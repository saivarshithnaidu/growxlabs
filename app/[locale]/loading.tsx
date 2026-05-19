"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div className="relative z-10 flex flex-col items-center">
        {/* Clean Spinner */}
        <div className="relative w-16 h-16 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-[3px] border-[#E8E6E1] border-t-[#355CFF] rounded-full"
          />
        </div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#9CA3AF] text-[14px] font-medium"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
