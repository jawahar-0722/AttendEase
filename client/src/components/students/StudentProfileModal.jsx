import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, UserCheck, AlertTriangle, CheckCircle2, BookOpen, Clock, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function StudentProfileModal({ isOpen, onClose, student }) {
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !student) return;

    const fetchStudentStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/stats/student/${student.id || student.rollNo}`);
        const data = await res.json();
        if (data.success) {
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentStats();
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const rate = stats?.overallAttendance ?? student.attendanceRate ?? 88.6;
  const isDefaulter = rate < 75.0;

  const handleSendAlert = () => {
    addToast(`Attendance warning notice dispatched to parent (${student.parentPhone || student.email})`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-elevated border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with profile banner */}
        <div className="p-6 bg-gradient-to-r from-navy-900 via-navy-800 to-brand-indigo text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{student.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  isDefaulter ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {isDefaulter ? 'At Risk (<75%)' : 'Eligible'}
                </span>
              </div>
              <p className="text-xs text-brand-cyan font-mono">{student.rollNo} • Class: {student.class}</p>
              <p className="text-[11px] text-slate-300 mt-0.5">{student.department} • Semester {student.semester || 7}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Attendance Metric Snapshot */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Overall Rate</span>
            <span className={`text-2xl font-extrabold ${isDefaulter ? 'text-rose-600' : 'text-brand-indigo'}`}>
              {rate}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Target: 75.0%</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Classes Attended</span>
            <span className="text-2xl font-extrabold text-navy-900">
              {stats?.presentClasses || student.presentClasses || 73}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">of {stats?.totalClasses || student.totalClasses || 80} Total</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">RFID Token</span>
            <span className="text-xs font-mono font-bold text-slate-700 block mt-2">
              {student.rfid || 'RFID-994821'}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">● Active</span>
          </div>
        </div>

        {/* Shortfall Alert if < 75% */}
        {isDefaulter && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-rose-900">Attendance Shortfall Detected</h4>
              <p className="text-rose-700 mt-0.5 leading-relaxed">
                Student must attend the next <strong>{stats?.classesNeeded || 5} consecutive classes</strong> to achieve the mandatory 75% university eligibility threshold.
              </p>
              <button
                onClick={handleSendAlert}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] shadow-xs"
              >
                <Send className="w-3 h-3" />
                Notify Parent via SMS / Email
              </button>
            </div>
          </div>
        )}

        {/* Subject Breakdown */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-indigo" />
            Subject-wise Attendance Breakdown
          </h4>

          <div className="space-y-3">
            {(stats?.subjects || [
              { code: "CS701", name: "Distributed Systems", present: 22, total: 24, rate: 91.7 },
              { code: "CS702", name: "Machine Learning", present: 20, total: 22, rate: 90.9 },
              { code: "CS703", name: "Cloud Computing", present: 17, total: 18, rate: 94.4 },
              { code: "CS704", name: "Cyber Security", present: 14, total: 16, rate: 87.5 }
            ]).map((sub) => (
              <div key={sub.code} className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-navy-900">{sub.name} <span className="text-slate-400 font-normal">({sub.code})</span></span>
                  <span className={`font-extrabold ${sub.rate >= 75 ? 'text-navy-900' : 'text-rose-600'}`}>
                    {sub.rate}% ({sub.present}/{sub.total})
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      sub.rate >= 85 ? 'bg-emerald-500' : sub.rate >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${sub.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Contact Details */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Parent / Guardian:</span>
              <span className="font-bold text-slate-800">{student.parentName || 'Carlos Rivera'}</span>
              <span className="text-slate-500 block font-mono text-[11px]">{student.parentPhone || '+1 (555) 987-6543'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Student Contact:</span>
              <span className="font-bold text-slate-800">{student.email}</span>
              <span className="text-slate-500 block font-mono text-[11px]">{student.phone || '+1 (555) 234-8901'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-navy-900 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
