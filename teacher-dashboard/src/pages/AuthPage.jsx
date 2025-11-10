import React, { useState } from 'react';
import { login } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

// Modern 3D-style Icons (using SVG gradients)
const StudentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 drop-shadow-2xl" viewBox="0 0 24 24" fill="none" stroke="url(#blue-gradient)" strokeWidth="1.5">
    <defs>
      <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const TeacherIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 drop-shadow-2xl" viewBox="0 0 24 24" fill="none" stroke="url(#purple-gradient)" strokeWidth="1.5">
    <defs>
      <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const AuthPage = ({ onLoginSuccess }) => {
  const [role, setRole] = useState('teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token, role: userRole } = await login(username, password);

      if (userRole === 'student') {
        // Redirect to Student Web if the user is a student
        window.location.href = `http://localhost:3000?token=${token}`;
      } else {
        // If teacher, allow login
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Visual & Info Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Welcome Card */}
          <div className="glass-card rounded-3xl p-8 flex flex-col justify-between sm:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700"></div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">STERA</h1>
              <p className="text-gray-400 text-lg">Teacher Portal</p>
            </div>
            <div className="mt-12">
              <p className="text-2xl font-light text-white leading-relaxed">
                "Empowering educators to support student well-being."
              </p>
            </div>
          </div>

          {/* Role Selection Cards */}
          <button
            onClick={() => setRole('student')}
            className={`glass-card rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-[1.02] ${role === 'student' ? 'ring-2 ring-cyan-400 bg-white/10' : 'hover:bg-white/10'
              }`}
          >
            <StudentIcon />
            <span className={`text-xl font-medium ${role === 'student' ? 'text-cyan-400' : 'text-gray-400'}`}>Student</span>
          </button>

          <button
            onClick={() => setRole('teacher')}
            className={`glass-card rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-[1.02] ${role === 'teacher' ? 'ring-2 ring-purple-400 bg-white/10' : 'hover:bg-white/10'
              }`}
          >
            <TeacherIcon />
            <span className={`text-xl font-medium ${role === 'teacher' ? 'text-purple-400' : 'text-gray-400'}`}>Teacher</span>
          </button>
        </div>

        {/* Right Column: Login Form */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-3xl p-8 h-full flex flex-col justify-center relative overflow-hidden">
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <h2 className="text-3xl font-bold text-white mb-2">
              {role === 'student' ? 'Student Login' : 'Teacher Login'}
            </h2>
            <p className="text-gray-400 mb-8">Enter your credentials to access the dashboard.</p>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-xl outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-xl outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner /> : 'Sign In'}
              </button>
            </form>
          </div>
          {/* Test Credentials & Version Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-2">Test Credentials</p>
            <div className="inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400">
              <p>User: <span className="text-purple-400 font-mono">teacher</span> &bull; Pass: <span className="text-purple-400 font-mono">password</span></p>
            </div>
            <p className="text-[10px] text-gray-600 mt-4 font-mono">v0-beta-build.2024</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;