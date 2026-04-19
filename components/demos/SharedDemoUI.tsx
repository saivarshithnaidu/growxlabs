"use client";

import { MessageCircle, Menu, X, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// --- GLOBAL DESIGN SYSTEM TOKENS ---
export const COLORS = {
  bg: "#0B0F1A",
  card: "#111827",
  textPrimary: "#DFE5F3",
  textSecondary: "#9CA3AF",
  accent: "#6C63FF",
  border: "rgba(255,255,255,0.08)"
};

export const SPACING = {
  section: "py-20 px-6",
  container: "max-w-7xl mx-auto",
  card: "p-8",
  gap: "gap-8",
  marginSection: "mt-20"
};

const NAVBAR_LINKS = [
  { name: "Home", href: "#" },
  { name: "Services", href: "#" },
  { name: "Portfolio", href: "#" },
  { name: "Contact", href: "#" }
];

export function DemoNavbar({ brand }: { brand: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="h-10 w-10 bg-[#6C63FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/20">
              <Rocket size={20} className="text-white" />
           </div>
           <span className="font-black text-xl italic tracking-tighter text-[#DFE5F3]">{brand}</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
           {NAVBAR_LINKS.map(link => (
             <a key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] hover:text-[#DFE5F3] transition-colors">{link.name}</a>
           ))}
           <Button className="h-11 px-8 rounded-xl bg-[#6C63FF] text-white font-black uppercase text-[10px] tracking-widest border-none hover:opacity-90">Get Started</Button>
        </div>

        <button className="md:hidden text-[#DFE5F3]" onClick={() => setIsOpen(!isOpen)}>
           {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0B0F1A] border-b border-white/5 p-6 space-y-6 flex flex-col items-center">
           {NAVBAR_LINKS.map(link => (
             <a key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">{link.name}</a>
           ))}
           <Button className="w-full h-12 bg-[#6C63FF] text-white font-black uppercase text-[10px] tracking-widest rounded-xl">Get Started</Button>
        </div>
      )}
    </nav>
  );
}

export function DemoFooter({ brand }: { brand: string }) {
  return (
    <footer className="py-20 px-6 border-t border-white/[0.08] bg-[#0B0F1A]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1 space-y-6">
           <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#6C63FF] rounded-lg flex items-center justify-center">
                 <Rocket size={16} className="text-white" />
              </div>
              <span className="font-black text-lg italic text-[#DFE5F3]">{brand}</span>
           </div>
           <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Engineering premium digital infrastructure and high-performance assets globally from Hyderabad.
           </p>
        </div>
        
        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C63FF]">Solutions</h4>
           <div className="flex flex-col gap-4 text-xs font-bold text-[#9CA3AF]">
              <p className="hover:text-[#DFE5F3] cursor-pointer">AI Web Engineering</p>
              <p className="hover:text-[#DFE5F3] cursor-pointer">n8n Automations</p>
              <p className="hover:text-[#DFE5F3] cursor-pointer">Asset Deployment</p>
           </div>
        </div>

        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C63FF]">Intelligence</h4>
           <div className="flex flex-col gap-4 text-xs font-bold text-[#9CA3AF]">
              <p>Financial District, Hyd</p>
              <p>hello@growxlabs.tech</p>
           </div>
        </div>

        <div className="space-y-6 flex flex-col justify-between items-end">
           <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]/20 border border-white/5 py-2 px-4 rounded-full italic">A GrowX Asset</div>
           <p className="text-[10px] font-black text-[#9CA3AF]/40 uppercase tracking-widest italic">© 2026 {brand}</p>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp({ phone }: { phone: string }) {
  return (
    <motion.a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-[120] h-16 w-16 bg-[#6C63FF] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#6C63FF]/40 cursor-pointer"
    >
      <MessageCircle size={32} />
    </motion.a>
  );
}

export function DemoBadge() {
  return (
    <div className="fixed bottom-8 left-8 z-[120] no-print">
      <div className="bg-[#111827]/80 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/5 flex items-center gap-3 overflow-hidden group">
        <div className="h-2 w-2 rounded-full bg-[#6C63FF] animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DFE5F3]/40 group-hover:text-[#DFE5F3] transition-colors">Digital Infrastructure Demo</span>
      </div>
    </div>
  );
}
