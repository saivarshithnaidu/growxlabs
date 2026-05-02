"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, CheckCircle } from "lucide-react";
import React from "react";

export function PrivacyContent() {
  const points = [
    { title: "Data Collection", desc: "We only collect essential data: Contact details, project specifications, payment info, and usage analytics.", icon: Eye },
    { title: "Zero Data Sale", desc: "GrowXLabsTech will NEVER sell your data to third parties. We value your privacy as a fundamental engineering principle.", icon: Shield },
    { title: "Storage & Security", desc: "All data is stored on Supabase using enterprise-grade encryption and secure access protocols.", icon: Lock },
    { title: "Your Rights", desc: "You have full rights to access, correct, or request deletion of your data at any time.", icon: CheckCircle }
  ];

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h1 className="text-[clamp(40px,7vw,72px)] font-black text-white tracking-tighter mb-8 text-center leading-[1.1]">
            Privacy <span className="text-gradient">Policy.</span>
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed text-center max-w-2xl mx-auto">
            How we protect your digital identity and project intelligence within the GrowXLabsTech ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-3xl border-white/5 space-y-4"
            >
              <p.icon className="h-8 w-8 text-white mb-2" />
              <h3 className="text-xl font-bold text-white tracking-tight">{p.title}</h3>
              <p className="text-white/40 font-light leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <section className="glass p-12 rounded-[2rem] border-white/5 mb-20 max-w-4xl mx-auto shadow-2xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Retention Standards</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <span className="text-white/60 font-bold text-lg">Project Intelligence</span>
              <span className="text-white font-black text-xl">3 Years</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <span className="text-white/60 font-bold text-lg">Enquiry & Metadata</span>
              <span className="text-white font-black text-xl">1 Year</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <span className="text-white/60 font-bold text-lg">Payment Logs</span>
              <span className="text-white font-black text-xl">7 Years</span>
            </div>
          </div>
        </section>

        <div className="text-center">
          <p className="text-white/40 text-xl mb-6">Questions regarding your data?</p>
          <a href="mailto:hello@growxlabs.tech" className="text-3xl font-black text-white hover:text-primary transition-all hover:scale-105 inline-block">
            hello@growxlabs.tech
          </a>
        </div>
      </div>
    </div>
  );
}
