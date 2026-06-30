import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from '../components/Skeleton';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-black)', minHeight: '100vh', padding: '100px 4%' }}>
        <Skeleton type="title" style={{ width: '30%', height: '40px' }} />
        <Skeleton type="hero" style={{ height: '60vh', marginTop: '20px' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and store current location for post-auth routing
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
export default PrivateRoute;
