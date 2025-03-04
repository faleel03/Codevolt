import api, { mockApiCall } from './api';

// Mock user data for development
const MOCK_USER = {
  id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  preferredStation: 'station-1',
  vehicleType: 'Tesla Model 3',
};

/**
 * Logs in a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data
 */
export const login = async (email, password) => {
  // For development, we'll use mock data
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // Simple validation for demo purposes
    if (email !== 'test@example.com' || password !== 'password') {
      return mockApiCall(null, 500, true);
    }
    
    // Mock successful login
    const authToken = 'mock-auth-token-123';
    localStorage.setItem('authToken', authToken);
    
    return mockApiCall(MOCK_USER);
  }
  
  // Real API call for production
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('authToken', response.token);
  return response.user;
};

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    localStorage.removeItem('authToken');
    return mockApiCall(null);
  }
  
  await api.post('/auth/logout');
  localStorage.removeItem('authToken');
};

/**
 * Checks if a user is authenticated
 * @returns {Promise<Object|null>} User data if authenticated, null otherwise
 */
export const checkAuthStatus = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return mockApiCall(MOCK_USER);
  }
  
  try {
    const response = await api.get('/auth/me');
    return response.user;
  } catch (error) {
    localStorage.removeItem('authToken');
    return null;
  }
};
