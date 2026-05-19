"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe2,
  MessagesSquare,
  Settings2,
  Workflow,
  Zap,
} from "lucide-react";

const signals = [
  { text: "7–21 day builds", icon: Clock },
  { text: "Web + automation", icon: Settings2 },
  { text: "Global remote delivery", icon: Globe2 },
] as const;

function GrowthConsolePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative lg:sticky lg:top-28"
      aria-label="Website, automation, and growth system preview"
    >
      <div className="rounded-xl border border-[#E5E2DC] bg-white p-5 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4 mb-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">Growth Console</p>
            <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">Lead engine live</h2>
          </div>
          <div className="h-10 w-10 rounded-md bg-[#355CFF] text-white flex items-center justify-center">
            <Zap className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { label: "Qualified leads", value: "+38%" },
            { label: "Response time", value: "4 sec" },
            { label: "Manual tasks", value: "-21h" },
          ].map((metric) => (
            <div key={metric.label} className="rounded-lg bg-[#F5F3EE] border border-[#E5E2DC] p-4">
              <p className="text-[12px] text-[#6B7280] font-semibold">{metric.label}</p>
              <p className="text-2xl font-black text-[#1A1A1A] mt-2">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] gap-4">
          <div className="rounded-lg bg-[#1A1A1A] p-5 text-white min-h-[220px] sm:min-h-[240px] flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-4">Website funnel</p>
              <div className="space-y-3">
                {["Visitor intent", "CTA capture", "Booked call"].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center text-[12px] font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-4">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "76%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                className="h-full bg-[#355CFF] rounded-full"
              />
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E2DC] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280] mb-4">Automation stack</p>
            <div className="space-y-3">
              {[
                { icon: MessagesSquare, title: "WhatsApp follow-up", text: "Every lead receives instant next steps." },
                { icon: Workflow, title: "CRM routing", text: "Qualified requests move to your pipeline." },
                { icon: CheckCircle2, title: "Daily reporting", text: "You see what converted and why." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 rounded-md bg-[#F5F3EE] border border-[#E5E2DC] p-3">
                  <item.icon className="h-5 w-5 text-[#355CFF] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">{item.title}</p>
                    <p className="text-[13px] text-[#6B7280] leading-snug">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Home page block: lead-engine story, CTAs, and Growth Console (below the minimal hero). */
export function LeadEngineSection() {
  return (
    <section
      className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pt-8 pb-16 md:pb-24 border-t border-[#E5E2DC]/90"
      aria-labelledby="lead-engine-heading"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] gap-10 xl:gap-14 items-start">
          <div className="max-w-xl lg:max-w-none xl:max-w-[34rem]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h2
                  id="lead-engine-heading"
                  className="text-[clamp(1.65rem,3.8vw,2.35rem)] font-black tracking-tight text-[#1A1A1A] leading-[1.12]"
                >
                  A website connected to your lead engine.
                </h2>
                <p className="text-[#6B7280] text-base sm:text-[17px] leading-relaxed">
                  Design becomes operations: capture, instant follow-up, CRM routing, and reporting in one system you
                  can run—not a pile of disconnected tools.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {signals.map(({ text, icon: Icon }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E5E2DC] bg-white/90 px-3 py-2 text-[13px] font-semibold text-[#4B5563] shadow-sm"
                  >
                    <Icon className="h-4 w-4 text-[#355CFF] shrink-0" aria-hidden="true" />
                    {text}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-[50px] px-7 text-[14px] rounded-md font-semibold inline-flex items-center justify-center gap-2 hover:gap-3"
                    trackEvent="cta_clicked"
                    trackProperties={{ location: "lead_engine_section", text: "Book a Growth Call" }}
                  >
                    Book a Growth Call <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/portfolio" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-[50px] px-7 text-[14px] rounded-md font-semibold"
                    trackEvent="cta_clicked"
                    trackProperties={{ location: "lead_engine_section", text: "View Work" }}
                  >
                    View Work
                  </Button>
                </Link>
              </div>

              <div className="rounded-xl border border-[#E5E2DC]/80 bg-[#FAF9F6] px-4 py-3.5 sm:px-5 sm:py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#355CFF] mb-1.5">
                  What moves into production
                </p>
                <p className="text-sm sm:text-[15px] text-[#6B7280] leading-relaxed">
                  The live layer ships with your funnel, automations, and dashboards wired together—the Growth Console
                  preview shows the shape of what we deploy.
                </p>
              </div>
            </motion.div>
          </div>

          <GrowthConsolePreview />
        </div>
      </div>
    </section>
  );
}
