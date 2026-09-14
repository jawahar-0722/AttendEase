import React, { useState } from 'react';
import { X, UserPlus, GraduationCap } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AddStudentModal({ isOpen, onClose, onStudentAdded }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    department: 'CSE',
    class: 'CSE-4A',
    semester: '7'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo || !formData.email) {
      addToast('Please fill out all required fields', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Student ${formData.name} added successfully!`, 'success');
        if (onStudentAdded) onStudentAdded();
        onClose();
      } else {
        addToast(data.message || 'Failed to add student', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Network error while adding student', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-elevated border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-indigo/30 border border-brand-indigo/40 flex items-center justify-center text-brand-cyan">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Enroll New Student</h3>
              <p className="text-xs text-slate-400">Add student to institutional records</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">University Roll No *</label>
              <input
                type="text"
                required
                placeholder="e.g. CS2024-089"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Institutional Email *</label>
              <input
                type="email"
                required
                placeholder="student@attendease.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Student Phone</label>
              <input
                type="text"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="IT">IT</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Class / Section</label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="CSE-4A">CSE-4A</option>
                <option value="CSE-4B">CSE-4B</option>
                <option value="ECE-3A">ECE-3A</option>
                <option value="ECE-3B">ECE-3B</option>
                <option value="IT-2A">IT-2A</option>
                <option value="MECH-4A">MECH-4A</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="1">1st</option>
                <option value="3">3rd</option>
                <option value="5">5th</option>
                <option value="7">7th</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                placeholder="Parent Name"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Parent Emergency Phone</label>
              <input
                type="text"
                placeholder="+1 (555) 987-6543"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-navy-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold rounded-xl shadow-md shadow-brand-indigo/30 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
