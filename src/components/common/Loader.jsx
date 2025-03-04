import React from 'react';

const Loader = ({ 
  size = 'md', 
  color = 'primary',
  label,
  fullPage = false
}) => {
  // Size classes
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  // Color classes
  const colorMap = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    white: 'text-white',
    gray: 'text-gray-500',
  };
  
  const loaderEl = (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'h-full w-full' : ''}`}>
      <svg 
        className={`animate-spin ${sizeMap[size]} ${colorMap[color]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      
      {label && (
        <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">{label}</span>
      )}
    </div>
  );
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50">
        {loaderEl}
      </div>
    );
  }
  
  return loaderEl;
};

export default Loader;
