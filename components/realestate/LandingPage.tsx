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
        <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-primary mb-8">
          Architectural Legacy
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8 tracking-tight">
          Future Living
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-12 font-medium leading-relaxed">
          Access a curated portfolio of world-class real estate. From high-tech urban studios to expansive beachfront villas.
        </p>
      </motion.div>

      {/* Modern Search Bar - Sharp & Balanced */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-full max-w-5xl bg-white/[0.02] backdrop-blur-2xl p-2 rounded-2xl md:rounded-full border border-white/5 flex flex-col md:flex-row gap-2 relative z-10 shadow-2xl"
      >
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
          <div className="flex items-center gap-4 px-6 md:border-r border-white/5 py-3">
            <MapPin className="text-primary w-5 h-5 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold uppercase text-white/40 tracking-widest">Location</span>
              <input type="text" placeholder="Search City..." className="bg-transparent text-white focus:outline-none font-semibold text-sm truncate placeholder:text-white/20" />
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 md:border-r border-white/5 py-3">
            <DollarSign className="text-primary w-5 h-5 shrink-0" />
            <div className="flex flex-col w-full">
              <span className="text-xs font-semibold uppercase text-white/40 tracking-widest">Budget</span>
              <select className="bg-transparent text-white focus:outline-none font-semibold text-sm appearance-none cursor-pointer w-full">
                <option className="bg-black">₹1Cr - ₹5Cr</option>
                <option className="bg-black">₹5Cr - ₹20Cr</option>
                <option className="bg-black">₹20Cr+</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-3">
            <Building className="text-primary w-5 h-5 shrink-0" />
            <div className="flex flex-col w-full">
              <span className="text-xs font-semibold uppercase text-white/40 tracking-widest">Category</span>
              <select className="bg-transparent text-white focus:outline-none font-semibold text-sm appearance-none cursor-pointer w-full">
                <option className="bg-black">Luxury Villa</option>
                <option className="bg-black">Sky Apartment</option>
                <option className="bg-black">Commercial</option>
              </select>
            </div>
          </div>
        </div>
        <Link href="/realestate/properties" className="md:ml-auto">
          <Button size="lg" className="w-full md:w-auto h-full px-10 rounded-xl md:rounded-full bg-white text-black hover:bg-white/90 transition-all font-semibold text-sm tracking-wide py-4 md:py-0">
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
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
             <span className="text-primary font-semibold uppercase tracking-widest text-xs mb-4 block">The Collection</span>
             <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Modern Estates</h2>
             <p className="text-lg text-white/60 font-medium max-w-sm">Exceptional listings verified by our world-class audit team.</p>
          </div>
          <Link href="/realestate/properties">
            <Button variant="ghost" className="text-white hover:text-primary font-semibold text-sm tracking-wide group">
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
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 border border-white/5 bg-white/[0.02]">
                <img src={prop.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-6 left-6 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white/80 text-xs font-semibold uppercase rounded-md tracking-wider border border-white/10">
                  {prop.type}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-2 text-white font-bold text-2xl mb-2 tracking-tight">
                    ₹{(prop.price / 10000000).toFixed(1)} <span className="text-sm font-semibold opacity-70">Cr</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight tracking-tight">{prop.title}</h3>
                  <div className="flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-widest">
                    <MapPin size={14} className="text-primary" /> {prop.location}
                  </div>
                </div>
              </div>
              <Link href={`/realestate/property/${prop.id}`}>
                <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black font-semibold text-sm transition-all gap-2">
                  Asset Intelligence <ArrowRight size={16} />
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
  <section className="py-24 md:py-32 bg-white/[0.02] border-y border-white/5">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-6 block">Live Data Matrix</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Market Pulse</h2>
          <p className="text-lg text-white/60 font-medium leading-relaxed mb-10 max-w-md">
            Our proprietary algorithm provides you with real-time analytics on asset appreciation and rental yields.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">12.4%</p>
              <p className="text-xs font-semibold uppercase text-white/40 tracking-widest">Appreciation</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">₹4.2Cr</p>
              <p className="text-xs font-semibold uppercase text-white/40 tracking-widest">Median Value</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-12 aspect-square flex flex-col items-center justify-center relative overflow-hidden group rounded-3xl shadow-2xl">
           <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary/10 to-transparent" />
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-[2px] h-24 md:h-32 bg-primary/40 rounded-full mb-6 animate-pulse" />
              <p className="text-6xl md:text-8xl font-bold text-white group-hover:scale-105 transition-transform duration-500 leading-none">98%</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mt-4">Retention Rate</p>
           </div>
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
        <div className="max-w-5xl mx-auto bg-white/[0.02] border border-white/5 rounded-3xl text-center py-16 md:py-24 px-8 relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">Secure Your Legacy</h2>
          <Link href="/realestate/properties">
            <Button size="lg" className="h-14 px-10 rounded-xl font-semibold bg-white text-black hover:bg-white/90 transition-all tracking-wide shadow-xl shadow-white/5">
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
