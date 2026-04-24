"use client";

import { motion } from "framer-motion";
import { X, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

interface CheckoutModalProps {
  courseId: string;
  courseTitle: string;
  price: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: { phone: string; city: string }) => void;
  isLoading: boolean;
  userEmail: string;
  userName: string;
}

export function CheckoutModal({
  courseId,
  courseTitle,
  price,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  userEmail,
  userName,
}: CheckoutModalProps) {
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-[#080808] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-10 md:p-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Secure Checkout</span>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tighter">
            Billing Details
          </h3>
          <p className="text-[#A0A0A0] text-lg font-medium mb-10 leading-relaxed">
            Please provide your contact information to proceed with the enrollment for <span className="text-white italic">{courseTitle}</span>.
          </p>

          <div className="space-y-6 mb-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Full Name</label>
              <div className="relative">
                <Input
                  value={userName}
                  disabled
                  className="bg-white/[0.03] border-white/5 rounded-2xl h-14 pl-6 text-white/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Email Address</label>
              <div className="relative">
                <Input
                  value={userEmail}
                  disabled
                  className="bg-white/[0.03] border-white/5 rounded-2xl h-14 pl-6 text-white/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Phone Number</label>
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/[0.05] border-primary/20 focus:border-primary/50 rounded-2xl h-14 pl-6 text-white placeholder:text-white/10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">City</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Your City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-white/[0.05] border-primary/20 focus:border-primary/50 rounded-2xl h-14 pl-6 text-white placeholder:text-white/10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 mb-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Total Investment</p>
                <p className="text-3xl font-black text-white">₹{price.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Guaranteed Secure</p>
                <div className="flex items-center gap-2 justify-end">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-white/50 text-[10px] font-bold uppercase">SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            disabled={isLoading || !phone || !city}
            onClick={() => onConfirm({ phone, city })}
            className="w-full h-16 rounded-[20px] bg-primary text-white hover:bg-white hover:text-black font-black uppercase text-xs tracking-[0.3em] transition-all duration-500 shadow-xl shadow-primary/10"
          >
            {isLoading ? "Initiating Secure Payment..." : "Proceed to Payment"}
          </Button>
          
          <p className="text-center mt-6 text-white/20 text-[10px] font-bold uppercase tracking-widest">
            By proceeding, you agree to our terms of service
          </p>
        </div>
      </motion.div>
    </div>
  );
}
