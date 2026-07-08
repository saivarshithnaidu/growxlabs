"use client";
import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className="pt-40 flex flex-col items-center justify-center text-center px-6 min-h-screen text-white">
      <div className="w-40 h-40 bg-primary/10 rounded-[4rem] flex items-center justify-center mb-8 border border-primary/30">
        <CheckCircle className="text-primary w-20 h-20" />
      </div>
      <h1 className="text-6xl font-black mb-6 uppercase">Stay Confirmed</h1>
      <p className="text-xl text-white/40 max-w-md mx-auto">We are preparing your sanctuary for arrival.</p>
    </div>
  );
}