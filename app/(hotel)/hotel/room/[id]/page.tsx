"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { rooms } from '@/lib/hotel-data';
import { Button } from '@/components/ui/Button';

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const room = rooms.find(r => r.id === id);
  if (!room) return <div className="pt-40 text-white text-center">Not Found</div>;
  return (
    <div className="pt-24 min-h-screen bg-black">
      <div className="h-[60vh] w-full relative">
        <img src={room.image} className="w-full h-full object-cover" />
        <div className="absolute bottom-12 left-12"><h1 className="text-8xl font-black text-white uppercase">{room.name}</h1></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-20 flex gap-20">
        <div className="flex-grow">
          <p className="text-2xl text-white/50 font-light">{room.description}</p>
        </div>
        <div className="w-96 glass-card p-10 bg-white/5 border-white/10 h-fit sticky top-32">
          <p className="text-3xl font-black text-white mb-8">₹{room.price.toLocaleString()} <span className="text-sm opacity-50">/ night</span></p>
          <Button onClick={() => router.push('/hotel/booking')} className="w-full h-16 rounded-2xl bg-white text-black font-black">Book Sanctuary</Button>
        </div>
      </div>
    </div>
  );
}