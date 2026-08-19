import React from 'react';
import { Users, Building2, Shield, Phone, Mail, CheckCircle2, Bus } from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const staffMembers = [
    {
      name: 'Risk BMTA Officer',
      email: 'riskbmta.zone6@gmail.com',
      roleEn: 'ผู้จัดการเขตการเดินรถ',
      zone: 'เขต 6 (ธรรมศาสตร์ รังสิต)',
      phone: '02-564-4411',
      status: 'พร้อมปฏิบัติงาน',
      casesHandling: 14,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop'
    },
    {
      name: 'นายกิตติพงษ์ นาวิน (Kittipong N.)',
      email: 'kittipong.n@bmta.go.th',
      roleEn: 'หัวหน้าผู้สอบสวนข้อเท็จจริง',
      zone: 'เขต 4 (คลองเตย)',
      phone: '081-998-1234',
      status: 'พร้อมปฏิบัติงาน',
      casesHandling: 8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop'
    },
    {
      name: 'นายสมชาย ทรงคุณ (Somchai T.)',
      email: 'somchai.t@bmta.go.th',
      roleEn: 'ผู้อำนวยการเขตการเดินรถที่ 4',
      zone: 'เขต 4 (คลองเตย)',
      phone: '02-249-0123',
      status: 'พร้อมปฏิบัติงาน',
      casesHandling: 24,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop'
    },
    {
      name: 'นายวิชัย สุวรรณ (Wichai S.)',
      email: 'wichai.s@bmta.go.th',
      roleEn: 'เจ้าหน้าที่ตรวจสอบภาคสนาม',
      zone: 'เขต 3 (สมุทรปราการ)',
      phone: '089-332-1100',
      status: 'พร้อมปฏิบัติงาน',
      casesHandling: 6,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'
    },
  ];

  const zones = [
    { zone: 'เขต 1', depot: 'อู่บางเขน', routes: 'สาย 59, 95, 107, 129, 543', manager: 'นายประเสริฐ สุขใจ' },
    { zone: 'เขต 2', depot: 'อู่มีนบุรี / สวนสยาม', routes: 'สาย 26, 60, 96, 168, 514', manager: 'นางสาวจินตนา ภักดี' },
    { zone: 'เขต 3', depot: 'อู่ฟาร์มจระเข้ สมุทรปราการ', routes: 'สาย 23, 25, 102, 142, 511', manager: 'นายเกรียงไกร มั่นคง' },
    { zone: 'เขต 4', depot: 'อู่คลองเตย / พระราม 9', routes: 'สาย 4, 13, 72, 137, 180', manager: 'นายสมชาย ทรงคุณ' },
    { zone: 'เขต 5', depot: 'อู่แสมดำ / ธนบุรี', routes: 'สาย 68, 76, 105, 140, 141', manager: 'นายสุรศักดิ์ วงศ์ไทย' },
    { zone: 'เขต 6', depot: 'อู่ธรรมศาสตร์ / รังสิต', routes: 'สาย 29, 39, 510, 520', manager: 'Risk BMTA Officer' },
    { zone: 'เขต 7', depot: 'อู่ท่าอิฐ / นนทบุรี', routes: 'สาย 18, 50, 66, 97, 134', manager: 'นายธีระพล พัฒนา' },
    { zone: 'เขต 8', depot: 'อู่หมอชิต 2 / สวนจตุจักร', routes: 'สาย 3, 16, 49, 138, 204', manager: 'นายณรงค์ศักดิ์ สดใส' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">ทีมงานและเขตการเดินรถ (Staff & Zones)</h2>
        <p className="text-xs text-slate-500">รายชื่อผู้มีอำนาจสอบสวน ผู้จัดการเขต และข้อมูลศูนย์ควบคุม ขสมก.</p>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {staffMembers.map((staff, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src={staff.avatar} 
                alt={staff.name} 
                className="w-11 h-11 rounded-full border border-slate-200 object-cover" 
                referrerPolicy="no-referrer" 
              />
              <div className="min-w-0">
                <h4 className="font-semibold text-xs text-slate-900 truncate">{staff.name}</h4>
                <p className="text-[11px] text-blue-600 font-medium truncate">{staff.roleEn}</p>
                <span className="text-[10px] text-slate-400 font-mono">{staff.zone}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
              <div className="flex items-center gap-2 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">{staff.phone}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">รับผิดชอบ: <strong>{staff.casesHandling} เคส</strong></span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 font-medium rounded-full text-[10px]">
                {staff.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Zones Table matching Professional Polish */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-slate-800 text-sm">ทำเนียบ 8 เขตการเดินรถ องค์การขนส่งมวลชนกรุงเทพ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3">เขตการเดินรถ</th>
                <th className="px-6 py-3">ศูนย์ควบคุม / อู่จอดหลัก</th>
                <th className="px-6 py-3">สายรถเมล์ในความรับผิดชอบ</th>
                <th className="px-6 py-3">ผู้อำนวยการเขต</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {zones.map((z, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-blue-600">{z.zone}</td>
                  <td className="px-6 py-3.5 font-medium text-slate-800 text-xs">{z.depot}</td>
                  <td className="px-6 py-3.5 text-slate-600 font-mono text-xs">{z.routes}</td>
                  <td className="px-6 py-3.5 text-slate-700 text-xs">{z.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
