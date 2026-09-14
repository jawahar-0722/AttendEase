import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET all students with query filters
router.get('/', (req, res) => {
  const { search, department, class: className, status } = req.query;
  let students = db.get('students');

  if (search) {
    const q = search.toLowerCase();
    students = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }

  if (department && department !== 'ALL') {
    students = students.filter(s => s.department === department);
  }

  if (className && className !== 'ALL') {
    students = students.filter(s => s.class === className);
  }

  if (status && status !== 'ALL') {
    students = students.filter(s => s.status.toLowerCase() === status.toLowerCase());
  }

  res.json({ success: true, count: students.length, students });
});

// GET single student
router.get('/:id', (req, res) => {
  const student = db.findById('students', req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, student });
});

// POST add new student
router.post('/', (req, res) => {
  const { name, rollNo, email, phone, parentName, parentPhone, department, class: className, semester } = req.body;

  if (!name || !rollNo || !email) {
    return res.status(400).json({ success: false, message: 'Name, Roll No and Email are required' });
  }

  // Check unique rollNo
  const existing = db.find('students', s => s.rollNo.toLowerCase() === rollNo.toLowerCase());
  if (existing.length > 0) {
    return res.status(400).json({ success: false, message: 'Student with this Roll Number already exists' });
  }

  const newStudent = db.insert('students', {
    name,
    rollNo,
    email,
    phone: phone || '+1 (555) 000-0000',
    parentName: parentName || 'Guardian',
    parentPhone: parentPhone || '+1 (555) 000-0000',
    department: department || 'CSE',
    class: className || 'CSE-4A',
    semester: Number(semester) || 7,
    attendanceRate: 100.0,
    presentClasses: 1,
    totalClasses: 1,
    status: 'Good',
    rfid: `RFID-${Math.floor(100000 + Math.random() * 900000)}`
  });

  // Also update total students in stats
  if (db.data.stats) {
    db.data.stats.totalStudents += 1;
    db.save();
  }

  res.status(201).json({ success: true, message: 'Student registered successfully', student: newStudent });
});

// PUT update student
router.put('/:id', (req, res) => {
  const updated = db.update('students', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, message: 'Student details updated', student: updated });
});

// DELETE student
router.delete('/:id', (req, res) => {
  const success = db.delete('students', req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  if (db.data.stats && db.data.stats.totalStudents > 0) {
    db.data.stats.totalStudents -= 1;
    db.save();
  }
  res.json({ success: true, message: 'Student removed successfully' });
});

export default router;
