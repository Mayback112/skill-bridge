import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const RoleRoute: React.FC<{ children: React.ReactNode; role: string }> = ({
  children,
  role,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== role) {
    const redirectPath =
      user?.role === 'GRADUATE'
        ? '/dashboard/graduate'
        : user?.role === 'EMPLOYER'
        ? '/dashboard/employer'
        : user?.role === 'ADMIN'
        ? '/dashboard/admin'
        : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
