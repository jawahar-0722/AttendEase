import React, { useState } from 'react';
import { X, FileBarChart2, FileSpreadsheet, FileText, Download, CheckCircle2 } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../../utils/export';
import { useToast } from '../../context/ToastContext';

export default function ReportGeneratorModal({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [targetClass, setTargetClass] = useState('CSE-4A');
  const [department, setDepartment] = useState('ALL');
  const [period, setPeriod] = useState('Semester');
  const [defaultersOnly, setDefaultersOnly] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const res = await fetch(`/api/reports/export-data?class=${targetClass}&department=${department}`);
      const data = await res.json();
      if (data.success) {
        let rows = data.rows || [];
        if (defaultersOnly) {
          rows = rows.filter(r => r.status === 'Defaulter');
        }

        const headers = [
          { label: 'S.No', key: 'slNo' },
          { label: 'Roll Number', key: 'rollNo' },
          { label: 'Student Name', key: 'name' },
          { label: 'Department', key: 'department' },
          { label: 'Class', key: 'class' },
          { label: 'Present Classes', key: 'presentClasses' },
          { label: 'Total Classes', key: 'totalClasses' },
          { label: 'Attendance Rate', key: 'attendanceRate' },
          { label: 'Eligibility Status', key: 'status' }
        ];

        exportToCSV(`AttendEase_Attendance_${targetClass}_${period}`, rows, headers);
        addToast(`CSV report downloaded for ${targetClass}!`, 'success');
        onClose();
      }
    } catch (err) {
      console.error(err);
      addToast('Error generating CSV export', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const res = await fetch(`/api/reports/export-data?class=${targetClass}&department=${department}`);
      const data = await res.json();
      if (data.success) {
        let rows = data.rows || [];
        if (defaultersOnly) {
          rows = rows.filter(r => r.status === 'Defaulter');
        }

        const reportPayload = {
          title: `Apex Institute - Class Attendance Dossier (${targetClass})`,
          institution: data.institution?.name || 'Apex Institute of Engineering & Technology',
          class: targetClass,
          totalStudents: rows.length,
          averageRate: '88.6%',
          defaultersCount: rows.filter(r => r.status === 'Defaulter').length,
          rows: rows.map(r => ({
            ...r,
            ratio: `${r.presentClasses}/${r.totalClasses}`,
            percentage: r.attendanceRate
          })),
          filename: `Attendance_Report_${targetClass}`
        };

        exportToPDF(reportPayload);
        addToast(`Official PDF report generated for ${targetClass}!`, 'success');
        onClose();
      }
    } catch (err) {
      console.error(err);
      addToast('Error generating PDF document', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-elevated border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <FileBarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Institutional Report Generator</h3>
              <p className="text-xs text-slate-400">Generate accredited attendance rosters & dossiers</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Criteria */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Target Class</label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="CSE-4A">CSE-4A (Final Year)</option>
                <option value="CSE-4B">CSE-4B (Final Year)</option>
                <option value="ECE-3A">ECE-3A (3rd Year)</option>
                <option value="ECE-3B">ECE-3B (3rd Year)</option>
                <option value="IT-2A">IT-2A (2nd Year)</option>
                <option value="MECH-4A">MECH-4A (Final Year)</option>
                <option value="ALL">All Classes Combined</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1">Time Horizon</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="Current Week">Current Week</option>
                <option value="Monthly (September)">Monthly (September 2024)</option>
                <option value="Semester">Full Semester Cumulative</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="defaultersOnly"
                checked={defaultersOnly}
                onChange={(e) => setDefaultersOnly(e.target.checked)}
                className="w-4 h-4 text-brand-indigo rounded border-slate-300 focus:ring-brand-indigo"
              />
              <label htmlFor="defaultersOnly" className="text-xs font-bold text-navy-900 cursor-pointer">
                Filter Defaulters Only (&lt; 75% Attendance)
              </label>
            </div>
            <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Viva Warning List
            </span>
          </div>

          <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-navy-900">Document Specifications:</p>
            <p className="text-[11px]">● Formatted with official university header, sign-off blocks, and serial numbering.</p>
            <p className="text-[11px]">● Color-coded flags for students eligible vs. at risk of semester condonation.</p>
          </div>

          {/* Export Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={exporting}
              className="py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download CSV Sheet</span>
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={exporting}
              className="py-3 px-4 rounded-xl bg-brand-indigo hover:bg-brand-indigoHover text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-indigo/30"
            >
              <FileText className="w-4 h-4 text-brand-cyan" />
              <span>Export Official PDF</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-navy-900 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
