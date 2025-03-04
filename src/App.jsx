import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StationLocator from './pages/StationLocator';
import SlotBooking from './pages/SlotBooking';
import ReservationHistory from './pages/ReservationHistory';
import NotificationsPanel from './pages/NotificationsPanel';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const { isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col`}>
      {isAuthenticated && <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      
      <div className="flex flex-grow">
        {isAuthenticated && <Sidebar />}
        
        <main className="flex-grow p-4 sm:p-6">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/stations" element={
              <ProtectedRoute>
                <StationLocator />
              </ProtectedRoute>
            } />
            
            <Route path="/booking" element={
              <ProtectedRoute>
                <SlotBooking />
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <ReservationHistory />
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPanel />
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      
      {isAuthenticated && <Footer />}
    </div>
  );
};

export default App;