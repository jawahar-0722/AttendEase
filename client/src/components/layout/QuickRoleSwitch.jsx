import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, GraduationCap, UserCheck, QrCode, Radio } from 'lucide-react';

export default function QuickRoleSwitch({ onOpenQR, onOpenBiometric }) {
  const { role, switchRole } = useAuth();

  return (
    <div className="bg-navy-900 border-b border-navy-800 text-slate-300 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 uppercase tracking-wider">
          Demo Presentation Mode
        </span>
        <span className="hidden sm:inline text-slate-400">Switch actor perspective:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => switchRole('admin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
            role === 'admin'
              ? 'bg-brand-indigo text-white shadow-sm ring-1 ring-white/20'
              : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
          <span>Admin</span>
        </button>

        <button
          onClick={() => switchRole('faculty')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
            role === 'faculty'
              ? 'bg-brand-indigo text-white shadow-sm ring-1 ring-white/20'
              : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-cyan-300" />
          <span>Faculty (Dr. Vance)</span>
        </button>

        <button
          onClick={() => switchRole('student')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
            role === 'student'
              ? 'bg-brand-indigo text-white shadow-sm ring-1 ring-white/20'
              : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
          <span>Student (Alex Rivera)</span>
        </button>

        <div className="h-4 w-px bg-navy-700 mx-1 hidden md:block" />

        {onOpenQR && (
          <button
            onClick={onOpenQR}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-cyan/15 text-cyan-300 hover:bg-brand-cyan/25 transition-colors border border-cyan-500/30 font-medium"
            title="Open Dynamic QR Attendance Terminal"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR Station</span>
          </button>
        )}

        {onOpenBiometric && (
          <button
            onClick={onOpenBiometric}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-colors border border-amber-500/30 font-medium"
            title="Open RFID / Biometric Hardware Simulator"
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RFID Simulator</span>
          </button>
        )}
      </div>
    </div>
  );
}
