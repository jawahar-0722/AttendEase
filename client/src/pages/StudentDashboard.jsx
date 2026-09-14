import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Send,
  HelpCircle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CalendarWidget from '../components/dashboard/CalendarWidget';

export default function StudentDashboard({
  onOpenQR,
  onOpenLeaveRequest,
  onOpenCorrections
}) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/stats/student/${user?.id || 'stu_1'}`);
        const result = await res.json();
        if (result.success) {
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const overall = data?.overallAttendance || 91.2;
  const isDefaulter = overall < 75.0;

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Student Attendance Portal
            </span>
            <span className="text-xs text-slate-400 font-semibold font-mono">
              Roll No: {user?.rollNo || 'CS2024-042'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Welcome, {user?.name || 'Alex Rivera'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Computer Science & Engineering • Class CSE-4A • Fall 2024 Semester 7
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenQR}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md shadow-brand-indigo/30 transition-all hover:scale-[1.02]"
          >
            <QrCode className="w-4 h-4 text-cyan-300" />
            <span>Scan Classroom QR</span>
          </button>

          <button
            onClick={onOpenLeaveRequest}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold border border-slate-200 shadow-xs transition-all hover:scale-[1.02]"
          >
            <Calendar className="w-4 h-4 text-brand-indigo" />
            <span>Apply for Leave</span>
          </button>

          <button
            onClick={onOpenCorrections}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Correction Request</span>
          </button>
        </div>
      </div>

      {/* Low Attendance Warning Alert (if < 75%) */}
      {isDefaulter ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3.5 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-rose-900">Attendance Below University 75% Requirement</h4>
            <p className="text-rose-700 mt-0.5 leading-relaxed">
              Your overall attendance is currently at <strong>{overall}%</strong>. University regulations require minimum 75% to appear for end-semester examinations. You need to attend the next <strong>{data?.classesNeeded || 5} classes</strong> without absence to regain eligibility.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-900">Good Academic Standing</span>
              <p className="text-emerald-700 text-[11px]">
                Your attendance is well above the 75% threshold. You can afford to miss up to <strong>{data?.canMissClasses || 6} classes</strong> without dropping below 75%.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-200/80 text-emerald-900">
            Exam Eligible
          </span>
        </div>
      )}

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Percentage */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card border-l-4 border-l-brand-indigo flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">Cumulative Rate</span>
            <p className="text-3xl font-extrabold text-navy-900 mt-1">{overall}%</p>
            <span className="text-[11px] text-slate-500">Threshold: 75.0%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-indigo font-bold text-sm">
            {overall >= 75 ? '✓' : '!'}
          </div>
        </div>

        {/* Metric 2: Classes Attended */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold uppercase text-slate-400">Classes Attended</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">
            {data?.presentClasses || 73}
          </p>
          <span className="text-[11px] text-slate-500">of {data?.totalClasses || 80} conducted</span>
        </div>

        {/* Metric 3: Classes Missed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card border-l-4 border-l-rose-500">
          <span className="text-xs font-bold uppercase text-slate-400">Classes Missed</span>
          <p className="text-3xl font-extrabold text-rose-600 mt-1">
            {data?.absentClasses || 7}
          </p>
          <span className="text-[11px] text-slate-500">2 with approved OD leave</span>
        </div>

        {/* Metric 4: RFID Card ID */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card border-l-4 border-l-brand-cyan">
          <span className="text-xs font-bold uppercase text-slate-400">Physical RFID Badge</span>
          <p className="text-base font-mono font-extrabold text-navy-900 mt-2 truncate">
            {user?.rfidCardId || 'RFID-994821'}
          </p>
          <span className="text-[11px] text-brand-cyan font-bold">● Active at Turnstiles</span>
        </div>
      </div>

      {/* Main Grid: Subject Breakdown + Calendar Attendance View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Subject-Wise Attendance Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-indigo" />
                Attendance Percentage by Subject
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Individual course compliance monitoring
              </p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Min Target: 75%</span>
          </div>

          <div className="space-y-4 pt-1">
            {(data?.subjects || [
              { code: "CS701", name: "Distributed Systems", present: 22, total: 24, rate: 91.7 },
              { code: "CS702", name: "Machine Learning", present: 20, total: 22, rate: 90.9 },
              { code: "CS703", name: "Cloud Computing", present: 17, total: 18, rate: 94.4 },
              { code: "CS704", name: "Cyber Security", present: 14, total: 16, rate: 87.5 }
            ]).map((sub) => (
              <div key={sub.code} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy-900">{sub.name}</span>
                    <span className="text-slate-400 font-mono ml-1.5">({sub.code})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">{sub.present}/{sub.total} Classes</span>
                    <span className={`font-extrabold ${sub.rate >= 75 ? 'text-brand-indigo' : 'text-rose-600'}`}>
                      {sub.rate}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      sub.rate >= 85
                        ? 'bg-gradient-to-r from-brand-indigo to-brand-cyan'
                        : sub.rate >= 75
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${sub.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar View for Student */}
        <div>
          <CalendarWidget onSelectDate={(d) => console.log(d)} />
        </div>

      </div>

      {/* Present / Absent Session History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        <h3 className="text-base font-bold text-navy-900 mb-3">
          Recent Attendance History & Punch Log
        </h3>

        <div className="space-y-2.5">
          {(data?.calendarLog || [
            { date: "2024-09-12", status: "present", subject: "Distributed Systems" },
            { date: "2024-09-11", status: "absent", subject: "Cloud Computing" },
            { date: "2024-09-10", status: "present", subject: "Machine Learning" },
            { date: "2024-09-09", status: "present", subject: "Distributed Systems" },
            { date: "2024-09-06", status: "late", subject: "Cyber Security" }
          ]).map((log, i) => (
            <div
              key={i}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold">
                  {log.status === 'present' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {log.status === 'absent' && <XCircle className="w-4 h-4 text-rose-600" />}
                  {log.status === 'late' && <Clock className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <span className="font-bold text-navy-900">{log.subject}</span>
                  <span className="text-[11px] text-slate-400 block font-mono">{log.date}</span>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                log.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                log.status === 'absent' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
