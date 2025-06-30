import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PublicRoute: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export default PublicRoute;