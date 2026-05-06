"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Target, Lightbulb } from "lucide-react";
import React from "react";

export function AboutContent() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B]">Our Story</span>
            <h1 className="text-[clamp(32px,6vw,56px)] font-bold text-white mt-4 mb-8 tracking-tight leading-[1.1]">
              Engineering Digital <br />
              <span className="text-gradient">Growth. Globally.</span>
            </h1>
            <div className="space-y-6 text-[18px] text-[#A0A0A0] leading-[1.7]">
              <p>
                GrowXLabsTech is a premier AI-native systems engineering firm headquartered in Guntur, Andhra Pradesh, India. We specialize in architecting high-performance digital ecosystems for businesses that demand engineering precision and global scalability.
              </p>
              <p>
                Our mission is to bridge the gap between complex AI technology and real-world business growth. We serve as a strategic technology partner for enterprises across India, the USA, UK, Australia, UAE, Canada, and Singapore.
              </p>
              <p>
                From building intelligent automation workflows to deploying full-stack digital systems, we ensure every solution we ship is battle-tested, secure, and built to lead in the global market.
              </p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {[
              { label: "Global Presence", value: "6+ Countries" },
              { label: "Platform Users", value: "500+" },
              { label: "AI Products", value: "3" },
              { label: "Client Satisfaction", value: "100%" }
            ].map((stat, i) => (
              <div key={i} className="rounded-2x- p-10 text-center border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] shadow-xl backdrop-blur-sm transition-transform hover:scale-[1.02]">
                <div className="text-[clamp(32px,4vw,42px)] font-black text-white mb-2">{stat.value}</div>
                <div className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
          <Card className="p-12 space-y-6 rounded-2xl border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-md">
            <div className="w-14 h-14 bg-[#00A86B]/10 rounded-2xl flex items-center justify-center">
              <Target className="text-[#00A86B]" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-[#A0A0A0] text-[16px] leading-[1.8] font-medium">
              To deliver elite-tier digital infrastructure to businesses worldwide through AI-native development and autonomous engineering. We strive to make digital transformation faster, smarter, and more accessible for the next generation of global industry leaders.
            </p>
          </Card>
          <Card className="p-12 space-y-6 rounded-2xl border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-md">
            <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center">
              <Lightbulb className="text-purple-500" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            <p className="text-[#A0A0A0] text-[16px] leading-[1.8] font-medium">
              To become the global standard for AI first digital agencies. where every website ships faster,
              every automation runs smarter, and every client grows measurably.
            </p>
          </Card>
        </div>

        {/* Founder Section */}
        <div className="text-center mb-32">
          <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">Leadership</span>
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-20 tracking-tight">Founding Engineers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Varshith */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-10 text-left space-y-8 transition-all duration-300 hover:border-[rgba(0,168,107,0.3)] shadow-2xl backdrop-blur-sm group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black text-white italic">VP</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Sai Varshith Pujala</h3>
                <p className="text-[#00A86B] font-black text-[10px] uppercase tracking-[0.3em] mt-3">Founder & Principal Systems Engineer</p>
              </div>
              <p className="text-[#A0A0A0] leading-[1.8] text-[16px] font-medium">
                Founder and Lead Systems Architect. Sai specializes in full-stack AI engineering, high-performance architecture, and building digital systems that scale across global markets.
              </p>
              <a href="https://linkedin.com/in/sai-varshith-pujala" target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-[#00A86B] transition-colors">
                LinkedIn →
              </a>
            </div>

            {/* Akhilesh */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-10 text-left space-y-8 transition-all duration-300 hover:border-[rgba(0,168,107,0.3)] shadow-2xl backdrop-blur-sm group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600/30 to-blue-600/30 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black text-white italic">AK</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Lakshmi Akhilesh Pasupuleti</h3>
                <p className="text-[#00A86B] font-black text-[10px] uppercase tracking-[0.3em] mt-3">Co-Founder & Automation Architect</p>
              </div>
              <p className="text-[#A0A0A0] leading-[1.8] text-[16px] font-medium">
                Co-Founder and Automation Architect. Akhilesh masters the art of autonomous business logic, connecting complex systems into unified, AI-driven engines for efficiency and growth.
              </p>
              <a href="https://linkedin.com/in/akhilesh-pasupuleti" target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-[#00A86B] transition-colors">
                LinkedIn →
              </a>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="max-w-4xl mx-auto p-16 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-center shadow-2xl backdrop-blur-sm">
          <p className="text-[11px] font-black text-[#A0A0A0] uppercase tracking-[0.4em] mb-6">Global Operations</p>
          <h3 className="text-3xl font-black text-white mb-6 italic tracking-tighter">GrowXLabsTech</h3>
          <div className="flex flex-col items-center gap-3">
            <p className="text-white font-bold text-lg tracking-wide uppercase">Serving India · USA · UK · Australia · UAE · Canada · Singapore</p>
            <p className="text-[#A0A0A0] text-base font-medium italic">Available Across All Timezones</p>
          </div>
        </div>
      </div>
    </div>
  );
}
