import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Send, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function LeaveRequestModal({ isOpen, onClose, student }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    type: 'Medical Leave',
    fromDate: '',
    toDate: '',
    days: 1,
    reason: ''
  });
  const [pastLeaves, setPastLeaves] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLeaves = async () => {
      try {
        const res = await fetch(`/api/leave?studentId=${student?.id || 'stu_1'}`);
        const data = await res.json();
        if (data.success) {
          setPastLeaves(data.leaves || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaves();
  }, [isOpen, student]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fromDate || !formData.toDate || !formData.reason) {
      addToast('Please specify leave dates and reason', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studentId: student?.id || 'stu_1',
          studentName: student?.name || 'Alex Rivera',
          rollNo: student?.rollNo || 'CS2024-042',
          class: student?.class || 'CSE-4A'
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast('Leave application submitted for faculty approval!', 'success');
        setPastLeaves(prev => [data.leave, ...prev]);
        setFormData({ type: 'Medical Leave', fromDate: '', toDate: '', days: 1, reason: '' });
      }
    } catch (err) {
      console.error(err);
      addToast('Error submitting leave request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-elevated border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Student Leave Application</h3>
              <p className="text-xs text-slate-400">Formal leave of absence & On-Duty (OD) request portal</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Form + Past Ledger */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* New Request Form */}
          <form onSubmit={handleSubmit} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Apply for Leave
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Leave Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="Duty Leave (OD)">Duty Leave (OD - Hackathon/Sports)</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Emergency Family Leave">Emergency Leave</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">From Date</label>
                <input
                  type="date"
                  required
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">To Date</label>
                <input
                  type="date"
                  required
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Reason / Explanation *</label>
              <textarea
                required
                rows={2}
                placeholder="State valid academic, medical or personal rationale..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-indigo"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Application</span>
              </button>
            </div>
          </form>

          {/* Leave History Ledger */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
              Application History & Status
            </h4>

            <div className="space-y-2.5">
              {pastLeaves.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No past leave applications recorded.</p>
              ) : (
                pastLeaves.map(l => (
                  <div key={l.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy-900">{l.type}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">{l.fromDate} to {l.toDate} ({l.days} days)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 italic">"{l.reason}"</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      l.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      l.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                ))
              )}
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
