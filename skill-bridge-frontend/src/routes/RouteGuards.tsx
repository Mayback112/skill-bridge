import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-sans">Verifying session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const RoleRoute: React.FC<{ children: React.ReactNode; role: string }> = ({
  children,
  role,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-sans">Verifying role...</div>;
  }

  if (!isAuthenticated || user?.role !== role) {
    const redirectPath =
      user?.role === 'GRADUATE'
        ? '/graduate/dashboard'
        : user?.role === 'EMPLOYER'
        ? '/dashboard/employer'
        : user?.role === 'ADMIN'
        ? '/admin/dashboard'
        : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
