"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Users, Maximize, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { rooms } from '@/lib/hotel-data';
import { Button } from '@/components/ui/Button';

export default function RoomsPage() {
  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase">Accommodations</h1>
        <p className="text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">Choose from our selection of premium suites and villas.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {rooms.map((room, i) => (
          <motion.div
            key={room.id}
            className="glass-card group p-0 overflow-hidden border-white/5 bg-white/[0.02]"
          >
            <div className="relative h-[450px] overflow-hidden">
               <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
               <div className="absolute top-8 right-8 bg-black/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
                <span className="text-primary font-black text-lg">₹{room.price.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-12">
              <h3 className="text-4xl font-black text-white mb-4 tracking-tight group-hover:text-primary transition-colors">{room.name}</h3>
              <div className="flex gap-4">
                <Link href={`/hotel/room/${room.id}`} className="flex-grow">
                  <Button className="w-full h-16 rounded-2xl bg-white text-black hover:bg-neutral-200 font-black">Details</Button>
                </Link>
                <Link href={`/hotel/booking?roomId=${room.id}`}>
                  <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 text-white font-black group">Book Now</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
