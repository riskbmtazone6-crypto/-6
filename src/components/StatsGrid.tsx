import React from 'react';
import { 
  FileText, 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { Case } from '../types';

interface StatsGridProps {
  cases: Case[];
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  cases,
  activeStatusFilter,
  onSelectStatusFilter
}) => {
  const total = cases.length;
  const newCases = cases.filter(c => c.status === 'new').length;
  const investigating = cases.filter(c => c.status === 'investigating').length;
  const pendingApproval = cases.filter(c => c.status === 'pending_approval').length;
  const completed = cases.filter(c => c.status === 'completed').length;
  const overdue = cases.filter(c => c.status === 'overdue').length;

  const stats = [
    {
      id: 'all',
      title: 'เรื่องร้องเรียนทั้งหมด',
      count: total,
      trend: '+12%',
      trendColor: 'text-green-600',
      badge: 'ทั้งหมด',
      subtext: 'รวมทุกหมวดหมู่บริการ',
      icon: FileText,
      borderHover: 'hover:border-blue-500'
    },
    {
      id: 'investigating',
      title: 'กำลังดำเนินการสอบสวน',
      count: investigating,
      trend: '67%',
      trendColor: 'text-blue-600',
      badge: 'Active',
      subtext: 'อยู่ระหว่างตรวจสอบข้อเท็จจริง',
      icon: Search,
      borderHover: 'hover:border-blue-500'
    },
    {
      id: 'pending_approval',
      title: 'รอผู้จัดการลงนามคำสั่ง',
      count: pendingApproval,
      trend: `${pendingApproval} เคส`,
      trendColor: 'text-amber-600',
      badge: 'Pending',
      subtext: 'รอการอนุมัติมาตรการลงโทษ',
      icon: Clock,
      borderHover: 'hover:border-amber-500'
    },
    {
      id: 'completed',
      title: 'เสร็จสิ้นและยุติเรื่องแล้ว',
      count: completed,
      trend: 'เป้าหมาย 80',
      trendColor: 'text-slate-400',
      badge: 'Done',
      subtext: 'แจ้งผลผู้ร้องเรียนเรียบร้อย',
      icon: CheckCircle2,
      borderHover: 'hover:border-green-500'
    },
    {
      id: 'overdue',
      title: 'เกินกำหนดเวลา SLA (วิกฤต)',
      count: overdue,
      trend: overdue > 0 ? 'ล่าช้า' : 'ตรงเวลา',
      trendColor: overdue > 0 ? 'text-red-600' : 'text-green-600',
      badge: 'Critical',
      subtext: 'ต้องการการสั่งการด่วนที่สุด',
      icon: AlertTriangle,
      borderHover: 'hover:border-red-500',
      isCritical: overdue > 0
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected = activeStatusFilter === item.id;
        return (
          <div
            key={item.id}
            id={`stat-card-${item.id}`}
            onClick={() => onSelectStatusFilter(item.id)}
            className={`bg-white p-5 sm:p-6 rounded-xl border transition-all cursor-pointer shadow-sm ${
              isSelected
                ? 'border-blue-600 ring-2 ring-blue-500/20'
                : `border-slate-200 ${item.borderHover} hover:shadow-md`
            } ${item.isCritical ? 'bg-red-50/20 border-red-200' : ''}`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-500 truncate">{item.title}</p>
              <Icon className={`w-4 h-4 shrink-0 ${
                item.isCritical ? 'text-red-500' : 'text-slate-400'
              }`} />
            </div>

            <div className="flex items-end justify-between gap-2 mt-2">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{item.count}</span>
                <span className={`text-xs font-medium mb-1 ${item.trendColor}`}>{item.trend}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                item.isCritical 
                  ? 'bg-red-100 text-red-700' 
                  : isSelected 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {item.badge}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 truncate">{item.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};
