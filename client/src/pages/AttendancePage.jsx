import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  QrCode,
  Radio,
  FileBarChart2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlayCircle,
  Users
} from 'lucide-react';
import TodayClassesTable from '../components/dashboard/TodayClassesTable';

export default function AttendancePage({
  onOpenMarkAttendance,
  onOpenQR,
  onOpenBiometric,
  onOpenGenerateReport
}) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/attendance/today-classes');
      const data = await res.json();
      if (data.success) {
        setClasses(data.classes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header with quick launch buttons */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand-indigo border border-indigo-100 uppercase tracking-wide">
            Attendance Operations Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-1.5">
            Mark & Verify Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose from manual entry, dynamic classroom QR code projection, or biometric IoT gate sync.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenMarkAttendance()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md shadow-brand-indigo/30 transition-all hover:scale-[1.02]"
          >
            <CheckSquare className="w-4 h-4 text-cyan-300" />
            <span>Manual Roster Mark</span>
          </button>

          <button
            onClick={onOpenQR}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-cyan hover:bg-brand-cyanHover text-white text-xs font-bold shadow-md shadow-brand-cyan/25 transition-all hover:scale-[1.02]"
          >
            <QrCode className="w-4 h-4 text-white" />
            <span>Project QR Code</span>
          </button>

          <button
            onClick={onOpenBiometric}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-all hover:scale-[1.02]"
          >
            <Radio className="w-4 h-4 text-white" />
            <span>RFID / Hardware</span>
          </button>
        </div>
      </div>

      {/* Today's Schedule Table */}
      <TodayClassesTable
        classes={classes}
        onOpenMarkAttendance={onOpenMarkAttendance}
      />

    </div>
  );
}
