"use client";

import React from 'react';
import { Home, ArrowRight } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#F9F8F6', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md mx-auto">
            <h1 style={{ fontSize: '120px', fontWeight: 900, color: '#E8E6E1', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '-8px' }}>
              404
            </h1>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px' }}>
              Page not found
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.6, marginBottom: '32px' }}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#355CFF',
                color: '#FFFFFF',
                padding: '12px 32px',
                borderRadius: '999px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
