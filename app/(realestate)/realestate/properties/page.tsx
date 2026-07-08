"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { Link } from '@/navigation';
import { properties } from '@/lib/property-data';
import { Button } from '@/components/ui/Button';

export default function PropertiesPage() {
  const [filterType, setFilterType] = useState('All');
  const filtered = properties.filter(p => filterType === 'All' || p.type === filterType);

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 text-white">
        <div>
           <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Property Portal</h1>
           <p className="text-xl text-white/40 font-light max-w-xl">Browse our curated collection of premier residential and commercial real estate.</p>
        </div>
        
        <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/10">
          {['All', 'Apartment', 'Villa', 'Commercial'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence mode="popLayout">
          {filtered.map((prop) => (
            <motion.div
              layout
              key={prop.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card group p-0 overflow-hidden border-white/5 bg-white/[0.02]"
            >
              <div className="relative h-72 overflow-hidden">
                 <img src={prop.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <div className="absolute top-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-md text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20 tracking-widest">
                    {prop.type}
                 </div>
              </div>
              
              <div className="p-10">
                <div className="flex justify-between items-start mb-6">
                   <h3 className="text-2xl font-black text-white leading-tight group-hover:text-primary transition-colors">{prop.title}</h3>
                   <div className="text-primary font-black text-xl">₹{(prop.price / 10000000).toFixed(1)}Cr</div>
                </div>
                
                <div className="flex items-center gap-2 text-white/30 text-sm font-bold uppercase tracking-widest mb-8">
                   <MapPin size={14} /> {prop.location}
                </div>

                <Link href={`/realestate/property/${prop.id}`}>
                   <Button className="w-full h-14 rounded-xl bg-white text-black hover:bg-primary hover:text-white font-black transition-all">
                      View Details
                   </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
