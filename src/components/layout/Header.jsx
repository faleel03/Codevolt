import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { useTheme } from '../../hooks/useTheme';

const Header = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const { darkMode, toggleDarkMode } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and site name */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">EV Charge</span>
            </div>
          </div>
          
          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            
            <Link to="/notifications" className="relative p-2">
              <span className="sr-only">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;