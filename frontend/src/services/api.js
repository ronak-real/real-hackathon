import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debug log
console.log('API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  mode: import.meta.env.MODE
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include user ID in headers
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.id) {
    config.headers['x-user-id'] = user.id;
  }
  return config;
});

export const incomeService = {
  getAll: () => api.get('/income'),
  create: (data) => api.post('/income', data),
};

export const expenseService = {
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expense', data),
};

export const goalService = {
  getAll: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  addFunds: (goalId, amount) => api.patch(`/goals/${goalId}/fund`, { amount }),
};

export const dashboardService = {
  getSummary: () => api.get('/dashboard'),
};

export const advisorService = {
  getAdvice: (data) => api.post('/advice', data),
};

export default api;