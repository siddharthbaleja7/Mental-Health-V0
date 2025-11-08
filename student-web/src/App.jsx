import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { logout } from './api';
import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setIsAuth(true);
    setIsAuthReady(true);
  }, []);

  const handleLogin = () => setIsAuth(true);
  const handleLogout = () => {
    logout();
    setIsAuth(false);
  };

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Routes>
        <Route
          path="/"
          element={!isAuth ? <LoginPage onLoginSuccess={handleLogin} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={isAuth ? <DashboardPage onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
