import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AlertBanner } from './components/AlertBanner';
import { StatsGrid } from './components/StatsGrid';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { CasesListView } from './components/CasesListView';
import { CaseDetailsView } from './components/CaseDetailsView';
import { NewComplaintModal } from './components/NewComplaintModal';
import { PrintBriefModal } from './components/PrintBriefModal';
import { ExportSheetsModal } from './components/ExportSheetsModal';
import { LoginModal } from './components/LoginModal';
import { UserManagementView } from './components/UserManagementView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { UserManualModal } from './components/UserManualModal';
import { Case, ActiveTab, UserProfile } from './types';
import { INITIAL_CASES } from './services/initialData';
import { subscribeToCases, seedInitialDataIfEmpty } from './services/casesService';
import { initAuth, logout } from './services/googleWorkspace';
import { testFirestoreConnection } from './services/firebase';

export default function App() {
  // Global State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [cases, setCases] = useState<Case[]>(INITIAL_CASES);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dismissOverdueAlert, setDismissOverdueAlert] = useState<boolean>(false);

  // User Profile
  const [user, setUser] = useState<UserProfile | null>({
    uid: 'user-default',
    name: 'Risk BMTA Officer',
    email: 'riskbmta.zone6@gmail.com',
    role: 'manager',
    zone: 'Zone 6',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  // Modals
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [showPrintBriefModal, setShowPrintBriefModal] = useState(false);
  const [printBriefCase, setPrintBriefCase] = useState<Case | null>(null);
  const [showExportSheetsModal, setShowExportSheetsModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  // Initialize Firebase & Auth
  useEffect(() => {
    // 1. Check & seed Firestore
    testFirestoreConnection().then(connected => {
      if (connected) {
        seedInitialDataIfEmpty();
      }
    });

    // 2. Subscribe to Firestore updates
    const unsubscribeCases = subscribeToCases((updatedCases) => {
      if (updatedCases && updatedCases.length > 0) {
        setCases(updatedCases);
      }
    });

    // 3. Auth state listener
    const unsubscribeAuth = initAuth((firebaseUser, token) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'BMTA Officer',
          email: firebaseUser.email || 'officer@bmta.go.th',
          role: 'manager',
          zone: 'Zone 6',
          avatarUrl: firebaseUser.photoURL || undefined
        });
      }
    });

    return () => {
      unsubscribeCases();
      unsubscribeAuth();
    };
  }, []);

  // Update a single case in state
  const handleUpdateCaseState = (updated: Case) => {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (selectedCase && selectedCase.id === updated.id) {
      setSelectedCase(updated);
    }
  };

  // Create new case handler
  const handleCaseCreated = (newCase: Case) => {
    setCases(prev => [newCase, ...prev]);
    setSelectedCase(newCase);
  };

  // Logout handler
  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  // Overdue cases for alert
  const overdueCases = cases.filter(c => c.status === 'overdue');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Persistent Navy Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedCase(null);
          }}
          onNewComplaintClick={() => setShowNewComplaintModal(true)}
          cases={cases}
          onOpenManual={() => setShowManualModal(true)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          user={user}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenLogin={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onOpenSheetsExport={() => setShowExportSheetsModal(true)}
          cases={cases}
          onSelectCase={(c) => {
            setSelectedCase(c);
            setActiveTab('complaints');
          }}
        />

        {/* Scrollable Body Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
          {/* Urgent Overdue SLA Banner */}
          {!dismissOverdueAlert && overdueCases.length > 0 && !selectedCase && (
            <AlertBanner
              overdueCases={overdueCases}
              onFilterOverdue={() => {
                setStatusFilter('overdue');
                setActiveTab('complaints');
              }}
              onDismiss={() => setDismissOverdueAlert(true)}
            />
          )}

          {/* Conditional Views */}
          {selectedCase ? (
            /* Detailed Case & Investigation View */
            <CaseDetailsView
              currentCase={selectedCase}
              onBack={() => setSelectedCase(null)}
              onOpenPrintBrief={(c) => {
                setPrintBriefCase(c);
                setShowPrintBriefModal(true);
              }}
              onUpdateCaseState={handleUpdateCaseState}
            />
          ) : (
            <>
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* KPI Bento Grid */}
                  <StatsGrid
                    cases={cases}
                    activeStatusFilter={statusFilter}
                    onSelectStatusFilter={(status) => {
                      setStatusFilter(status);
                      setActiveTab('complaints');
                    }}
                  />

                  {/* Charts (Trend & Categories) */}
                  <AnalyticsCharts cases={cases} />

                  {/* Recent Cases Section */}
                  <div className="space-y-3">
                    <CasesListView
                      cases={cases}
                      onSelectCase={(c) => setSelectedCase(c)}
                      onOpenSheetsExport={() => setShowExportSheetsModal(true)}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      zoneFilter={selectedZone}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: COMPLAINTS LIST */}
              {activeTab === 'complaints' && (
                <CasesListView
                  cases={cases}
                  onSelectCase={(c) => setSelectedCase(c)}
                  onOpenSheetsExport={() => setShowExportSheetsModal(true)}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  zoneFilter={selectedZone}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}

              {/* TAB 3: INVESTIGATIONS (Filtered to Active & Overdue) */}
              {activeTab === 'investigations' && (
                <CasesListView
                  cases={cases.filter(c => c.status === 'investigating' || c.status === 'overdue' || c.status === 'pending_approval')}
                  onSelectCase={(c) => setSelectedCase(c)}
                  onOpenSheetsExport={() => setShowExportSheetsModal(true)}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  zoneFilter={selectedZone}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}

              {/* TAB 4: ANALYTICS */}
              {activeTab === 'analytics' && (
                <AnalyticsView
                  cases={cases}
                  onOpenSheetsExport={() => setShowExportSheetsModal(true)}
                />
              )}

              {/* TAB 5: USER MANAGEMENT */}
              {activeTab === 'user_management' && (
                <UserManagementView />
              )}

              {/* TAB 6: SETTINGS */}
              {activeTab === 'settings' && (
                <SettingsView
                  user={user}
                  onOpenLogin={() => setShowLoginModal(true)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCase(null);
        }}
        onNewComplaintClick={() => setShowNewComplaintModal(true)}
        cases={cases}
      />

      {/* Modals */}
      <NewComplaintModal
        isOpen={showNewComplaintModal}
        onClose={() => setShowNewComplaintModal(false)}
        onCaseCreated={handleCaseCreated}
      />

      <PrintBriefModal
        caseItem={printBriefCase}
        onClose={() => {
          setShowPrintBriefModal(false);
          setPrintBriefCase(null);
        }}
      />

      <ExportSheetsModal
        isOpen={showExportSheetsModal}
        onClose={() => setShowExportSheetsModal(false)}
        cases={cases}
        userEmail={user?.email}
        onOpenLogin={() => {
          setShowExportSheetsModal(false);
          setShowLoginModal(true);
        }}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(profile) => setUser(profile)}
      />

      <UserManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
      />
    </div>
  );
}
