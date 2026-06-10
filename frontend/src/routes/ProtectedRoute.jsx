import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem('genwin_access_token') ||
    sessionStorage.getItem('genwin_access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}