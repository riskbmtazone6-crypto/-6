import React from 'react';
import { X, Printer, Bus, ShieldCheck, Download } from 'lucide-react';
import { Case } from '../types';

interface PrintBriefModalProps {
  caseItem: Case | null;
  onClose: () => void;
}

export const PrintBriefModal: React.FC<PrintBriefModalProps> = ({
  caseItem,
  onClose
}) => {
  if (!caseItem) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-xl max-w-3xl w-full p-8 shadow-xl border border-slate-200 my-8 space-y-6 print:shadow-none print:border-none print:p-0 print:my-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>รายงานสรุปสำนวนเรื่องร้องเรียน (Official Complaint Brief)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสาร (Print Report)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="border border-slate-300 p-8 rounded-lg bg-white space-y-6 text-slate-900 font-sans print:border-none print:p-0">
          {/* Header with Emblem */}
          <div className="text-center space-y-2 border-b-2 border-slate-900 pb-4">
            <div className="w-14 h-14 mx-auto mb-1">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh9Sw5QK47e-KsZs_lsrlB4PHaQovQ6gRnNFpVkI-jNUuQpo1NxsG16SiIBWd-ETXL348CzmLxrKGXZK9JGw-3suXz2nqzgKj9jWfHJdsxJEQfot3o4cCEP6Nzfy51SokgQfVZztpoJGM3nT7qhP73LVmfR9CdEmPtEb82M5nhJ374sQOvWkMGt7XIId-QUGgampLaiRG357JH_o-pQg2rMF_yOi4P5lmDhQDgTv6Iy0ZS9_hghaRLyqKdf-hkXKiSWQ"
                alt="BMTA Emblem"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-lg font-bold tracking-wide">องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)</h1>
            <h2 className="text-sm font-semibold text-slate-700">รายงานสรุปผลการตรวจสอบข้อเท็จจริงเรื่องร้องเรียนบริการ</h2>
            <p className="text-xs text-slate-500">Bangkok Mass Transit Authority Case Investigation Summary Brief</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="font-semibold text-slate-600">เลขที่สำนวน (Case ID):</span>
              <p className="font-mono font-bold text-sm text-blue-600">{caseItem.id}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-600">สถานะสำนวน (Status):</span>
              <p className="font-bold uppercase text-slate-800">{caseItem.status}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-600">สายรถเมล์ / ทะเบียน:</span>
              <p className="font-semibold">สาย {caseItem.busRoute} (ทะเบียน {caseItem.vehicleId || '-'})</p>
            </div>
            <div>
              <span className="font-semibold text-slate-600">สังกัดเขตการเดินรถ:</span>
              <p className="font-semibold">{caseItem.zone}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-600">วันที่รับเรื่อง:</span>
              <p>{new Date(caseItem.createdAt).toLocaleString('th-TH')}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-600">กำหนดเวลา SLA:</span>
              <p>{new Date(caseItem.slaDeadline).toLocaleString('th-TH')}</p>
            </div>
          </div>

          {/* Complainant & Incident Narrative */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-700">ผู้ร้องเรียน:</span>{' '}
              <span>{caseItem.isAnonymous ? 'ไม่ประสงค์ออกนาม (Anonymous)' : `${caseItem.complainantName} (โทร: ${caseItem.complainantContact || '-'})`}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">สถานที่เกิดเหตุ:</span>{' '}
              <span>{caseItem.incidentLocation || '-'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">หัวข้อเรื่องร้องเรียน:</span>
              <p className="p-2 bg-slate-50 rounded border border-slate-200 mt-1 font-semibold">{caseItem.subject}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-700">พฤติการณ์เหตุการณ์โดยละเอียด:</span>
              <p className="p-3 bg-slate-50 rounded border border-slate-200 mt-1 whitespace-pre-wrap leading-relaxed">
                {caseItem.narrative}
              </p>
            </div>
          </div>

          {/* Manager Notes */}
          {caseItem.managerNotes && (
            <div className="text-xs space-y-1">
              <span className="font-semibold text-slate-700">คำสั่งการและมาตรการของผู้จัดการเขต:</span>
              <p className="p-3 bg-blue-50 rounded border border-blue-200 text-blue-900 font-medium">
                {caseItem.managerNotes}
              </p>
            </div>
          )}

          {/* Sign-off Blocks */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
            <div className="text-center space-y-8">
              <p>ลงชื่อ..............................................................</p>
              <div>
                <p className="font-semibold">({caseItem.assignedInvestigator || '................................................'})</p>
                <p className="text-slate-500">หัวหน้าผู้สอบสวนข้อเท็จจริง</p>
              </div>
            </div>
            <div className="text-center space-y-8">
              <p>ลงชื่อ..............................................................</p>
              <div>
                <p className="font-semibold">({caseItem.assignedManager || '................................................'})</p>
                <p className="text-slate-500">ผู้จัดการเขตการเดินรถ / ผู้มีอำนาจสั่งการ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
