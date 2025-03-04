import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Notification from '../components/common/Notification';

const Login = () => {
  const { login, loading } = useAuth();
  const [error, setError] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  const onSubmit = async (data) => {
    setError(null);
    
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };
  
  const handleDemoLogin = async () => {
    setError(null);
    
    try {
      const result = await login('test@example.com', 'password');
      if (!result.success) {
        setError(result.error || 'Demo login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <svg className="h-16 w-16 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 14V10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 16H19C20.1046 16 21 16.8954 21 18V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V18C3 16.8954 3.89543 16 5 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 16V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            EV Charging Grid
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your charging reservations
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          {error && (
            <div className="mb-4">
              <Notification
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              label="Email address"
              type="email"
              required
              autoComplete="email"
              leftIcon={
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
            />
            
            <Input
              id="password"
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              leftIcon={
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full"
            >
              Sign in
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
              >
                Sign in with demo account
              </Button>
            </div>
          </div>
          
          {/* Demo account info */}
          <div className="mt-4">
            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              onClick={() => setShowDemo(!showDemo)}
            >
              {showDemo ? 'Hide demo account info' : 'Show demo account info'}
            </button>
            
            {showDemo && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                <p><strong>Email:</strong> test@example.com</p>
                <p><strong>Password:</strong> password</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
