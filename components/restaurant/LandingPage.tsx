"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Star, Clock, MapPin, ChefHat } from 'lucide-react';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/Button';
import { menuItems } from '@/lib/restaurant-data';
import { useCart, MenuItem } from '@/lib/restaurant-context';

const Hero = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center bg-black px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl aspect-square bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-2 text-primary mb-8 animate-pulse">
            <ChefHat size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">Culinary Excellence</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
            Taste the Future
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-12 font-medium leading-relaxed">
            Experience a curated selection of artisanal dishes crafted with passion and delivered with precision.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/restaurant/menu">
              <Button size="lg" className="h-14 px-8 text-sm md:text-base rounded-xl font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-xl shadow-white/5 tracking-wide">
                Discover Menu
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-white hover:text-primary font-semibold tracking-wide text-sm">
                Our Philosophy
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const MasterWorks = () => {
  const { addToCart } = useCart();

  return (
    <section className="py-24 md:py-40 bg-black overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
             <span className="text-primary font-semibold uppercase tracking-widest text-xs mb-4 block">Signature Dishes</span>
             <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Master Works</h2>
             <p className="text-lg text-white/60 font-medium max-w-sm">Our most celebrated dishes, prepared daily with seasonal precision.</p>
          </div>
          <Link href="/restaurant/menu">
            <Button variant="ghost" className="text-white hover:text-primary font-semibold text-sm tracking-wide group">
              Full Menu <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {menuItems.slice(0, 3).map((dish: MenuItem, i: number) => (
            <motion.div 
              key={dish.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 border border-white/5 bg-white/[0.02]">
                <img src={dish.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-semibold text-sm border border-white/10 tracking-wide">
                   ₹{dish.price}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                   <p className="text-white/80 font-medium text-sm line-clamp-3">{dish.description}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors tracking-tight">{dish.name}</h3>
                <Button 
                  onClick={() => addToCart(dish)}
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black font-semibold text-sm transition-all gap-2"
                >
                  <ShoppingBag size={16} /> Add to Bag
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ChefTable = () => (
  <section className="py-24 px-6">
    <div className="max-w-7xl mx-auto bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center relative">
      <div className="w-full lg:w-1/2 aspect-square relative">
        <img src="/images/dishes/hero-dish.png" className="w-full h-full object-cover" alt="Chef's Table" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>
      <div className="p-10 md:p-16 flex-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-6 block">Exclusive Access</span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Chef's Table</h2>
        <p className="text-lg text-white/60 font-medium leading-relaxed mb-10 max-w-sm">
          Go behind the scenes and experience a personalized tasting menu prepared right before your eyes. Perfect for intimate celebrations.
        </p>
        <div className="grid grid-cols-2 gap-8 mb-10">
           <div>
              <p className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">12</p>
              <p className="text-xs font-semibold uppercase text-white/40 tracking-widest">Limited Seats</p>
           </div>
           <div>
              <p className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">08</p>
              <p className="text-xs font-semibold uppercase text-white/40 tracking-widest">Courses Menu</p>
           </div>
        </div>
        <Button className="h-12 px-8 rounded-xl border border-white/10 text-white hover:bg-white hover:text-black font-semibold text-sm transition-all tracking-wide">Reserve Spot</Button>
      </div>
    </div>
  </section>
);

const Features = () => {
  const items = [
    { icon: Clock, label: 'Swift Delivery', desc: 'Average 30 min arrival time with specialized packaging.' },
    { icon: Star, label: 'Michelin Grade', desc: 'Crafted by chefs with world-class pedigree.' },
    { icon: MapPin, label: 'Live Tracking', desc: 'Follow your gourmet journey from kitchen to door.' },
  ];

  return (
    <section className="py-24 bg-white/[0.01] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left group">
              <div className="w-14 h-14 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all duration-300">
                <item.icon className="text-primary w-6 h-6 transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-3 tracking-wide">{item.label}</h4>
              <p className="text-sm text-white/60 leading-relaxed font-medium max-w-[200px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function RestaurantLanding() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-primary selection:text-black">
      <Hero />
      <Features />
      <MasterWorks />
      <ChefTable />
      <footer className="py-24 border-t border-white/5 text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <span className="text-xl font-black tracking-tighter text-white uppercase italic">GrowX <span className="text-primary not-italic">Eats</span></span>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">© {new Date().getFullYear()} GrowX Labs Gastronomy.</p>
           <div className="flex gap-8">
              <Link href="/privacy" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Terms</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
