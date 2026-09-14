import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import QuickRoleSwitch from './components/layout/QuickRoleSwitch';

// Modals
import MarkAttendanceModal from './components/attendance/MarkAttendanceModal';
import QRCodeSessionModal from './components/attendance/QRCodeSessionModal';
import BiometricSimulatorModal from './components/attendance/BiometricSimulatorModal';
import AddStudentModal from './components/students/AddStudentModal';
import StudentProfileModal from './components/students/StudentProfileModal';
import ReportGeneratorModal from './components/reports/ReportGeneratorModal';
import CorrectionReviewModal from './components/corrections/CorrectionReviewModal';
import LeaveRequestModal from './components/leave/LeaveRequestModal';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AttendancePage from './pages/AttendancePage';
import StudentsPage from './pages/StudentsPage';
import ClassesPage from './pages/ClassesPage';
import TimetablePage from './pages/TimetablePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const { user, role, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals state
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [activeClassData, setActiveClassData] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCorrectionsModal, setShowCorrectionsModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center animate-pulse mb-4">
          <span className="font-extrabold text-lg">AE</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Loading AttendEase Campus System...
        </p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleOpenMarkAttendance = (classData = null) => {
    setActiveClassData(classData || { class: 'CSE-4A', subject: 'Distributed Systems' });
    setShowMarkModal(true);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      if (role === 'faculty') {
        return (
          <FacultyDashboard
            onOpenMarkAttendance={handleOpenMarkAttendance}
            onOpenQR={() => setShowQRModal(true)}
            onOpenGenerateReport={() => setShowReportModal(true)}
            onOpenCorrections={() => setShowCorrectionsModal(true)}
            onViewStudentProfile={(s) => setSelectedStudentForProfile(s)}
          />
        );
      }
      if (role === 'student') {
        return (
          <StudentDashboard
            onOpenQR={() => setShowQRModal(true)}
            onOpenLeaveRequest={() => setShowLeaveModal(true)}
            onOpenCorrections={() => setShowCorrectionsModal(true)}
          />
        );
      }
      return (
        <AdminDashboard
          onOpenMarkAttendance={handleOpenMarkAttendance}
          onOpenAddStudent={() => setShowAddStudentModal(true)}
          onOpenGenerateReport={() => setShowReportModal(true)}
          onOpenQR={() => setShowQRModal(true)}
          onOpenBiometric={() => setShowBiometricModal(true)}
          onOpenCorrections={() => setShowCorrectionsModal(true)}
        />
      );
    }

    switch (activeTab) {
      case 'mark-attendance':
      case 'attendance':
        return (
          <AttendancePage
            onOpenMarkAttendance={handleOpenMarkAttendance}
            onOpenQR={() => setShowQRModal(true)}
            onOpenBiometric={() => setShowBiometricModal(true)}
            onOpenGenerateReport={() => setShowReportModal(true)}
          />
        );
      case 'students':
        return (
          <StudentsPage
            onOpenAddStudent={() => setShowAddStudentModal(true)}
            onViewStudentProfile={(s) => setSelectedStudentForProfile(s)}
            refreshTrigger={refreshTrigger}
          />
        );
      case 'classes':
        return <ClassesPage />;
      case 'timetable':
        return <TimetablePage />;
      case 'reports':
        return <ReportsPage onOpenGenerateReport={() => setShowReportModal(true)} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <AdminDashboard
            onOpenMarkAttendance={handleOpenMarkAttendance}
            onOpenAddStudent={() => setShowAddStudentModal(true)}
            onOpenGenerateReport={() => setShowReportModal(true)}
            onOpenQR={() => setShowQRModal(true)}
            onOpenBiometric={() => setShowBiometricModal(true)}
            onOpenCorrections={() => setShowCorrectionsModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col font-sans">
      
      {/* Presentation Role Switcher Toolbar */}
      <QuickRoleSwitch
        onOpenQR={() => setShowQRModal(true)}
        onOpenBiometric={() => setShowBiometricModal(true)}
      />

      {/* Top Application Navbar */}
      <TopNav
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onOpenQR={() => setShowQRModal(true)}
          onOpenBiometric={() => setShowBiometricModal(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderContent()}
        </main>
      </div>

      {/* Modals Container */}
      <MarkAttendanceModal
        isOpen={showMarkModal}
        onClose={() => setShowMarkModal(false)}
        classData={activeClassData}
        onSaved={handleRefresh}
      />

      <QRCodeSessionModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        defaultClass={activeClassData?.class || 'CSE-4A'}
        defaultSubject={activeClassData?.subject || 'Distributed Systems'}
      />

      <BiometricSimulatorModal
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
      />

      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onStudentAdded={handleRefresh}
      />

      <StudentProfileModal
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        student={selectedStudentForProfile}
      />

      <ReportGeneratorModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />

      <CorrectionReviewModal
        isOpen={showCorrectionsModal}
        onClose={() => setShowCorrectionsModal(false)}
        onUpdated={handleRefresh}
      />

      <LeaveRequestModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        student={user}
      />

    </div>
  );
}
