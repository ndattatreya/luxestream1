import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';

const ProtectedRoute = ({ children, isAdminRoute = false, isUserRoute = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectPath = isAdminRoute ? '/adminlogin' : '/userlogin';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (isAdminRoute && user?.role !== 'admin') {
    return <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  if (isUserRoute && user?.role !== 'user') {
    return <Navigate to="/userlogin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
