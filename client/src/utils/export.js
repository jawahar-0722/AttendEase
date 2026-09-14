import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Export dataset to CSV
export function exportToCSV(filename, rows, headers) {
  const separator = ',';
  const csvContent = [
    headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(separator),
    ...rows.map(row =>
      headers
        .map(h => {
          let val = row[h.key];
          if (val === null || val === undefined) val = '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(separator)
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate formatted PDF institutional report
export function exportToPDF(reportData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const title = reportData.title || 'Institutional Attendance Report';
  const institution = reportData.institution || 'Apex Institute of Engineering & Technology';
  const generatedAt = new Date().toLocaleString();

  // Institution Banner / Header
  doc.setFillColor(15, 23, 42); // Navy 900
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(institution, 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(6, 182, 212); // Cyan
  doc.text('AttendEase — Integrated Smart Campus Attendance System', 14, 18);

  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(`Academic Term: 2024-2025 (Odd Semester) | Generated: ${generatedAt}`, 14, 23);

  // Document Title & Metadata
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 38);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Target Class: ${reportData.class || 'All Classes'} | Attendance Policy Threshold: 75.0%`, 14, 44);

  // Summary Metrics Badges
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 48, 182, 16, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Students: ${reportData.totalStudents || reportData.rows?.length || 0}`, 20, 58);
  doc.text(`Avg Attendance: ${reportData.averageRate || '88.6%'}`, 75, 58);
  doc.text(`Defaulters (<75%): ${reportData.defaultersCount || 0}`, 130, 58);

  // Table
  const tableHeaders = reportData.headers || [
    { label: 'S.No', key: 'slNo' },
    { label: 'Roll No', key: 'rollNo' },
    { label: 'Student Name', key: 'name' },
    { label: 'Class', key: 'class' },
    { label: 'Present/Total', key: 'ratio' },
    { label: 'Percentage', key: 'percentage' },
    { label: 'Eligibility', key: 'status' }
  ];

  const tableBody = (reportData.rows || []).map((row, idx) => [
    idx + 1,
    row.rollNo || '—',
    row.name || '—',
    row.class || '—',
    `${row.presentClasses || 0}/${row.totalClasses || 0}`,
    `${row.attendanceRate || 0}%`,
    (row.attendanceRate >= 75 || row.status === 'Eligible') ? 'ELIGIBLE' : 'DEFAULTER'
  ]);

  doc.autoTable({
    startY: 68,
    head: [tableHeaders.map(h => h.label)],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229], // Indigo 600
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [15, 23, 42]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: function(data) {
      if (data.column.index === 6 && data.cell.raw === 'DEFAULTER') {
        data.cell.styles.textColor = [225, 29, 72];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 }
  });

  // Footer / Signatures
  const finalY = doc.lastAutoTable?.finalY || 180;
  if (finalY < 250) {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Prepared by: Class Advisor / Faculty', 14, finalY + 25);
    doc.text('Verified by: Head of Department', 85, finalY + 25);
    doc.text('Approved by: Dean of Academics', 150, finalY + 25);
  }

  doc.save(`${(reportData.filename || 'attendance_report').replace(/\s+/g, '_')}.pdf`);
}
