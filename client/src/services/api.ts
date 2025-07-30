// client/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000', // Use environment variable or default
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;