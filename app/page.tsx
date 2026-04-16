"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Card } from "@/components/ui/Card";
import {
  Code,
  Settings,
  TrendingUp,
  Server,
  ArrowRight,
  Zap,
  Shield,
  Layers,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";

const mainServices = [
  {
    title: "Web Engineering",
    description: "High-performance, modern ecosystems built with Next.js, optimized for zero-latency and massive conversion.",
    icon: Code,
  },
  {
    title: "AI & Automation",
    description: "Intelligent n8n & custom logic systems that eliminate manual overhead and save hundreds of operational hours.",
    icon: Settings,
  },
  {
    title: "Performance SEO",
    description: "Technical search excellence designed to dominate rankings and capture high-intent organic traffic.",
    icon: TrendingUp,
  },
  {
    title: "Systems Hosting",
    description: "Global cloud infrastructure with 99.9% uptime and specialized maintenance for scale-ready companies.",
    icon: Server,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 md:pt-56 md:pb-48 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full glass mb-8 border border-white/10"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              The Standard of Scale
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.9]"
          >
            Digital Systems <br />
            <span className="text-gradient">Engineered to Grow.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto mb-14 leading-relaxed font-light"
          >
            GrowX Labs combines elite software engineering with autonomous intelligence 
            to architect the future of your business operations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link href="/login">
              <Button size="lg" className="h-16 px-12 text-lg rounded-full font-black bg-white text-black hover:bg-primary transition-all">
                Start Your Project <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="h-16 px-12 text-lg rounded-full font-black border-white/10 hover:bg-white/5 transition-all text-white/60 hover:text-white">
                View Case Studies
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-white/[0.03] blur-[150px] -z-10 rounded-full" />
      </section>

      {/* Services Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Core Capabilities</h2>
              <p className="text-xl text-white/40 font-light leading-relaxed">
                We specialize in building the technical infrastructure that allows traditional businesses 
                to operate at the speed of the modern web.
              </p>
            </div>
            <Link href="/services">
              <Button variant="ghost" className="text-white/60 hover:text-white font-bold group">
                All Services <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work - Bringing the Portfolio vibe here */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter">Featured Proof.</h2>
            <p className="text-white/40 max-w-2xl mx-auto font-light text-lg">
              Measurable impact across commerce, automation, and industrial scaling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={index} {...project} href={`/portfolio/${project.slug}`} />
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Link href="/portfolio">
              <Button variant="outline" className="px-10 py-6 rounded-full font-black border-white/5 text-white/40 hover:text-white hover:border-white/20 transition-all">
                Access Full Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics / Social Proof */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Revenue Generated", value: "$40M+" },
              { label: "Hours Automated", value: "12K+" },
              { label: "Project Success", value: "100%" },
              { label: "Uptime Guaranteed", value: "99.9%" }
            ].map((metric, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">{metric.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-16 md:p-32 text-center rounded-[3rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -z-10 group-hover:bg-white/10 transition-colors" />
             
             <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none">
               Let&apos;s Build <br />The Future.
             </h2>
             <p className="text-xl text-white/40 max-w-xl mx-auto mb-14 font-light leading-relaxed">
               Limited availability for Q2/Q3 partnerships. 
               Secure your scaling engine today.
             </p>
             <Link href="/login">
               <Button size="lg" className="h-16 px-16 text-xl rounded-full font-black bg-white text-black hover:bg-primary transition-all shadow-2xl shadow-white/10">
                 Get Started
               </Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
