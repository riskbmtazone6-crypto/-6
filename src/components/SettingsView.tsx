import React, { useState } from 'react';
import { 
  Settings, 
  HardDrive, 
  FileSpreadsheet, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Bell, 
  Save,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile | null;
  onOpenLogin: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onOpenLogin
}) => {
  const [slaHighDays, setSlaHighDays] = useState('3');
  const [slaMedDays, setSlaMedDays] = useState('5');
  const [autoEmailAlerts, setAutoEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">ตั้งค่าระบบและการเชื่อมต่อ (System Settings)</h2>
        <p className="text-xs text-slate-500">จัดการการเชื่อมต่อ Google Workspace, Firebase Firestore และพารามิเตอร์ SLA</p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>บันทึกการตั้งค่าระบบเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Cloud & Workspace Integrations Status */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          สถานะการเชื่อมต่อบริการคลาวด์ (Cloud & Workspace Integrations)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Firestore */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Connected
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900">Firebase Firestore</h4>
            <p className="text-[11px] text-slate-500">ฐานข้อมูลจัดเก็บเรื่องร้องเรียนและประวัติสำนวนแบบ Real-time</p>
          </div>

          {/* Google Sheets */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                OAuth 2.0 Ready
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900">Google Sheets API</h4>
            <p className="text-[11px] text-slate-500">ส่งออกข้อมูลสถิติและรายงานสรุป SLA ไปยัง Google Drive สเปรดชีต</p>
          </div>

          {/* Google Drive */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                OAuth 2.0 Ready
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900">Google Drive API</h4>
            <p className="text-[11px] text-slate-500">ระบบจัดเก็บไฟล์หลักฐานภาพนิ่งและวิดีโอกล้องหน้ารถ (Dashcam)</p>
          </div>
        </div>

        {!user && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs flex items-center justify-between">
            <span className="text-blue-900 font-medium">เข้าสู่ระบบด้วย Google เพื่อเปิดใช้งานการบันทึกไฟล์ Drive เต็มรูปแบบ</span>
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 bg-blue-600 text-white font-semibold rounded-lg cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
        )}
      </div>

      {/* SLA Policy Config */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          กำหนดเกณฑ์ระยะเวลา SLA และการแจ้งเตือน
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              กำหนดระยะเวลายื่นเรื่องและตรวจสอบความสำคัญสูง (High Priority):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={slaHighDays}
                onChange={(e) => setSlaHighDays(e.target.value)}
                className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold outline-none focus:bg-white focus:border-blue-500"
              />
              <span className="text-slate-500">วันทำการ</span>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              กำหนดระยะเวลาสำหรับเรื่องทั่วไป (Normal / Medium Priority):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={slaMedDays}
                onChange={(e) => setSlaMedDays(e.target.value)}
                className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold outline-none focus:bg-white focus:border-blue-500"
              />
              <span className="text-slate-500">วันทำการ</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={autoEmailAlerts}
              onChange={(e) => setAutoEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <span className="font-medium text-slate-700">
              แจ้งเตือนอัตโนมัติเมื่อมีเคสใกล้ครบกำหนด SLA ภายใน 24 ชั่วโมง
            </span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่า (Save Settings)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
