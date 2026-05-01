"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wifi, Waves, Dumbbell, Car, Star, ArrowRight, MapPin } from 'lucide-react';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/Button';
import { rooms } from '@/lib/hotel-data';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <motion.div style={{ y: y1 }} className="absolute inset-0 scale-105">
           <img 
            src="/images/hotel/hero.png" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="max-w-4xl"
        >
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-widest text-primary mb-8 animate-float">
            <MapPin size={14} /> Manhattan, New York
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
            Refined Luxury
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-xl mb-12 font-medium leading-relaxed">
            A sanctuary of modern elegance where every detail is crafted for your ultimate indulgence.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link href="/hotel/rooms">
              <Button size="lg" className="h-14 px-8 text-sm md:text-base rounded-full font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-xl shadow-white/5 tracking-wide">
                Discover Suites
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-end gap-4 opacity-40">
        <div className="w-[1px] h-32 bg-gradient-to-b from-primary to-transparent" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white rotate-90 origin-right translate-y-12">Scroll</span>
      </div>
    </section>
  );
};

const Collections = () => {
  return (
    <section className="py-24 md:py-40 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-xl">
             <span className="text-primary font-semibold uppercase tracking-widest text-xs mb-4 block">Curated Living</span>
             <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">The Portfolio</h2>
             <p className="text-lg text-white/60 font-medium max-w-sm leading-relaxed">Exceptional listings verified by our world-class hospitality team.</p>
          </div>
          <Link href="/hotel/rooms">
            <Button variant="ghost" className="text-white hover:text-primary font-semibold text-sm tracking-wide group">
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {rooms.slice(0, 3).map((room, i) => (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 border border-white/5 bg-white/[0.02]">
                <img src={room.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-8 left-8">
                  <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-1">From ₹{room.price.toLocaleString()}/night</p>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{room.name}</h3>
                </div>
              </div>
              <Link href={`/hotel/room/${room.id}`}>
                <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black font-semibold text-sm transition-all gap-2 group">
                  Reservations <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Amenities = () => {
  const ams = [
    { icon: Wifi, label: 'Fiber WiFi', desc: 'Seamless connectivity throughout.' },
    { icon: Waves, label: 'Sky Pool', desc: 'Infinity pool with panoramic views.' },
    { icon: Dumbbell, label: 'Wellness', desc: '24/7 fitness and private yoga.' },
    { icon: Car, label: 'Chauffeur', desc: 'Luxury transfers and city tours.' },
  ];

  return (
    <section className="py-24 bg-white/[0.01] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {ams.map((a, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/10 transition-all duration-300">
                <a.icon className="text-primary w-6 h-6 transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-2 tracking-wide">{a.label}</h4>
              <p className="text-sm text-white/60 font-medium px-4 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Membership = () => (
  <section className="py-24 px-6">
    <div className="max-w-7xl mx-auto bg-white/[0.02] border border-white/5 rounded-3xl p-10 md:p-16 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 hidden lg:block opacity-10">
        <div className="w-32 h-32 border border-white/20 rounded-full animate-pulse" />
      </div>
      
      <div className="max-w-xl text-center lg:text-left relative z-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-6 block">The Inner Circle</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">The Elite Society</h2>
        <p className="text-lg text-white/60 font-medium leading-relaxed mb-10 max-w-sm mx-auto lg:mx-0">
          Unlock a world of unparalleled luxury with our quarterly membership. Priority suite allocation and private concierge services.
        </p>
        <Button variant="outline" className="h-12 px-8 rounded-xl border-white/10 text-white hover:bg-white hover:text-black font-semibold tracking-wide transition-all">Explore Benefits</Button>
      </div>
      
      <div className="w-full lg:flex-grow grid grid-cols-1 gap-4 relative z-10">
        {['Global Concierge', 'Spa & Wellness', 'Private Aviation'].map((benefit, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer">
            <span className="text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">{benefit}</span>
            <ArrowRight className="text-white/40 group-hover:text-primary transition-all group-hover:translate-x-1" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function HotelLanding() {
  return (
    <div className="bg-black text-white min-h-screen selection:bg-primary selection:text-black">
      <Hero />
      <Collections />
      <Amenities />
      <Membership />
      <footer className="py-24 border-t border-white/5 text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <span className="text-xl font-black tracking-tighter text-white uppercase italic">GrowX <span className="text-primary not-italic">Hotels</span></span>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">© {new Date().getFullYear()} GrowX Labs Hospitality.</p>
           <div className="flex gap-8">
              <Link href="/privacy" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Terms</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
