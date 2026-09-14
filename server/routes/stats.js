import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Get Admin dashboard statistics
router.get('/dashboard', (req, res) => {
  const stats = db.data.stats || {
    totalStudents: 1248,
    presentToday: 1106,
    absentToday: 142,
    attendanceRate: 88.6
  };
  const todayClasses = db.get('todayClasses');
  const departments = db.get('departments');
  const settings = db.data.settings;

  // Compute departmental distribution
  const deptStats = departments.map(d => ({
    name: d.code,
    fullName: d.name,
    students: d.studentsCount,
    avgAttendance: (82 + Math.random() * 12).toFixed(1)
  }));

  res.json({
    success: true,
    summary: {
      totalStudents: stats.totalStudents,
      presentToday: stats.presentToday,
      absentToday: stats.absentToday,
      attendanceRate: stats.attendanceRate,
      changeFromLastMonth: '+3.2%',
      defaultersCount: 38,
      activeClasses: 12,
      pendingCorrections: (db.get('correctionRequests') || []).filter(c => c.status === 'pending').length,
      pendingLeaves: (db.get('leaveRequests') || []).filter(l => l.status === 'pending').length
    },
    weeklyTrend: stats.weeklyTrend || [],
    distribution: stats.distribution || [],
    deptStats,
    todayClasses,
    institution: db.data.institution,
    settings
  });
});

// Student dashboard specific stats
router.get('/student/:id', (req, res) => {
  const { id } = req.params;
  const students = db.get('students');
  const student = students.find(s => s.id === id || s.rollNo === id) || students[0];

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  // Calculate classes required to reach 75% threshold
  const targetRate = 75.0;
  const currentPresent = student.presentClasses || 73;
  const currentTotal = student.totalClasses || 80;
  const currentRate = (currentPresent / currentTotal) * 100;

  let classesNeeded = 0;
  if (currentRate < targetRate) {
    // (P + x) / (T + x) >= targetRate / 100
    // P + x >= 0.75 * T + 0.75 * x
    // 0.25 * x >= 0.75 * T - P
    // x = ceil((0.75 * T - P) / 0.25)
    classesNeeded = Math.max(0, Math.ceil((targetRate / 100 * currentTotal - currentPresent) / (1 - targetRate / 100)));
  }

  // Can afford to miss classes if attendance is above target
  let canMissClasses = 0;
  if (currentRate > targetRate) {
    // P / (T + y) >= 0.75 => y <= (P / 0.75) - T
    canMissClasses = Math.max(0, Math.floor((currentPresent / (targetRate / 100)) - currentTotal));
  }

  // Subjects
  const subjects = student.subjectAttendance || [
    { code: "CS701", name: "Distributed Systems", present: 22, total: 24, rate: 91.7 },
    { code: "CS702", name: "Machine Learning", present: 20, total: 22, rate: 90.9 },
    { code: "CS703", name: "Cloud Computing", present: 17, total: 18, rate: 94.4 },
    { code: "CS704", name: "Cyber Security", present: 14, total: 16, rate: 87.5 }
  ];

  // Calendar dates log for the current month
  const calendarLog = [
    { date: "2024-09-02", status: "present", subject: "Distributed Systems" },
    { date: "2024-09-03", status: "present", subject: "Machine Learning" },
    { date: "2024-09-04", status: "present", subject: "Cloud Computing" },
    { date: "2024-09-05", status: "present", subject: "Distributed Systems" },
    { date: "2024-09-06", status: "late", subject: "Cyber Security" },
    { date: "2024-09-09", status: "present", subject: "Distributed Systems" },
    { date: "2024-09-10", status: "present", subject: "Machine Learning" },
    { date: "2024-09-11", status: "absent", subject: "Cloud Computing" },
    { date: "2024-09-12", status: "present", subject: "Distributed Systems" },
    { date: "2024-09-13", status: "present", subject: "Cyber Security" }
  ];

  res.json({
    success: true,
    student,
    overallAttendance: student.attendanceRate || parseFloat(currentRate.toFixed(1)),
    targetThreshold: targetRate,
    isLowAttendance: (student.attendanceRate || currentRate) < targetRate,
    classesNeeded,
    canMissClasses,
    subjects,
    calendarLog,
    totalClasses: currentTotal,
    presentClasses: currentPresent,
    absentClasses: currentTotal - currentPresent
  });
});

// Faculty dashboard specific stats
router.get('/faculty/:id', (req, res) => {
  const { id } = req.params;
  const facultyList = db.get('faculty');
  const faculty = facultyList.find(f => f.id === id || f.email === id) || facultyList[0];

  const todayClasses = db.get('todayClasses').filter(c => 
    c.faculty.toLowerCase().includes((faculty ? faculty.name.split(' ')[1] : 'vance').toLowerCase())
  );

  const pendingApprovals = (db.get('correctionRequests') || []).filter(c => c.status === 'pending');

  res.json({
    success: true,
    faculty,
    todayClasses,
    assignedClasses: faculty ? faculty.classes : ["CSE-4A", "CSE-3A"],
    assignedSubjects: faculty ? faculty.subjects : ["Distributed Systems", "Cloud Computing"],
    pendingApprovalsCount: pendingApprovals.length,
    averageClassAttendance: 91.2
  });
});

export default router;
