import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  // Get the user state from Redux
  const user = useSelector((state) => state.auth.user);

  // If the user is not authenticated, redirect to login page
  if (!user || !user.id) {
    return <Navigate to="/RestrictedPage" replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
