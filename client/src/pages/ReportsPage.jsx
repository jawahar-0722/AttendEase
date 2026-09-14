import React, { useState, useEffect } from 'react';
import { FileBarChart2, FileSpreadsheet, FileText, Filter, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/export';
import { useToast } from '../context/ToastContext';

export default function ReportsPage({ onOpenGenerateReport }) {
  const { addToast } = useToast();
  const [reportData, setReportData] = useState(null);
  const [selectedClass, setSelectedClass] = useState('CSE-4A');
  const [selectedPeriod, setSelectedPeriod] = useState('Semester');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reports/summary?class=${selectedClass}&period=${selectedPeriod}`);
      const data = await res.json();
      if (data.success) {
        setReportData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedClass, selectedPeriod]);

  const handleQuickExportCSV = async () => {
    try {
      const res = await fetch(`/api/reports/export-data?class=${selectedClass}`);
      const data = await res.json();
      if (data.success) {
        const headers = [
          { label: 'S.No', key: 'slNo' },
          { label: 'Roll Number', key: 'rollNo' },
          { label: 'Student Name', key: 'name' },
          { label: 'Department', key: 'department' },
          { label: 'Class', key: 'class' },
          { label: 'Present Classes', key: 'presentClasses' },
          { label: 'Total Classes', key: 'totalClasses' },
          { label: 'Attendance Rate', key: 'attendanceRate' },
          { label: 'Status', key: 'status' }
        ];
        exportToCSV(`Attendance_Summary_${selectedClass}`, data.rows || [], headers);
        addToast('CSV export downloaded!', 'success');
      }
    } catch (e) {
      addToast('Error downloading CSV', 'error');
    }
  };

  const handleQuickExportPDF = async () => {
    try {
      const res = await fetch(`/api/reports/export-data?class=${selectedClass}`);
      const data = await res.json();
      if (data.success) {
        const rows = data.rows || [];
        exportToPDF({
          title: `Accreditation Attendance Dossier - Class ${selectedClass}`,
          institution: data.institution?.name || 'Apex Institute of Engineering & Technology',
          class: selectedClass,
          totalStudents: rows.length,
          averageRate: '88.6%',
          defaultersCount: rows.filter(r => r.status === 'Defaulter').length,
          rows: rows.map(r => ({
            ...r,
            ratio: `${r.presentClasses}/${r.totalClasses}`,
            percentage: r.attendanceRate
          })),
          filename: `Official_Attendance_${selectedClass}`
        });
        addToast('Official PDF generated and downloaded!', 'success');
      }
    } catch (e) {
      addToast('Error generating PDF', 'error');
    }
  };

  const defaulters = reportData?.defaultersList || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand-indigo border border-indigo-100 uppercase tracking-wide">
            Institutional Audit & Dossiers
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-1">
            Monthly & Semester Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate certified compliance documents, university condonation lists, and CSV analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleQuickExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleQuickExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold shadow-md shadow-brand-indigo/30 transition-all"
          >
            <FileText className="w-4 h-4 text-brand-cyan" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Filter and Criteria Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-navy-900 focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="CSE-4A">CSE-4A (Sem 7)</option>
              <option value="CSE-4B">CSE-4B (Sem 7)</option>
              <option value="ECE-3A">ECE-3A (Sem 5)</option>
              <option value="IT-2A">IT-2A (Sem 3)</option>
              <option value="ALL">All Classes Combined</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Time Horizon</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-navy-900 focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="Semester">Full Semester Cumulative</option>
              <option value="Monthly">September 2024</option>
              <option value="Weekly">Current Week</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Class Average</span>
            <span className="font-extrabold text-brand-indigo text-base">
              {reportData?.metrics?.averageAttendance || 88.6}%
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mandatory Threshold</span>
            <span className="font-extrabold text-navy-900 text-base">75.0%</span>
          </div>
        </div>
      </div>

      {/* Defaulters Section (< 75% Attendance) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Defaulters List (&lt; 75% Mandatory Attendance)
              </h3>
              <p className="text-xs text-slate-400">
                Students below statutory requirements for end-semester university hall tickets.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800">
            {defaulters.length} Students At Risk
          </span>
        </div>

        {defaulters.length === 0 ? (
          <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-800 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold">Excellent! No students currently fall below the 75% threshold in this cohort.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-rose-50/50 border-b border-rose-100 text-[11px] font-bold text-rose-900 uppercase">
                  <th className="py-2.5 px-4">Roll Number</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4 text-center">Attended / Total</th>
                  <th className="py-2.5 px-4 text-center">Current %</th>
                  <th className="py-2.5 px-4">Shortfall Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaulters.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-navy-900">{s.rollNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{s.name}</td>
                    <td className="py-3 px-4 font-medium text-slate-600">{s.class}</td>
                    <td className="py-3 px-4 text-center text-slate-700 font-mono">
                      {s.presentClasses || 55}/{s.totalClasses || 80}
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold text-rose-600">
                      {s.attendanceRate}%
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                        Parent Warning Dispatched
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
