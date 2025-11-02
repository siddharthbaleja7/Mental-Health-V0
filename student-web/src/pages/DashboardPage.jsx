import React from 'react';
import Header from '../components/Header';
import AudioRecorder from '../components/AudioRecorder';

/**
 * The main page for authenticated users, combining the Header and Recorder.
 */
const DashboardPage = ({ onLogout, theme, toggleTheme }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-black dark:text-white p-4">
    <Header onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />

    {/* Main content area */}
    <main className="flex items-center justify-center min-h-screen pt-16">
      <AudioRecorder />
    </main>
  </div>
);

export default DashboardPage;
