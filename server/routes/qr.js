import express from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';

const router = express.Router();

// Memory store for active QR sessions: { [classId]: { token, class, subject, expiresAt, attendees: [] } }
const activeSessions = {};

// POST generate / refresh dynamic QR code session
router.post('/generate', (req, res) => {
  const { class: className, subject, faculty } = req.body;
  const targetClass = className || 'CSE-4A';
  const targetSubject = subject || 'Distributed Systems';
  const validitySeconds = (db.data.settings && db.data.settings.qrCodeValiditySeconds) || 30;

  // Generate rotating alphanumeric token
  const token = `QR-${targetClass}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const expiresAt = Date.now() + (validitySeconds * 1000);

  if (!activeSessions[targetClass]) {
    activeSessions[targetClass] = {
      class: targetClass,
      subject: targetSubject,
      faculty: faculty || 'Dr. Alan Vance',
      token,
      expiresAt,
      createdAt: Date.now(),
      attendees: []
    };
  } else {
    activeSessions[targetClass].token = token;
    activeSessions[targetClass].expiresAt = expiresAt;
    activeSessions[targetClass].subject = targetSubject;
  }

  res.json({
    success: true,
    session: {
      class: targetClass,
      subject: targetSubject,
      token,
      validitySeconds,
      expiresAt,
      attendeeCount: activeSessions[targetClass].attendees.length
    }
  });
});

// GET active QR session status for a class
router.get('/status/:classId', (req, res) => {
  const { classId } = req.params;
  const session = activeSessions[classId];

  if (!session) {
    return res.json({ success: true, active: false });
  }

  const isExpired = Date.now() > session.expiresAt;
  res.json({
    success: true,
    active: true,
    isExpired,
    session: {
      ...session,
      secondsRemaining: Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000))
    }
  });
});

// POST student scans QR code
router.post('/scan', (req, res) => {
  const { token, studentId, rollNo, studentName } = req.body;

  if (!token || (!studentId && !rollNo)) {
    return res.status(400).json({ success: false, message: 'QR Token and Student Identification required' });
  }

  // Locate the active session with this token
  const sessionEntry = Object.values(activeSessions).find(s => s.token === token);

  if (!sessionEntry) {
    return res.status(400).json({ success: false, message: 'Invalid or expired QR code session. Please re-scan.' });
  }

  if (Date.now() > sessionEntry.expiresAt + 5000) { // 5s grace for network latency
    return res.status(400).json({ success: false, message: 'QR Code has expired! Wait for the teacher screen to refresh.' });
  }

  // Check if student already marked in this session
  const alreadyMarked = sessionEntry.attendees.some(a => a.studentId === studentId || a.rollNo === rollNo);
  if (alreadyMarked) {
    return res.json({ success: true, alreadyRecorded: true, message: 'Attendance already recorded for this session.' });
  }

  // Find student details
  const students = db.get('students');
  const student = students.find(s => s.id === studentId || s.rollNo === rollNo) || {
    id: studentId,
    rollNo: rollNo || 'CS2024-042',
    name: studentName || 'Alex Rivera'
  };

  const attendanceLog = {
    studentId: student.id,
    rollNo: student.rollNo,
    name: student.name,
    time: new Date().toLocaleTimeString(),
    timestamp: new Date().toISOString(),
    status: 'present',
    method: 'QR_CODE'
  };

  sessionEntry.attendees.push(attendanceLog);

  // Update today's attendance records in DB
  const today = new Date().toISOString().split('T')[0];
  const allRecords = db.get('attendanceRecords');
  let currentRec = allRecords.find(r => r.class === sessionEntry.class && r.date === today);

  if (currentRec) {
    const existingStudentRec = currentRec.records.find(r => r.studentId === student.id || r.rollNo === student.rollNo);
    if (existingStudentRec) {
      existingStudentRec.status = 'present';
      existingStudentRec.method = 'QR_CODE';
    } else {
      currentRec.records.push({
        studentId: student.id,
        rollNo: student.rollNo,
        name: student.name,
        status: 'present',
        method: 'QR_CODE'
      });
    }
    db.save();
  }

  res.json({
    success: true,
    message: `Attendance marked successfully via QR Code for ${student.name} (${sessionEntry.subject})`,
    session: {
      class: sessionEntry.class,
      subject: sessionEntry.subject,
      timestamp: attendanceLog.time
    }
  });
});

export default router;
