import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole) {
    // Admin can access everything
    if (currentUser.role === 'admin') {
      return <Outlet />;
    }
    
    // Moderator can access moderator and contributor routes
    if (currentUser.role === 'moderator' && 
        (requiredRole === 'moderator' || requiredRole === 'contributor')) {
      return <Outlet />;
    }
    
    // Contributor can only access contributor routes
    if (currentUser.role === 'contributor' && requiredRole === 'contributor') {
      return <Outlet />;
    }
    
    // If user doesn't have the required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If no specific role required, just being authenticated is enough
  return <Outlet />;
};

export default ProtectedRoute;