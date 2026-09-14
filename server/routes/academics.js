import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// --- DEPARTMENTS ---
router.get('/departments', (req, res) => {
  res.json({ success: true, departments: db.get('departments') });
});

router.post('/departments', (req, res) => {
  const { code, name, hod } = req.body;
  if (!code || !name) {
    return res.status(400).json({ success: false, message: 'Department code and name required' });
  }
  const item = db.insert('departments', {
    code: code.toUpperCase(),
    name,
    hod: hod || 'TBD',
    studentsCount: 0,
    facultyCount: 0
  });
  res.status(201).json({ success: true, department: item });
});

router.delete('/departments/:id', (req, res) => {
  const ok = db.delete('departments', req.params.id);
  res.json({ success: ok });
});

// --- CLASSES ---
router.get('/classes', (req, res) => {
  res.json({ success: true, classes: db.get('classes') });
});

router.post('/classes', (req, res) => {
  const { code, department, semester, section, room, classTeacher } = req.body;
  if (!code || !department) {
    return res.status(400).json({ success: false, message: 'Class code and department required' });
  }
  const item = db.insert('classes', {
    code,
    department,
    semester: Number(semester) || 1,
    section: section || 'A',
    room: room || 'Hall-101',
    classTeacher: classTeacher || 'TBD',
    totalStudents: 0
  });
  res.status(201).json({ success: true, class: item });
});

router.delete('/classes/:id', (req, res) => {
  const ok = db.delete('classes', req.params.id);
  res.json({ success: ok });
});

// --- SUBJECTS ---
router.get('/subjects', (req, res) => {
  res.json({ success: true, subjects: db.get('subjects') });
});

router.post('/subjects', (req, res) => {
  const { code, name, department, credits, faculty, weeklyHours } = req.body;
  if (!code || !name) {
    return res.status(400).json({ success: false, message: 'Subject code and name required' });
  }
  const item = db.insert('subjects', {
    code: code.toUpperCase(),
    name,
    department: department || 'CSE',
    credits: Number(credits) || 3,
    faculty: faculty || 'TBD',
    weeklyHours: Number(weeklyHours) || 3
  });
  res.status(201).json({ success: true, subject: item });
});

router.delete('/subjects/:id', (req, res) => {
  const ok = db.delete('subjects', req.params.id);
  res.json({ success: ok });
});

// --- TIMETABLE ---
router.get('/timetable', (req, res) => {
  const { class: className, day } = req.query;
  let tt = db.get('timetable');
  if (className && className !== 'ALL') {
    tt = tt.filter(t => t.class === className);
  }
  if (day && day !== 'ALL') {
    tt = tt.filter(t => t.day.toLowerCase() === day.toLowerCase());
  }
  res.json({ success: true, timetable: tt });
});

router.post('/timetable', (req, res) => {
  const { day, time, class: className, subject, faculty, room } = req.body;
  if (!day || !time || !className || !subject) {
    return res.status(400).json({ success: false, message: 'Day, time, class, and subject required' });
  }
  const entry = db.insert('timetable', {
    day,
    time,
    class: className,
    subject,
    faculty: faculty || 'TBD',
    room: room || 'Room 101'
  });
  res.status(201).json({ success: true, entry });
});

router.delete('/timetable/:id', (req, res) => {
  const ok = db.delete('timetable', req.params.id);
  res.json({ success: ok });
});

export default router;
