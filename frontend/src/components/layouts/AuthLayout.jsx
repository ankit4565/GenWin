import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export default function AuthLayout() {
  const token = localStorage.getItem('access_token');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}