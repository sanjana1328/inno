import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (currentUser.role === 'investor') {
      return <Navigate to="/investor/dashboard" replace />;
    } else if (currentUser.role === 'innovator') {
      return <Navigate to="/innovator/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  if (currentUser.status === 'pending' && currentUser.role !== 'admin') {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
};

export default ProtectedRoute;