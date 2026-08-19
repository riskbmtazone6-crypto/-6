import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Bus, 
  User, 
  Phone, 
  Mail, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Paperclip, 
  Upload, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Case, Evidence, TimelineEvent } from '../types';
import { 
  updateCaseData, 
  addTimelineEvent, 
  addEvidenceItem, 
  subscribeToTimeline, 
  subscribeToEvidence 
} from '../services/casesService';

interface CaseDetailsViewProps {
  currentCase: Case;
  onBack: () => void;
  onOpenPrintBrief: (caseItem: Case) => void;
  onUpdateCaseState: (updated: Case) => void;
}

export const CaseDetailsView: React.FC<CaseDetailsViewProps> = ({
  currentCase,
  onBack,
  onOpenPrintBrief,
  onUpdateCaseState
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'timeline' | 'actions'>('details');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [noteText, setNoteText] = useState('');
  const [managerActionNote, setManagerActionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);

  // Subscribe to real-time timeline & evidence
  useEffect(() => {
    const unsubTimeline = subscribeToTimeline(currentCase.id, (events) => {
      setTimelineEvents(events);
    });
    const unsubEvidence = subscribeToEvidence(currentCase.id, (evs) => {
      setEvidenceList(evs);
    });
    return () => {
      unsubTimeline();
      unsubEvidence();
    };
  }, [currentCase.id]);

  // Time remaining calculation for SLA
  const calculateTimeRemaining = (deadline: string) => {
    const totalHours = Math.round((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60));
    if (totalHours <= 0) return { text: 'เกินกำหนดแล้ว (Overdue)', isLate: true };
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return { text: `เหลือเวลา ${days} วัน ${hours} ชั่วโมง`, isLate: false };
  };

  const slaStatus = calculateTimeRemaining(currentCase.slaDeadline);

  // Manager Approval Handler
  const handleManagerDecision = async (status: 'approved' | 'rejected') => {
    setIsSubmitting(true);
    try {
      const updatedCase: Case = {
        ...currentCase,
        status: status === 'approved' ? 'completed' : 'investigating',
        approvalStatus: status === 'approved' ? 'approved' : 'revised',
        managerNotes: managerActionNote.trim() || (status === 'approved' ? 'อนุมัติผลการสอบสวนและมาตรการลงโทษตามเสนอ' : 'ส่งกลับให้สอบสวนข้อเท็จจริงเพิ่มเติม'),
        updatedAt: new Date().toISOString()
      };

      await updateCaseData(currentCase.id, updatedCase);
      await addTimelineEvent(currentCase.id, {
        id: `tl-${Date.now()}`,
        caseId: currentCase.id,
        title: status === 'approved' ? 'อนุมัติผลการสอบสวนและลงนามคำสั่ง' : 'ส่งกลับเพื่อทบทวนผลการสอบสวน',
        description: managerActionNote.trim() || 'พิจารณาเรียบร้อย',
        type: 'manager_action',
        timestamp: new Date().toISOString(),
        author: 'Risk BMTA Manager (Zone 6)'
      });

      onUpdateCaseState(updatedCase);
      setApprovalFeedback(status === 'approved' ? 'อนุมัติสำนวนและยุติเรื่องร้องเรียนเรียบร้อย' : 'ส่งกลับแก้ไขสำนวนเรียบร้อย');
      setTimeout(() => setApprovalFeedback(null), 4000);
    } catch (err) {
      console.error('Error updating case decision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Investigation Note
  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    try {
      await addTimelineEvent(currentCase.id, {
        id: `tl-${Date.now()}`,
        caseId: currentCase.id,
        title: 'บันทึกความคืบหน้าการสอบสวน',
        description: noteText.trim(),
        type: 'note',
        timestamp: new Date().toISOString(),
        author: 'หัวหน้าผู้สอบสวน'
      });
      setNoteText('');
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newEvidence: Evidence = {
        id: `ev-${Date.now()}`,
        caseId: currentCase.id,
        fileName: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        fileUrl: URL.createObjectURL(file),
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Risk BMTA Officer'
      };

      await addEvidenceItem(currentCase.id, newEvidence);
      await addTimelineEvent(currentCase.id, {
        id: `tl-${Date.now()}`,
        caseId: currentCase.id,
        title: `เพิ่มหลักฐานใหม่: ${file.name}`,
        description: `อัปโหลดไฟล์หลักฐานขนาด ${newEvidence.fileSize} เข้าสู่ระบบ`,
        type: 'evidence_added',
        timestamp: new Date().toISOString(),
        author: 'Risk BMTA Officer'
      });
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header & Quick Action Toolbar */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="ย้อนกลับ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-blue-600 text-sm">{currentCase.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                currentCase.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : currentCase.status === 'overdue'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {currentCase.status === 'completed' ? 'เสร็จสิ้น' : currentCase.status === 'overdue' ? 'ล่าช้า' : 'กำลังดำเนินการ'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mt-1">{currentCase.subject}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-print-case-brief"
            onClick={() => onOpenPrintBrief(currentCase)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงานสรุป (Print Brief)</span>
          </button>
        </div>
      </div>

      {/* SLA Countdown & Key Info Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border flex items-center gap-3 shadow-xs ${
          slaStatus.isLate ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 ${
            slaStatus.isLate ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-medium text-slate-500 block">เกณฑ์กำหนดเวลา SLA</span>
            <span className="text-sm font-semibold truncate block">{slaStatus.text}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Bus className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-medium text-slate-500 block">สายรถ / เบอร์ข้างรถ</span>
            <span className="text-sm font-semibold text-slate-800 truncate block">
              สาย {currentCase.busRoute || '-'} (ทะเบียน {currentCase.vehicleId || '-'})
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-medium text-slate-500 block">เขตการเดินรถผู้รับผิดชอบ</span>
            <span className="text-sm font-semibold text-slate-800 truncate block">{currentCase.zone}</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu matching Professional Polish */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-medium">
        {[
          { id: 'details', label: 'รายละเอียดเหตุการณ์' },
          { id: 'evidence', label: `หลักฐานและภาพถ่าย (${evidenceList.length})` },
          { id: 'timeline', label: `บันทึกการสอบสวน (${timelineEvents.length})` },
          { id: 'actions', label: 'คำสั่งการของผู้จัดการเขต' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DETAILS */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Narrative */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-800 text-sm">พฤติการณ์เหตุการณ์โดยละเอียด</h3>
              <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
                {currentCase.narrative}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">สถานที่เกิดเหตุ</span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{currentCase.incidentLocation || '-'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">วันและเวลาที่เกิดเหตุ</span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{new Date(currentCase.incidentTime).toLocaleString('th-TH')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Info Cards */}
          <div className="space-y-6">
            {/* Complainant Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-semibold text-slate-800 text-sm">ข้อมูลผู้ร้องเรียน</h3>
              {currentCase.isAnonymous ? (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 italic">
                  ผู้ร้องเรียนระบุไม่ประสงค์ออกนาม (Anonymous)
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{currentCase.complainantName}</span>
                  </div>
                  {currentCase.complainantContact && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700 font-mono">{currentCase.complainantContact}</span>
                    </div>
                  )}
                  {currentCase.complainantEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700 font-mono">{currentCase.complainantEmail}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Officer Assignment */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <h3 className="font-semibold text-slate-800 text-sm">ผู้รับผิดชอบสำนวน</h3>
              <div className="space-y-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">หัวหน้าผู้สอบสวน</span>
                  <span className="font-semibold">{currentCase.assignedInvestigator || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ผู้จัดการเขตการเดินรถ</span>
                  <span className="font-semibold">{currentCase.assignedManager || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">ไฟล์หลักฐานและภาพถ่ายเหตุการณ์</h3>
              <p className="text-xs text-slate-500">จัดเก็บไฟล์เอกสารและภาพลงใน Google Drive ขสมก. โดยอัตโนมัติ</p>
            </div>
            <label className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'กำลังอัปโหลด...' : 'เพิ่มไฟล์หลักฐาน'}</span>
              <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,video/*,.pdf" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {evidenceList.length > 0 ? (
              evidenceList.map((ev) => (
                <div key={ev.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                  <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                    {ev.fileType === 'image' && ev.fileUrl ? (
                      <img src={ev.fileUrl} alt={ev.fileName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">FILE: {ev.fileName}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">{ev.fileName}</span>
                    {ev.fileUrl && (
                      <a href={ev.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>เปิดดู</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-xs text-slate-400">
                ยังไม่มีไฟล์หลักฐานเพิ่มเติม
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-slate-800 text-sm">บันทึกขั้นตอนการสอบสวน (Audit Trail)</h3>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="พิมพ์บันทึกข้อเท็จจริงหรือความคืบหน้า..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500"
              />
              <button
                onClick={handleAddNote}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                บันทึกโน้ต
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {timelineEvents.length > 0 ? (
              timelineEvents.map((event) => (
                <div key={event.id} className="py-3 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{event.title}</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {new Date(event.timestamp).toLocaleString('th-TH')}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{event.description}</p>
                    <span className="text-[11px] text-blue-600 font-medium">{event.author}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-slate-400 text-xs">ยังไม่มีบันทึกเหตุการณ์</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ACTIONS */}
      {activeTab === 'actions' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm">การสั่งการและมาตรการลงโทษ โดยผู้จัดการเขต</h3>

          {approvalFeedback && (
            <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{approvalFeedback}</span>
            </div>
          )}

          <textarea
            rows={4}
            placeholder="ระบุคำสั่งการ เช่น ว่ากล่าวตักเตือน, พักใบอนุญาตขับขี่ 7 วัน หรือส่งเข้ารับการอบรมพฤติกรรมบริการ..."
            value={managerActionNote}
            onChange={(e) => setManagerActionNote(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500"
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleManagerDecision('rejected')}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              ส่งกลับให้สอบสวนเพิ่ม
            </button>
            <button
              onClick={() => handleManagerDecision('approved')}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>ลงนามอนุมัติและยุติเรื่อง</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
