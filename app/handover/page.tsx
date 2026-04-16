"use client";

import { motion } from "framer-motion";
import { Check, Download, Package, LifeBuoy } from "lucide-react";

export default function HandoverPage() {
  const checklist = [
    "Performance optimized (90+ Lighthouse Score)",
    "Production-grade metadata & SEO keywords",
    "Security headers & HTTPS encryption",
    "Cross-platform responsive validation",
    "Database schema & API documentation"
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 lowercase">
            Project <br /><span className="text-gradient">Handover.</span>
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed">
            Ensuring a seamless transition from engineering cycles to full production ownership.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <section className="glass p-12 rounded-[3rem] border-white/5 space-y-8">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
              <Package className="mr-3 text-primary" /> The Package
            </h2>
            <ul className="space-y-4">
              {["Full Source Code", "Architecture Docs", "Hosting Credentials", "Design Assets", "Logic Schemas"].map((item, i) => (
                <li key={i} className="flex items-center text-white/60 font-light">
                  <Check className="h-4 w-4 text-primary mr-3" /> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass p-12 rounded-[3rem] border-white/5 space-y-8">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
              <LifeBuoy className="mr-3 text-primary h-6 w-6" /> Support
            </h2>
            <p className="text-white/40 font-light leading-relaxed">
              Every handover includes <span className="text-white font-bold tracking-tight">14 days</span> of complimentary technical stability support.
            </p>
            <p className="text-white/40 font-light leading-relaxed">
              Extended SLA maintenance available for high-scale enterprise systems.
            </p>
          </section>
        </div>

        <section className="bg-white p-16 md:p-24 rounded-[4rem] text-black">
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12">Handover Checklist.</h2>
           <div className="space-y-6">
             {checklist.map((item, i) => (
               <div key={i} className="flex items-center text-xl font-bold border-b border-black/10 pb-6">
                 <div className="h-8 w-8 rounded-full border-2 border-black flex items-center justify-center mr-6 flex-shrink-0">
                    <Check size={18} />
                 </div>
                 {item}
               </div>
             ))}
           </div>
        </section>
      </div>
    </div>
  );
}
