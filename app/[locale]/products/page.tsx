"use client";

import { motion } from "framer-motion";
import { Cpu, Users, Briefcase, ChevronRight, Binary } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const products = [
  {
    title: "ResumeForgeAI",
    description: "Intelligent career architect that engineers hyper-optimized resumes for elite roles using advanced NLP models.",
    features: ["ATS Optimization", "Role Modeling", "Multi-version Control"],
    stack: "Next.js • OpenAI • Supabase",
    icon: Binary
  },
  {
    title: "UniversalAI",
    description: "Multimodel parallel execution engine designed for high-concurrency intelligence tasks and automated content pipelines.",
    features: ["Parallel Processing", "Logic Fallbacks", "Token Efficiency"],
    stack: "Python • Node.js • Gemini 2.x",
    icon: Cpu
  },
  {
    title: "RecruitAI",
    description: "Autonomous talent acquisition system that filters, ranks, and interacts with potential candidates at global scale.",
    features: ["Sentiment Analysis", "Skill Scoring", "n8n Automation"],
    stack: "Next.js • n8n • Tailwind CSS",
    icon: Users
  }
];

export default function ProductsPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-24 text-center"
        >
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 lowercase leading-none">
            Deep <br /><span className="text-gradient">Tech. Products.</span>
          </h1>
          <p className="text-xl text-white/40 font-light max-w-2xl mx-auto">
            Proprietary ecosystems that prove our technical dominance and engineering speed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-10 glass border-white/5 h-full flex flex-col justify-between group hover:border-white/20 transition-all">
                 <div className="space-y-6">
                   <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white text-white group-hover:text-black transition-all">
                     <product.icon size={28} />
                   </div>
                   <h3 className="text-3xl font-black text-white tracking-tight">{product.title}</h3>
                   <p className="text-white/40 font-light leading-relaxed text-sm">{product.description}</p>
                   
                   <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Key Features</p>
                     <div className="flex flex-wrap gap-2">
                       {product.features.map((f, j) => (
                         <span key={j} className="text-[10px] font-bold text-white/60 bg-white/5 px-2 py-1 rounded">
                           {f}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="mt-12 pt-8 border-t border-white/5 flex flex-col space-y-6">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white/20">Architecture</span>
                     <span className="text-white/60">{product.stack}</span>
                   </div>
                   <Button className="w-full h-14 rounded-2xl font-black bg-white/5 text-white/40 hover:bg-white hover:text-black transition-all">
                     Request Access
                   </Button>
                 </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
