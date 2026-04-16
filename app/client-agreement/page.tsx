"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function ClientAgreementPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-20 text-center"
        >
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none">
            Master <br /><span className="text-gradient">Agreement.</span>
          </h1>
          <p className="text-xl text-white/40 font-light max-w-2xl mx-auto">
            Standard contractual framework for all GrowX Labs partnerships and engineering cycles.
          </p>
        </motion.div>

        <div className="space-y-16">
          <section className="space-y-8">
            <h2 className="text-3xl font-black text-white tracking-widest uppercase text-center text-white/10">01 / Payment Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-10 rounded-3xl border-white/5">
                <h3 className="text-white font-bold mb-4">Advance (50%)</h3>
                <p className="text-white/40 font-light text-sm">Required to initialize the project architecture and strategy phase.</p>
              </div>
              <div className="glass p-10 rounded-3xl border-white/5">
                <h3 className="text-white font-bold mb-4">Delivery (50%)</h3>
                <p className="text-white/40 font-light text-sm">Cleared before the final code handover and production deployment.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/[0.02] p-12 md:p-20 rounded-[3rem] border border-white/5 space-y-10">
             <div className="space-y-4">
               <h3 className="text-2xl font-black text-white tracking-tight">Confidentiality</h3>
               <p className="text-white/40 font-light leading-relaxed">
                 Both parties agree to protect all proprietary information, trade secrets, and technical logic for a period of <span className="text-white font-bold">3 years</span> from the date of disclosure.
               </p>
             </div>
             
             <div className="space-y-4">
               <h3 className="text-2xl font-black text-white tracking-tight">Termination</h3>
               <p className="text-white/40 font-light leading-relaxed">
                 Agreement may be terminated with <span className="text-white font-bold">14 days</span> written notice. Any completed milestones at the time of termination will be billed in full.
               </p>
             </div>
          </section>

          <section className="text-center p-20 border-2 border-dashed border-white/5 rounded-[4rem]">
             <p className="text-white/20 text-[10px] font-black uppercase tracking-[1em] mb-10">Signature Required</p>
             <div className="w-full h-40 border-b border-white/10 mb-10 flex items-center justify-center">
               <span className="text-white/5 italic font-serif text-5xl">Digital Signature Placeholder</span>
             </div>
             <Button className="h-16 px-16 rounded-full font-black text-lg bg-white text-black hover:bg-neutral-200">
               Generate Legal PDF
             </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
