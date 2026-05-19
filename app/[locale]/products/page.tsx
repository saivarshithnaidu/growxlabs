"use client";

import { motion } from "framer-motion";
import { Cpu, Users, ChevronRight, Binary, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const products = [
  {
    title: "ResumeForgeAI",
    description: "An intelligent career platform that helps job seekers create structured, ATS-aware resumes with role-specific positioning.",
    features: ["ATS Optimization", "Role Modeling", "Multi-version Control"],
    stack: "Next.js, OpenAI, Supabase",
    icon: Binary,
  },
  {
    title: "UniversalAI",
    description: "A multimodel execution layer for high-concurrency intelligence tasks, internal tooling, and automated content workflows.",
    features: ["Parallel Processing", "Logic Fallbacks", "Token Efficiency"],
    stack: "Python, Node.js, Gemini",
    icon: Cpu,
  },
  {
    title: "RecruitAI",
    description: "A recruitment workflow system that helps teams filter, score, and communicate with candidates at scale.",
    features: ["Sentiment Analysis", "Skill Scoring", "n8n Automation"],
    stack: "Next.js, n8n, Tailwind CSS",
    icon: Users,
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Hero — largest emphasis on AI PRODUCTS */}
      <section
        className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pt-24 sm:pt-28 pb-14 md:pb-18 min-h-[min(52dvh,560px)] flex flex-col items-center justify-center text-center"
        aria-labelledby="products-hero-heading"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              id="products-hero-heading"
              className="text-[clamp(2.5rem,14vw,8.5rem)] font-black text-[#1A1A1A] tracking-[-0.04em] leading-[0.92] uppercase sm:whitespace-nowrap"
            >
              AI products
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pb-24 border-t border-[#E5E2DC]/90">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 md:mb-16 text-center pt-10 md:pt-12"
          >
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#355CFF] mb-4 block">
              Product catalog
            </span>
            <h2 className="text-[clamp(1.65rem,4vw,2.75rem)] font-black text-[#1A1A1A] tracking-tight mb-5 leading-[1.12] max-w-4xl mx-auto">
              Products that prove our engineering speed.
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
              We build internal and public AI products alongside client work. The same product discipline powers the
              websites and automation systems we ship for businesses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.1 }}
                className="h-full"
              >
                <Card className="p-7 h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="h-12 w-12 rounded-md bg-[#EDEAE4] flex items-center justify-center">
                      <product.icon size={24} className="text-[#355CFF]" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight">{product.title}</h3>
                    <p className="text-[#6B7280] leading-relaxed text-sm">{product.description}</p>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">Key features</p>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1A1A1A] bg-[#F5F3EE] border border-[#E5E2DC] px-2.5 py-1 rounded-md"
                          >
                            <CheckCircle2 className="h-3 w-3 text-[#355CFF]" aria-hidden="true" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-[#E5E2DC] flex flex-col space-y-5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                        Architecture
                      </span>
                      <p className="text-sm font-semibold text-[#1A1A1A]">{product.stack}</p>
                    </div>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full h-12 rounded-md font-semibold inline-flex items-center gap-2">
                        Request access <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
