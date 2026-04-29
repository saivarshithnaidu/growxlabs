"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Building, ArrowRight, ShieldCheck, Star, Activity, DollarSign } from 'lucide-react';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/Button';
import { properties } from '@/lib/property-data';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative min-h-[100svh] pt-32 pb-20 flex flex-col items-center justify-center bg-black overflow-hidden px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl aspect-square bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-7xl mx-auto mb-16 relative z-10"
      >
        <span className="inline-block py-2 px-6 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-12 italic">
          Architectural Legacy
        </span>
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white leading-[0.8] mb-12 tracking-tighter uppercase italic">
          Future <br />
          <span className="text-primary not-italic">Living</span>
        </h1>
        <p className="text-lg md:text-2xl text-white/40 max-w-xl mx-auto mb-12 font-light leading-relaxed">
          Access a curated portfolio of world-class real estate. From high-tech urban studios to expansive beachfront villas.
        </p>
      </motion.div>

      {/* Modern Search Bar - Sharp & Balanced */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-full max-w-5xl bg-white/[0.02] backdrop-blur-2xl p-2 rounded-3xl md:rounded-full border border-white/5 flex flex-col md:flex-row gap-2 relative z-10"
      >
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
          <div className="flex items-center gap-4 px-6 md:border-r border-white/5 py-4">
            <MapPin className="text-primary w-5 h-5 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Location</span>
              <input type="text" placeholder="Search City..." className="bg-transparent text-white focus:outline-none font-black text-sm uppercase truncate placeholder:text-white/20" />
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 md:border-r border-white/5 py-4">
            <DollarSign className="text-primary w-5 h-5 shrink-0" />
            <div className="flex flex-col w-full">
              <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Budget</span>
              <select className="bg-transparent text-white focus:outline-none font-black text-sm uppercase appearance-none cursor-pointer w-full">
                <option className="bg-black">₹1Cr - ₹5Cr</option>
                <option className="bg-black">₹5Cr - ₹20Cr</option>
                <option className="bg-black">₹20Cr+</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <Building className="text-primary w-5 h-5 shrink-0" />
            <div className="flex flex-col w-full">
              <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Category</span>
              <select className="bg-transparent text-white focus:outline-none font-black text-sm uppercase appearance-none cursor-pointer w-full">
                <option className="bg-black">Luxury Villa</option>
                <option className="bg-black">Sky Apartment</option>
                <option className="bg-black">Commercial</option>
              </select>
            </div>
          </div>
        </div>
        <Link href="/realestate/properties">
          <Button size="lg" className="h-full px-12 rounded-2xl md:rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] py-6 md:py-0">
            Search Assets
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

const Portfolio = () => {
  return (
    <section className="py-24 md:py-40 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-xl">
             <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block font-mono italic">The Collection</span>
             <h2 className="text-4xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.8] uppercase">Modern <br /><span className="text-primary italic">Estates</span></h2>
             <p className="text-lg text-white/30 font-light max-w-sm italic">Exceptional listings verified by our world-class audit team.</p>
          </div>
          <Link href="/realestate/properties">
            <Button variant="ghost" className="text-primary font-black text-[10px] uppercase tracking-[0.3em] group">
              Explore All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {properties.slice(0, 3).map((prop, i) => (
            <motion.div 
              key={prop.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-8 border border-white/5 bg-white/[0.01]">
                <img src={prop.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute top-8 left-8 px-4 py-2 bg-primary text-black text-[9px] font-black uppercase rounded-lg tracking-widest">
                  {prop.type}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-10 left-10">
                  <div className="flex items-center gap-2 text-primary font-black text-2xl mb-4 tracking-tighter">
                    ₹{(prop.price / 10000000).toFixed(1)} <span className="text-[10px] uppercase opacity-70">Cr</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 leading-tight uppercase italic">{prop.title}</h3>
                  <div className="flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-widest">
                    <MapPin size={12} className="text-primary" /> {prop.location}
                  </div>
                </div>
              </div>
              <Link href={`/realestate/property/${prop.id}`}>
                <Button className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-widest transition-all">
                  Asset Intelligence
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MarketIntelligence = () => (
  <section className="py-24 md:py-40 bg-black overflow-hidden border-y border-white/5">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-8 block font-mono italic">Live Data Matrix</span>
          <h2 className="text-4xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.8] uppercase">Market <br /><span className="text-primary italic">Pulse</span></h2>
          <p className="text-lg text-white/30 font-light leading-relaxed mb-12 max-w-md italic">
            Our proprietary algorithm provides you with real-time analytics on asset appreciation and rental yields.
          </p>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">12.4%</p>
              <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Appreciation</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">₹4.2Cr</p>
              <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Median Value</p>
            </div>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 p-12 aspect-square flex flex-col items-center justify-center relative overflow-hidden group rounded-[4rem]">
           <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary/20 to-transparent" />
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-[2px] h-32 md:h-48 bg-primary/40 rounded-full mb-8 animate-pulse" />
              <p className="text-7xl md:text-9xl font-black text-white group-hover:scale-110 transition-transform duration-700 leading-none">98%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-6">Retention Rate</p>
           </div>
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
      </div>
    </div>
  </section>
);

export default function RealEstateLanding() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-primary selection:text-black">
      <Hero />
      <Portfolio />
      <MarketIntelligence />
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-primary/5 border border-primary/20 rounded-[3rem] md:rounded-[4rem] text-center py-24 md:py-32 px-10 relative overflow-hidden">
          <h2 className="text-4xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase leading-none italic">Secure Your <br /><span className="text-primary not-italic">Legacy</span></h2>
          <Link href="/realestate/properties">
            <Button size="lg" className="h-16 md:h-20 px-12 md:px-20 text-sm md:text-xl rounded-full font-black bg-white text-black hover:bg-primary hover:text-white transition-all uppercase tracking-widest shadow-2xl shadow-primary/20">
              Start Acquisition
            </Button>
          </Link>
        </div>
      </section>
      <footer className="py-24 border-t border-white/5 text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <span className="text-xl font-black tracking-tighter text-white uppercase italic">GrowX <span className="text-primary not-italic">Estates</span></span>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">© {new Date().getFullYear()} GrowX Labs Real Estate.</p>
           <div className="flex gap-8">
              <Link href="/privacy" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Terms</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
