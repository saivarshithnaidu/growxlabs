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
      <body className="bg-black text-white flex flex-col items-center justify-center min-h-screen p-6 text-center font-sans">
        <h1 className="text-4xl font-black mb-4">CRITICAL_SYSTEM_FAILURE</h1>
        <p className="text-white/50 mb-8 max-w-md">
          A fatal error occurred at the root level of the GrowX Labs matrix.
          Please refresh the page or contact system administration.
        </p>
        <button
          onClick={() => reset()}
          className="bg-[#00b894] px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all"
        >
          REBOOT SYSTEM
        </button>
      </body>
    </html>
  );
}
