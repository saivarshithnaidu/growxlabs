"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft, Zap, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Cinematic Perspective Grid */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 10%, transparent 100%)',
          perspective: '1000px',
          transform: 'rotateX(50deg) translateY(-20%)',
        }}
      />

      {/* Kinetic Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            y: [-10, 10, -10],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/20 blur-[180px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            y: [10, -10, 10],
            opacity: [0.05, 0.2, 0.05],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full" 
        />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        <div className="relative inline-block">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           >
              <div className="flex items-center justify-center gap-6 mb-8">
                 <div className="h-[1px] w-12 bg-primary/40 md:w-24" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">System Signal Lost</span>
                 <div className="h-[1px] w-12 bg-primary/40 md:w-24" />
              </div>
              <h1 className="text-[10rem] md:text-[16rem] font-black text-white tracking-tighter leading-[0.8] italic select-none opacity-5 absolute -top-[50px] md:-top-[100px] left-1/2 -translate-x-1/2">404</h1>
              <h2 className="text-5xl md:text-8xl lg:text-[9rem] font-black text-white tracking-tighter leading-[0.9] italic relative z-20">
                 PHANTOM <br/>
                 <span className="text-primary">SECTOR.</span>
              </h2>
           </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          <p className="text-lg md:text-xl text-white/40 max-w-xl mx-auto font-medium tracking-tight leading-relaxed">
            The data coordinates you requested do not exist in the current GrowXLabsTech intelligence matrix. 
            The path has been redacted or never initialized.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-black font-black hover:bg-primary hover:text-white transition-all shadow-2xl group">
                <Home className="mr-3 w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                INITIALIZE NAVIGATION
              </Button>
            </Link>
            <Button 
              onClick={() => window.history.back()}
              variant="outline" 
              size="lg" 
              className="h-16 px-12 rounded-2xl border-white/10 text-white/60 hover:text-white font-black hover:bg-white/5 group"
            >
              <ArrowLeft className="mr-3 w-5 h-5 group-hover:-translate-x-2 transition-transform" /> 
              GO BACK
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Floating Status bars */}
      <div className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-2 opacity-20">
         {[70, 45, 90].map((w, i) => (
           <div key={i} className="h-1 bg-white/40 rounded-full overflow-hidden w-40">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
                className="h-full bg-white w-20"
              />
           </div>
         ))}
         <p className="text-[8px] font-black uppercase tracking-widest text-white mt-2">Searching Matrix...</p>
      </div>
    </div>
  );
}
