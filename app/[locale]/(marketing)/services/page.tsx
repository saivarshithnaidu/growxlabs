"use client";

import { motion } from "framer-motion";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { 
  Code, 
  Settings, 
  TrendingUp, 
  Server, 
  Globe, 
  Zap, 
  Shield, 
  Clock 
} from "lucide-react";

const allServices = [
  {
    title: "Web Engineering",
    description: "High-performance applications built for speed and conversion. We use Next.js and TypeScript to create stable, scalable digital platforms.",
    icon: Code,
  },
  {
    title: "AI & Automations",
    description: "Remove manual tasks from your workflow. We deploy custom AI and automation systems that save your team hundreds of hours per month.",
    icon: Settings,
  },
  {
    title: "Technical SEO",
    description: "Data-driven search strategy designed to put your business in front of the right customers and dominate your market rankings.",
    icon: TrendingUp,
  },
  {
    title: "Cloud Infrastructure",
    description: "Global hosting solutions with 100% uptime monitoring and proactive maintenance. Built for businesses that cannot afford downtime.",
    icon: Server,
  },
  {
    title: "Product Design",
    description: "Premium user interfaces that prioritize clarity and ease of use. We design systems that make complex software feel simple.",
    icon: Globe,
  },
  {
    title: "Strategic Growth",
    description: "Comprehensive audits and technical roadmaps to identify bottlenecks and unlock new revenue streams through technology.",
    icon: Zap,
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-32">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter"
          >
            Engineering <span className="text-gradient">Potential.</span>
          </motion.h1>
          <p className="text-xl text-white/40 max-w-3xl mx-auto font-light leading-relaxed">
            We provide direct, high-impact technical services designed to solve 
            real business problems and accelerate your path to scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {allServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Value Props */}
        <div className="glass rounded-[3rem] p-12 md:p-24 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-white/[0.01] -z-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-center relative z-10">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                <Shield className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Enterprise Security</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">Every solution is built with rigorous security standards to protect your business data.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110" style={{ transitionDelay: '0.1s' }}>
                <Clock className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">On-Time Delivery</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">We respect your timeline. Fixed-price, fixed-date projects delivered with absolute precision.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110" style={{ transitionDelay: '0.2s' }}>
                <Zap className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Precision Performance</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">We optimize for speed and reliability, ensuring your systems perform under massive traffic.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

