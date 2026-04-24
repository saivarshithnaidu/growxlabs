"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link } from '@/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Critical System Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden relative font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00b894]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 mb-8 relative">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl bg-red-500/10 blur-xl"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 italic uppercase">
            System <span className="text-[#00b894]">Crash.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 font-medium leading-relaxed mb-10 max-w-md mx-auto">
            An unexpected error has disrupted the GrowX Labs intelligence matrix. Our systems are currently recalibrating.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => reset()}
              size="lg"
              className="h-14 px-8 rounded-2xl bg-[#00b894] text-white font-bold hover:bg-[#00b894]/90 transition-all group"
            >
              <RefreshCcw className="mr-2 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              RETRY CONNECTION
            </Button>
            
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold"
              >
                <Home className="mr-2 w-5 h-5" />
                BACK TO CORE
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Error Code/Digest - Technical Detail */}
        {error.digest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="mt-12 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
          >
            <p className="text-[10px] font-mono text-white/60 tracking-widest uppercase">
              Error Hash: {error.digest}
            </p>
          </motion.div>
        )}
      </div>

      {/* Decorative Matrix Elements */}
      <div className="absolute bottom-10 left-10 opacity-10 hidden md:block">
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-0.5 w-32 bg-white rounded-full overflow-hidden">
               <motion.div 
                 animate={{ x: ['-100%', '200%'] }}
                 transition={{ duration: 1.5 + i, repeat: Infinity, ease: "linear" }}
                 className="h-full bg-red-500 w-10"
               />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
