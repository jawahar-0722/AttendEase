import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET today's class attendance table records
router.get('/today-classes', (req, res) => {
  const list = db.get('todayClasses');
  res.json({ success: true, classes: list });
});

// GET roster for attendance marking session
router.get('/session', (req, res) => {
  const { class: className, subject, date } = req.query;
  const targetClass = className || 'CSE-4A';
  const targetDate = date || new Date().toISOString().split('T')[0];

  // Find students in this class
  const allStudents = db.get('students');
  const classStudents = allStudents.filter(s => s.class === targetClass);

  // Check if attendance was already recorded for this session
  const records = db.get('attendanceRecords');
  const existingSession = records.find(r => 
    r.class === targetClass && 
    (!subject || r.subject.toLowerCase() === subject.toLowerCase()) && 
    r.date === targetDate
  );

  const roster = classStudents.map(student => {
    let status = 'present';
    let method = 'MANUAL';

    if (existingSession) {
      const match = existingSession.records.find(r => r.studentId === student.id || r.rollNo === student.rollNo);
      if (match) {
        status = match.status;
        method = match.method;
      }
    }

    return {
      studentId: student.id,
      rollNo: student.rollNo,
      name: student.name,
      department: student.department,
      class: student.class,
      avatar: student.avatar,
      rfid: student.rfid,
      status,
      method
    };
  });

  res.json({
    success: true,
    session: {
      class: targetClass,
      subject: subject || 'Distributed Systems',
      date: targetDate,
      isExisting: !!existingSession,
      roster
    }
  });
});

// POST mark / update attendance (Bulk or Manual)
router.post('/mark', (req, res) => {
  const { class: className, subject, faculty, period, date, records } = req.body;

  if (!className || !records || !Array.isArray(records)) {
    return res.status(400).json({ success: false, message: 'Class and student records array required' });
  }

  const markDate = date || new Date().toISOString().split('T')[0];
  const allRecords = db.get('attendanceRecords');

  // Check if session exists
  const existingIdx = allRecords.findIndex(r => 
    r.class === className && 
    (!subject || r.subject.toLowerCase() === subject.toLowerCase()) && 
    r.date === markDate
  );

  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const percentage = records.length > 0 ? parseFloat(((presentCount / records.length) * 100).toFixed(1)) : 0;

  const sessionRecord = {
    id: existingIdx !== -1 ? allRecords[existingIdx].id : `att_rec_${Date.now()}`,
    date: markDate,
    class: className,
    subject: subject || 'Distributed Systems',
    faculty: faculty || 'Faculty In-Charge',
    period: period || '1st Period',
    timestamp: new Date().toISOString(),
    presentCount,
    absentCount,
    lateCount,
    percentage,
    records
  };

  if (existingIdx !== -1) {
    allRecords[existingIdx] = sessionRecord;
  } else {
    allRecords.unshift(sessionRecord);
  }
  db.save();

  // Also update TodayClasses table if this class matches
  const todayClasses = db.get('todayClasses');
  const classItem = todayClasses.find(c => c.class === className && (!subject || c.subject.toLowerCase() === subject.toLowerCase()));
  if (classItem) {
    classItem.present = presentCount;
    classItem.absent = absentCount;
    classItem.percentage = percentage;
    classItem.status = 'Completed';
    db.save();
  }

  res.json({
    success: true,
    message: `Attendance marked successfully for ${className} (${records.length} students)`,
    summary: { presentCount, absentCount, lateCount, percentage }
  });
});

// GET Attendance history for a student or class
router.get('/history', (req, res) => {
  const { studentId, class: className, subject } = req.query;
  const allRecords = db.get('attendanceRecords');

  if (studentId) {
    const studentHistory = [];
    allRecords.forEach(session => {
      const match = session.records.find(r => r.studentId === studentId || r.rollNo === studentId);
      if (match) {
        studentHistory.push({
          date: session.date,
          class: session.class,
          subject: session.subject,
          faculty: session.faculty,
          status: match.status,
          method: match.method || 'MANUAL',
          timestamp: session.timestamp
        });
      }
    });
    return res.json({ success: true, history: studentHistory });
  }

  let filtered = allRecords;
  if (className && className !== 'ALL') {
    filtered = filtered.filter(r => r.class === className);
  }
  if (subject && subject !== 'ALL') {
    filtered = filtered.filter(r => r.subject.toLowerCase() === subject.toLowerCase());
  }

  res.json({ success: true, history: filtered });
});

export default router;
