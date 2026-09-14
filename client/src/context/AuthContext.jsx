import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/current');
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const switchRole = async (targetRole) => {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        addToast(`Switched view to ${data.user.role.toUpperCase()} (${data.user.name})`, 'info');
        return true;
      }
    } catch (err) {
      console.error('Role switch failed:', err);
      addToast('Failed to switch role', 'error');
    }
    return false;
  };

  const login = async (credentials) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        addToast(`Welcome back, ${data.user.name}`, 'success');
        return true;
      } else {
        addToast(data.message || 'Login failed', 'error');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      addToast('Network error during login', 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      addToast('Logged out successfully', 'info');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || 'admin', loading, switchRole, login, logout, refreshUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
