'use client';

import React from 'react';
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { 
  Sparkles, 
  Database, 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  Layers
} from "lucide-react";

export default function SandboxPage() {
  const systems = [
    {
      title: "Enterprise Lead Gen Orchestrator",
      category: "B2B OUTBOUND AUTOMATION",
      description: "An autonomous multi-agent pipeline designed to discover, crawl, and enrich high-value B2B prospect contacts directly into your CRM.",
      metrics: {
        value: "92% time saved",
        label: "versus manual sourcing"
      },
      benefits: [
        "Multi-agent search & Google Maps crawling",
        "Real-time contact email & phone verification",
        "Automatic background synchronization with HubSpot, Salesforce, or custom CRMs"
      ],
      icon: Database,
      highlight: "HubSpot / Salesforce Integrations Ready"
    },
    {
      title: "Cognitive Document Parser",
      category: "FINANCIAL OPERATIONS",
      description: "A secure extraction engine that parses raw invoices, purchase orders, and financial receipts into structured schemas, auto-matching banking ledgers.",
      metrics: {
        value: "98.4% accuracy",
        label: "out-of-the-box OCR parsing"
      },
      benefits: [
        "Intelligent table parsing & line-item matching",
        "Direct bank transaction & ledger reconciliation",
        "Automated ledger entry writing with full double-entry auditing logs"
      ],
      icon: FileText,
      highlight: "ERP & Banking Ledger Sync"
    },
    {
      title: "Operational Support Agent",
      category: "LOGISTICS & SCHEDULING",
      description: "A cognitive conversational AI that queries active databases to answer complex logistics questions and book meetings autonomously.",
      metrics: {
        value: "80% resolution",
        label: "first-contact operational queries"
      },
      benefits: [
        "Live database API queries (Freight, Shipping, Inventory)",
        "Automated booking, cancelation, and calendar rescheduling",
        "Intelligent fallback routing to human agents when exceptions occur"
      ],
      icon: MessageSquare,
      highlight: "WhatsApp / Web Chat Integrations"
    }
  ];

  return (
    <div className="bg-[#020202] min-h-screen text-white select-none">
      <PageHero
        title="AI Sandbox"
        viewingText="SANDBOX"
        exploreText="DEMOS"
        tagline="CUSTOM SYSTEMS"
      />

      <div className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pb-24 pt-16">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto space-y-24">
          
          {/* Header Description */}
          <div className="text-center max-w-3xl mx-auto">
            <Reveal>
              <span className="text-[12px] font-mono font-bold uppercase tracking-[0.2em] text-[#C0F0FB] mb-3 block">
                Proprietary Blueprints
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-serif font-bold tracking-tight leading-tight">
                Enterprise AI systems built to scale.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-zinc-400 mt-4 text-[16px] max-w-xl mx-auto leading-relaxed">
                Explore custom blueprints we design, develop, and integrate directly into our clients' existing tech stacks to streamline manual workflows.
              </p>
            </Reveal>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {systems.map((sys, idx) => (
              <Reveal key={idx} delay={0.08 * (idx + 1)}>
                <div className="bg-[#080808] border border-white/5 hover:border-[#C0F0FB]/20 rounded-2xl p-8 flex flex-col justify-between h-full transition-all duration-300 group hover:shadow-[0_0_30px_rgba(192,240,251,0.02)]">
                  <div className="space-y-6">
                    {/* Icon & Category */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#C0F0FB] group-hover:bg-[#C0F0FB] group-hover:text-black transition-all duration-300">
                        <sys.icon className="w-5.5 h-5.5" />
                      </div>
                      <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase font-bold">
                        {sys.category}
                      </span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold tracking-tight font-serif text-white group-hover:text-[#C0F0FB] transition-colors duration-300">
                        {sys.title}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {sys.description}
                      </p>
                    </div>

                    {/* Key Metric Panel */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                      <div className="text-2xl font-serif font-bold text-[#C0F0FB] tracking-tight">
                        {sys.metrics.value}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider leading-snug">
                        {sys.metrics.label}
                      </div>
                    </div>

                    {/* Capabilities List */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold block">
                        Capabilities & Features:
                      </span>
                      <ul className="space-y-2.5">
                        {sys.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-[#C0F0FB] shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions & Integration Badge */}
                  <div className="pt-8 mt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>Integration:</span>
                      <span className="text-white font-semibold">{sys.highlight}</span>
                    </div>
                    <Link href="/contact" className="block w-full">
                      <Button className="w-full py-4.5 bg-zinc-900 border border-white/10 text-white font-semibold hover:bg-[#C0F0FB] hover:text-black hover:border-transparent transition-all duration-300 rounded-lg text-xs flex items-center justify-center gap-2 group-hover:border-white/20">
                        <span>Request Sandbox Integration</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom Call to Action Block */}
          <Reveal delay={0.24}>
            <div className="bg-[#080808] border border-white/5 rounded-2xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto">
              <span className="text-[12px] font-mono tracking-[0.2em] text-[#C0F0FB] uppercase font-bold">
                Custom Engineering
              </span>
              <h3 className="text-3xl font-serif font-bold tracking-tight max-w-xl mx-auto leading-tight">
                Have a manual operation you want to automate?
              </h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                We work directly with your operational stakeholders to scope, design, and ship production-ready custom AI agents tailored to your business rules.
              </p>
              <div className="pt-4 flex justify-center">
                <Link href="/contact">
                  <Button className="bg-[#C0F0FB] text-black font-bold hover:bg-[#C0F0FB]/90 transition-all rounded-lg px-8 py-6 text-sm">
                    Book a Scoping Call
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
}
