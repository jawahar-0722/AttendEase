import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET settings & institutional parameters
router.get('/', (req, res) => {
  res.json({
    success: true,
    institution: db.data.institution,
    settings: db.data.settings
  });
});

// PUT update settings
router.put('/', (req, res) => {
  const { institution, settings } = req.body;

  if (institution) {
    db.data.institution = { ...db.data.institution, ...institution };
  }
  if (settings) {
    db.data.settings = { ...db.data.settings, ...settings };
  }

  db.save();

  res.json({
    success: true,
    message: 'Attendance policies and institution settings updated',
    institution: db.data.institution,
    settings: db.data.settings
  });
});

// POST reset database to original seed data
router.post('/reset-db', (req, res) => {
  db.reset();
  res.json({
    success: true,
    message: 'Database successfully restored to default sample data'
  });
});

export default router;
