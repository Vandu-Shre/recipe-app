// client/src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC = () => {
  const { user, isLoading } = useAuth(); // Get user and isLoading from context

  if (isLoading) {
    // Show a loading indicator while checking auth status
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-700 text-white text-xl">
        Loading...
      </div>
    );
  }

  // If user is logged in, render the child routes (Outlet)
  // Otherwise, redirect to the login page
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;