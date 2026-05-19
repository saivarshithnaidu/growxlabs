"use client";

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ backgroundColor: '#F9F8F6', color: '#1A1A1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px', textAlign: 'center', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Something went wrong</h1>
        <p style={{ color: '#6B7280', marginBottom: '32px', maxWidth: '400px', lineHeight: 1.6 }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          style={{ backgroundColor: '#355CFF', color: '#FFFFFF', padding: '12px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
