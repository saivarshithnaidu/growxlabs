"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import {
  Code,
  Settings,
  TrendingUp,
  Server,
} from "lucide-react";
import { Link } from "@/navigation";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";

export default function Home() {
  const mainServices = [
    {
      title: "Web Engineering",
      description: "We build high-performance digital platforms that turn visitors into customers at scale.",
      icon: Code,
    },
    {
      title: "AI & Automation",
      description: "Custom AI workflows and automation systems that eliminate manual overhead and speed up your growth.",
      icon: Settings,
    },
    {
      title: "Technical SEO",
      description: "Dominant search visibility engineered to capture high-intent organic traffic and drive revenue.",
      icon: TrendingUp,
    },
    {
      title: "Cloud Infrastructure",
      description: "Secure, scalable hosting and maintenance designed for 100% reliability and business continuity.",
      icon: Server,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 md:px-10 xl:px-16 2xl:px-24">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto text-center relative z-10 w-full">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B]">
              AI Native Digital Agency
            </span>
          </motion.div>
          
          <motion.h1 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="text-white font-bold mb-10 leading-[1.1] max-w-[1100px] mx-auto"
            style={{ fontSize: "clamp(48px, 6vw, 96px)", fontWeight: 700 }}
          >
            Digital Systems That Drive Growth.
          </motion.h1>
          
          <motion.p 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[18px] text-[#A0A0A0] max-w-[520px] mx-auto mb-14 leading-[1.7]"
          >
            We build high performance websites and automation systems that help businesses grow faster.
          </motion.p>
          
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/contact">
              <Button size="lg" className="h-12 px-8 py-3 text-base rounded-full font-semibold bg-[#00A86B] text-white hover:bg-[#00A86B]/90 transition-all shadow-none">
                Start Your Project Today
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="h-12 px-8 py-3 text-base rounded-full font-semibold border-white/20 hover:border-white hover:bg-white/5 transition-all text-white">
                View Portfolio
              </Button>
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-[#00A86B]/[0.04] blur-[150px] -z-10 rounded-full" />
      </section>

      {/* Services / Core Capabilities Section */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24 relative">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
              WHAT WE BUILD
            </span>
            <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight">Core Capabilities</h2>
            <p className="text-[#A0A0A0] max-w-[640px] mx-auto text-lg leading-relaxed">
              Direct results oriented technical solutions for businesses that prioritize speed and reliability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {mainServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Segment */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
              OUR WORK
            </span>
            <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight">Case Studies</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto text-center">
          <h2 className="text-[clamp(28px,5vw,48px)] font-bold text-white mb-6 tracking-tight">
            Currently Onboarding First Clients
          </h2>
          <p className="text-[#A0A0A0] max-w-[640px] mx-auto text-lg leading-relaxed mb-12">
            Be among the first businesses to experience AI powered digital growth with GrowX Labs.
          </p>
          
          <div className="max-w-xl mx-auto p-10 rounded-2xl border border-[#00A86B]/30 bg-[rgba(255,255,255,0.03)] shadow-2xl backdrop-blur-sm">
            <p className="text-white text-xl font-medium mb-3">
              Want to be our first featured client?
            </p>
            <p className="text-[#A0A0A0] text-base mb-10">
              Your project becomes our showcase.
            </p>
            <Link href="/contact">
              <Button className="bg-[#00A86B] text-white hover:bg-[#00A86B]/90 rounded-full px-10 py-4 h-14 text-lg font-semibold shadow-none transition-all hover:scale-105">
                Start Your Project Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
