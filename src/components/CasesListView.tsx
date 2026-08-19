import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Bus,
  Search,
  Filter
} from 'lucide-react';
import { Case, CaseStatus, PriorityLevel } from '../types';

interface CasesListViewProps {
  cases: Case[];
  onSelectCase: (caseItem: Case) => void;
  onOpenSheetsExport: () => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  zoneFilter: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CasesListView: React.FC<CasesListViewProps> = ({
  cases,
  onSelectCase,
  onOpenSheetsExport,
  statusFilter,
  setStatusFilter,
  zoneFilter,
  searchQuery,
  setSearchQuery
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filtering Logic
  const filteredCases = cases.filter((c) => {
    // Status Filter
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    // Zone Filter
    if (zoneFilter !== 'all' && c.zone !== zoneFilter) return false;
    // Priority Filter
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    // Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchSubject = c.subject.toLowerCase().includes(q);
      const matchRoute = (c.busRoute || '').toLowerCase().includes(q);
      const matchVehicle = (c.vehicleId || '').toLowerCase().includes(q);
      const matchComplainant = c.complainantName.toLowerCase().includes(q);
      return matchId || matchSubject || matchRoute || matchVehicle || matchComplainant;
    }
    return true;
  });

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">รับเรื่องใหม่</span>;
      case 'investigating':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">กำลังทำ</span>;
      case 'pending_approval':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">รอดำเนินการ</span>;
      case 'completed':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">เสร็จสิ้น</span>;
      case 'overdue':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">ล่าช้า</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return <span className="text-xs text-red-600 font-medium">สูง (High)</span>;
      case 'medium':
        return <span className="text-xs text-amber-600 font-medium">ปานกลาง</span>;
      case 'low':
        return <span className="text-xs text-slate-500 font-medium">ปกติ</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
      {/* Header matching Professional Polish */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-800 text-base">
            รายการเรื่องร้องเรียน ({filteredCases.length} รายการ)
          </h3>
          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="text-blue-600 text-xs font-medium hover:underline cursor-pointer"
            >
              แสดงทั้งหมด
            </button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-semibold text-slate-800"
            >
              <option value="all">ทุกระดับความสำคัญ</option>
              <option value="high">ระดับสูง (High)</option>
              <option value="medium">ระดับปานกลาง (Medium)</option>
              <option value="low">ระดับปกติ (Low)</option>
            </select>
          </div>

          {/* Quick status tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {['all', 'investigating', 'pending_approval', 'completed', 'overdue'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === s ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s === 'all' && 'ทั้งหมด'}
                {s === 'investigating' && 'กำลังทำ'}
                {s === 'pending_approval' && 'รอคำสั่ง'}
                {s === 'completed' && 'เสร็จสิ้น'}
                {s === 'overdue' && 'ล่าช้า'}
              </button>
            ))}
          </div>

          {/* Export Sheets Button */}
          <button
            onClick={onOpenSheetsExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>ส่งออก Sheets</span>
          </button>
        </div>
      </div>

      {/* Table matching Professional Polish */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">เลขที่ / เรื่องร้องเรียน</th>
              <th className="px-6 py-3">สายรถ / ทะเบียน</th>
              <th className="px-6 py-3">ผู้รับผิดชอบ / เขต</th>
              <th className="px-6 py-3">กำหนดการ SLA</th>
              <th className="px-6 py-3">ความสำคัญ</th>
              <th className="px-6 py-3">สถานะ</th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  <Bus className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">ไม่พบรายการเรื่องร้องเรียนที่ตรงกับเงื่อนไข</p>
                  <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองเขต/สถานะ</p>
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                      {c.subject}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-semibold text-blue-600">{c.id}</span>
                      <span className="text-xs text-slate-400">• ผู้ร้อง: {c.isAnonymous ? 'ไม่เปิดเผยนาม' : c.complainantName}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {c.busRoute || '-'}
                      </span>
                      <span className="text-slate-600 text-xs font-mono">{c.vehicleId || '-'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                        {(c.assignedInvestigator || 'BM')[0]}
                      </div>
                      <div>
                        <span className="text-slate-700 text-xs font-medium block">{c.assignedInvestigator || 'รอระบุ'}</span>
                        <span className="text-slate-400 text-[11px] block">{c.zone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(c.slaDeadline).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit'
                    })}
                  </td>

                  <td className="px-6 py-4">
                    {getPriorityBadge(c.priority)}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(c.status)}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors inline" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
