"use client";

import { MessageCircle, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

// --- DESIGN SYSTEM TOKENS ---
export const COLORS = {
  bg: "#09090B",
  card: "#18181B",
  cardHover: "#1F1F23",
  textPrimary: "#FAFAFA",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  border: "rgba(255,255,255,0.06)",
};

const NAVBAR_LINKS = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

export function DemoNavbar({ brand, accent = "#6C63FF" }: { brand: string; accent?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-[#09090B]/70 backdrop-blur-2xl border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: accent, boxShadow: `0 8px 24px ${accent}30` }}
          >
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white">{brand}</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAVBAR_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              {link.name}
            </a>
          ))}
          <Button
            className="ml-4 h-10 px-6 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90 transition-opacity"
            style={{ backgroundColor: accent }}
          >
            Book Now
          </Button>
        </div>

        <button
          className="md:hidden text-white p-2 -mr-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#09090B] border-b border-white/5"
          >
            <div className="p-6 space-y-2">
              {NAVBAR_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-zinc-400 hover:text-white py-3 px-4 rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <Button
                className="w-full h-12 text-white text-sm font-semibold rounded-xl mt-4"
                style={{ backgroundColor: accent }}
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function DemoFooter({ brand, accent = "#6C63FF" }: { brand: string; accent?: string }) {
  return (
    <footer className="py-16 sm:py-20 px-4 sm:px-6 border-t border-white/[0.04] bg-[#09090B]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: accent }}
              >
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">{brand}</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Premium experiences, crafted with care. Built by GrowXLabsTech.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {["Home", "About Us", "Gallery", "Contact"].map((t) => (
                <a key={t} href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  {t}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
              Contact
            </h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-500">
              <p>Hyderabad, India</p>
              <p>hello@growxlabs.tech</p>
              <p>+91 00000 00000</p>
            </div>
          </div>

          {/* Badge */}
          <div className="space-y-4 sm:text-right lg:text-right">
            <div
              className="inline-block text-[10px] font-semibold uppercase tracking-wider py-2 px-4 rounded-full border border-white/[0.06]"
              style={{ color: `${accent}99` }}
            >
              A GrowXLabsTech Demo
            </div>
            <p className="text-xs text-zinc-600">© 2026 {brand}. All rights reserved.</p>
          </div>
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
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-[120] h-14 w-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/30 cursor-pointer"
    >
      <MessageCircle size={26} />
    </motion.a>
  );
}

export function DemoBadge() {
  return (
    <div className="fixed bottom-6 left-6 z-[120] no-print">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-zinc-900/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/[0.06] flex items-center gap-2.5"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-medium tracking-wide text-zinc-500">
          Live Demo · GrowXLabsTech
        </span>
      </motion.div>
    </div>
  );
}
