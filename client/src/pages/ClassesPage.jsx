import React, { useState, useEffect } from 'react';
import { Building2, BookOpen, Users, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ClassesPage() {
  const { addToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState('departments'); // 'departments' | 'classes' | 'subjects'
  const [loading, setLoading] = useState(true);

  // Form states for modals/inlines
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDept, setNewDept] = useState({ code: '', name: '', hod: '' });
  const [newClass, setNewClass] = useState({ code: '', department: 'CSE', semester: 7, section: 'A', room: '', classTeacher: '' });
  const [newSubject, setNewSubject] = useState({ code: '', name: '', department: 'CSE', credits: 4, faculty: '', weeklyHours: 4 });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dRes, cRes, sRes] = await Promise.all([
        fetch('/api/academics/departments').then(r => r.json()),
        fetch('/api/academics/classes').then(r => r.json()),
        fetch('/api/academics/subjects').then(r => r.json())
      ]);
      if (dRes.success) setDepartments(dRes.departments || []);
      if (cRes.success) setClasses(cRes.classes || []);
      if (sRes.success) setSubjects(sRes.subjects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/academics/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDept)
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Department ${newDept.name} created!`, 'success');
        setShowAddModal(false);
        setNewDept({ code: '', name: '', hod: '' });
        fetchData();
      }
    } catch (e) {
      addToast('Error creating department', 'error');
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/academics/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass)
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Class ${newClass.code} registered!`, 'success');
        setShowAddModal(false);
        setNewClass({ code: '', department: 'CSE', semester: 7, section: 'A', room: '', classTeacher: '' });
        fetchData();
      }
    } catch (e) {
      addToast('Error creating class', 'error');
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/academics/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject)
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Subject ${newSubject.name} registered!`, 'success');
        setShowAddModal(false);
        setNewSubject({ code: '', name: '', department: 'CSE', credits: 4, faculty: '', weeklyHours: 4 });
        fetchData();
      }
    } catch (e) {
      addToast('Error creating subject', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand-indigo border border-indigo-100 uppercase tracking-wide">
            Academics & Curricula
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-1">
            Departments, Classes & Subjects
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage academic faculties, class sections, room allocations, and course offerings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md shadow-brand-indigo/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeTab === 'departments' ? 'Department' : activeTab === 'classes' ? 'Class' : 'Subject'}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-6 pt-3 shadow-xs">
        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'departments'
              ? 'border-brand-indigo text-brand-indigo font-extrabold'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'classes'
              ? 'border-brand-indigo text-brand-indigo font-extrabold'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Classes & Sections ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'subjects'
              ? 'border-brand-indigo text-brand-indigo font-extrabold'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Subjects & Courses ({subjects.length})
        </button>
      </div>

      {/* Tab 1: Departments */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => (
            <div key={dept.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-indigo-50 text-brand-indigo font-mono">
                    {dept.code}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{dept.studentsCount || 180} Students</span>
                </div>
                <h3 className="text-base font-bold text-navy-900 mt-1">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1">HOD: <strong className="text-slate-800">{dept.hod}</strong></p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Faculty Strength: {dept.facultyCount || 16}</span>
                <span className="text-brand-cyan font-semibold">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Classes */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-5">Class Code</th>
                  <th className="py-3 px-5">Department</th>
                  <th className="py-3 px-5">Semester & Sec</th>
                  <th className="py-3 px-5">Assigned Room</th>
                  <th className="py-3 px-5">Class Advisor</th>
                  <th className="py-3 px-5 text-center">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map(cls => (
                  <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-navy-900 font-mono">{cls.code}</td>
                    <td className="py-3.5 px-5 font-semibold text-brand-indigo">{cls.department}</td>
                    <td className="py-3.5 px-5 text-slate-700">Semester {cls.semester} • Section {cls.section}</td>
                    <td className="py-3.5 px-5 text-slate-600 font-medium">{cls.room}</td>
                    <td className="py-3.5 px-5 font-medium text-slate-800">{cls.classTeacher}</td>
                    <td className="py-3.5 px-5 text-center font-bold text-navy-900">{cls.totalStudents || 60}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Subjects */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-5">Course Code</th>
                  <th className="py-3 px-5">Course Name</th>
                  <th className="py-3 px-5">Department</th>
                  <th className="py-3 px-5 text-center">Credits</th>
                  <th className="py-3 px-5 text-center">Weekly Hours</th>
                  <th className="py-3 px-5">Faculty In-Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-navy-900 font-mono">{sub.code}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-800">{sub.name}</td>
                    <td className="py-3.5 px-5 text-brand-indigo font-medium">{sub.department}</td>
                    <td className="py-3.5 px-5 text-center font-bold text-slate-800">{sub.credits}</td>
                    <td className="py-3.5 px-5 text-center text-slate-600">{sub.weeklyHours} hrs</td>
                    <td className="py-3.5 px-5 font-medium text-slate-700">{sub.faculty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-900">
                Add New {activeTab === 'departments' ? 'Department' : activeTab === 'classes' ? 'Class' : 'Subject'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-navy-900">✕</button>
            </div>

            {activeTab === 'departments' && (
              <form onSubmit={handleCreateDepartment} className="space-y-3 mt-4 text-xs">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Department Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI-DS"
                    value={newDept.code}
                    onChange={e => setNewDept({ ...newDept, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Department Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Artificial Intelligence & Data Science"
                    value={newDept.name}
                    onChange={e => setNewDept({ ...newDept, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Head of Department (HOD)</label>
                  <input
                    type="text"
                    placeholder="Dr. Full Name"
                    value={newDept.hod}
                    onChange={e => setNewDept({ ...newDept, hod: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-bold text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-indigo text-white font-bold rounded-xl shadow-xs">Save Department</button>
                </div>
              </form>
            )}

            {activeTab === 'classes' && (
              <form onSubmit={handleCreateClass} className="space-y-3 mt-4 text-xs">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Class Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE-2B"
                    value={newClass.code}
                    onChange={e => setNewClass({ ...newClass, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab-302"
                    value={newClass.room}
                    onChange={e => setNewClass({ ...newClass, room: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Class Teacher</label>
                  <input
                    type="text"
                    placeholder="Prof. Name"
                    value={newClass.classTeacher}
                    onChange={e => setNewClass({ ...newClass, classTeacher: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-bold text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-indigo text-white font-bold rounded-xl shadow-xs">Save Class</button>
                </div>
              </form>
            )}

            {activeTab === 'subjects' && (
              <form onSubmit={handleCreateSubject} className="space-y-3 mt-4 text-xs">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS708"
                    value={newSubject.code}
                    onChange={e => setNewSubject({ ...newSubject, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quantum Computing"
                    value={newSubject.name}
                    onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Faculty In-Charge</label>
                  <input
                    type="text"
                    placeholder="Dr. Alan Vance"
                    value={newSubject.faculty}
                    onChange={e => setNewSubject({ ...newSubject, faculty: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-bold text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-indigo text-white font-bold rounded-xl shadow-xs">Save Subject</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
