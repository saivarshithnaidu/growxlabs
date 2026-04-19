"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Introduction & Acceptance",
      content: "By accessing and using the services of GrowX Labs, you agree to be bound by these Terms and Conditions. Our services are designed for businesses seeking high-performance digital engineering and automation solutions."
    },
    {
      title: "2. Services Offered",
      content: "GrowX Labs provides specialized expertise in: Web Development (Next.js/React), Automation Systems (n8n/Custom Logic), Premium Hosting, AI Strategy & Integration, and Technical SEO."
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
      content: "Full ownership and intellectual property rights of the final deliverables are transferred to the client upon receipt of the final payment. GrowX Labs retains the right to showcase the project in our portfolio unless otherwise agreed in writing."
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
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8">
            Terms of <span className="text-gradient">Service.</span>
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed">
            Legal framework governing the engineering and operational standards of GrowX Labs.
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 md:p-12 rounded-[2rem] border-white/5"
            >
              <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">{section.title}</h2>
              <p className="text-white/50 leading-relaxed font-light text-lg">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        <div className="mt-20 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
          Last Updated: April 2026 • GrowX Labs
        </div>
      </div>
    </div>
  );
}
