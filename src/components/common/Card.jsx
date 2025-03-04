import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  footer,
  className = '',
  actions,
  elevation = 'md',
  onClick,
  clickable = false,
  noPadding = false,
  ...props 
}) => {
  // Elevation classes
  const elevationClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  
  // Clickable classes
  const clickableClasses = clickable ? 
    'cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]' : '';
  
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 
        rounded-lg ${elevationClasses[elevation]}
        ${clickableClasses}
        ${className}
      `} 
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
