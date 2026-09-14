import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  QrCode,
  Users,
  FileBarChart2,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FacultyDashboard({
  onOpenMarkAttendance,
  onOpenQR,
  onOpenGenerateReport,
  onOpenCorrections,
  onViewStudentProfile
}) {
  const { user } = useAuth();
  const [facultyData, setFacultyData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        const [statsRes, studentsRes] = await fetchFacultyRequests();
        if (statsRes.success) setFacultyData(statsRes);
        if (studentsRes.success) setStudents(studentsRes.students || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const fetchFacultyRequests = async () => {
      const statsRes = await fetch(`/api/stats/faculty/${user?.id || 'fac_1'}`).then(r => r.json());
      const studentsRes = await fetch(`/api/students?class=CSE-4A`).then(r => r.json());
      return [statsRes, studentsRes];
    };

    fetchFacultyData();
  }, [user]);

  const assignedClasses = [
    {
      code: "CSE-4A",
      subject: "Distributed Systems",
      time: "09:00 AM - 10:00 AM",
      room: "Lab-301",
      enrolled: 62,
      todayStatus: "Completed",
      attendanceRate: 93.5
    },
    {
      code: "CSE-4A",
      subject: "Cloud Computing & DevOps",
      time: "11:15 AM - 12:15 PM",
      room: "Hall-201",
      enrolled: 62,
      todayStatus: "Pending",
      attendanceRate: 88.0
    },
    {
      code: "CSE-3A",
      subject: "Advanced Systems Lab",
      time: "02:00 PM - 04:00 PM",
      room: "Lab-304",
      enrolled: 64,
      todayStatus: "Pending",
      attendanceRate: 86.4
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand-indigo border border-indigo-100">
              Faculty Portal
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Department of Computer Science & Engineering
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Good Morning, {user?.name || 'Dr. Alan Vance'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            You have 3 active lectures scheduled today. 1 session marked, 2 remaining.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenQR()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-cyan hover:bg-brand-cyanHover text-white text-xs font-bold shadow-md shadow-brand-cyan/20 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch QR Session</span>
          </button>

          <button
            onClick={onOpenGenerateReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-md shadow-navy-900/20 transition-all"
          >
            <FileBarChart2 className="w-4 h-4 text-brand-cyan" />
            <span>Class Report</span>
          </button>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card border-l-4 border-l-brand-indigo">
          <span className="text-xs font-bold uppercase text-slate-400">Assigned Courses</span>
          <p className="text-2xl font-extrabold text-navy-900 mt-1">2 Subjects</p>
          <span className="text-xs text-slate-500">CS701 & CS703 across 2 sections</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold uppercase text-slate-400">Avg Class Attendance</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">91.2%</p>
          <span className="text-xs text-slate-500">+2.6% above department average</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">Pending Approvals</span>
            <p className="text-2xl font-extrabold text-navy-900 mt-1">1 Dispute</p>
            <span className="text-xs text-slate-500">Student correction request</span>
          </div>
          <button
            onClick={onOpenCorrections}
            className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
          >
            Review
          </button>
        </div>
      </div>

      {/* Assigned Classes Roster Cards */}
      <div>
        <h3 className="text-base font-bold text-navy-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-indigo" />
          Today's Assigned Lecture Schedule
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assignedClasses.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-navy-900 text-white font-mono">
                    {item.code}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.todayStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.todayStatus}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-navy-900 leading-snug">{item.subject}</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.time}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.enrolled} Enrolled • Room {item.room}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900">Rate: {item.attendanceRate}%</span>
                <button
                  onClick={() => onOpenMarkAttendance({ class: item.code, subject: item.subject })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{item.todayStatus === 'Completed' ? 'Edit Roster' : 'Mark'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Students Overview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-navy-900">
              CSE-4A Class Student Roster
            </h3>
            <p className="text-xs text-slate-400">Class In-charge monitor: Dr. Alan Vance</p>
          </div>
          <span className="text-xs font-semibold text-brand-indigo bg-indigo-50 px-2.5 py-1 rounded-lg">
            Total: {students.length} Students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-4">Roll No</th>
                <th className="py-2.5 px-4">Student Name</th>
                <th className="py-2.5 px-4 text-center">Attendance %</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-navy-900">{s.rollNo}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{s.name}</td>
                  <td className="py-3 px-4 text-center font-bold">
                    <span className={s.attendanceRate >= 75 ? 'text-emerald-600' : 'text-rose-600'}>
                      {s.attendanceRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      s.attendanceRate >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {s.attendanceRate >= 75 ? 'Eligible' : 'At Risk'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onViewStudentProfile && onViewStudentProfile(s)}
                      className="text-xs font-semibold text-brand-indigo hover:text-brand-indigoHover"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
