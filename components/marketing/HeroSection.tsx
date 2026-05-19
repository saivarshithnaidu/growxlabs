"use client";

import { motion } from "framer-motion";

/**
 * Minimal home hero: studio line + brand only.
 * Lead copy, CTAs, and Growth Console live in `LeadEngineSection`.
 */
export function HeroSection() {
  return (
    <section
      className="w-full relative overflow-hidden px-6 md:px-10 xl:px-16 2xl:px-24 pt-24 sm:pt-28 pb-16 md:pb-20 min-h-[min(88dvh,920px)] flex flex-col items-center justify-center text-center"
      aria-labelledby="hero-studio-heading"
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <h1
            id="hero-studio-heading"
            className="font-black tracking-tight text-[#1A1A1A] leading-[0.95] flex flex-col items-center gap-6 sm:gap-8"
          >
            <span className="block text-[clamp(0.875rem,2.4vw,1.35rem)] uppercase tracking-[0.2em] sm:tracking-[0.26em] text-balance text-[#1A1A1A] max-w-[30ch] order-1">
              AI-native product studio
            </span>
            <span className="block text-[clamp(2.5rem,14vw,8.5rem)] tracking-[-0.04em] sm:whitespace-nowrap leading-none text-[#1A1A1A] order-2">
              GROWXLABSTECH
            </span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
