"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      <div className="relative z-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Large 404 */}
          <h1 className="text-[140px] md:text-[180px] font-black text-[#E8E6E1] tracking-tighter leading-none select-none mb-0">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-4 -mt-6">
            Page not found
          </h2>

          <p className="text-[16px] text-[#6B7280] leading-relaxed mb-10 max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full bg-[#355CFF] text-white hover:bg-[#2A4AD4] font-semibold text-[15px] transition-all shadow-none"
              >
                <Home className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full border-[#E8E6E1] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-semibold text-[15px] transition-all"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
