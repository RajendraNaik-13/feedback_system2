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
  if (requiredRole) {
    if (currentUser.role === 'admin') {
      return <Outlet />;
    }
    if (currentUser.role === 'moderator' && 
        (requiredRole === 'moderator' || requiredRole === 'contributor')) {
      return <Outlet />;
    }
    if (currentUser.role === 'contributor' && requiredRole === 'contributor') {
      return <Outlet />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;