"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Target, Lightbulb, Globe2, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import React from "react";

const stats = [
  { label: "Global markets served", value: "6+" },
  { label: "Platform users", value: "500+" },
  { label: "AI products shipped", value: "3" },
  { label: "Client satisfaction", value: "100%" }
];

const principles = [
  {
    icon: Target,
    title: "Commercial clarity",
    text: "We start with the business outcome first, then design the site, automation, and stack around that goal."
  },
  {
    icon: Lightbulb,
    title: "AI-native execution",
    text: "We use AI where it improves speed, intelligence, personalization, and operational leverage."
  },
  {
    icon: ShieldCheck,
    title: "Production discipline",
    text: "We care about performance, security, handover, uptime, and the quiet details that keep systems useful."
  }
];

const leaders = [
  {
    initials: "PSV",
    name: "Pujala Sai Varshith",
    role: "Founder & Principal Systems Engineer",
    text: "Leads full-stack AI engineering, architecture, and performance-focused digital systems for global businesses.",
    href: "https://linkedin.com/in/sai-varshith-pujala"
  },
  {
    initials: "AK",
    name: "Lakshmi Akhilesh Pasupuleti",
    role: "Co-Founder & Automation Architect",
    text: "Designs autonomous business workflows that connect lead capture, follow-up, CRM logic, and reporting.",
    href: "https://linkedin.com/in/akhilesh-pasupuleti"
  }
];

export function AboutContent() {
  const titleName = "ABOUT";

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        {/* Massive Swiss Page Title */}
        <div className="w-full overflow-hidden flex justify-center items-end select-none pointer-events-none mb-14">
          <h1 className="font-black select-none tracking-[-0.06em] text-[#1A1A1A] leading-[0.8] text-[9.2vw] uppercase whitespace-nowrap">
            {titleName}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.98fr_1.02fr] gap-14 lg:gap-20 items-center mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#355CFF]">Our story</span>
            <h2 className="text-[clamp(32px,5vw,56px)] font-black text-[#1A1A1A] mt-5 mb-7 tracking-tight leading-[1.1]">
              Engineering digital growth, globally.
            </h2>
            <div className="space-y-5 text-[17px] text-[#6B7280] leading-[1.75]">
              <p>
                GrowXLabsTech is an AI-native systems engineering agency headquartered in Guntur, Andhra Pradesh, India. We build websites, automations, and digital growth systems for businesses that need practical technology, not decorative complexity.
              </p>
              <p>
                Our work sits at the intersection of product engineering, lead generation, technical SEO, and business automation. That means every project is designed to look credible, load fast, capture demand, and reduce manual work.
              </p>
              <p>
                We serve clients remotely across India, the USA, UK, Australia, UAE, Canada, Singapore, and other global markets with transparent delivery and clear communication.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {stats.map((stat, index) => (
              <div key={stat.label} className="rounded-lg p-6 md:p-8 text-left border border-[#E5E2DC] bg-white shadow-sm">
                <div className="text-[clamp(32px,5vw,52px)] font-black text-[#1A1A1A] mb-2">{stat.value}</div>
                <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.12em]">{stat.label}</div>
                <div className="mt-5 h-1.5 rounded-full bg-[#EDEAE4] overflow-hidden">
                  <div className="h-full bg-[#355CFF]" style={{ width: `${index === 3 ? 100 : 72 + index * 7}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28">
          {principles.map((item) => (
            <Card key={item.title} className="p-8 space-y-5 h-full">
              <div className="w-12 h-12 bg-[#EDEAE4] rounded-md flex items-center justify-center">
                <item.icon className="text-[#355CFF]" size={24} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">{item.title}</h3>
              <p className="text-[#6B7280] text-[15px] leading-[1.75]">
                {item.text}
              </p>
            </Card>
          ))}
        </div>

        <div className="mb-28">
          <div className="text-center mb-12">
            <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#355CFF] mb-4 block">Leadership</span>
            <h2 className="text-[clamp(32px,5vw,52px)] font-black text-[#1A1A1A] tracking-tight">Founding engineers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {leaders.map((leader) => (
              <div key={leader.name} className="rounded-lg border border-[#E5E2DC] bg-white p-8 text-left space-y-6 transition-all duration-300 hover:border-[#355CFF]/25 hover:shadow-md">
                <div className="w-16 h-16 rounded-md bg-[#1A1A1A] flex items-center justify-center">
                  <span className="text-xl font-black text-white">{leader.initials}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight">{leader.name}</h3>
                  <p className="text-[#355CFF] font-bold text-[11px] uppercase tracking-[0.18em] mt-3">{leader.role}</p>
                </div>
                <p className="text-[#6B7280] leading-[1.75] text-[15px]">
                  {leader.text}
                </p>
                <a href={leader.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#355CFF] hover:text-[#2A4AD4] transition-colors">
                  LinkedIn <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-6 rounded-lg border border-[#E5E2DC] bg-white p-8 md:p-10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-md bg-[#EDEAE4] flex items-center justify-center shrink-0">
              <Globe2 className="text-[#355CFF]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.2em] mb-2">Global operations</p>
              <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight">GrowXLabsTech</h3>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[#1A1A1A] font-bold text-lg">Serving India, USA, UK, Australia, UAE, Canada, and Singapore</p>
              <p className="text-[#6B7280] mt-2">Available across time zones with remote-first project delivery.</p>
            </div>
            <Link href="/contact">
              <Button className="h-12 px-6 rounded-md inline-flex items-center gap-2 whitespace-nowrap">
                Work with us <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
