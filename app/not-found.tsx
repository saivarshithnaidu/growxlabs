"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-black">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden relative font-sans">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.05]" 
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-[120px] md:text-[200px] font-black text-white/5 tracking-tighter leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                404
              </h1>
              
              <div className="relative">
                <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6">
                  Unknown <span className="text-[#00b894]">Territory.</span>
                </h2>
                <p className="text-white/50 text-lg mb-10 max-w-md mx-auto leading-relaxed font-medium">
                  The coordinates you've accessed are outside the mapped GrowXLabsTech network. 
                </p>
                
                <a 
                  href="/"
                  className="inline-flex items-center gap-3 bg-[#00b894] hover:bg-[#00b894]/90 text-white px-10 py-4 rounded-2xl font-black italic tracking-widest transition-all hover:scale-105 shadow-[0_10px_40px_rgba(0,184,148,0.2)]"
                >
                  <Home className="w-5 h-5" />
                  RETURN TO BASE
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute top-10 right-10 opacity-20 hidden md:block">
            <div className="w-32 h-32 border border-dashed border-[#00b894] rounded-full animate-spin-slow" />
          </div>
        </div>

        <style jsx global>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
        `}</style>
      </body>
    </html>
  );
}
