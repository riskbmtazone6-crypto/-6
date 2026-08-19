import React from 'react';
import { LayoutDashboard, FileText, Search, Settings, Plus } from 'lucide-react';
import { ActiveTab, Case } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewComplaintClick: () => void;
  cases: Case[];
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onNewComplaintClick,
  cases
}) => {
  const overdueCount = cases.filter(c => c.status === 'overdue').length;
  const newCount = cases.filter(c => c.status === 'new').length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-3 py-2 flex items-center justify-around z-40 text-slate-300">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'dashboard' ? 'text-blue-400 font-bold' : 'hover:text-white'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>แดชบอร์ด</span>
      </button>

      <button
        onClick={() => setActiveTab('complaints')}
        className={`relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'complaints' ? 'text-blue-400 font-bold' : 'hover:text-white'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span>เคสทั้งหมด</span>
        {newCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-blue-600 text-white font-mono text-[9px] font-bold px-1.5 rounded-full">
            {newCount}
          </span>
        )}
      </button>

      {/* Floating Center Plus Button */}
      <button
        onClick={onNewComplaintClick}
        className="w-11 h-11 -mt-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg font-bold cursor-pointer active:scale-95 transition-transform"
        title="บันทึกเรื่องร้องเรียนใหม่"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

      <button
        onClick={() => setActiveTab('investigations')}
        className={`relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'investigations' ? 'text-blue-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Search className="w-5 h-5" />
        <span>งานสอบสวน</span>
        {overdueCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-600 text-white font-mono text-[9px] font-bold px-1.5 rounded-full animate-pulse">
            {overdueCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('settings')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'settings' ? 'text-blue-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Settings className="w-5 h-5" />
        <span>ตั้งค่า</span>
      </button>
    </div>
  );
};
