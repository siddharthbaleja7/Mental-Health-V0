import React, { useState } from 'react';
import { login, register } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * The page for handling user Login and Registration.
 */
const AuthPage = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        // Attempt to log in
        await login(username, password);
        onLoginSuccess(); // Tell the App component to update auth state
      } else {
        // Attempt to register
        await register(username, password);
        // On success, show a message and switch to login mode
        alert('Registration successful! Please log in.');
        setMode('login');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      // Handle errors from the backend (e.g., "Invalid credentials")
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-black dark:text-white">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
          {mode === 'login' ? 'Sign in to your account' : 'Get started'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 font-semibold rounded-md text-white bg-black dark:bg-white dark:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <LoadingSpinner /> : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <span
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="ml-1 font-medium text-black dark:text-white hover:underline cursor-pointer"
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
