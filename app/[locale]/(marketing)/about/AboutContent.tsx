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
                GrowXLabsTech is a global AI native digital agency founded by engineers with one belief: most businesses are losing customers online because their technology hasn't caught up with their ambition.
              </p>
              <p>
                We bridge that gap. We build AI powered websites, intelligent automation, and full stack products for businesses in USA, UK, Australia, UAE, Canada, and globally.
              </p>
              <p>
                We don't just build for clients. We build and operate our own products — ResumeForgeAI, UniversalAI, and RecruitAI — serving 500+ real users every day.
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
              To deliver enterprise grade digital infrastructure to businesses worldwide through AI powered development
              and intelligent automation. faster, smarter, and more affordably than anyone else.
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
                <h3 className="text-3xl font-bold text-white tracking-tight">Varshith Pujala</h3>
                <p className="text-[#00A86B] font-black text-[10px] uppercase tracking-[0.3em] mt-3">Co Founder & Full Stack Engineer</p>
              </div>
              <p className="text-[#A0A0A0] leading-[1.8] text-[16px] font-medium">
                Builder of ResumeForgeAI. a live AI career platform serving 500 plus users.
                Specializes in Next.js, TypeScript, AI API integrations, and scalable SaaS architecture.
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
                <h3 className="text-3xl font-bold text-white tracking-tight">Akhilesh</h3>
                <p className="text-[#00A86B] font-black text-[10px] uppercase tracking-[0.3em] mt-3">Co Founder & Automation Engineer</p>
              </div>
              <p className="text-[#A0A0A0] leading-[1.8] text-[16px] font-medium">
                n8n automation specialist building enterprise workflow systems. Expert in connecting business tools
                and deploying scalable automation infrastructure.
              </p>
              <a href="https://linkedin.com/in/akhilesh" target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-[#00A86B] transition-colors">
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
