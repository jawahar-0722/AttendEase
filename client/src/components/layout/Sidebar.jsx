import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Building2,
  CalendarDays,
  FileBarChart2,
  Settings,
  HelpCircle,
  QrCode,
  Radio,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({
  activeTab,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  onOpenQR,
  onOpenBiometric
}) {
  const { role } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mark-attendance', label: 'Mark Attendance', icon: CheckSquare },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'classes', label: 'Classes & Depts', icon: Building2 },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-navy-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-navy-800 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding (in sidebar for mobile, and header spacing) */}
        <div className="p-5 border-b border-navy-800 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-brand-cyan tracking-widest block">
              Portal Navigation
            </span>
            <span className="text-sm font-semibold text-white">
              {role === 'admin' ? 'Administrative Suite' : role === 'faculty' ? 'Faculty Portal' : 'Student Portal'}
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-brand-indigo text-white shadow-md shadow-brand-indigo/30 font-semibold'
                    : 'text-slate-300 hover:bg-navy-800/80 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Quick Hardware & QR shortcuts in sidebar */}
          <div className="pt-4 mt-4 border-t border-navy-800">
            <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Smart Hardware
            </span>
            <button
              onClick={() => {
                onOpenQR();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-cyan-300 hover:bg-navy-800 hover:text-cyan-200 transition-colors"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>QR Code Station</span>
            </button>
            <button
              onClick={() => {
                onOpenBiometric();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-amber-300 hover:bg-navy-800 hover:text-amber-200 transition-colors"
            >
              <Radio className="w-4 h-4 text-amber-400" />
              <span>RFID Biometric Feed</span>
            </button>
          </div>
        </nav>

        {/* Bottom College System Status Card */}
        <div className="p-4 border-t border-navy-800 bg-navy-950/40">
          <div className="bg-navy-800/70 rounded-xl p-3 border border-navy-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white">Apex Campus AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Biometric gateway operational. 4 terminals active.
            </p>
            <div className="mt-2.5 pt-2 border-t border-navy-700/50 flex items-center justify-between text-[10px] text-slate-400">
              <span>Term: Fall 2024</span>
              <span className="text-brand-cyan font-semibold">v1.0 Final Year</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
