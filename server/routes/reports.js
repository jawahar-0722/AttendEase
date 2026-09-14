import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET attendance summary report by filter
router.get('/summary', (req, res) => {
  const { department, class: className, period } = req.query;
  const students = db.get('students');
  const departments = db.get('departments');
  const classes = db.get('classes');
  const todayClasses = db.get('todayClasses');

  let filteredStudents = students;
  if (department && department !== 'ALL') {
    filteredStudents = filteredStudents.filter(s => s.department === department);
  }
  if (className && className !== 'ALL') {
    filteredStudents = filteredStudents.filter(s => s.class === className);
  }

  const total = filteredStudents.length;
  const avgRate = total > 0 
    ? (filteredStudents.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / total).toFixed(1)
    : 88.6;

  const defaulters = filteredStudents.filter(s => (s.attendanceRate || 0) < 75.0);
  const excellent = filteredStudents.filter(s => (s.attendanceRate || 0) >= 90.0);

  res.json({
    success: true,
    filter: { department: department || 'ALL', class: className || 'ALL', period: period || 'Semester' },
    metrics: {
      totalStudents: total,
      averageAttendance: parseFloat(avgRate),
      defaulterCount: defaulters.length,
      excellentCount: excellent.length,
      attendanceThreshold: 75.0
    },
    defaultersList: defaulters,
    todayClasses
  });
});

// GET Defaulters list (low attendance < 75%)
router.get('/defaulters', (req, res) => {
  const { department, threshold = 75.0 } = req.query;
  let students = db.get('students');

  if (department && department !== 'ALL') {
    students = students.filter(s => s.department === department);
  }

  const defaulters = students.filter(s => (s.attendanceRate || 0) < Number(threshold));

  res.json({
    success: true,
    threshold: Number(threshold),
    count: defaulters.length,
    defaulters
  });
});

// GET Structured data ready for PDF / CSV institutional export
router.get('/export-data', (req, res) => {
  const { class: className, format } = req.query;
  const targetClass = className || 'CSE-4A';
  const students = db.get('students').filter(s => targetClass === 'ALL' || s.class === targetClass);
  const todayClasses = db.get('todayClasses');

  const rows = students.map((s, idx) => ({
    slNo: idx + 1,
    rollNo: s.rollNo,
    name: s.name,
    class: s.class,
    department: s.department,
    presentClasses: s.presentClasses || 72,
    totalClasses: s.totalClasses || 80,
    attendanceRate: `${s.attendanceRate || 90.0}%`,
    status: (s.attendanceRate || 90.0) >= 75 ? 'Eligible' : 'Defaulter'
  }));

  res.json({
    success: true,
    institution: db.data.institution,
    generatedAt: new Date().toISOString(),
    reportTitle: `Institutional Attendance Report - ${targetClass}`,
    class: targetClass,
    totalCount: rows.length,
    rows,
    classSummary: todayClasses
  });
});

export default router;
