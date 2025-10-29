import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import AuthPage from './pages/AuthPage';
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
    <>
      {isAuth ? (
        <DashboardPage onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      ) : (
        <AuthPage onLoginSuccess={handleLogin} />
      )}
    </>
  );
}
