import React from 'react';
import { Link } from 'react-router-dom';

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <h1 className="text-3xl font-bold text-black dark:text-white">Welcome</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Please select your role to log in.</p>
        
        <div className="mt-8 space-y-4">
          <Link
            to="/login?role=student"
            className="block w-full py-4 px-4 font-semibold rounded-md text-white bg-black dark:bg-white dark:text-black"
          >
            I am a Student
          </Link>
          
          <Link
            to="/login?role=teacher"
            className="block w-full py-4 px-4 font-semibold rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            I am a Teacher
          </Link>
        </div>
      </div>
    </div>
  );
}