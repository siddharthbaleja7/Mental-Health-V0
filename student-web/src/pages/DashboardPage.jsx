import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AudioRecorder from '../components/AudioRecorder';
import { getHistory } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = ({ onLogout, theme, toggleTheme }) => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(sorted);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);



  return (
    <div className="min-h-screen pb-10">
      <Header onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 pt-24 space-y-6">

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {/* 1. Welcome / Engagement Card (Span 2 cols) */}
          <div className="md:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/20 transition-all duration-700"></div>
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Welcome Back!</h2>
            <p className="text-gray-300 text-lg relative z-10">
              "Every step you take towards understanding yourself is a step towards a healthier you."
            </p>
            <div className="mt-6 flex items-center space-x-2 text-cyan-400 relative z-10">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">System Active</span>
            </div>
          </div>

          {/* 2. Quick Stats Card (Span 1 col) */}
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -ml-8 -mb-8"></div>
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Check-ins</h3>
            <p className="text-5xl font-bold text-white">{history.length}</p>
          </div>

          {/* 3. Streak/Mood Card (Span 1 col) */}
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Weekly Streak</h3>
            <div className="flex items-end space-x-1">
              <span className="text-5xl font-bold text-white">0</span>
              <span className="text-gray-400 mb-2">days</span>
            </div>
          </div>

          {/* 4. Main Recorder Section (Span 2 cols, Tall) */}
          <div className="md:col-span-2 lg:col-span-3 glass-card rounded-3xl p-1">
            <div className="h-full w-full bg-black/20 rounded-[20px] p-6 flex items-center justify-center min-h-[400px]">
              <AudioRecorder />
            </div>
          </div>

          {/* 5. History Sidebar (Span 1 col, Tall) */}
          <div className="md:col-span-1 lg:col-span-1 glass-card rounded-3xl p-6 h-full max-h-[600px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              History
            </h3>

            {loadingHistory ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center">
                <p>No check-ins yet.</p>
                <p className="text-sm mt-2">Start recording to see your history.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {history.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-default">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-black/30 text-gray-400">
                        Analyzed
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2 italic group-hover:text-white transition-colors">
                      "{item.transcript}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Version Label */}
      <div className="fixed bottom-4 right-4 text-[10px] text-gray-600 font-mono pointer-events-none z-50">
        v0-beta-build.2024
      </div>
    </div>
  );
};

export default DashboardPage;
