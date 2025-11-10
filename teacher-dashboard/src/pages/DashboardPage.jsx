import React, { useState, useEffect } from 'react';
import { getStudentData } from '../api';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

// Helper to get username from token
const getUsername = () => {
  try {
    const token = localStorage.getItem('authToken');
    const decoded = jwtDecode(token);
    return decoded.username || 'Teacher';
  } catch (e) {
    return 'Teacher';
  }
};

export default function DashboardPage({ onLogout, theme, toggleTheme }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const teacherUsername = getUsername();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getStudentData();
        setStudents(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch student data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRiskColor = (score) => {
    if (score === null || typeof score === 'undefined') return 'text-gray-400';
    if (score <= 0.3) return 'text-green-400';
    if (score <= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPredictionColor = (prediction) => {
    if (prediction === 'Depression') return 'text-red-400';
    if (prediction === 'Not Depression') return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen pb-10">
      <Header onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 pt-24 space-y-6">

        {/* Welcome Banner */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h2 className="text-3xl font-bold text-white mb-2 relative z-10">
            Welcome, {teacherUsername}
          </h2>
          <p className="text-gray-300 relative z-10">
            Monitor student well-being and review assessments.
          </p>
        </div>

        {loading && <div className="flex justify-center p-12"><LoadingSpinner /></div>}
        {error && <p className="text-red-400 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Column 1: Student List (Bento Card) */}
            <div className="glass-card rounded-3xl p-6 h-[600px] flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                Students ({students.length})
              </h3>
              <ul className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {students.map(student => (
                  <li key={student._id}>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${selectedStudent?._id === student._id
                        ? 'bg-purple-500/20 border border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
                        : 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{student.username}</span>
                        <span className="text-xs bg-black/30 px-2 py-1 rounded-full text-gray-400">
                          {student.assessments.length}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Selected Student Details (Bento Card - Spans 2 cols) */}
            <div className="lg:col-span-2 glass-card rounded-3xl p-6 h-[600px] flex flex-col">
              {selectedStudent ? (
                <>
                  <div className="mb-6 pb-4 border-b border-white/10">
                    <h3 className="text-2xl font-bold text-white">
                      {selectedStudent.username}
                    </h3>
                    <p className="text-gray-400 text-sm">Assessment History</p>
                  </div>

                  <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {selectedStudent.assessments.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p>No assessments found for this student.</p>
                      </div>
                    )}
                    {[...selectedStudent.assessments].reverse().map(assessment => (
                      <div key={assessment._id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm text-gray-400 font-mono">
                            {new Date(assessment.date).toLocaleString()}
                          </span>
                          <div className="flex space-x-3">
                            <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Prediction</p>
                              <p className={`font-bold text-sm ${getPredictionColor(assessment.prediction)}`}>
                                {assessment.prediction || 'N/A'}
                              </p>
                            </div>
                            <div className="text-right pl-3 border-l border-white/10">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Risk Score</p>
                              <p className={`font-bold text-sm ${getRiskColor(assessment.riskScore)}`}>
                                {assessment.riskScore ? (assessment.riskScore * 100).toFixed(0) + '%' : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-black/20 p-3 rounded-xl">
                          <p className="text-gray-300 italic text-sm leading-relaxed">
                            "{assessment.transcript}"
                          </p>
                        </div>

                        {assessment.riskError && (
                          <p className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                            Error: {assessment.riskError}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <p className="text-lg font-medium">Select a student to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Version Label */}
      <div className="fixed bottom-4 right-4 text-[10px] text-gray-600 font-mono pointer-events-none z-50">
        v0-beta-build.2024
      </div>
    </div>
  );
}