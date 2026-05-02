"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00b894]/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* GrowXLabsTech Custom Loader */}
        <div className="relative w-24 h-24 mb-12">
          {/* Rotating outer rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-[#00b894]/30 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-t-2 border-l-2 border-[#00b894] rounded-full"
          />

          {/* Pulsing center dot */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[38%] bg-[#00b894] rounded-sm rotate-45 shadow-[0_0_20px_rgba(0,184,148,0.5)]"
          />
        </div>

        {/* Text Loading State */}
        <div className="space-y-4 text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-xs font-black uppercase tracking-[0.4em] italic"
          >
            Synchronizing Matrix
          </motion.h3>

          {/* Skeleton-like progress bar */}
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#00b894] to-transparent"
            />
          </div>
        </div>

        {/* Floating Technical HUD elements (Static/Subtle) */}
        <div className="mt-20 grid grid-cols-3 gap-8 opacity-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-1 w-12 bg-white/40 rounded-full" />
              <div className="h-1 w-8 bg-white/20 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Background HUD numbers */}
      <div className="absolute top-10 left-10 font-mono text-[10px] text-white/5 space-y-1 select-none pointer-events-none">
        <p>GROWXLABSTECH_v2.0.4</p>
        <p>SYSTEM_ID: GX-9921</p>
        <p>ENCRYPTION: ACTIVE</p>
      </div>
    </div>
  );
}
