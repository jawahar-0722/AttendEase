import React, { useState, useEffect } from 'react';
import { Settings, Shield, Sliders, RefreshCw, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    minimumRequiredPercentage: 75.0,
    warningPercentage: 80.0,
    lateEntryGraceMinutes: 15,
    qrCodeValiditySeconds: 30,
    allowBiometricSync: true,
    enableEmailDefaulterAlerts: true
  });
  const [institution, setInstitution] = useState({
    name: 'Apex Institute of Engineering & Technology',
    code: 'AIET-108',
    academicYear: '2024-2025',
    currentSemester: 'Fall 2024'
  });
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          if (data.settings) setSettings(data.settings);
          if (data.institution) setInstitution(data.institution);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, institution })
      });
      const data = await res.json();
      if (data.success) {
        addToast('Institutional settings and attendance policies saved!', 'success');
      }
    } catch (e) {
      addToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDB = async () => {
    if (!confirm('Reset database back to initial seed data? This will restore the 1,248 students, 1,106 present, and 142 absent sample state.')) return;
    try {
      setResetting(true);
      const res = await fetch('/api/settings/reset-db', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        addToast('Database successfully restored to seed data!', 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (err) {
      addToast('Error resetting database', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand-indigo border border-indigo-100 uppercase tracking-wide">
            Institutional Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-1">
            System Rules & Policies
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure attendance thresholds, QR code rotation intervals, and university metadata.
          </p>
        </div>

        <button
          onClick={handleResetDB}
          disabled={resetting}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Reset Sample DB Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Attendance Policy Rules */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-brand-indigo" />
            <div>
              <h3 className="text-sm font-bold text-navy-900">Statutory Attendance Rules</h3>
              <p className="text-xs text-slate-400">Enforce university examination eligibility and warning thresholds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-navy-900 block mb-1">
                Minimum Mandatory % *
              </label>
              <input
                type="number"
                step="0.5"
                value={settings.minimumRequiredPercentage}
                onChange={e => setSettings({ ...settings, minimumRequiredPercentage: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-brand-indigo focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">University exam eligibility</span>
            </div>

            <div>
              <label className="font-bold text-navy-900 block mb-1">
                Warning Threshold %
              </label>
              <input
                type="number"
                step="0.5"
                value={settings.warningPercentage}
                onChange={e => setSettings({ ...settings, warningPercentage: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-amber-600 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Triggers caution notice</span>
            </div>

            <div>
              <label className="font-bold text-navy-900 block mb-1">
                Late Entry Grace (Mins)
              </label>
              <input
                type="number"
                value={settings.lateEntryGraceMinutes}
                onChange={e => setSettings({ ...settings, lateEntryGraceMinutes: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Tolerated arrival window</span>
            </div>

            <div>
              <label className="font-bold text-navy-900 block mb-1">
                QR Token Expiry (Secs)
              </label>
              <input
                type="number"
                value={settings.qrCodeValiditySeconds}
                onChange={e => setSettings({ ...settings, qrCodeValiditySeconds: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-brand-cyan focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Dynamic anti-proxy refresh</span>
            </div>
          </div>
        </div>

        {/* Card 2: Institution Metadata */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-brand-cyan" />
            <div>
              <h3 className="text-sm font-bold text-navy-900">Institution Profile & Accreditation</h3>
              <p className="text-xs text-slate-400">Campus details appearing on generated dossiers and reports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-navy-900 block mb-1">College Name</label>
              <input
                type="text"
                value={institution.name}
                onChange={e => setInstitution({ ...institution, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-navy-900 block mb-1">Institution Code</label>
              <input
                type="text"
                value={institution.code}
                onChange={e => setInstitution({ ...institution, code: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold font-mono text-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-navy-900 block mb-1">Academic Year</label>
              <input
                type="text"
                value={institution.academicYear}
                onChange={e => setInstitution({ ...institution, academicYear: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-navy-900 block mb-1">Current Term</label>
              <input
                type="text"
                value={institution.currentSemester}
                onChange={e => setInstitution({ ...institution, currentSemester: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md shadow-brand-indigo/30 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

    </div>
  );
}
