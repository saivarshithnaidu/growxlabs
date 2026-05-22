"use client";

import { Shield, Lock, Eye, CheckCircle } from "lucide-react";
import React from "react";

export function PrivacyContent() {
  const points = [
    { title: "Data Collection", desc: "We only collect essential data: Contact details, project specifications, payment info, and usage analytics.", icon: Eye },
    { title: "Zero Data Sale", desc: "GrowXLabsTech will NEVER sell your data to third parties. We value your privacy as a fundamental engineering principle.", icon: Shield },
    { title: "Storage & Security", desc: "All data is stored on Supabase using enterprise-grade encryption and secure access protocols.", icon: Lock },
    { title: "Your Rights", desc: "You have full rights to access, correct, or request deletion of your data at any time.", icon: CheckCircle }
  ];

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full bg-[#F5F3EE]">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="mb-20 text-center">
          <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#355CFF] mb-4 block">
            Compliance & Trust
          </span>
          <h1 className="text-[clamp(40px,7vw,72px)] font-black text-[#1A1A1A] tracking-tighter mb-8 leading-[1.1] uppercase">
            Privacy <span className="text-[#355CFF]">Policy.</span>
          </h1>
          <p className="text-xl text-[#6B7280] font-medium leading-relaxed max-w-2xl mx-auto">
            How we protect your digital identity and project intelligence within the GrowXLabsTech ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
          {points.map((p, i) => (
            <div
              key={i}
              className="bg-white border border-[#E5E2DC] p-10 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start"
            >
              <div className="p-3 bg-[#355CFF]/5 rounded-xl text-[#355CFF] mb-4 inline-flex">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight mb-2 uppercase">{p.title}</h3>
              <p className="text-[#6B7280] font-medium text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-white border border-[#E5E2DC] p-8 md:p-12 rounded-[24px] mb-20 max-w-4xl mx-auto shadow-sm">
          <h2 className="text-3xl font-black text-[#1A1A1A] mb-8 tracking-tight uppercase">Retention Standards</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#E5E2DC] pb-6">
              <span className="text-[#6B7280] font-bold text-lg">Project Intelligence</span>
              <span className="text-[#1A1A1A] font-black text-xl">3 Years</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#E5E2DC] pb-6">
              <span className="text-[#6B7280] font-bold text-lg">Enquiry & Metadata</span>
              <span className="text-[#1A1A1A] font-black text-xl">1 Year</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#E5E2DC] pb-6">
              <span className="text-[#6B7280] font-bold text-lg">Payment Logs</span>
              <span className="text-[#1A1A1A] font-black text-xl">7 Years</span>
            </div>
          </div>
        </section>

        <div className="text-center">
          <p className="text-[#6B7280] font-bold text-lg mb-4 uppercase tracking-widest">Questions regarding your data?</p>
          <a href="mailto:hello@growxlabs.tech" className="text-2xl md:text-3xl font-black text-[#355CFF] hover:text-[#254CE0] transition-colors duration-300">
            hello@growxlabs.tech
          </a>
        </div>
      </div>
    </div>
  );
}
