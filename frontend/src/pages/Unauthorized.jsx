import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f172a',
        color: '#fff',
        padding: '20px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          padding: '40px',
          borderRadius: '16px',
          background: '#1e293b',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        <h1
          style={{
            fontSize: '72px',
            margin: '0',
            color: '#ef4444',
          }}
        >
          403
        </h1>

        <h2
          style={{
            marginTop: '10px',
            marginBottom: '15px',
          }}
        >
          Unauthorized Access
        </h2>

        <p
          style={{
            color: '#cbd5e1',
            marginBottom: '30px',
            lineHeight: '1.6',
          }}
        >
          You don't have permission to access this page.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#22c55e',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}