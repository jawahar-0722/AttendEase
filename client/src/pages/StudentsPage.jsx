import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  Trash2,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function StudentsPage({
  onOpenAddStudent,
  onViewStudentProfile,
  refreshTrigger
}) {
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [className, setClassName] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let url = `/api/students?department=${department}&class=${className}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [department, className, search, refreshTrigger]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete student ${name}?`)) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast(`Student ${name} removed from roster`, 'info');
        fetchStudents();
      }
    } catch (e) {
      addToast('Error removing student', 'error');
    }
  };

  const filteredStudents = students.filter(s => {
    if (statusFilter === 'defaulters') return (s.attendanceRate || 0) < 75.0;
    if (statusFilter === 'eligible') return (s.attendanceRate || 0) >= 75.0;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand-indigo border border-indigo-100 uppercase tracking-wide">
            Student Information System
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-1">
            Student Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, enroll, and monitor institutional student profiles and compliance rates.
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md shadow-brand-indigo/30 transition-all hover:scale-[1.02]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, roll no, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-indigo focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Dept Filter */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:ring-2 focus:ring-brand-indigo"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="MECH">MECH</option>
          </select>

          {/* Class Filter */}
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:ring-2 focus:ring-brand-indigo"
          >
            <option value="ALL">All Classes</option>
            <option value="CSE-4A">CSE-4A</option>
            <option value="CSE-4B">CSE-4B</option>
            <option value="ECE-3A">ECE-3A</option>
            <option value="ECE-3B">ECE-3B</option>
            <option value="IT-2A">IT-2A</option>
            <option value="MECH-4B">MECH-4B</option>
          </select>

          {/* Defaulter Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-0.5 font-bold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'ALL' ? 'bg-white shadow-xs text-navy-900' : 'text-slate-500 hover:text-navy-900'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setStatusFilter('defaulters')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'defaulters' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-600 hover:text-rose-700'
              }`}
            >
              Defaulters (&lt;75%)
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Roll Number</th>
                <th className="py-3 px-5">Student Name</th>
                <th className="py-3 px-5">Department & Class</th>
                <th className="py-3 px-5">Contact</th>
                <th className="py-3 px-5 text-center">Attendance Rate</th>
                <th className="py-3 px-5">Eligibility</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">Loading student directory...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">No students match the current filters.</td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const isDefaulter = (s.attendanceRate || 0) < 75.0;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-navy-900">
                        {s.rollNo}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-navy-900">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.email}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-semibold text-slate-700">{s.class}</span>
                        <span className="text-[11px] text-slate-400 block">{s.department} • Sem {s.semester || 7}</span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 font-mono text-[11px]">
                        {s.phone || '—'}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`font-extrabold text-sm ${isDefaulter ? 'text-rose-600' : 'text-brand-indigo'}`}>
                          {s.attendanceRate || 90.0}%
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {s.presentClasses || 73}/{s.totalClasses || 80} classes
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isDefaulter
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isDefaulter ? 'Defaulter' : 'Eligible'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          onClick={() => onViewStudentProfile && onViewStudentProfile(s)}
                          className="p-1.5 rounded-lg text-brand-indigo hover:bg-indigo-50 transition-colors"
                          title="View Attendance Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-5">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
          <span className="font-semibold text-navy-900">Total Enrolled Institutional: 1,248</span>
        </div>
      </div>

    </div>
  );
}
