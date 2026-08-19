import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Bus, 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { Case, CaseCategory, OriginatingChannel, PriorityLevel, CaseStatus } from '../types';
import { createCase } from '../services/casesService';

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: Case) => void;
}

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<CaseCategory>('driver_conduct');
  const [channel, setChannel] = useState<OriginatingChannel>('hotline');
  const [priority, setPriority] = useState<PriorityLevel>('high');

  const [complainantName, setComplainantName] = useState('');
  const [complainantContact, setComplainantContact] = useState('');
  const [complainantEmail, setComplainantEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [busRoute, setBusRoute] = useState('514');
  const [vehicleId, setVehicleId] = useState('12-3456');
  const [incidentTime, setIncidentTime] = useState(new Date().toISOString().slice(0, 16));
  const [incidentLocation, setIncidentLocation] = useState('อนุสาวรีย์ชัยสมรภูมิ');
  const [narrative, setNarrative] = useState('');
  const [zone, setZone] = useState('Zone 4');

  const [assignedInvestigator, setAssignedInvestigator] = useState('Kittipong N.');
  const [assignedManager, setAssignedManager] = useState('Somchai T.');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !subject.trim()) {
      setErrorMsg('กรุณาระบุหัวข้อเรื่องร้องเรียน');
      return;
    }
    if (step === 2 && !isAnonymous && !complainantName.trim()) {
      setErrorMsg('กรุณากรอกชื่อผู้ร้องเรียน หรือเลือกไม่ประสงค์ออกนาม');
      return;
    }
    if (step === 3 && !narrative.trim()) {
      setErrorMsg('กรุณาระบุรายละเอียดพฤติการณ์เหตุการณ์');
      return;
    }
    setErrorMsg(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newCaseId = `CR-2026-${randomSuffix}`;

    const newCase: Case = {
      id: newCaseId,
      subject: subject.trim(),
      category,
      channel,
      priority,
      status: 'new' as CaseStatus,
      complainantName: isAnonymous ? 'Anonymous' : complainantName.trim(),
      complainantContact: isAnonymous ? '' : complainantContact.trim(),
      complainantEmail: isAnonymous ? '' : complainantEmail.trim(),
      isAnonymous,
      busRoute: busRoute.trim(),
      vehicleId: vehicleId.trim(),
      incidentTime: new Date(incidentTime).toISOString(),
      incidentLocation: incidentLocation.trim(),
      narrative: narrative.trim(),
      tags: [`#${category}`, `#Route${busRoute}`, '#NewComplaint'],
      assignedInvestigator,
      assignedManager,
      zone,
      slaDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalStatus: 'pending'
    };

    try {
      await createCase(newCase);
      onCaseCreated(newCase);
      onClose();
    } catch (err: any) {
      console.error('Failed to create case:', err);
      onCaseCreated(newCase);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 my-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">บันทึกเรื่องร้องเรียนใหม่ (New Complaint)</h2>
              <p className="text-xs text-slate-500">กรอกข้อมูลตามลำดับขั้นตอนเพื่อส่งต่อหน่วยงานสอบสวน ขสมก.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Wizard (1 to 4) */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { s: 1, title: '1. ข้อมูลเรื่อง' },
            { s: 2, title: '2. ผู้ร้องเรียน' },
            { s: 3, title: '3. รายละเอียดเหตุ' },
            { s: 4, title: '4. มอบหมายงาน' },
          ].map((item) => (
            <div
              key={item.s}
              className={`p-2 rounded-lg text-center text-xs font-semibold transition-all ${
                step === item.s
                  ? 'bg-blue-600 text-white shadow-xs'
                  : step > item.s
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Case Details */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หัวข้อเรื่องร้องเรียน (Subject) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="เช่น พนักงานขับรถสาย 514 ขับรถปาดซ้ายขวาและไม่จอดรับผู้โดยสาร..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">หมวดหมู่เรื่องร้องเรียน</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CaseCategory)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer"
                >
                  <option value="driver_conduct">พฤติกรรมพนักงานขับรถ (Driver Conduct)</option>
                  <option value="schedule_delay">รถขาดระยะ / ไม่ตรงเวลา (Schedule Delay)</option>
                  <option value="vehicle_condition">สภาพตัวรถ / แอร์เสีย (Vehicle Condition)</option>
                  <option value="ticketing_issue">การเก็บค่าโดยสาร / ตั๋ว (Ticketing)</option>
                  <option value="route_change">การปรับเปลี่ยนเส้นทาง (Route Change)</option>
                  <option value="safety_violation">ความปลอดภัย / ฝ่าไฟแดง (Safety)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ช่องทางการรับเรื่อง</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as OriginatingChannel)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer"
                >
                  <option value="hotline">สายด่วน ขสมก. 1348 (Hotline)</option>
                  <option value="website">เว็บไซต์ ขสมก. (Website Portal)</option>
                  <option value="social_media">โซเชียลมีเดีย / Facebook (Social)</option>
                  <option value="in_person">ยื่นเรื่องด้วยตนเอง ณ เขตการเดินรถ</option>
                  <option value="mobile_app">ViaBus / Application</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">ระดับความสำคัญ (Priority)</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'high', label: 'ระดับสูง (High)', color: 'border-red-300 text-red-700 bg-red-50/50' },
                  { id: 'medium', label: 'ระดับปานกลาง (Medium)', color: 'border-amber-300 text-amber-700 bg-amber-50/50' },
                  { id: 'low', label: 'ระดับปกติ (Low)', color: 'border-slate-300 text-slate-700 bg-slate-50' },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`p-3 rounded-lg border flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold transition-all ${
                      priority === p.id ? `ring-2 ring-blue-600 ${p.color}` : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority_select"
                      checked={priority === p.id}
                      onChange={() => setPriority(p.id as PriorityLevel)}
                      className="hidden"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Complainant Information */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3.5 bg-blue-50/60 rounded-lg border border-blue-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-900">ไม่ประสงค์ออกนาม (Anonymous Complainant)</span>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>

            {!isAnonymous && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อ-นามสกุล ผู้ร้องเรียน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    placeholder="เช่น นายสมพงษ์ ใจดี"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                    <input
                      type="text"
                      value={complainantContact}
                      onChange={(e) => setComplainantContact(e.target.value)}
                      placeholder="081-456-7890"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">อีเมล (ถ้ามี)</label>
                    <input
                      type="email"
                      value={complainantEmail}
                      onChange={(e) => setComplainantEmail(e.target.value)}
                      placeholder="complainant@example.com"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Incident Information */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">สายรถโดยสาร ขสมก.</label>
                <input
                  type="text"
                  value={busRoute}
                  onChange={(e) => setBusRoute(e.target.value)}
                  placeholder="เช่น 514 (มีนบุรี - สีลม)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">เบอร์ข้างรถ / ทะเบียนรถ</label>
                <input
                  type="text"
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  placeholder="เช่น 12-3456 / Bus-8A"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">วันและเวลาที่เกิดเหตุ</label>
                <input
                  type="datetime-local"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">สถานที่เกิดเหตุ / จุดตัด</label>
                <input
                  type="text"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  placeholder="เช่น สี่แยกรัชดาภิเษก หน้าบิ๊กซี"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รายละเอียดเหตุการณ์ (Narrative) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="ระบุพฤติการณ์โดยละเอียด เช่น พนักงานขับรถขับขี่ด้วยความเร็วสูง เบรกกะทันหัน..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Assignment & Zone */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">เขตการเดินรถผู้รับผิดชอบ</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer"
                >
                  <option value="Zone 1">เขตการเดินรถที่ 1 (บางเขน)</option>
                  <option value="Zone 2">เขตการเดินรถที่ 2 (มีนบุรี)</option>
                  <option value="Zone 3">เขตการเดินรถที่ 3 (สมุทรปราการ)</option>
                  <option value="Zone 4">เขตการเดินรถที่ 4 (คลองเตย)</option>
                  <option value="Zone 5">เขตการเดินรถที่ 5 (แสมดำ)</option>
                  <option value="Zone 6">เขตการเดินรถที่ 6 (ธรรมศาสตร์)</option>
                  <option value="Zone 7">เขตการเดินรถที่ 7 (ท่าอิฐ)</option>
                  <option value="Zone 8">เขตการเดินรถที่ 8 (หมอชิต 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">หัวหน้าผู้สอบสวน</label>
                <input
                  type="text"
                  value={assignedInvestigator}
                  onChange={(e) => setAssignedInvestigator(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ผู้จัดการเขตการเดินรถ</label>
              <input
                type="text"
                value={assignedManager}
                onChange={(e) => setAssignedManager(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white"
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800 space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <Info className="w-4 h-4 text-blue-600" />
                <span>การกำหนดเวลา SLA อัตโนมัติ:</span>
              </div>
              <p>ระบบจะกำหนด SLA เป้าหมายการสอบสวน 5 วันทำการนับตั้งแต่วันที่รับเรื่อง</p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-submit-complaint"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกเรื่องร้องเรียน'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
