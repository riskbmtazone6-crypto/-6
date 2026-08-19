import React from 'react';
import { 
  FileSpreadsheet, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Bus,
  ShieldCheck
} from 'lucide-react';
import { Case } from '../types';
import { AnalyticsCharts } from './AnalyticsCharts';

interface AnalyticsViewProps {
  cases: Case[];
  onOpenSheetsExport: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  cases,
  onOpenSheetsExport
}) => {
  const total = cases.length;
  const completed = cases.filter(c => c.status === 'completed').length;
  const overdue = cases.filter(c => c.status === 'overdue').length;
  const complianceRate = total > 0 ? ((total - overdue) / total * 100).toFixed(1) : '94.2';

  const zonePerformance = [
    { zone: 'เขต 1 (บางเขน)', cases: 142, avgDays: '2.8 วัน', compliance: '96%' },
    { zone: 'เขต 2 (มีนบุรี)', cases: 168, avgDays: '3.1 วัน', compliance: '94%' },
    { zone: 'เขต 3 (สมุทรปราการ)', cases: 184, avgDays: '3.4 วัน', compliance: '91%' },
    { zone: 'เขต 4 (คลองเตย)', cases: 215, avgDays: '3.6 วัน', compliance: '89%' },
    { zone: 'เขต 5 (แสมดำ)', cases: 156, avgDays: '3.0 วัน', compliance: '95%' },
    { zone: 'เขต 6 (ธรรมศาสตร์)', cases: 138, avgDays: '2.7 วัน', compliance: '97%' },
    { zone: 'เขต 7 (ท่าอิฐ)', cases: 122, avgDays: '2.9 วัน', compliance: '96%' },
    { zone: 'เขต 8 (หมอชิต 2)', cases: 159, avgDays: '3.2 วัน', compliance: '93%' },
  ];

  const topRoutes = [
    { route: 'สาย 514 (มีนบุรี - สีลม)', count: 48, topIssue: 'ขับรถเร็ว/ปาดซ้ายขวา', zone: 'เขต 2' },
    { route: 'สาย 511 (ปากน้ำ - สายใต้ใหม่)', count: 42, topIssue: 'รถขาดระยะช่วงเร่งด่วน', zone: 'เขต 3' },
    { route: 'สาย 72 (คลองเตย - เทเวศร์)', count: 35, topIssue: 'ปล่อยรถไม่สม่ำเสมอ', zone: 'เขต 4' },
    { route: 'สาย 138 (พระประแดง - หมอชิต 2)', count: 28, topIssue: 'ระบบปรับอากาศชำรุด', zone: 'เขต 8' },
    { route: 'สาย 140 (แสมดำ - อนุสาวรีย์ชัยฯ)', count: 26, topIssue: 'กิริยามารยาทพนักงาน', zone: 'เขต 5' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header matching Professional Polish */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800">
              รายงานสถิติและประสิทธิภาพ SLA ประจำปี 2569
            </h2>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold rounded-full text-xs">
              SLA Rate: {complianceRate}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            วิเคราะห์เชิงลึกอัตราการแก้ไขปัญหา ระยะเวลาเฉลี่ย และจัดอันดับสายรถเมล์ที่ถูกร้องเรียน
          </p>
        </div>

        <button
          onClick={onOpenSheetsExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>ส่งออกรายงานไป Google Sheets</span>
        </button>
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts cases={cases} />

      {/* Zone Performance & Top Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone SLA Table */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">
              ประสิทธิภาพ SLA รายเขตการเดินรถ (Zone Performance)
            </h3>
            <span className="text-xs text-slate-400 font-medium">เกณฑ์: &le; 5 วัน</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                  <th className="pb-2">เขตการเดินรถ</th>
                  <th className="pb-2">เรื่องรับเข้า</th>
                  <th className="pb-2">เวลาเฉลี่ย</th>
                  <th className="pb-2 text-right">ผ่านเกณฑ์ SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zonePerformance.map((zp, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-medium text-slate-800">{zp.zone}</td>
                    <td className="py-2.5 text-slate-600">{zp.cases} เคส</td>
                    <td className="py-2.5 font-medium text-blue-600">{zp.avgDays}</td>
                    <td className="py-2.5 text-right font-bold text-green-600">{zp.compliance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Complaint Routes */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">
              5 อันดับสายรถเมล์ที่ได้รับการร้องเรียนสูงสุด
            </h3>
            <span className="text-xs text-red-600 font-medium">Watchlist</span>
          </div>

          <div className="space-y-3">
            {topRoutes.map((tr, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{tr.route}</h4>
                    <p className="text-slate-400 text-[11px]">ประเด็นหลัก: {tr.topIssue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{tr.count} เคส</span>
                  <p className="text-[10px] text-slate-400 font-medium">{tr.zone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
