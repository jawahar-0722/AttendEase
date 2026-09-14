import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import statsRouter from './routes/stats.js';
import studentsRouter from './routes/students.js';
import facultyRouter from './routes/faculty.js';
import academicsRouter from './routes/academics.js';
import attendanceRouter from './routes/attendance.js';
import qrRouter from './routes/qr.js';
import biometricRouter from './routes/biometric.js';
import correctionsRouter from './routes/corrections.js';
import leaveRouter from './routes/leave.js';
import reportsRouter from './routes/reports.js';
import notificationsRouter from './routes/notifications.js';
import settingsRouter from './routes/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/stats', statsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/faculty', facultyRouter);
app.use('/api/academics', academicsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/qr', qrRouter);
app.use('/api/biometric', biometricRouter);
app.use('/api/corrections', correctionsRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/settings', settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AttendEase - Student Attendance Management System',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if exists
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('AttendEase API Server is running. Client build will be served here once built.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` AttendEase Backend API Server running on port ${PORT}`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
