import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  User,
  ArrowRight,
  Lock,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'faculty' | 'student'
  const [email, setEmail] = useState('admin@attendease.edu');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);

  const switchTab = (role) => {
    setActiveTab(role);
    if (role === 'admin') {
      setEmail('admin@attendease.edu');
      setPassword('admin123');
    } else if (role === 'faculty') {
      setEmail('faculty@attendease.edu');
      setPassword('faculty123');
    } else {
      setEmail('student@attendease.edu');
      setPassword('student123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await login({ email, password, role: activeTab });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-indigo/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-cyan/15 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-indigo via-blue-600 to-brand-cyan shadow-elevated shadow-brand-indigo/30 mb-3">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Attend<span className="text-brand-cyan">Ease</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">
          Smart Student Attendance Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-navy-900 border border-navy-800 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl">
          
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-navy-950/80 rounded-2xl border border-navy-800 mb-6">
            <button
              onClick={() => switchTab('admin')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-brand-indigo text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
            <button
              onClick={() => switchTab('faculty')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'faculty'
                  ? 'bg-brand-indigo text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Faculty
            </button>
            <button
              onClick={() => switchTab('student')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'student'
                  ? 'bg-brand-indigo text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Student
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-indigo to-indigo-600 hover:from-brand-indigoHover hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-brand-indigo/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In as {activeTab.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Login Pill */}
          <div className="mt-6 pt-5 border-t border-navy-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-2">
              Final Year Project Demonstration Tip
            </span>
            <p className="text-xs text-slate-400">
              Click any tab above to autofill valid college credentials, then hit Sign In.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
