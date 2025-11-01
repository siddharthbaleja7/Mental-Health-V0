import React from 'react';
import { SunIcon, MoonIcon } from './icons/Icons';

const Header = ({ onLogout, theme, toggleTheme }) => (
  <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center">
    <h1 className="text-xl font-bold text-black dark:text-white">Student Portal</h1>
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-black dark:text-white bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
      <button
        onClick={onLogout}
        className="px-4 py-2 font-medium text-sm bg-gray-200/50 dark:bg-gray-700/50 text-black dark:text-white rounded-md shadow-sm backdrop-blur-sm"
      >
        Logout
      </button>
    </div>
  </header>
);

export default Header;
