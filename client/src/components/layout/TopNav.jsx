import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export default function TopNav({ activeTab, onNavigate, onToggleMobileSidebar }) {
  const { user, role, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?role=${role}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 12000);
    return () => clearInterval(interval);
  }, [role]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Students' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'reports', label: 'Reports' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* AttendEase Brand Logo */}
            <div
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 via-brand-indigo to-brand-cyan flex items-center justify-center shadow-md shadow-brand-indigo/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-navy-900">
                    Attend<span className="text-brand-indigo">Ease</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1 hidden sm:block">
                  Smart Campus System
                </p>
              </div>
            </div>

            {/* Top Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-brand-indigo bg-indigo-50/80 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            
            {/* Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-navy-900">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="bg-brand-indigo/10 text-brand-indigo text-xs font-semibold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-brand-indigo hover:text-brand-indigoHover font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 p-6 text-center">No notifications at this time.</p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3.5 hover:bg-slate-50/80 transition-colors flex items-start gap-3 ${
                            !notif.read ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {notif.type === 'warning' ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            ) : notif.type === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Info className="w-4 h-4 text-brand-cyan" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-navy-900 leading-snug">{notif.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors text-left focus:outline-none"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-navy-900 leading-none truncate max-w-[130px]">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-[10px] font-semibold text-brand-indigo uppercase tracking-wider mt-0.5">
                    {user?.role || 'admin'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-navy-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      Role: {user?.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profile & Settings
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
