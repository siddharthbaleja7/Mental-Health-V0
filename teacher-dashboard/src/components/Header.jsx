import React from 'react';
import { SunIcon, MoonIcon, LogOutIcon } from './icons/Icons';

/**
 * The main header for the dashboard, with theme toggle and logout.
 */
const Header = ({ onLogout, theme, toggleTheme }) => (
  <header className="w-full p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm sticky top-0">
    <div className="container mx-auto flex justify-between items-center max-w-7xl px-4">
      <h1 className="text-xl font-bold text-black dark:text-white">
        Teacher Dashboard
      </h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-black dark:text-white bg-gray-200/50 dark:bg-gray-700/50"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-2 font-medium text-sm bg-gray-200/50 dark:bg-gray-700/50 text-black dark:text-white rounded-md shadow-sm"
        >
          <LogOutIcon className="w-5 h-5 mr-1.5" />
          Logout
        </button>
      </div>
    </div>
  </header>
);

export default Header;