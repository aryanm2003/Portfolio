import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for the admin token in local storage
  const token = localStorage.getItem('adminToken');

  // If there's no token, redirect the user to the homepage
  if (!token) {
    return <Navigate to="/" />;
  }

  // If the token exists, render the component that was passed in
  return children;
};

export default ProtectedRoute;