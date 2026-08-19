import React from 'react';
import { Case } from '../types';
import { BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';

interface AnalyticsChartsProps {
  cases: Case[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ cases }) => {
  // Category Counts
  const categories = [
    { label: 'พฤติกรรมพนักงานขับรถ', key: 'driver_conduct', color: 'bg-blue-600' },
    { label: 'รถขาดระยะ / ล่าช้า', key: 'schedule_delay', color: 'bg-amber-500' },
    { label: 'สภาพตัวรถ / แอร์เสีย', key: 'vehicle_condition', color: 'bg-slate-500' },
    { label: 'การเก็บค่าโดยสาร / ตั๋ว', key: 'ticketing_issue', color: 'bg-emerald-500' },
    { label: 'ความปลอดภัย / ฝ่าไฟแดง', key: 'safety_violation', color: 'bg-red-500' },
  ];

  const total = cases.length || 1;

  const monthlyTrends = [
    { month: 'ม.ค.', count: 45, slaRate: 95 },
    { month: 'ก.พ.', count: 52, slaRate: 92 },
    { month: 'มี.ค.', count: 38, slaRate: 96 },
    { month: 'เม.ย.', count: 64, slaRate: 89 },
    { month: 'พ.ค.', count: 48, slaRate: 94 },
    { month: 'มิ.ย.', count: 58, slaRate: 93 },
    { month: 'ก.ค.', count: 70, slaRate: 91 },
    { month: 'ส.ค.', count: cases.length, slaRate: 94 },
  ];

  const maxCount = Math.max(...monthlyTrends.map(m => m.count), 80);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Intake & SLA Rate Chart (2 Cols) */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">
              แนวโน้มเรื่องร้องเรียนและประสิทธิภาพ SLA รายเดือน
            </h3>
            <p className="text-xs text-slate-500">สถิติปริมาณเรื่องรับเข้าและอัตราการยุติเรื่องตามกรอบเวลา (2569)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-600"></span>
              <span className="text-slate-600 font-medium">เรื่องรับเข้า</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-emerald-500"></span>
              <span className="text-slate-600 font-medium">SLA Rate (%)</span>
            </div>
          </div>
        </div>

        {/* Custom SVG/HTML Bar & Trend visualization */}
        <div className="h-56 w-full pt-4 flex items-end justify-between gap-3 border-b border-slate-100 pb-2">
          {monthlyTrends.map((item, idx) => {
            const barHeight = Math.round((item.count / maxCount) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-1.5 py-0.5 pointer-events-none">
                  {item.count} เคส ({item.slaRate}%)
                </div>
                {/* Bar */}
                <div
                  style={{ height: `${barHeight}%` }}
                  className="w-full max-w-[28px] bg-blue-600/90 group-hover:bg-blue-600 rounded-t-sm transition-all relative"
                >
                  <div 
                    style={{ bottom: `${item.slaRate - 10}%` }}
                    className="absolute -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white"
                  ></div>
                </div>
                {/* Month label */}
                <span className="text-xs font-medium text-slate-500">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories Distribution Breakdown (1 Col) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">สัดส่วนหมวดหมู่เรื่องร้องเรียน</h3>
          <span className="text-xs text-blue-600 font-medium">สถิติรวม</span>
        </div>

        <div className="space-y-3.5 pt-1">
          {categories.map((cat) => {
            const count = cases.filter(c => c.category === cat.key).length;
            const pct = Math.round((count / total) * 100);
            return (
              <div key={cat.key} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span className="truncate pr-2">{cat.label}</span>
                  <span className="font-semibold text-slate-900">{pct}% ({count})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(pct, 4)}%` }}
                    className={`h-full ${cat.color} rounded-full transition-all`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
