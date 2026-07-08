"use client";
import React from 'react';
import { useRouter } from '@/navigation';
import { Button } from '@/components/ui/Button';

export default function BookingPage() {
  const router = useRouter();
  return (
    <div className="pt-40 max-w-4xl mx-auto px-6 text-white min-h-screen">
      <h1 className="text-5xl font-black mb-16 uppercase">Finalize Booking</h1>
      <form onSubmit={(e) => { e.preventDefault(); router.push('/hotel/confirmation'); }} className="glass-card p-12 space-y-8">
        <input required placeholder="Full Name" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" />
        <div className="grid grid-cols-2 gap-8"><input type="date" className="bg-white/5 border border-white/10 p-5 rounded-2xl" /><input type="date" className="bg-white/5 border border-white/10 p-5 rounded-2xl" /></div>
        <Button size="lg" className="w-full h-20 rounded-full font-black bg-primary text-white">Confirm Booking</Button>
      </form>
    </div>
  );
}