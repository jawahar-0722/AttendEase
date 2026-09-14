import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, AlertTriangle, PlayCircle, Eye } from 'lucide-react';

export default function TodayClassesTable({ classes, onOpenMarkAttendance }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const list = classes || [];

  const filtered = list.filter(item => {
    const matchesSearch =
      item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.faculty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-brand-cyan border border-cyan-200/60 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      case 'Low Attendance':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <AlertTriangle className="w-3.5 h-3.5" />
            Low Attendance
          </span>
        );
      default: // Pending
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      {/* Table Header with Search & Filter */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-navy-900">
            Today's Class Attendance
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time session monitoring across campus lecture halls and labs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search class, subject, faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:bg-white w-52 sm:w-64 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none pr-1"
            >
              <option value="ALL">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Low Attendance">Low Attendance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5">Class</th>
              <th className="py-3 px-5">Subject</th>
              <th className="py-3 px-5">Faculty</th>
              <th className="py-3 px-5 text-center">Present</th>
              <th className="py-3 px-5 text-center">Absent</th>
              <th className="py-3 px-5">Percentage</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No class attendance records match your criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  <td className="py-3.5 px-5 font-bold text-navy-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-indigo/60"></span>
                      <span>{item.class}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-800">{item.subject}</div>
                    <div className="text-[11px] text-slate-400">{item.code} • {item.room}</div>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-700">
                    {item.faculty}
                  </td>
                  <td className="py-3.5 px-5 text-center font-bold text-emerald-600">
                    {item.present}
                  </td>
                  <td className="py-3.5 px-5 text-center font-bold text-rose-500">
                    {item.absent}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.percentage >= 85
                              ? 'bg-emerald-500'
                              : item.percentage >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, item.percentage)}%` }}
                        />
                      </div>
                      <span className="font-bold text-navy-900 text-xs">
                        {item.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onOpenMarkAttendance && onOpenMarkAttendance(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-indigo hover:text-brand-indigoHover bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{item.status === 'Completed' ? 'Review' : 'Mark'}</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-5">
        <span>Showing {filtered.length} of {list.length} scheduled classes today</span>
        <span className="font-semibold text-navy-900">Total Enrolled: 1,248</span>
      </div>
    </div>
  );
}
