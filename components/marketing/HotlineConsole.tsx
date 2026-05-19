"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, MessageSquare, Calendar, ShieldCheck, Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "@/navigation";

export function HotlineConsole() {
  // Keyframes for the ringing vibration effect
  const ringTransition = {
    duration: 0.15,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  };

  const ringVariants = {
    idle: { rotate: 0, scale: 1 },
    hover: { 
      rotate: [0, -3, 3, -3, 3, 0],
      scale: 1.05,
      transition: {
        rotate: ringTransition,
        scale: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 px-4">
      {/* Outer Console Case with architectural Swiss lines */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        className="relative rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-6 sm:p-8 shadow-[0_24px_50px_rgba(26,26,26,0.06)] overflow-hidden group transition-shadow hover:shadow-[0_30px_60px_rgba(53,92,255,0.08)]"
      >
        {/* Decorative Grid Mesh Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,26,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {/* Top Status Header */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E2DC]/80 pb-6 mb-8 text-left">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
            </span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#355CFF]">Direct Studio Connect</p>
              <h3 className="text-[15px] font-bold text-[#1A1A1A] tracking-tight mt-0.5">LINE OPEN & ACTIVE NOW</h3>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E2DC] bg-[#FAF9F6] px-3.5 py-1 text-[12px] font-semibold text-[#6B7280]">
            <Sparkles className="w-3.5 h-3.5 text-[#355CFF] animate-pulse" />
            <span>Average response: <span className="font-bold text-[#1A1A1A]">4 mins</span></span>
          </div>
        </div>

        {/* Central Graphic Section: The telephone container */}
        <div className="relative flex flex-col items-center justify-center py-6">
          {/* Subtle Technical Label Overlays */}
          <div className="absolute top-2 left-2 text-[10px] font-mono text-[#6B7280] tracking-widest hidden sm:block">
            SYS_STATUS // SECURE_HOTLINE
          </div>
          <div className="absolute top-2 right-2 text-[10px] font-mono text-[#6B7280] tracking-widest hidden sm:block">
            GL-X_PRTCL // PORT: 009
          </div>

          {/* Interactive Telephone Graphic with multi-layered glow and hover triggers */}
          <div className="relative cursor-pointer group-hover:scale-105 transition-transform duration-500">
            {/* Pulsing Backglow Aura */}
            <div className="absolute inset-0 bg-[#355CFF]/5 rounded-full filter blur-2xl group-hover:bg-[#355CFF]/10 transition-colors duration-500" />
            
            {/* Beautiful Framer-Motion Animated Phone */}
            <motion.div
              variants={ringVariants}
              initial="idle"
              whileHover="hover"
              className="relative z-10 w-[240px] sm:w-[280px] h-[220px] sm:h-[260px] flex items-center justify-center select-none"
            >
              <Image
                src="/images/cta-phone.png"
                alt="GrowXLabsTech premium hotline connection"
                width={280}
                height={260}
                className="object-contain pointer-events-none select-none"
                style={{ mixBlendMode: "multiply" }}
                priority
              />
            </motion.div>

            {/* Glowing Ring Ripple Animation under the phone */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-[#1A1A1A]/10 rounded-full filter blur-sm group-hover:bg-[#355CFF]/20 transition-all duration-500" />
          </div>

          <div className="mt-8 text-center">
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#6B7280] uppercase">hover device to ring hotline</span>
          </div>
        </div>

        {/* Bottom Swiss Grid Action Panel */}
        <div className="relative mt-8 pt-6 border-t border-[#E5E2DC]/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href="/contact"
            className="group/btn flex items-center justify-between rounded-xl border border-[#E5E2DC] bg-[#FAF9F6] p-4 text-left hover:border-[#355CFF] hover:bg-white transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#355CFF]/5 text-[#355CFF] flex items-center justify-center group-hover/btn:bg-[#355CFF] group-hover/btn:text-white transition-all duration-300">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[13px] font-black tracking-tight text-[#1A1A1A]">Text via WhatsApp</p>
                <p className="text-[11px] text-[#6B7280]">Instant dispatch to engineer</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#6B7280] group-hover/btn:text-[#355CFF] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
          </Link>

          <Link 
            href="/contact"
            className="group/btn flex items-center justify-between rounded-xl border border-[#E5E2DC] bg-[#FAF9F6] p-4 text-left hover:border-[#355CFF] hover:bg-white transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#355CFF]/5 text-[#355CFF] flex items-center justify-center group-hover/btn:bg-[#355CFF] group-hover/btn:text-white transition-all duration-300">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[13px] font-black tracking-tight text-[#1A1A1A]">Calendar Schedule</p>
                <p className="text-[11px] text-[#6B7280]">Book detailed digital strategy</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#6B7280] group-hover/btn:text-[#355CFF] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
          </Link>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Encrypted connection. Zero third-party tracking.</span>
        </div>
      </motion.div>
    </div>
  );
}
