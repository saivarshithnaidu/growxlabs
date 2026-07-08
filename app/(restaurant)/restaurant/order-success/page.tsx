"use client";
import React from 'react';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="pt-40 flex flex-col items-center justify-center text-center px-6 min-h-screen">
      <div className="w-32 h-32 bg-primary/20 rounded-[3rem] flex items-center justify-center mb-8 border border-primary/50">
        <CheckCircle2 className="text-primary w-20 h-20" />
      </div>
      <h1 className="text-6xl font-black text-white mb-6 uppercase">Order Received!</h1>
      <Link href="/restaurant/track-order">
        <Button size="lg" className="h-20 px-16 rounded-full font-black bg-white text-black">Track Order</Button>
      </Link>
    </div>
  );
}