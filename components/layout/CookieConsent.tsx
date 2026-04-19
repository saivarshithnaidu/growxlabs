"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("growx_cookie_consent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("growx_cookie_consent", "accepted");
    setIsVisible(false);
    // Dispatch a custom event to notify analytics scripts
    window.dispatchEvent(new Event("growx_consent_accepted"));
  };

  const handleReject = () => {
    localStorage.setItem("growx_cookie_consent", "rejected");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[1000] p-6 lg:p-10 pointer-events-none"
        >
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="w-full lg:w-auto glass-card border border-white/10 p-6 lg:p-8 rounded-[32px] flex flex-col lg:flex-row items-center gap-8 pointer-events-auto shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-white/5">
                  <ShieldCheck className="text-black h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white leading-tight">Cookie Consent</p>
                  <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                    We use cookies to improve your experience, analyze traffic, and personalize content. 
                    <Link href="/privacy" className="text-white/60 hover:text-white underline ml-1 font-medium">Learn more</Link>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto">
                <button 
                  onClick={handleReject}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  Reject
                </button>
                <Button 
                  onClick={handleAccept}
                  className="bg-white text-black hover:bg-neutral-200 px-8 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest flex-1 lg:flex-none shadow-xl shadow-white/5"
                >
                  Accept All <ChevronRight size={14} className="ml-2" />
                </Button>
                <button 
                  onClick={handleReject}
                  className="p-3 text-white/20 hover:text-white transition-colors lg:ml-2"
                  aria-label="Close"
                >
                   <X size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
