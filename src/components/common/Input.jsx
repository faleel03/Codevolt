import React, { forwardRef } from 'react';

const Input = forwardRef(({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  className = '',
  size = 'md',
  required = false,
  disabled = false,
  helpText,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-3 text-base',
    lg: 'py-3 px-4 text-lg',
  };
  
  // Icon padding classes
  const iconPaddingLeft = leftIcon ? 'pl-10' : '';
  const iconPaddingRight = rightIcon ? 'pr-10' : '';
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          id={id}
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            dark:bg-gray-700 dark:text-white
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}
            ${sizeClasses[size]} ${iconPaddingLeft} ${iconPaddingRight}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
