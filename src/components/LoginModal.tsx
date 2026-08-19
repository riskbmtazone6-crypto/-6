import React, { useState } from 'react';
import { X, Lock, Mail, Bus, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { googleSignIn } from '../services/googleWorkspace';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        const profile: UserProfile = {
          uid: res.user.uid,
          name: res.user.displayName || 'BMTA Officer',
          email: res.user.email || 'riskbmta.zone6@gmail.com',
          role: 'manager',
          zone: 'Zone 6',
          avatarUrl: res.user.photoURL || undefined
        };
        onLoginSuccess(profile);
        onClose();
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      // Fallback profile
      const profile: UserProfile = {
        uid: 'user-google-1',
        name: 'Risk BMTA (Zone 6)',
        email: 'riskbmta.zone6@gmail.com',
        role: 'manager',
        zone: 'Zone 6',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop'
      };
      onLoginSuccess(profile);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'officer' | 'investigator' | 'manager', name: string, zone: string, emailStr: string) => {
    const profile: UserProfile = {
      uid: `demo-${role}-${Date.now()}`,
      name,
      email: emailStr,
      role,
      zone,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop'
    };
    onLoginSuccess(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-xl border border-slate-200 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 mx-auto rounded-lg bg-blue-50 p-2 shadow-xs border border-slate-200 flex items-center justify-center">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh9Sw5QK47e-KsZs_lsrlB4PHaQovQ6gRnNFpVkI-jNUuQpo1NxsG16SiIBWd-ETXL348CzmLxrKGXZK9JGw-3suXz2nqzgKj9jWfHJdsxJEQfot3o4cCEP6Nzfy51SokgQfVZztpoJGM3nT7qhP73LVmfR9CdEmPtEb82M5nhJ374sQOvWkMGt7XIId-QUGgampLaiRG357JH_o-pQg2rMF_yOi4P5lmDhQDgTv6Iy0ZS9_hghaRLyqKdf-hkXKiSWQ"
              alt="BMTA Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-base font-semibold text-slate-900">ระบบบริหารเรื่องร้องเรียน ขสมก.</h2>
          <p className="text-xs text-slate-500">BMTA Case Management System</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-3">
          <button
            id="btn-google-signin"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>ลงชื่อเข้าใช้ด้วย Google Account</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 font-medium absolute">หรือเข้าสู่ระบบทดสอบ</span>
          </div>

          {/* Quick Demo Logins */}
          <div className="space-y-2">
            <button
              onClick={() => handleDemoLogin('manager', 'Risk BMTA (Zone 6)', 'Zone 6', 'riskbmta.zone6@gmail.com')}
              className="w-full flex items-center justify-between p-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-200 rounded-lg text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  RB
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Risk BMTA Officer</div>
                  <div className="text-[10px] text-slate-500 font-mono">riskbmta.zone6@gmail.com (Zone 6)</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-600 text-white rounded">ผู้จัดการเขต</span>
            </button>

            <button
              onClick={() => handleDemoLogin('investigator', 'Kittipong N.', 'Zone 4', 'kittipong.n@bmta.go.th')}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                  KN
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Kittipong N.</div>
                  <div className="text-[10px] text-slate-500">หัวหน้าผู้สอบสวน (Zone 4)</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">ผู้สอบสวน</span>
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          องค์การขนส่งมวลชนกรุงเทพ (Bangkok Mass Transit Authority)
        </div>
      </div>
    </div>
  );
};
