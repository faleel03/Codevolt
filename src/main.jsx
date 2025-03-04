import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <BookingProvider>
                <NotificationProvider>
                  <App />
                </NotificationProvider>
              </BookingProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);