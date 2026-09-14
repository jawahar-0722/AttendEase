import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET leave requests
router.get('/', (req, res) => {
  const { studentId, status } = req.query;
  let leaves = db.get('leaveRequests');

  if (studentId) {
    leaves = leaves.filter(l => l.studentId === studentId || l.rollNo === studentId);
  }
  if (status && status !== 'ALL') {
    leaves = leaves.filter(l => l.status.toLowerCase() === status.toLowerCase());
  }

  res.json({ success: true, count: leaves.length, leaves });
});

// POST submit leave request
router.post('/', (req, res) => {
  const { studentId, studentName, rollNo, class: className, type, fromDate, toDate, days, reason } = req.body;

  if (!fromDate || !toDate || !reason) {
    return res.status(400).json({ success: false, message: 'Dates and reason are required' });
  }

  const newLeave = db.insert('leaveRequests', {
    studentId: studentId || 'stu_1',
    studentName: studentName || 'Alex Rivera',
    rollNo: rollNo || 'CS2024-042',
    class: className || 'CSE-4A',
    type: type || 'Medical Leave',
    fromDate,
    toDate,
    days: Number(days) || 1,
    reason,
    status: 'pending',
    submittedAt: new Date().toISOString()
  });

  db.insert('notifications', {
    title: 'New Leave Request Received',
    message: `${studentName || 'Student'} submitted ${type || 'leave'} for ${fromDate} to ${toDate}.`,
    type: 'info',
    timestamp: 'Just now',
    read: false,
    targetRole: ['admin', 'faculty']
  });

  res.status(201).json({ success: true, message: 'Leave request submitted successfully', leave: newLeave });
});

// PUT review leave request (Approve or Reject)
router.put('/:id', (req, res) => {
  const { status, remarks } = req.body;

  const existing = db.findById('leaveRequests', req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Leave request not found' });
  }

  const updated = db.update('leaveRequests', req.params.id, {
    status: status.toLowerCase(),
    remarks: remarks || `Leave ${status}`,
    reviewedAt: new Date().toISOString()
  });

  res.json({ success: true, message: `Leave request ${status}`, leave: updated });
});

export default router;
