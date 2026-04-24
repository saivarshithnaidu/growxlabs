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
    description: "High performance applications built for speed and conversion. We use Next.js and TypeScript to create stable, scalable digital platforms.",
    icon: Code,
  },
  {
    title: "AI & Automations",
    description: "Remove manual tasks from your workflow. We deploy custom AI and automation systems that save your team hundreds of hours per month.",
    icon: Settings,
  },
  {
    title: "Technical SEO",
    description: "Data driven search strategy designed to put your business in front of the right customers and dominate your market rankings.",
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
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
            WHAT WE BUILD
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight"
          >
            Core Capabilities
          </motion.h1>
          <p className="text-[#A0A0A0] max-w-[640px] mx-auto text-lg leading-relaxed">
            Direct results oriented technical solutions for businesses that prioritize speed and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-24">
          {allServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Value Props */}
        <div className="rounded-2xl p-10 md:p-16 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] relative overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 text-center relative z-10">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="text-[#00A86B] h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-white">Enterprise Security</h3>
              <p className="text-[#A0A0A0] text-base leading-relaxed">Every solution is built with rigorous security standards to protect your business data.</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-2xl flex items-center justify-center mx-auto">
                <Clock className="text-[#00A86B] h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-white">On Time Delivery</h3>
              <p className="text-[#A0A0A0] text-base leading-relaxed">We respect your timeline. Fixed price, fixed date projects delivered with absolute precision.</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="text-[#00A86B] h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-white">Precision Performance</h3>
              <p className="text-[#A0A0A0] text-base leading-relaxed">We optimize for speed and reliability, ensuring your systems perform under massive traffic.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
