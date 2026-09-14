import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET all recent biometric & RFID device logs
router.get('/logs', (req, res) => {
  const logs = db.get('biometricLogs') || [];
  res.json({
    success: true,
    devices: [
      { id: "GATE-CARD-READER-1", name: "Main Campus North Turnstile", status: "ONLINE", ip: "192.168.1.101", lastPing: "Just now" },
      { id: "GATE-CARD-READER-2", name: "Science & Tech South Gate", status: "ONLINE", ip: "192.168.1.102", lastPing: "1 min ago" },
      { id: "LAB-FP-SCANNER-3", name: "CS Department Lab 301 Fingerprint", status: "ONLINE", ip: "192.168.1.105", lastPing: "Just now" },
      { id: "MECH-WORKSHOP-1", name: "Mechanical Wing Workshop Terminal", status: "IDLE", ip: "192.168.1.109", lastPing: "5 mins ago" }
    ],
    logs
  });
});

// POST simulate biometric punch or RFID tap (Hardware webhook endpoint)
router.post('/scan', (req, res) => {
  const { deviceId, rfidCard, studentId, scanType } = req.body;
  const students = db.get('students');

  // Match by RFID card ID or student ID
  let student = null;
  if (rfidCard) {
    student = students.find(s => s.rfid && s.rfid.toLowerCase() === rfidCard.toLowerCase());
  }
  if (!student && studentId) {
    student = students.find(s => s.id === studentId || s.rollNo === studentId);
  }

  if (!student) {
    student = students[0]; // fallback to first demo student
  }

  const logEntry = db.insert('biometricLogs', {
    deviceId: deviceId || 'GATE-CARD-READER-1',
    studentId: student.id,
    rollNo: student.rollNo,
    studentName: student.name,
    timestamp: new Date().toISOString(),
    status: 'VERIFIED',
    type: scanType || 'RFID_TAP'
  });

  // Mark student as present in today's attendance records
  const today = new Date().toISOString().split('T')[0];
  const allRecords = db.get('attendanceRecords');
  const studentClass = student.class || 'CSE-4A';
  let currentRec = allRecords.find(r => r.class === studentClass && r.date === today);

  if (currentRec) {
    const studentRec = currentRec.records.find(r => r.studentId === student.id || r.rollNo === student.rollNo);
    if (studentRec) {
      studentRec.status = 'present';
      studentRec.method = 'BIOMETRIC';
    } else {
      currentRec.records.push({
        studentId: student.id,
        rollNo: student.rollNo,
        name: student.name,
        status: 'present',
        method: 'BIOMETRIC'
      });
    }
    db.save();
  }

  res.json({
    success: true,
    message: `Biometric Verification Successful: ${student.name} (${student.rollNo})`,
    log: logEntry,
    student: {
      name: student.name,
      rollNo: student.rollNo,
      department: student.department,
      class: student.class,
      attendanceRate: student.attendanceRate
    }
  });
});

// POST trigger hardware sync simulation
router.post('/sync', (req, res) => {
  res.json({
    success: true,
    message: 'Hardware terminal sync completed. 4 active biometric/RFID readers verified.',
    syncedRecordsCount: 28,
    timestamp: new Date().toISOString()
  });
});

export default router;
