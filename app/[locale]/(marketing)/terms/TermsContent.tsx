"use client";

import React from "react";

export function TermsContent() {
  const sections = [
    {
      title: "1. Introduction & Acceptance",
      content: "By accessing and using the services of GrowXLabsTech, you agree to be bound by these Terms and Conditions. Our services are designed for businesses seeking high-performance digital engineering and automation solutions."
    },
    {
      title: "2. Services Offered",
      content: "GrowXLabsTech provides specialized expertise in: Web Development (Next.js/React), Automation Systems (n8n/Custom Logic), Premium Hosting, AI Strategy & Integration, and Technical SEO."
    },
    {
      title: "3. Project Commencement",
      content: "A 50% advance payment is required to initiate any project cycle. Work will commence only after the successful receipt of the initial deposit and all necessary project requirements."
    },
    {
      title: "4. Revision Policy",
      content: "Each project includes 2 complimentary rounds of revisions. Any subsequent changes or modifications requested after these rounds will be billed at our standard hourly rate."
    },
    {
      title: "5. Intellectual Property",
      content: "Full ownership and intellectual property rights of the final deliverables are transferred to the client upon receipt of the final payment. GrowXLabsTech retains the right to showcase the project in our portfolio unless otherwise agreed in writing."
    },
    {
      title: "6. Prohibited Uses",
      content: "We strictly prohibit the use of our services for illegal activities, scams, adult content, hacking, or phishing. Discovery of such use will result in immediate termination of the project without refund."
    },
    {
      title: "7. Governing Law",
      content: "Any disputes arising from these terms will be governed by the laws of India, under the jurisdiction of Guntur courts."
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full bg-[#F5F3EE]">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="mb-16 text-center lg:text-left">
          <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#355CFF] mb-4 block">
            Operating Standards
          </span>
          <h1 className="text-[clamp(40px,7vw,72px)] font-black text-[#1A1A1A] tracking-tighter mb-8 leading-[1.1] uppercase">
            Terms of <span className="text-[#355CFF]">Service.</span>
          </h1>
          <p className="text-xl text-[#6B7280] font-medium leading-relaxed max-w-2xl">
            Legal framework governing the engineering and operational standards of GrowXLabsTech.
          </p>
        </div>

        <div className="space-y-10 max-w-4xl mx-auto lg:mx-0">
          {sections.map((section, index) => (
            <section
              key={index}
              className="bg-white border border-[#E5E2DC] p-8 md:p-12 rounded-[24px] shadow-sm transition-all hover:border-[#355CFF]/20 hover:shadow-md duration-300"
            >
              <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] mb-6 tracking-tight uppercase">{section.title}</h2>
              <p className="text-[#6B7280] leading-relaxed font-medium text-base md:text-lg">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-20 text-center lg:text-left text-[#6B7280]/40 text-[11px] font-black uppercase tracking-[0.4em]">
          Last Updated: April 2026 • GrowXLabsTech
        </div>
      </div>
    </div>
  );
}
