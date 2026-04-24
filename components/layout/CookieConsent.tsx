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
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[1000] pointer-events-none"
        >
          <div className="w-full sm:w-[400px] glass-card border border-white/10 p-5 rounded-[24px] pointer-events-auto shadow-2xl backdrop-blur-xl bg-black/40">
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-black h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white leading-tight">Privacy Preferences</p>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    We use cookies to optimize your experience and analyze traffic. 
                    <Link href="/privacy" className="text-[#00A86B] hover:underline ml-1 font-medium">Policy</Link>
                  </p>
                </div>
                <button 
                  onClick={handleReject}
                  className="p-1 text-white/20 hover:text-white transition-colors"
                  aria-label="Close"
                >
                   <X size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleReject}
                  className="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white border border-white/5 rounded-xl transition-colors"
                >
                  Decline
                </button>
                <Button 
                  onClick={handleAccept}
                  className="flex-1 bg-white text-black hover:bg-neutral-200 h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
