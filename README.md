# AttendEase — Modern Student Attendance Management System

A production-grade, full-stack Student Attendance Management System engineered for college final-year project demonstrations, viva presentations, and real-world campus deployment.

---

## 🎓 Key Highlights & Technology Stack

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Recharts (Area/Line trends, Donut distribution), Canvas Confetti, Web Audio API sound synthesizer, jsPDF & autoTable for official institutional PDF dossiers, CSV spreadsheet exporter.
- **Backend**: Node.js & Express REST API with CORS, Morgan logging, atomic file-backed JSON database engine (`server/db/database.js`).
- **Aesthetic**: Polished SaaS interface designed with **navy blue (`#0f172a`), indigo (`#4f46e5`), cyan (`#06b6d4`), white, and light-gray (`#f8fafc`)**, featuring clean Inter typography, rounded cards, subtle shadows, and responsive layout.

---

## 📊 Exact Dashboard Metrics & Seed Data

The system comes pre-configured with realistic institutional data:
- **Total Students**: **1,248** (enrolled across 5 engineering departments)
- **Present Today**: **1,106**
- **Absent Today**: **142**
- **Attendance Rate**: **88.6%** (Target: 75.0%)
- **Weekly Trend**: Mon (86.4%), Tue (89.2%), Wed (87.8%), Thu (91.1%), Fri (88.6%)
- **Present vs Absent Donut**: Present (1,106), Absent (104), Approved Leave (24), Late (14)
- **Today's Class Attendance**: Live status across CSE-4A, CSE-4B, ECE-3A, ECE-3B, IT-2A, MECH-4A, MECH-4B.

---

## 🚀 Quick Start Guide

### Option 1: Double-Click Launcher (Windows)
Simply double-click `start.bat` in the project directory.

### Option 2: Command Line
```bash
# In the root directory:
npm run dev
# OR:
node server/server.js
```

### URLs:
- **Client (Vite Development Server)**: `http://localhost:5173`
- **Backend API & Production Bundle**: `http://localhost:5001`

---

## 🔑 Demo Accounts & One-Click Role Switcher

For college viva and presentations, a **Floating Presentation Mode Toolbar** is permanently accessible at the top of the screen:
1. **Admin**: `admin@attendease.edu` (Dr. Arthur Vance — Dean of Academics)
2. **Faculty**: `faculty@attendease.edu` (Dr. Alan Vance — Head of Computer Science)
3. **Student**: `student@attendease.edu` (Alex Rivera — Roll CS2024-042, CSE-4A)

---

## 📦 Functional Modules

### 1. Multi-Mode Attendance Engine
- **Manual Attendance Marking**: Toggle individual students (Present / Absent / Late) with "Mark All Present" & "Mark All Absent" shortcuts and live percentage recalculation.
- **Dynamic QR Code Attendance**: 30-second cryptographic rotating QR token for faculty projection + integrated student scanner simulator with celebratory confetti and audio chime.
- **Biometric / RFID Integration Placeholder**: Virtual turnstile hardware gateway with RFID tap and fingerprint sensor simulator, real-time device logs, and REST webhook (`/api/biometric/scan`).

### 2. Role-Based Dashboards
- **Admin Dashboard**:
  - Greeting: “Good Morning, Admin”
  - 4 Summary Cards (1,248 Total, 1,106 Present, 142 Absent, 88.6% Rate)
  - Weekly Line/Area Chart & Present-versus-Absent Donut Chart
  - Interactive monthly calendar widget with attendance health indicators
  - Today's Class Attendance table with Class, Subject, Faculty, Present, Absent, %, Status
  - Quick action buttons: “Mark Attendance”, “Add Student”, “Generate Report”
- **Faculty Dashboard**:
  - Assigned courses: Distributed Systems (CS701) & Cloud Computing (CS703)
  - 1-click attendance marking for current lecture period
  - Student roster with individual attendance rates
  - Approval workflow for student attendance dispute requests
- **Student Dashboard**:
  - Overall cumulative attendance rate vs 75% statutory requirement
  - Subject-by-subject attendance progress rings and bars
  - Shortfall Calculator: calculates exact number of classes required to regain eligibility
  - Student leave application form (Medical, OD, Personal) with status ledger
  - Interactive personal attendance calendar with day status dots

### 3. Reports & Institutional Dossiers
- **Official PDF Generation**: Formatted with university header, Dean & HOD sign-off lines, and eligibility status flags.
- **CSV Export**: Clean spreadsheet export with individual ratios and percentages.
- **Defaulters List**: Identifies all students below 75% threshold with automated warning triggers.

---

## ⚙️ REST API Endpoints

- `GET /api/stats/dashboard`: Institutional overview and charts data
- `GET /api/stats/student/:id`: Student-specific analytics and shortfall calculator
- `GET /api/students`: Student directory with search, department, and class filters
- `POST /api/students`: Register new student
- `GET /api/attendance/session`: Fetch class roster for attendance marking
- `POST /api/attendance/mark`: Save attendance records
- `POST /api/qr/generate`: Create/refresh dynamic expiring QR token
- `POST /api/qr/scan`: Submit scanned student attendance token
- `GET /api/biometric/logs`: Recent RFID & fingerprint gate events
- `POST /api/biometric/scan`: Hardware webhook simulator
- `GET /api/corrections`: Student attendance correction requests
- `PUT /api/corrections/:id`: Approve/reject correction with remarks
- `GET /api/leave`: Student leave applications
- `POST /api/leave`: Submit new leave application
- `GET /api/reports/export-data`: Structured data for PDF/CSV generation
- `POST /api/settings/reset-db`: Restore database to initial seed state
