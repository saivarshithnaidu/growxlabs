"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Users, Target, Rocket, Lightbulb } from "lucide-react";

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
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-8">
              Driving Digital <br />
              <span className="text-gradient">Transformation.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              GrowX Labs was founded on a simple premise: technology should be a multiplier 
              for growth, not a bottleneck. We started as a small team of developers and automation 
              experts who saw a gap between enterprise-level solutions and what most agencies were offering.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we help businesses across the globe build robust digital architectures that 
              are fast, secure, and ready for the future.
            </p>
          </motion.div>
          <div className="relative">
            <div className="aspect-video glass rounded-2xl p-8 flex flex-col justify-center items-center text-center">
               <Rocket size={64} className="text-primary mb-6 animate-float" />
               <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-white">Innovation Powered</h3>
                 <p className="text-muted-foreground">Built for the next decade of digital commerce.</p>
               </div>
            </div>
            <div className="absolute -z-10 top-0 left-0 w-full h-full bg-primary/10 blur-3xl rounded-full" />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          <Card className="p-10 space-y-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-white">Our Mission</h3>
            <p className="text-muted-foreground text-lg">
              To empower businesses with cutting-edge technology and intelligent automation that 
              reduces friction and accelerates growth.
            </p>
          </Card>
          <Card className="p-10 space-y-6">
            <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center">
              <Lightbulb className="text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-white">Our Vision</h3>
            <p className="text-muted-foreground text-lg">
              To become the global benchmark for web development agencies, where every project 
              sets a new standard for performance and design.
            </p>
          </Card>
        </div>

        {/* Founder Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-16">Meet Our Leadership</h2>
          <div className="max-w-md mx-auto">
            <div className="aspect-square glass rounded-2xl mb-8 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary overflow-hidden">
               <Users size={80} className="text-white/20" />
            </div>
            <h3 className="text-2xl font-bold text-white">Alex Rivera</h3>
            <p className="text-primary font-medium mb-4">Founder & CTO</p>
            <p className="text-muted-foreground">
              With over 15 years in software architecture and automation, Alex leads the 
              technical vision at GrowX Labs, ensuring every project uses the most 
              effective tech stack for long-term success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
