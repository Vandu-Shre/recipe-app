// client/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

// Define the shape of the user object
interface User {
  id: string; // This must be consistently 'id' on the frontend
  username: string;
  email: string;
  // Add any other user properties your backend returns
}

// Define the shape of the Auth Context
interface AuthContextType {
  user: User | null;
  authToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Ensure parsedUser has _id before mapping, or handle cases where it might not
        if (parsedUser && parsedUser._id) {
            const mappedUser: User = { // Use a new variable name for clarity, explicitly type
                id: parsedUser._id, // Correctly map _id from localStorage to id for frontend
                username: parsedUser.username,
                email: parsedUser.email,
                // Copy other properties as needed
            };
            setAuthToken(storedToken);
            setUser(mappedUser); // Set the mapped user to state
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
            // If stored user is invalid (e.g., no _id), clear storage
            console.warn("Stored user data is incomplete or invalid. Clearing storage.");
            localStorage.clear();
            setAuthToken(null);
            setUser(null);
        }
      } catch (e) {
        console.error("Failed to parse stored user or token", e);
        localStorage.clear(); // Clear invalid data
        setAuthToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      const { token, user: backendUserData } = response.data; // backendUserData comes with _id

      // Create a new User object that conforms to the frontend's 'User' interface
      const mappedUser: User = {
        id: backendUserData._id, // Map _id from backend response to frontend 'id'
        username: backendUserData.username,
        email: backendUserData.email,
        // Copy other properties from backendUserData if your User interface expects them
      };

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(mappedUser)); // Store the mapped user
      setAuthToken(token);
      setUser(mappedUser); // Set the mapped user to state immediately
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, { username, email, password });
      const { token, user: backendUserData } = response.data; // backendUserData comes with _id

      // Create a new User object that conforms to the frontend's 'User' interface
      const mappedUser: User = {
        id: backendUserData._id, // Map _id from backend response to frontend 'id'
        username: backendUserData.username,
        email: backendUserData.email,
        // Copy other properties from backendUserData if your User interface expects them
      };

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(mappedUser)); // Store the mapped user
      setAuthToken(token);
      setUser(mappedUser); // Set the mapped user to state immediately
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization']; // Remove default header
  };

  const value = {
    user,
    authToken,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};