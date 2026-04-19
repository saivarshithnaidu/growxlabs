"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Users, Target, Rocket, Lightbulb, Globe, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Story</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-8 tracking-tighter">
              Engineering Digital <br />
              <span className="text-gradient">Growth. Globally.</span>
            </h1>
            <div className="space-y-6 text-lg text-white/60 leading-relaxed font-medium">
              <p>
                GrowX Labs was built on a simple conviction: the gap between enterprise-level digital infrastructure 
                and what most businesses actually have is a massive, unnecessary problem.
              </p>
              <p>
                We fix that. We build AI-powered websites, intelligent automation systems, and full-stack digital products 
                that turn online presence into measurable revenue — for clients across the globe.
              </p>
              <p>
                What makes us different: we don't just build for clients. We build and operate our own live products 
                — <strong>ResumeForgeAI</strong>, <strong>UniversalAI</strong>, and <strong>RecruitAI</strong> 
                — serving real users every day. Every client solution is battle-tested on our own stack.
              </p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
             {[
               { label: "Live AI Products", value: "3" },
               { label: "Platform Users Globally", value: "500+" },
               { label: "Expert Founders", value: "2" },
               { label: "Client Satisfaction", value: "100%" }
             ].map((stat, i) => (
               <div key={i} className="glass rounded-3xl p-8 text-center border border-white/5 bg-white/[0.02]">
                 <div className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                 <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          <Card className="p-12 space-y-6 border-white/5 bg-white/[0.02] rounded-[2.5rem]">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Target className="text-primary" size={28} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Our Mission</h3>
            <p className="text-white/40 text-lg leading-relaxed font-medium">
              To deliver enterprise-grade digital infrastructure to businesses worldwide through AI-powered development 
              and intelligent automation — faster, smarter, and more affordably than anyone else.
            </p>
          </Card>
          <Card className="p-12 space-y-6 border-white/5 bg-white/[0.02] rounded-[2.5rem]">
            <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center">
              <Lightbulb className="text-purple-600" size={28} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Our Vision</h3>
            <p className="text-white/40 text-lg leading-relaxed font-medium">
              To become the global standard for AI-first digital agencies — where every website ships faster, 
              every automation runs smarter, and every client grows measurably.
            </p>
          </Card>
        </div>

        {/* Founder Section */}
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-20 tracking-tighter">Founding Engineers</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Varshith */}
            <div className="text-left space-y-8 group">
              <div className="aspect-[4/5] glass rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 relative border border-white/5 shadow-2xl">
                 <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110">
                   <Users size={160} className="text-white" />
                 </div>
              </div>
              <div className="space-y-4 px-2">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Varshith Pujala</h3>
                  <p className="text-primary font-bold text-xs uppercase tracking-[0.3em] mt-2">Co-Founder & Full Stack Engineer</p>
                </div>
                <p className="text-white/40 leading-relaxed font-medium text-lg">
                  Builder of ResumeForgeAI — a live AI career platform serving 500+ users globally. 
                  Specializes in Next.js, TypeScript, AI API integrations, and scalable SaaS architecture.
                </p>
                <div className="flex gap-4">
                  <Link href="https://linkedin.com/in/varshithpujala" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                    LinkedIn →
                  </Link>
                </div>
              </div>
            </div>

            {/* Akhilesh */}
            <div className="text-left space-y-8 group">
              <div className="aspect-[4/5] glass rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-green-600/20 to-blue-600/20 relative border border-white/5 shadow-2xl">
                 <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110">
                   <Users size={160} className="text-white" />
                 </div>
              </div>
              <div className="space-y-4 px-2">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Akhilesh</h3>
                  <p className="text-primary font-bold text-xs uppercase tracking-[0.3em] mt-2">Co-Founder & Automation Engineer</p>
                </div>
                <p className="text-white/40 leading-relaxed font-medium text-lg">
                  n8n automation specialist building enterprise workflow systems. Expert in connecting business tools, 
                  eliminating manual processes, and deploying scalable automation infrastructure.
                </p>
                <div className="flex gap-4">
                  <Link href="https://linkedin.com/in/akhilesh" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                    LinkedIn →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="max-w-4xl mx-auto p-16 glass rounded-[3rem] border border-white/10 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-10 group-hover:bg-white/10 transition-colors" />
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-6">Official Entity</p>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">GrowX Labs</h3>
            <div className="flex flex-col items-center gap-2">
              <p className="text-white/60 font-medium text-lg">MSME Registered · UDYAM-AP-22-0063260</p>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-2">Guntur, India → Serving Clients Globally</p>
            </div>
        </div>

      </div>
    </div>
  );
}
