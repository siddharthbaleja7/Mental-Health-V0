import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { logout } from './api';
import LoadingSpinner from './components/LoadingSpinner';

// A custom component to protect routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken');
  // You can add token expiration logic here
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('authToken'));
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Check if a token exists on initial load or in URL
  useEffect(() => {
    // Check for token in URL (from student-web redirection)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      localStorage.setItem('authToken', urlToken);
      setIsAuth(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuth(true);
    }
    setIsAuthReady(true);
  }, []);

  const handleLogin = () => {
    setIsAuth(true);
  };

  const handleLogout = () => {
    logout(); // Clear token from localStorage
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
    <Routes>
      <Route
        path="/login"
        element={
          isAuth ? <Navigate to="/app" /> : <AuthPage onLoginSuccess={handleLogin} />
        }
      />
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <DashboardPage
              onLogout={handleLogout}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </PrivateRoute>
        }
      />
      {/* Default route: redirect to /app if logged in, else to /login */}
      <Route
        path="*"
        element={
          isAuth ? <Navigate to="/app" /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}