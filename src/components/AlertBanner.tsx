import React from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';
import { Case } from '../types';

interface AlertBannerProps {
  overdueCases: Case[];
  onFilterOverdue: () => void;
  onDismiss: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  overdueCases,
  onFilterOverdue,
  onDismiss
}) => {
  if (overdueCases.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4 text-xs animate-in fade-in">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-semibold text-red-900 text-sm">
            การแจ้งเตือนความเร่งด่วน: มี {overdueCases.length} รายการที่เกินกำหนดเวลา SLA (Overdue)
          </h4>
          <p className="text-red-700 mt-0.5">
            ต้องการการตรวจสอบและสั่งการมาตรการลงโทษจากผู้จัดการเขตการเดินรถโดยด่วน
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onFilterOverdue}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <span>ตรวจสอบเคสวิกฤต</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDismiss}
          className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
          title="ปิดการแจ้งเตือน"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
