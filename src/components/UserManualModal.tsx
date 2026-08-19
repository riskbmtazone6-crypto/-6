import React from 'react';
import { X, BookOpen, Clock, ShieldCheck, FileSpreadsheet, HardDrive, Bus } from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 my-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">คู่มือการใช้งานระบบ BMTA CMS</h2>
              <p className="text-xs text-slate-500">มาตรฐานขั้นตอนการปฏิบัติงานและการติดตาม SLA เรื่องร้องเรียน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-700 max-h-[65vh] overflow-y-auto pr-2">
          {/* Step 1 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>การรับเรื่องร้องเรียน (Intake & Registration)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              เมื่อประชาชนแจ้งเรื่องผ่านสายด่วน 1348, เว็บไซต์ หรือโซเชียล ให้กดปุ่ม <strong>"+ บันทึกเรื่องร้องเรียนใหม่"</strong> กรอกข้อมูล 4 ขั้นตอน ระบบจะสร้างรหัสเคสอัตโนมัติ (เช่น CR-2026-00124) พร้อมส่งแจ้งเตือนไปยังผู้สอบสวนประจำเขต
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>เกณฑ์มาตรฐานระยะเวลา SLA (Service Level Agreement)</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>ความสำคัญสูง (High):</strong> ต้องเริ่มตรวจสอบภายใน 24 ชม. และยุติเรื่องภายใน 3 วันทำการ</li>
              <li><strong>ความสำคัญปานกลาง (Medium):</strong> ยุติเรื่องภายใน 5 วันทำการ</li>
              <li><strong>เคสเกินกำหนด (Overdue):</strong> ระบบจะแจ้งเตือนแถบสีแดงด่วนด้านบนสุด ให้ผู้จัดการเขตสั่งการทันที</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>การอัปโหลดไฟล์หลักฐานเข้า Google Drive</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              ในแท็บ <strong>"หลักฐาน (Evidence)"</strong> เจ้าหน้าที่สามารถลากไฟล์วิดีโอกล้องหน้ารถ (Dashcam) หรือภาพถ่ายตั๋วโดยสารเพื่ออัปโหลดจัดเก็บใน Google Drive ขององค์กรโดยอัตโนมัติ
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">4</span>
              <span>การส่งออกรายงานเข้า Google Sheets</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              คลิกปุ่ม <strong>"Google Sheets"</strong> ที่แถบด้านบน เพื่อสร้างตารางสรุปสถิติเรื่องร้องเรียนและประสิทธิภาพ SLA ประจำเดือนแบบ Real-time พร้อมเปิดดูและแชร์ต่อได้ทันที
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors"
          >
            เข้าใจแล้ว (Close Manual)
          </button>
        </div>
      </div>
    </div>
  );
};
