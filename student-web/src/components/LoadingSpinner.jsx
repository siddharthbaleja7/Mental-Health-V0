import React from 'react';

const LoadingSpinner = () => (
  <div
    className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-black dark:border-white"
    role="status"
    aria-label="Loading..."
  ></div>
);

export default LoadingSpinner;
