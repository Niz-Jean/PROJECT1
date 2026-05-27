import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
  return (
    <div className="flex justify-center items-center h-64">
      <div className={`${sizes[size]} animate-spin rounded-full border-b-2 border-blue-600`}></div>
    </div>
  );
};

export default LoadingSpinner;