"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Flame, Navigation, Package } from 'lucide-react';

export default function TrackOrderPage() {
  const [stage, setStage] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setStage(s => (s < 4 ? s + 1 : 4)), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pt-40 max-w-2xl mx-auto px-6 text-white min-h-screen text-center">
      <h1 className="text-5xl font-black mb-16 uppercase">Live Tracking</h1>
      <div className="space-y-12">
        {[{id:1, n:'Confirmed', i:CheckCircle2}, {id:2, n:'Preparing', i:Flame}, {id:3, n:'On the Way', i:Navigation}, {id:4, n:'Delivered', i:Package}].map(s => (
          <div key={s.id} className={`flex items-center gap-8 ${stage >= s.id ? 'opacity-100' : 'opacity-20'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${stage >= s.id ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10'}`}>
              <s.i className={stage >= s.id ? 'text-primary' : 'text-white/40'} />
            </div>
            <h3 className="text-2xl font-black">{s.n}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}