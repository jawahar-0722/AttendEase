import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET all faculty
router.get('/', (req, res) => {
  const { department } = req.query;
  let faculty = db.get('faculty');
  if (department && department !== 'ALL') {
    faculty = faculty.filter(f => f.department === department);
  }
  res.json({ success: true, count: faculty.length, faculty });
});

// GET single faculty
router.get('/:id', (req, res) => {
  const faculty = db.findById('faculty', req.params.id);
  if (!faculty) {
    return res.status(404).json({ success: false, message: 'Faculty member not found' });
  }
  res.json({ success: true, faculty });
});

// POST add new faculty
router.post('/', (req, res) => {
  const { name, email, phone, department, designation, qualification, experience, classes, subjects } = req.body;

  if (!name || !email || !department) {
    return res.status(400).json({ success: false, message: 'Name, email, and department are required' });
  }

  const newFaculty = db.insert('faculty', {
    facultyId: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    email,
    phone: phone || '+1 (555) 000-0000',
    department,
    designation: designation || 'Assistant Professor',
    qualification: qualification || 'M.Tech',
    experience: experience || '3 Years',
    classes: Array.isArray(classes) ? classes : [classes || 'CSE-4A'],
    subjects: Array.isArray(subjects) ? subjects : [subjects || 'Engineering Mathematics']
  });

  res.status(201).json({ success: true, message: 'Faculty registered successfully', faculty: newFaculty });
});

// PUT update faculty
router.put('/:id', (req, res) => {
  const updated = db.update('faculty', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Faculty member not found' });
  }
  res.json({ success: true, message: 'Faculty details updated', faculty: updated });
});

// DELETE faculty
router.delete('/:id', (req, res) => {
  const success = db.delete('faculty', req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Faculty member not found' });
  }
  res.json({ success: true, message: 'Faculty removed successfully' });
});

export default router;
