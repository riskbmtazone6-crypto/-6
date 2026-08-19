import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  BarChart3, 
  Users, 
  Settings, 
  Plus, 
  BookOpen, 
  Bus
} from 'lucide-react';
import { ActiveTab, Case } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewComplaintClick: () => void;
  cases: Case[];
  onOpenManual: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onNewComplaintClick,
  cases,
  onOpenManual
}) => {
  const pendingCount = cases.filter(c => c.status === 'pending_approval').length;
  const overdueCount = cases.filter(c => c.status === 'overdue').length;
  const newCount = cases.filter(c => c.status === 'new').length;

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'แผงควบคุมหลัก',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'complaints' as ActiveTab,
      label: 'รายการเรื่องร้องเรียน',
      labelEn: 'Complaints',
      icon: FileText,
      badge: newCount > 0 ? newCount : null,
      badgeColor: 'bg-blue-500 text-white',
    },
    {
      id: 'investigations' as ActiveTab,
      label: 'งานสอบสวน & พิจารณา',
      labelEn: 'Investigations',
      icon: Search,
      badge: overdueCount > 0 ? overdueCount : (pendingCount > 0 ? pendingCount : null),
      badgeColor: overdueCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500 text-white',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'รายงานและสถิติ SLA',
      labelEn: 'Analytics & Reports',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'user_management' as ActiveTab,
      label: 'ทีมงานและเขตการเดินรถ',
      labelEn: 'Staff & Zones',
      icon: Users,
      badge: null,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'ตั้งค่าระบบ',
      labelEn: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-screen select-none">
      {/* Brand Header matching SiamFlow / Professional Polish */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0 overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh9Sw5QK47e-KsZs_lsrlB4PHaQovQ6gRnNFpVkI-jNUuQpo1NxsG16SiIBWd-ETXL348CzmLxrKGXZK9JGw-3suXz2nqzgKj9jWfHJdsxJEQfot3o4cCEP6Nzfy51SokgQfVZztpoJGM3nT7qhP73LVmfR9CdEmPtEb82M5nhJ374sQOvWkMGt7XIId-QUGgampLaiRG357JH_o-pQg2rMF_yOi4P5lmDhQDgTv6Iy0ZS9_hghaRLyqKdf-hkXKiSWQ" 
            alt="BMTA Logo" 
            className="w-full h-full object-contain p-1 bg-white"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold text-lg tracking-tight">BMTA CMS</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">ขสมก.</span>
          </div>
          <p className="text-xs text-slate-400 truncate">ระบบจัดการเรื่องร้องเรียน</p>
        </div>
      </div>

      {/* New Complaint CTA Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          id="btn-sidebar-new-complaint"
          onClick={onNewComplaintClick}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>บันทึกเรื่องร้องเรียนใหม่</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-5 h-5 shrink-0" />
                <div className="text-left truncate">
                  <div className="truncate">{item.label}</div>
                </div>
              </div>

              {item.badge !== null && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-700 text-slate-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Support & System Info */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={onOpenManual}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-left"
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>คู่มือการใช้งาน (Manual)</span>
        </button>

        <div className="flex items-center gap-3 px-2 pt-2 border-t border-slate-800/80">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" 
            className="w-9 h-9 rounded-full border-2 border-slate-700 object-cover" 
            alt="User Profile" 
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Risk BMTA Officer</p>
            <p className="text-xs text-slate-400 truncate">ผู้จัดการเขตการเดินรถที่ 6</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
