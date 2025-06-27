import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debug log
console.log('Auth API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  mode: import.meta.env.MODE
});

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include user ID in headers
authApi.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.id) {
    config.headers['x-user-id'] = user.id;
  }
  return config;
});

export const authService = {
  login: async (username, password) => {
    const response = await authApi.post('/auth/login', { username, password });
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  register: async (userData) => {
    const response = await authApi.post('/auth/register', userData);
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

export default authService;