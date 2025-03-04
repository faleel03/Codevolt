import axios from 'axios';

// Create an axios instance with default configurations
const api = axios.create({
  // Replace with your actual API base URL in production
  baseURL: 'https://api.evcharging.example/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(
      error.response?.data?.message || 
      error.message || 
      'Something went wrong'
    );
  }
);

// For development/demo purposes - mock API calls
const MOCK_MODE = true;

// Mock API function to simulate API calls
export const mockApiCall = (data, delay = 500, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('API call failed'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

export default api;
