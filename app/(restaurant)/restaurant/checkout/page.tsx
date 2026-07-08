"use client";
import React, { useState } from 'react';
import { useRouter } from '@/navigation';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => router.push('/restaurant/order-success'), 1500);
  };
  return (
    <div className="pt-40 max-w-4xl mx-auto px-6 text-white min-h-screen">
      <h1 className="text-5xl font-black mb-12 uppercase">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="glass-card p-12 space-y-8">
        <input required placeholder="Full Name" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" />
        <input required placeholder="Phone" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" />
        <textarea required placeholder="Address" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-32" />
        <Button size="lg" className="w-full h-20 rounded-full font-black bg-primary text-white">Place Order</Button>
      </form>
    </div>
  );
}