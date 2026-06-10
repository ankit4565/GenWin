import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';

export default function DashboardLayout() {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          background: '#0f172a',
          color: '#fff',
          padding: '20px',
        }}
      >
        <h2>GenWin Dashboard</h2>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '20px',
          }}
        >
          <Link
            to="/"
            style={{ color: '#fff', textDecoration: 'none' }}
          >
            Home
          </Link>

          <Link
            to="/profile"
            style={{ color: '#fff', textDecoration: 'none' }}
          >
            Profile
          </Link>

          <Link
            to="/grievances"
            style={{ color: '#fff', textDecoration: 'none' }}
          >
            Grievances
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: '20px',
          background: '#f8fafc',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}