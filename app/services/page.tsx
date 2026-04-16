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
    title: "Web Development",
    description: "Custom, high-performance web applications built with Next.js, React, and TypeScript. We focus on speed, SEO, and conversion-centric design.",
    icon: Code,
  },
  {
    title: "AI & Automations",
    description: "Connect your tools and automate repetitive tasks using n8n, Make, or custom scripts. Save time and reduce human error.",
    icon: Settings,
  },
  {
    title: "SEO Optimization",
    description: "Technical SEO, content strategy, and backlink auditing to ensure your business ranks on the first page of Google.",
    icon: TrendingUp,
  },
  {
    title: "Hosting & Maintenance",
    description: "Premium cloud hosting on Vercel/AWS with 24/7 monitoring, security updates, and performance tuning.",
    icon: Server,
  },
  {
    title: "UI/UX Design",
    description: "Modern, minimal, and premium design systems that provide a seamless user experience across all devices.",
    icon: Globe,
  },
  {
    title: "Performance Audits",
    description: "Deep dive into your existing site's performance and security to identify and fix bottlenecks.",
    icon: Zap,
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Digital Solutions for <span className="text-gradient">Modern Scale.</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide a full suite of services designed to take your business from 
            initial concept to global market leader.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {allServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Features list */}
        <div className="glass rounded-3xl p-12 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white">Secure First</h3>
              <p className="text-muted-foreground text-sm">Every line of code is written with security and privacy in mind.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Clock className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white">Timely Delivery</h3>
              <p className="text-muted-foreground text-sm">We value your time. Our agile process ensures we hit every milestone.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white">Ultra-Fast</h3>
              <p className="text-muted-foreground text-sm">We optimize for performance, ensuring sub-2s load times on all pages.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
