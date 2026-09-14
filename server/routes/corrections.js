import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET all correction requests
router.get('/', (req, res) => {
  const { status, studentId, class: className } = req.query;
  let list = db.get('correctionRequests');

  if (status && status !== 'ALL') {
    list = list.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }
  if (studentId) {
    list = list.filter(item => item.studentId === studentId || item.rollNo === studentId);
  }
  if (className && className !== 'ALL') {
    list = list.filter(item => item.class === className);
  }

  res.json({ success: true, count: list.length, requests: list });
});

// POST submit a new correction request
router.post('/', (req, res) => {
  const { studentId, studentName, rollNo, class: className, subject, date, markedStatus, requestedStatus, reason, proofDocUrl } = req.body;

  if (!studentName || !subject || !date || !reason) {
    return res.status(400).json({ success: false, message: 'Student, subject, date, and reason are required' });
  }

  const newRequest = db.insert('correctionRequests', {
    studentId: studentId || 'stu_1',
    studentName,
    rollNo: rollNo || 'CS2024-042',
    class: className || 'CSE-4A',
    subject,
    date,
    markedStatus: markedStatus || 'absent',
    requestedStatus: requestedStatus || 'present',
    reason,
    proofDocUrl: proofDocUrl || 'medical-receipt-slip.pdf',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedBy: null,
    remarks: ''
  });

  // Add system notification for faculty and admin
  db.insert('notifications', {
    title: 'New Attendance Correction Request',
    message: `${studentName} requested attendance change for ${subject} on ${date}.`,
    type: 'info',
    timestamp: 'Just now',
    read: false,
    targetRole: ['admin', 'faculty']
  });

  res.status(201).json({ success: true, message: 'Correction request submitted for approval', request: newRequest });
});

// PUT review correction request (Approve or Reject)
router.put('/:id', (req, res) => {
  const { status, remarks, reviewerName } = req.body; // 'approved' or 'rejected'

  if (!status || !['approved', 'rejected'].includes(status.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
  }

  const existing = db.findById('correctionRequests', req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Correction request not found' });
  }

  const updated = db.update('correctionRequests', req.params.id, {
    status: status.toLowerCase(),
    remarks: remarks || (status.toLowerCase() === 'approved' ? 'Request approved by academic review.' : 'Request declined due to insufficient verification.'),
    reviewedBy: reviewerName || 'Dr. Arthur Vance',
    reviewedAt: new Date().toISOString()
  });

  // If approved, update the actual attendance record
  if (status.toLowerCase() === 'approved') {
    const allRecords = db.get('attendanceRecords');
    const sessionRec = allRecords.find(r => r.class === existing.class && r.date === existing.date);
    if (sessionRec) {
      const studentRec = sessionRec.records.find(s => s.studentId === existing.studentId || s.rollNo === existing.rollNo);
      if (studentRec) {
        studentRec.status = existing.requestedStatus;
        studentRec.method = 'CORRECTION_APPROVED';
        db.save();
      }
    }

    // Add student notification
    db.insert('notifications', {
      title: 'Correction Request Approved',
      message: `Your attendance for ${existing.subject} on ${existing.date} has been marked as ${existing.requestedStatus.toUpperCase()}.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      targetRole: ['student']
    });
  }

  res.json({ success: true, message: `Request ${status}`, request: updated });
});

export default router;
