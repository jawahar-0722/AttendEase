import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  UserPlus,
  FileBarChart2,
  Calendar as CalendarIcon,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Radio,
  FileText
} from 'lucide-react';
import SummaryCards from '../components/dashboard/SummaryCards';
import WeeklyTrendChart from '../components/dashboard/WeeklyTrendChart';
import AttendanceDonut from '../components/dashboard/AttendanceDonut';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import TodayClassesTable from '../components/dashboard/TodayClassesTable';

export default function AdminDashboard({
  onOpenMarkAttendance,
  onOpenAddStudent,
  onOpenGenerateReport,
  onOpenQR,
  onOpenBiometric,
  onOpenCorrections
}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats/dashboard');
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Header & Quick Action Buttons */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-brand-indigo border border-indigo-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Controller
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {stats?.institution?.name || 'Apex Institute of Engineering & Technology'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Good Morning, Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Today is <strong className="text-slate-700">{todayDateFormatted}</strong> • Academic Term: {stats?.institution?.academicYear || '2024-2025'}
          </p>
        </div>

        {/* 3 Required Quick-Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenMarkAttendance()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md shadow-brand-indigo/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckSquare className="w-4 h-4 text-cyan-300" />
            <span>Mark Attendance</span>
          </button>

          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold border border-slate-200 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 text-brand-indigo" />
            <span>Add Student</span>
          </button>

          <button
            onClick={onOpenGenerateReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-md shadow-navy-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileBarChart2 className="w-4 h-4 text-brand-cyan" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Pending Dispute / Correction Alert Banner */}
      {stats?.summary?.pendingCorrections > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="text-amber-900 font-bold block">
                {stats.summary.pendingCorrections} Attendance Correction Request(s) Awaiting Review
              </strong>
              <span className="text-amber-700 text-[11px]">
                Students submitted attendance verification documents for faculty review.
              </span>
            </div>
          </div>
          <button
            onClick={onOpenCorrections}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
          >
            Review Requests
          </button>
        </div>
      )}

      {/* 4 Summary Cards: Total Students 1,248 | Present 1,106 | Absent 142 | Rate 88.6% */}
      <SummaryCards stats={stats?.summary} />

      {/* Analytics Charts Grid: Weekly Attendance Line Chart + Present vs Absent Donut Chart + Calendar Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Line/Area Chart */}
        <div className="lg:col-span-2">
          <WeeklyTrendChart weeklyData={stats?.weeklyTrend} />
        </div>

        {/* Present vs Absent Donut Chart */}
        <div>
          <AttendanceDonut distribution={stats?.distribution} />
        </div>
      </div>

      {/* Grid for Today's Class Attendance Table & Calendar Widget */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Table: Class, Subject, Faculty, Present, Absent, Percentage, Status */}
        <div className="xl:col-span-2">
          <TodayClassesTable
            classes={stats?.todayClasses}
            onOpenMarkAttendance={onOpenMarkAttendance}
          />
        </div>

        {/* Interactive Calendar Widget */}
        <div>
          <CalendarWidget onSelectDate={(d) => console.log('Selected date:', d)} />
        </div>
      </div>

    </div>
  );
}
