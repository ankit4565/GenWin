import React from 'react';

export default function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f172a',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          border: '6px solid rgba(255,255,255,0.2)',
          borderTop: '6px solid #22c55e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}