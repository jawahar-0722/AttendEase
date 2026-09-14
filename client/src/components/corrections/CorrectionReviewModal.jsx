import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Clock, FileText, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { soundFX } from '../../utils/audio';

export default function CorrectionReviewModal({ isOpen, onClose, onUpdated }) {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  const fetchCorrections = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/corrections?status=${filter}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCorrections();
    }
  }, [isOpen, filter]);

  if (!isOpen) return null;

  const handleReview = async (id, status) => {
    const remarks = prompt(
      status === 'approved'
        ? 'Enter approval notes for audit record:'
        : 'Enter reason for rejection:'
    );
    if (remarks === null) return; // user cancelled prompt

    try {
      const res = await fetch(`/api/corrections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks })
      });
      const data = await res.json();
      if (data.success) {
        if (status === 'approved') soundFX.playSuccess();
        addToast(`Correction request ${status}!`, 'success');
        fetchCorrections();
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to review request', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-elevated border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-brand-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Attendance Correction Requests</h3>
              <p className="text-xs text-slate-400">Formal student dispute resolution & faculty audit trail</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['pending', 'approved', 'rejected', 'ALL'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  filter === tab
                    ? 'bg-brand-indigo text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {requests.length} Requests Found
          </span>
        </div>

        {/* Request List */}
        <div className="p-6 flex-1 overflow-y-auto divide-y divide-slate-100 space-y-3">
          {loading ? (
            <p className="text-center text-xs text-slate-400 py-12">Loading requests...</p>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-navy-900">All caught up!</p>
              <p className="text-xs text-slate-400">No {filter} correction requests pending action.</p>
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-navy-900">{req.studentName}</h4>
                      <span className="text-[11px] font-mono text-slate-500">({req.rollNo})</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {req.class}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-600">
                      Dispute for <strong className="text-navy-900">{req.subject}</strong> on <strong>{req.date}</strong>
                    </div>

                    <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200/70 text-xs text-slate-700">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Student Reason:</span>
                      "{req.reason}"
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Status Change: <strong className="text-rose-600 uppercase">{req.markedStatus}</strong> ➔ <strong className="text-emerald-600 uppercase">{req.requestedStatus}</strong></span>
                      {req.reviewedBy && <span>Reviewed by: <strong className="text-navy-900">{req.reviewedBy}</strong></span>}
                    </div>

                    {req.remarks && (
                      <p className="mt-1.5 text-[11px] text-indigo-700 bg-indigo-50/70 p-2 rounded-lg font-medium">
                        Audit Remarks: {req.remarks}
                      </p>
                    )}
                  </div>

                  {/* Actions if pending */}
                  {req.status === 'pending' ? (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleReview(req.id, 'approved')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(req.id, 'rejected')}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase shrink-0 ${
                      req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
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
