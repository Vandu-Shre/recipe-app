// client/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import axios, { type AxiosInstance } from 'axios';

// 1. Define types
interface User {
  _id: string;
  username: string;
  email: string;
  // Add other user properties you expect from your backend /profile endpoint
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  api: AxiosInstance; // Axios instance configured with token
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  // Configure Axios instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Point to your backend API
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor to attach token to requests
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]); // Re-run when token changes

  // Function to load user from token (e.g., on app start or refresh)
  const loadUser = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.user);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setToken(null); // Clear token if invalid
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user on component mount
  useEffect(() => {
    loadUser();
  }, []);

  // Authentication functions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error; // Re-throw to be handled by the form component
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { username, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      throw error; // Re-throw to be handled by the form component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // localStorage.removeItem('token'); // Handled by useEffect
    // delete api.defaults.headers.common['Authorization']; // Handled by useEffect
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    api,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};