import React, { useState, useEffect } from 'react';
import { X, Check, XCircle, Clock, ShieldAlert, CheckCheck, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { soundFX } from '../../utils/audio';

export default function MarkAttendanceModal({ isOpen, onClose, classData, onSaved }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [roster, setRoster] = useState([]);
  const [sessionClass, setSessionClass] = useState(classData?.class || 'CSE-4A');
  const [sessionSubject, setSessionSubject] = useState(classData?.subject || 'Distributed Systems');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState('1st Period');

  useEffect(() => {
    if (classData) {
      setSessionClass(classData.class || 'CSE-4A');
      setSessionSubject(classData.subject || 'Distributed Systems');
    }
  }, [classData]);

  // Load roster
  useEffect(() => {
    if (!isOpen) return;

    const loadRoster = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/attendance/session?class=${sessionClass}&subject=${encodeURIComponent(sessionSubject)}&date=${sessionDate}`);
        const data = await res.json();
        if (data.success && data.session?.roster) {
          setRoster(data.session.roster);
        }
      } catch (err) {
        console.error('Error fetching roster:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoster();
  }, [isOpen, sessionClass, sessionSubject, sessionDate]);

  if (!isOpen) return null;

  const toggleStatus = (studentId, newStatus) => {
    soundFX.playBeep();
    setRoster(prev => prev.map(s => s.studentId === studentId ? { ...s, status: newStatus } : s));
  };

  const markAll = (status) => {
    soundFX.playBeep();
    setRoster(prev => prev.map(s => ({ ...s, status })));
  };

  const presentCount = roster.filter(s => s.status === 'present').length;
  const absentCount = roster.filter(s => s.status === 'absent').length;
  const lateCount = roster.filter(s => s.status === 'late').length;
  const currentRate = roster.length > 0 ? ((presentCount / roster.length) * 100).toFixed(1) : 0;

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class: sessionClass,
          subject: sessionSubject,
          period,
          date: sessionDate,
          records: roster.map(s => ({
            studentId: s.studentId,
            rollNo: s.rollNo,
            name: s.name,
            status: s.status,
            method: 'MANUAL'
          }))
        })
      });
      const data = await res.json();
      if (data.success) {
        soundFX.playSuccess();
        addToast(`Attendance saved successfully! (${presentCount} Present, ${absentCount} Absent)`, 'success');
        if (onSaved) onSaved();
        onClose();
      } else {
        addToast(data.message || 'Failed to save attendance', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error saving attendance', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-elevated border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-navy-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 uppercase tracking-wide">
                Daily Roster Entry
              </span>
              <span className="text-xs text-slate-400">Class: {sessionClass}</span>
            </div>
            <h2 className="text-xl font-extrabold mt-1 text-white">
              Mark Attendance — {sessionSubject}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Control Bar: Class, Subject, Date, Period & Batch Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Class</label>
              <select
                value={sessionClass}
                onChange={(e) => setSessionClass(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="CSE-4A">CSE-4A (Sem 7)</option>
                <option value="CSE-4B">CSE-4B (Sem 7)</option>
                <option value="ECE-3A">ECE-3A (Sem 5)</option>
                <option value="ECE-3B">ECE-3B (Sem 5)</option>
                <option value="IT-2A">IT-2A (Sem 3)</option>
                <option value="MECH-4A">MECH-4A (Sem 7)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-indigo"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="1st Period">1st Period (09:00 - 10:00)</option>
                <option value="2nd Period">2nd Period (10:00 - 11:00)</option>
                <option value="3rd Period">3rd Period (11:15 - 12:15)</option>
                <option value="4th Period">4th Period (01:00 - 02:00)</option>
              </select>
            </div>
          </div>

          {/* Quick Bulk Marking Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => markAll('present')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark All Present
            </button>
            <button
              onClick={() => markAll('absent')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              Total Roster: <strong className="text-navy-900">{roster.length}</strong>
            </span>
            <span className="text-emerald-700 font-semibold">
              ● {presentCount} Present
            </span>
            <span className="text-rose-600 font-semibold">
              ● {absentCount} Absent
            </span>
            <span className="text-amber-600 font-semibold">
              ● {lateCount} Late
            </span>
          </div>
          <div className="font-bold text-navy-900">
            Current Rate: <span className="text-brand-indigo">{currentRate}%</span>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading student roster...</div>
          ) : roster.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No students registered in this class.</div>
          ) : (
            <div className="space-y-3">
              {roster.map((student) => (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {student.rollNo.slice(-3)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-900">{student.name}</h4>
                      <p className="text-[11px] text-slate-400">{student.rollNo} • {student.department}</p>
                    </div>
                  </div>

                  {/* Attendance Status Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleStatus(student.studentId, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        student.status === 'present'
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    <button
                      onClick={() => toggleStatus(student.studentId, 'absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        student.status === 'absent'
                          ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>

                    <button
                      onClick={() => toggleStatus(student.studentId, 'late')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        student.status === 'late'
                          ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Late</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-navy-900 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || roster.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md shadow-brand-indigo/30 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Attendance</span>
          </button>
        </div>

      </div>
    </div>
  );
}
