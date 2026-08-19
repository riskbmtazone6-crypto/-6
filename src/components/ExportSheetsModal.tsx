import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Case } from '../types';
import { exportCasesToGoogleSheets, ExportResult } from '../services/googleWorkspace';

interface ExportSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: Case[];
  userEmail?: string;
  onOpenLogin: () => void;
}

export const ExportSheetsModal: React.FC<ExportSheetsModalProps> = ({
  isOpen,
  onClose,
  cases,
  userEmail,
  onOpenLogin
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMsg(null);

    try {
      const result = await exportCasesToGoogleSheets(cases);
      setExportResult(result);
    } catch (err: any) {
      console.error('Export to Google Sheets error:', err);
      setErrorMsg(err.message || 'ไม่สามารถส่งออกไปยัง Google Sheets ได้ กรุณาเข้าสู่ระบบด้วย Google');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAsCsv = () => {
    const headers = ['Case ID', 'Subject', 'Status', 'Priority', 'Category', 'Bus Route', 'Vehicle ID', 'Complainant', 'Contact', 'Location', 'Incident Date', 'SLA Deadline', 'Investigator', 'Zone', 'Created Date'];
    const rows = cases.map(c => [
      c.id,
      `"${c.subject.replace(/"/g, '""')}"`,
      c.status,
      c.priority,
      c.category,
      c.busRoute || '',
      c.vehicleId || '',
      c.isAnonymous ? 'Anonymous' : `"${c.complainantName}"`,
      c.isAnonymous ? '' : c.complainantContact,
      `"${(c.incidentLocation || '').replace(/"/g, '""')}"`,
      c.incidentTime || '',
      c.slaDeadline || '',
      c.assignedInvestigator || '',
      c.zone || '',
      c.createdAt || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BMTA_CMS_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">ส่งออกข้อมูลไปยัง Google Sheets</h2>
              <p className="text-xs text-slate-500">สร้างตารางสเปรดชีตวิเคราะห์ข้อมูลเรื่องร้องเรียนแบบ Real-time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info stats */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">จำนวนข้อมูลที่จะส่งออก:</span>
            <span className="font-semibold text-slate-900 font-mono">{cases.length} รายการ</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">คอลัมน์ทั้งหมด:</span>
            <span className="font-semibold text-slate-900 font-mono">16 คอลัมน์ (ID, สถานะ, SLA, สายรถ, ฯลฯ)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">รูปแบบไฟล์ปลายทาง:</span>
            <span className="font-semibold text-emerald-700">Google Sheets Online (.gsheet)</span>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>การเชื่อมต่อ Google Workspace</span>
            </div>
            <p className="text-amber-700">{errorMsg}</p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold text-xs cursor-pointer"
              >
                เข้าสู่ระบบด้วย Google
              </button>
              <button
                onClick={downloadAsCsv}
                className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg font-semibold text-xs cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>ดาวน์โหลด CSV แทน</span>
              </button>
            </div>
          </div>
        )}

        {/* Success message with link to open Google Sheets */}
        {exportResult && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-xs space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>สร้าง Google Sheets สำเร็จเรียบร้อย!</span>
            </div>
            <p className="text-green-700">
              ส่งออกเรื่องร้องเรียนจำนวน {exportResult.rowCount} แถว พร้อมหัวตารางและฟอร์แมตอัตโนมัติ
            </p>
            <a
              href={exportResult.spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>เปิดดูไฟล์ใน Google Sheets</span>
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={downloadAsCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด CSV สำรอง</span>
          </button>

          <button
            id="btn-confirm-export-sheets"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            <span>{isExporting ? 'กำลังส่งออกข้อมูล...' : 'เริ่มส่งออก (Export Now)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
