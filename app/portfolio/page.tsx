"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data/projects";

export default function PortfolioPage() {
  return (
    <div className="pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full glass mb-6 border border-white/10"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Success Stories
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter"
          >
            Engineering <br />
            <span className="text-gradient">Real Results.</span>
          </motion.h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-light">
            Explore how we transform complex business challenges into 
            high-performance digital solutions through engineering and automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index} 
              {...project} 
              href={`/portfolio/${project.slug}`}
            />
          ))}
        </div>

        {/* Dynamic CTA */}
        <div className="mt-40 text-center glass p-16 md:p-24 rounded-[3rem] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to be our next success story?</h2>
          <p className="text-white/40 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            We partner with ambitious companies to build the future of digital commerce and automation.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-white text-black rounded-full font-black text-lg shadow-2xl hover:bg-primary hover:text-white transition-colors"
          >
            Let&apos;s Build Together
          </motion.button>
        </div>
      </div>
    </div>
  );
}
