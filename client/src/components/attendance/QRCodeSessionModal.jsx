import React, { useState, useEffect } from 'react';
import { X, QrCode, RefreshCw, Smartphone, CheckCircle2, ShieldCheck, Users, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';
import { soundFX } from '../../utils/audio';

export default function QRCodeSessionModal({ isOpen, onClose, defaultClass = 'CSE-4A', defaultSubject = 'Distributed Systems' }) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('faculty'); // 'faculty' (project QR) or 'student' (scan simulator)
  const [session, setSession] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [copied, setCopied] = useState(false);
  const [scanStudentId, setScanStudentId] = useState('stu_1');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate or refresh QR session
  const generateQR = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class: defaultClass, subject: defaultSubject })
      });
      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
        setSecondsRemaining(data.session.validitySeconds || 30);
      }
    } catch (e) {
      console.error('Error generating QR:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateQR();
    }
  }, [isOpen, defaultClass, defaultSubject]);

  // Countdown timer for 30-second token rotation
  useEffect(() => {
    if (!isOpen || !session) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          generateQR(); // Auto-rotate token
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, session]);

  if (!isOpen) return null;

  // Student scan simulation
  const handleStudentScan = async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/qr/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: session.token,
          studentId: scanStudentId
        })
      });
      const data = await res.json();
      if (data.success) {
        soundFX.playSuccess();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
        setScanResult(data);
        addToast(data.message, 'success');
      } else {
        soundFX.playWarning();
        addToast(data.message || 'Scan failed', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error during QR scan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (session?.token) {
      navigator.clipboard.writeText(session.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-elevated border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dynamic QR Attendance</h3>
              <p className="text-xs text-slate-400">Class: {defaultClass} • {defaultSubject}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => setActiveTab('faculty')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'faculty'
                ? 'border-brand-indigo text-brand-indigo font-extrabold'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            Faculty Projection Screen
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'student'
                ? 'border-brand-indigo text-brand-indigo font-extrabold'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Student Scanner Simulator
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {activeTab === 'faculty' ? (
            <div className="flex flex-col items-center text-center">
              {/* Token Expiry Ring */}
              <div className="flex items-center gap-2 mb-3 bg-indigo-50 text-brand-indigo font-semibold text-xs px-3 py-1 rounded-full">
                <RefreshCw className={`w-3.5 h-3.5 ${secondsRemaining < 5 ? 'animate-spin' : ''}`} />
                <span>Expires in <strong className="text-navy-900">{secondsRemaining}s</strong> (Auto-Refreshes)</span>
              </div>

              {/* High-res SVG QR Code Display */}
              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-brand-indigo/40 shadow-inner my-2 relative group">
                <svg
                  className="w-56 h-56"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" fill="white" />
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="#4f46e5" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="#4f46e5" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="#4f46e5" />

                  {/* Dynamic Pattern Pixels */}
                  <rect x="36" y="8" width="6" height="6" fill="#06b6d4" />
                  <rect x="46" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="8" width="6" height="6" fill="#4f46e5" />
                  <rect x="36" y="18" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="18" width="6" height="6" fill="#06b6d4" />
                  <rect x="36" y="28" width="8" height="8" fill="#4f46e5" />
                  <rect x="50" y="28" width="6" height="6" fill="#0f172a" />

                  {/* Central Grid */}
                  <rect x="10" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="22" y="38" width="8" height="8" fill="#4f46e5" />
                  <rect x="36" y="38" width="12" height="12" rx="2" fill="#06b6d4" />
                  <rect x="54" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="66" y="38" width="8" height="8" fill="#4f46e5" />
                  <rect x="80" y="38" width="6" height="6" fill="#0f172a" />

                  <rect x="10" y="52" width="8" height="8" fill="#06b6d4" />
                  <rect x="24" y="52" width="6" height="6" fill="#0f172a" />
                  <rect x="36" y="56" width="6" height="6" fill="#4f46e5" />
                  <rect x="48" y="52" width="10" height="10" rx="1" fill="#0f172a" />
                  <rect x="64" y="52" width="6" height="6" fill="#06b6d4" />
                  <rect x="76" y="52" width="8" height="8" fill="#4f46e5" />

                  {/* Bottom right patterns */}
                  <rect x="36" y="70" width="8" height="8" fill="#0f172a" />
                  <rect x="50" y="70" width="6" height="6" fill="#06b6d4" />
                  <rect x="62" y="70" width="6" height="6" fill="#4f46e5" />
                  <rect x="74" y="70" width="8" height="8" fill="#0f172a" />
                  <rect x="42" y="82" width="6" height="6" fill="#4f46e5" />
                  <rect x="54" y="82" width="8" height="8" fill="#0f172a" />
                  <rect x="68" y="82" width="6" height="6" fill="#06b6d4" />
                  <rect x="80" y="82" width="8" height="8" fill="#4f46e5" />
                </svg>

                {/* Live Attendee Counter Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-navy-700">
                  <Users className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{session?.attendeeCount || 0} Students Scanned</span>
                </div>
              </div>

              {/* Dynamic Token String Display */}
              <div className="mt-5 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Token Hash</span>
                  <span className="text-xs font-mono font-bold text-navy-900 truncate max-w-[280px] block">
                    {session?.token || 'Loading...'}
                  </span>
                </div>
                <button
                  onClick={copyToken}
                  className="p-2 text-slate-500 hover:text-navy-900 rounded-lg hover:bg-slate-200/60 transition-colors"
                  title="Copy Token"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-4 max-w-sm">
                Project this QR screen on the classroom display. Students scan via their mobile portal to record attendance with geofence validation.
              </p>
            </div>
          ) : (
            /* Student Simulator View */
            <div className="space-y-4">
              <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100 flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-brand-indigo shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-navy-900">Student Camera Simulator</h4>
                  <p className="text-[11px] text-slate-500">Test the student mobile scanning experience with 1-click</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Student to Check-In</label>
                <select
                  value={scanStudentId}
                  onChange={(e) => setScanStudentId(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="stu_1">Alex Rivera (CS2024-042) - CSE-4A</option>
                  <option value="stu_2">Maya Patel (CS2024-001) - CSE-4A</option>
                  <option value="stu_3">Jordan Lee (CS2024-015) - CSE-4A</option>
                  <option value="stu_4">Samantha Wright (CS2024-023) - CSE-4A</option>
                  <option value="stu_10">Rachel Gomez (CS2024-055) - CSE-4A</option>
                </select>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl font-mono text-xs space-y-1">
                <div className="text-brand-cyan flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Target Session: {session?.token?.slice(0, 20)}...</span>
                </div>
                <p className="text-slate-400">Class: {defaultClass} | Subject: {defaultSubject}</p>
                <p className="text-slate-400">Status: Dynamic token active ({secondsRemaining}s)</p>
              </div>

              {scanResult && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="font-bold block text-emerald-900">{scanResult.message}</strong>
                    <span>Recorded at {scanResult.session?.timestamp || 'Just now'}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleStudentScan}
                disabled={loading}
                className="w-full py-3 bg-brand-indigo hover:bg-brand-indigoHover text-white font-bold text-xs rounded-xl shadow-md shadow-brand-indigo/30 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Simulate Camera Scan & Submit</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-navy-900 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Close Session
          </button>
        </div>

      </div>
    </div>
  );
}
