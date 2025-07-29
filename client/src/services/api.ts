// client/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/', // IMPORTANT: Ensure this matches your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling (optional, but good practice)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: if (error.response?.status === 401) { /* handle unauthorized, e.g., redirect to login */ }
    console.error('API call error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;