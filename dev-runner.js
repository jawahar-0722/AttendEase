import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================================');
console.log(' Launching AttendEase - Student Attendance Management System');
console.log('================================================================');

// Ensure node is in PATH
const env = { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH}` };

// 1. Start Server on Port 5001
const server = spawn('node', ['server/server.js'], {
  cwd: __dirname,
  env,
  stdio: 'inherit',
  shell: true
});

// 2. Start Vite Client on Port 5173
const client = spawn('npm', ['--prefix', 'client', 'run', 'dev'], {
  cwd: __dirname,
  env,
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit();
});
