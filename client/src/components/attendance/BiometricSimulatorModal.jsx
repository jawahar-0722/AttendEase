import React, { useState, useEffect } from 'react';
import { X, Radio, Fingerprint, CreditCard, RefreshCw, CheckCircle2, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { soundFX } from '../../utils/audio';

export default function BiometricSimulatorModal({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('CS2024-042');
  const [selectedDevice, setSelectedDevice] = useState('GATE-CARD-READER-1');
  const [scanType, setScanType] = useState('RFID_TAP');
  const [loading, setLoading] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);

  // Fetch biometric device status & logs
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/biometric/logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setDevices(data.devices || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/biometric/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: selectedDevice,
          studentId: selectedStudent,
          scanType
        })
      });
      const data = await res.json();
      if (data.success) {
        soundFX.playBeep();
        setLastScanned(data);
        addToast(data.message, 'success');
        fetchLogs(); // refresh logs
      } else {
        addToast('Biometric match failed', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error during device communication', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-elevated border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Biometric & RFID Hardware Gateway</h3>
              <p className="text-xs text-slate-400">IoT turnstile integration & physical clock-in simulator</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Status Bar */}
        <div className="bg-slate-900 text-slate-300 p-4 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {devices.map(dev => (
            <div key={dev.id} className="p-2 rounded-xl bg-navy-800/80 border border-navy-700/50">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 truncate">{dev.id}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${dev.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              </div>
              <p className="text-[11px] font-bold text-white truncate mt-0.5">{dev.name}</p>
              <span className="text-[10px] text-slate-400">{dev.ip}</span>
            </div>
          ))}
        </div>

        {/* Interactive Simulator Controls */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="CS2024-042">Alex Rivera (CS2024-042)</option>
                <option value="CS2024-001">Maya Patel (CS2024-001)</option>
                <option value="CS2024-015">Jordan Lee (CS2024-015)</option>
                <option value="CS2024-023">Samantha Wright (CS2024-023)</option>
                <option value="CS2024-055">Rachel Gomez (CS2024-055)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Terminal</label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="GATE-CARD-READER-1">Main Campus North Turnstile</option>
                <option value="GATE-CARD-READER-2">Science & Tech South Gate</option>
                <option value="LAB-FP-SCANNER-3">CS Lab 301 Fingerprint</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sensor Method</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setScanType('RFID_TAP')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    scanType === 'RFID_TAP'
                      ? 'bg-brand-indigo text-white border-brand-indigo shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  RFID
                </button>
                <button
                  onClick={() => setScanType('FINGERPRINT')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    scanType === 'FINGERPRINT'
                      ? 'bg-brand-indigo text-white border-brand-indigo shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  Biometric
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-navy-900 to-brand-indigo hover:from-navy-800 hover:to-brand-indigoHover text-white font-bold text-xs rounded-xl shadow-md shadow-brand-indigo/20 transition-all flex items-center justify-center gap-2"
          >
            {scanType === 'RFID_TAP' ? <CreditCard className="w-4 h-4 text-brand-cyan" /> : <Fingerprint className="w-4 h-4 text-brand-cyan" />}
            <span>Trigger Virtual Hardware Clock-In (Card Swipe / Fingerprint Tap)</span>
          </button>
        </div>

        {/* Live Device Event Logs Feed */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              Live Hardware Webhook Event Feed
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">PORT: 5001 • /api/biometric/scan</span>
          </div>

          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-navy-900">{log.studentName}</span>
                    <span className="text-slate-500 ml-1.5">({log.rollNo})</span>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {log.deviceId} • {log.type}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {log.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-navy-900 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
