import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireTeam?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireTeam = false }) => {
  const { isAuthenticated, team } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireTeam && !team) {
    return <Navigate to="/onboard" replace />;
  }

  return <>{children}</>;
};
