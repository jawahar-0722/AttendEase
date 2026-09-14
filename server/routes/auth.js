import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Current active session mock (in memory)
let currentUserId = 'usr_admin';

// Get current logged-in user
router.get('/current', (req, res) => {
  const users = db.get('users');
  const user = users.find(u => u.id === currentUserId) || users[0];
  res.json({ success: true, user });
});

// Get all demo users for easy selection
router.get('/users', (req, res) => {
  const users = db.get('users');
  res.json({ success: true, users });
});

// Switch role / demo login
router.post('/switch-role', (req, res) => {
  const { role, userId } = req.body;
  const users = db.get('users');
  let targetUser;

  if (userId) {
    targetUser = users.find(u => u.id === userId);
  } else if (role) {
    targetUser = users.find(u => u.role === role);
  }

  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'User or role not found' });
  }

  currentUserId = targetUser.id;
  res.json({ success: true, user: targetUser, message: `Switched to ${targetUser.name} (${targetUser.role})` });
});

// Regular Login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  const users = db.get('users');
  
  // Find user by email or fallback to role
  let user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user && role) {
    user = users.find(u => u.role === role);
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials or user not registered' });
  }

  currentUserId = user.id;
  res.json({ success: true, user, message: 'Login successful' });
});

// Logout
router.post('/logout', (req, res) => {
  currentUserId = 'usr_admin';
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
