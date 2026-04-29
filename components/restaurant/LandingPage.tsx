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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-2 text-primary mb-12 animate-pulse">
            <ChefHat size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Culinary Excellence</span>
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.85] uppercase italic">
            Taste the <br />
            <span className="text-primary not-italic">Future</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/40 max-w-xl mx-auto mb-16 font-light leading-relaxed italic">
            Experience a curated selection of artisanal dishes crafted with passion and delivered with precision.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/restaurant/menu">
              <Button size="lg" className="h-16 md:h-20 px-12 md:px-16 text-sm md:text-lg rounded-full font-black bg-white text-black hover:bg-primary hover:text-white transition-all shadow-2xl shadow-primary/20 uppercase tracking-widest">
                Discover Menu
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-white hover:text-primary font-black uppercase tracking-widest text-[10px]">
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
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-xl">
             <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block font-mono italic">Signature Dishes</span>
             <h2 className="text-4xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.8]">Master <br /><span className="text-primary italic">Works</span></h2>
             <p className="text-lg text-white/30 font-light max-w-sm italic">Our most celebrated dishes, prepared daily with seasonal precision.</p>
          </div>
          <Link href="/restaurant/menu">
            <Button variant="ghost" className="text-primary font-black text-[10px] uppercase tracking-[0.3em] group">
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
              <div className="relative aspect-square rounded-[3rem] overflow-hidden mb-8 border border-white/5 bg-white/[0.01]">
                <img src={dish.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-primary font-black text-[10px] border border-white/10 tracking-widest">
                   ₹{dish.price}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                   <p className="text-white font-light text-sm italic line-clamp-2">{dish.description}</p>
                </div>
              </div>
              <div className="px-2">
                <h3 className="text-2xl font-black text-white mb-8 group-hover:text-primary transition-colors uppercase leading-none italic">{dish.name}</h3>
                <Button 
                  onClick={() => addToCart(dish)}
                  className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-widest transition-all gap-2"
                >
                  <ShoppingBag size={14} /> Add to Bag
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
  <section className="py-24 md:py-40 px-6">
    <div className="max-w-7xl mx-auto bg-primary/5 border border-primary/20 rounded-[3rem] md:rounded-[4rem] overflow-hidden flex flex-col lg:flex-row items-center relative">
      <div className="w-full lg:w-1/2 aspect-square relative">
        <img src="/images/dishes/hero-dish.png" className="w-full h-full object-cover" alt="Chef's Table" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
      </div>
      <div className="p-10 md:p-24 flex-1">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 block font-mono italic">Exclusive Access</span>
        <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter uppercase leading-[0.8] italic">Chef's <br /><span className="text-primary not-italic">Table</span></h2>
        <p className="text-lg text-white/40 font-light leading-relaxed mb-12 italic max-w-sm">
          Go behind the scenes and experience a personalized tasting menu prepared right before your eyes. Perfect for intimate celebrations.
        </p>
        <div className="grid grid-cols-2 gap-12 mb-12">
           <div>
              <p className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">12</p>
              <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Limited Seats</p>
           </div>
           <div>
              <p className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">08</p>
              <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Courses Menu</p>
           </div>
        </div>
        <Button className="h-16 px-10 rounded-full border border-white/10 text-white hover:bg-white hover:text-black font-black uppercase tracking-widest text-[10px] transition-all">Reserve Spot</Button>
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
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-all duration-500">
                <item.icon className="text-primary group-hover:text-black w-6 h-6 transition-colors" />
              </div>
              <h4 className="text-[10px] font-black text-white mb-4 uppercase tracking-[0.3em]">{item.label}</h4>
              <p className="text-[10px] text-white/30 leading-relaxed font-light max-w-[200px] italic">{item.desc}</p>
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
