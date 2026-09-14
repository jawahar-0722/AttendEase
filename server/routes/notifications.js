import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET notifications for role
router.get('/', (req, res) => {
  const { role } = req.query;
  let notifs = db.get('notifications');

  if (role) {
    notifs = notifs.filter(n => !n.targetRole || n.targetRole.includes(role.toLowerCase()));
  }

  const unreadCount = notifs.filter(n => !n.read).length;
  res.json({ success: true, count: notifs.length, unreadCount, notifications: notifs });
});

// Mark single notification read
router.put('/:id/read', (req, res) => {
  const notif = db.update('notifications', req.params.id, { read: true });
  res.json({ success: true, notification: notif });
});

// Mark all notifications read
router.post('/read-all', (req, res) => {
  const notifs = db.get('notifications').map(n => ({ ...n, read: true }));
  db.set('notifications', notifs);
  res.json({ success: true, message: 'All notifications marked as read' });
});

// Create notification
router.post('/', (req, res) => {
  const { title, message, type, targetRole } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message required' });
  }

  const newNotif = db.insert('notifications', {
    title,
    message,
    type: type || 'info',
    timestamp: 'Just now',
    read: false,
    targetRole: targetRole || ['admin', 'faculty', 'student']
  });

  res.status(201).json({ success: true, notification: newNotif });
});

export default router;
