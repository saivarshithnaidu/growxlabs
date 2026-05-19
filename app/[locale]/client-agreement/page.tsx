"use client";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/marketing/Reveal";
import { ShieldCheck, Signature, CreditCard, Scale, FileText } from "lucide-react";

export default function ClientAgreementPage() {
  return (
    <div className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Hero */}
        <div className="text-center mb-16 md:mb-24">
          <Reveal scale={0.98}>
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#355CFF] mb-4 block">
              Contractual Framework
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black text-[#1A1A1A] tracking-[-0.05em] leading-[0.95] uppercase mb-6">
              Master <br /><span className="text-[#355CFF]">Agreement.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-lg md:text-xl text-[#6B7280] font-medium max-w-2xl mx-auto leading-relaxed">
              Our standardized engineering terms and service framework designed for absolute transparency, speed, and clean code delivery.
            </p>
          </Reveal>
        </div>

        {/* Structural Terms Container */}
        <div className="space-y-12 md:space-y-16">
          
          {/* Section 01: Payment Flow */}
          <section className="space-y-6">
            <Reveal>
              <div className="flex items-center gap-3 border-b border-[#E5E2DC] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#355CFF] bg-[#355CFF]/5 px-3 py-1 rounded-full">01</span>
                <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] tracking-tight uppercase">Payment Terms</h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <Reveal delay={0.05}>
                <div className="h-full bg-white border border-[#E5E2DC] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-[#355CFF]/5 rounded-xl text-[#355CFF]">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-[#1A1A1A]">Advance (50%)</h3>
                  </div>
                  <p className="text-[#6B7280] font-medium text-sm leading-relaxed">
                    Required to secure engineering bandwidth, initialize local system architectures, and begin the technical discovery and wireframing cycle.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="h-full bg-white border border-[#E5E2DC] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-[#355CFF]/5 rounded-xl text-[#355CFF]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-[#1A1A1A]">Handover (50%)</h3>
                  </div>
                  <p className="text-[#6B7280] font-medium text-sm leading-relaxed">
                    Settled upon complete demonstration and verification of features in the local testing workspace, immediately preceding final code release and domain deployment.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Section 02: Core Protections */}
          <section className="space-y-6">
            <Reveal>
              <div className="flex items-center gap-3 border-b border-[#E5E2DC] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#355CFF] bg-[#355CFF]/5 px-3 py-1 rounded-full">02</span>
                <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] tracking-tight uppercase">Core Protections</h2>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="bg-white border border-[#E5E2DC] p-8 md:p-10 rounded-2xl shadow-sm divide-y divide-[#E5E2DC]">
                <div className="pb-6 space-y-3">
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <Scale className="w-5 h-5 text-[#355CFF]" />
                    <h4 className="font-bold text-base">Intellectual Property</h4>
                  </div>
                  <p className="text-[#6B7280] text-sm leading-relaxed font-medium pl-8">
                    Upon complete settlement of dues, full ownership of all custom codebase, visual elements, integrations, and branding assets is automatically transferred to the client.
                  </p>
                </div>

                <div className="py-6 space-y-3">
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <ShieldCheck className="w-5 h-5 text-[#355CFF]" />
                    <h4 className="font-bold text-base">Strict Confidentiality</h4>
                  </div>
                  <p className="text-[#6B7280] text-sm leading-relaxed font-medium pl-8">
                    Both parties sign a comprehensive, mutual NDA ensuring that proprietary trade logic, design prototypes, databases, and operational mechanisms are fiercely protected.
                  </p>
                </div>

                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <FileText className="w-5 h-5 text-[#355CFF]" />
                    <h4 className="font-bold text-base">Agile Cancellation</h4>
                  </div>
                  <p className="text-[#6B7280] text-sm leading-relaxed font-medium pl-8">
                    Contracts can be paused or terminated cleanly with 14 days written notice. Only milestones currently processed or shipped up to the termination point are billable.
                  </p>
                </div>
              </div>
            </Reveal>
          </section>

          {/* Section 03: Verification and Signature */}
          <section className="space-y-6">
            <Reveal>
              <div className="flex items-center gap-3 border-b border-[#E5E2DC] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#355CFF] bg-[#355CFF]/5 px-3 py-1 rounded-full">03</span>
                <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] tracking-tight uppercase">Deployment Vault</h2>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="text-center p-8 md:p-12 border border-dashed border-[#E5E2DC] bg-white rounded-2xl shadow-sm relative overflow-hidden">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="inline-flex p-4 bg-[#355CFF]/5 text-[#355CFF] rounded-2xl mb-2">
                    <Signature className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight">Ready to lock in your engineering cycle?</h3>
                  <p className="text-[#6B7280] font-medium text-sm leading-relaxed">
                    Once initialized, we generate your personalized secure client portal where agreements, invoices, and live code staging previews are seamlessly managed.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Button className="w-full sm:w-auto h-12 px-8 rounded-lg font-semibold bg-[#355CFF] text-white hover:bg-[#254CE0] transition-colors duration-300">
                      Initialize Agreement
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-lg font-semibold border-[#E5E2DC] text-[#1A1A1A] hover:bg-neutral-50 transition-colors duration-300">
                      Download PDF Model
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

        </div>
      </div>
    </div>
  );
}
