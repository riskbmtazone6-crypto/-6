import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  LogOut, 
  LogIn, 
  Building2, 
  FileSpreadsheet, 
  ChevronDown
} from 'lucide-react';
import { UserProfile, Case } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenSheetsExport: () => void;
  cases: Case[];
  onSelectCase: (c: Case) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  selectedZone,
  setSelectedZone,
  searchQuery,
  setSearchQuery,
  onOpenLogin,
  onLogout,
  onOpenSheetsExport,
  cases,
  onSelectCase
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const urgentCases = cases.filter(c => c.status === 'overdue' || c.priority === 'high');

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0 sticky top-0 z-30">
      {/* Left Title & Status Indicator */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-800 hidden sm:block">
          ระบบบริหารเรื่องร้องเรียน ขสมก.
        </h1>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
          <span>ระบบปกติ</span>
        </span>
      </div>

      {/* Right Controls matching Professional Polish */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            placeholder="ค้นหาเลขที่เคส, สายรถ, ทะเบียน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-44 sm:w-64 outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Zone Selector */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <select
            id="zone-select"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-transparent outline-none cursor-pointer font-semibold text-slate-800"
          >
            <option value="all">ทุกเขตการเดินรถ (All Zones)</option>
            <option value="Zone 1">เขต 1 (บางเขน)</option>
            <option value="Zone 2">เขต 2 (มีนบุรี)</option>
            <option value="Zone 3">เขต 3 (สมุทรปราการ)</option>
            <option value="Zone 4">เขต 4 (คลองเตย)</option>
            <option value="Zone 5">เขต 5 (แสมดำ)</option>
            <option value="Zone 6">เขต 6 (ธรรมศาสตร์)</option>
            <option value="Zone 7">เขต 7 (ท่าอิฐ)</option>
            <option value="Zone 8">เขต 8 (หมอชิต 2)</option>
          </select>
        </div>

        {/* Google Sheets Export Trigger */}
        <button
          id="btn-nav-export-sheets"
          onClick={onOpenSheetsExport}
          title="ส่งออกรายงานไปยัง Google Sheets"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Google Sheets</span>
        </button>

        {/* Notifications Icon Button matching Professional Polish */}
        <div className="relative">
          <button
            id="btn-nav-notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 relative transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {urgentCases.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-3 z-50 animate-in fade-in">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">แจ้งเตือนด่วน ({urgentCases.length})</span>
                <span className="text-[11px] text-red-600 font-semibold">Overdue / High Priority</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {urgentCases.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">ไม่มีรายการแจ้งเตือนค้าง</div>
                ) : (
                  urgentCases.slice(0, 5).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onSelectCase(c);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors text-left"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-bold text-blue-600">{c.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {c.status === 'overdue' ? 'เกินกำหนด SLA' : 'ความสำคัญสูง'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 truncate">{c.subject}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">สาย {c.busRoute || '-'} • {c.zone}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Login */}
        <div className="relative">
          {user ? (
            <button
              id="btn-user-avatar"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <img
                src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                referrerPolicy="no-referrer"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>
          ) : (
            <button
              id="btn-nav-login"
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ</span>
            </button>
          )}

          {showProfileMenu && user && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs text-slate-400">ลงชื่อเข้าใช้ในฐานะ</p>
                <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 font-mono truncate">{user.email}</p>
              </div>

              <div className="px-2 py-1.5 space-y-0.5 text-xs text-slate-700">
                <div className="px-3 py-2 flex items-center justify-between text-slate-600">
                  <span>สิทธิ์การใช้งาน</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[10px] uppercase">{user.role}</span>
                </div>
                <div className="px-3 py-2 flex items-center justify-between text-slate-600">
                  <span>สังกัดเขต</span>
                  <span className="font-semibold text-slate-800">{user.zone}</span>
                </div>
              </div>

              <div className="p-2 border-t border-slate-100">
                <button
                  id="btn-profile-logout"
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
