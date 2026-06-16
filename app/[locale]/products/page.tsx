"use client";

import { motion } from "framer-motion";
import { Cpu, Users, ChevronRight, Binary, CheckCircle2, Network } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";

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
  {
    title: "3RDMIND",
    description: "An autonomous startup simulation platform where C-suite agents collaborate, run business tasks, and improve via feedback loops.",
    features: ["Agent Collaboration", "Feedback Loops", "Simulation Engine"],
    stack: "Next.js, Supabase, OpenRouter",
    icon: Network,
  },
];

export default function ProductsPage() {

  return (
    <>
      <PageHero
        title="Products"
        viewingText="PRODUCTS"
        exploreText="CATALOG"
        tagline="OWN PRODUCTS"
      />

      <div className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pb-24 border-t border-border/20 pt-16">
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
            <h2 className="text-[clamp(1.65rem,4vw,2.75rem)] font-black text-foreground tracking-tight mb-5 leading-[1.12] max-w-4xl mx-auto">
              Products that prove our engineering speed.
            </h2>

          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center">
                      <product.icon size={24} className="text-[#355CFF]" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">{product.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Key features</p>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground bg-muted border border-border px-2.5 py-1 rounded-md"
                          >
                            <CheckCircle2 className="h-3 w-3 text-[#355CFF]" aria-hidden="true" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-border flex flex-col space-y-5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Architecture
                      </span>
                      <p className="text-sm font-semibold text-foreground">{product.stack}</p>
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
