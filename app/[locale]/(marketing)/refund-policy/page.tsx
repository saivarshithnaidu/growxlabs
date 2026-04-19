"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 lowercase">
            Refund <span className="text-gradient">Policy.</span>
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed">
            Transparent financial protocols for cancellations and project terminations.
          </p>
        </motion.div>

        <div className="space-y-8 mb-20">
          <PolicyCard 
            icon={<CheckCircle className="text-white" />} 
            title="Full Refund" 
            text="100% refund of initial deposit if requested before project assessment or engineering cycles begin." 
          />
          <PolicyCard 
            icon={<AlertCircle className="text-white" />} 
            title="Non-Refundable" 
            text="Once technical engineering or strategic logic design has commenced, the initial 50% deposit is non-refundable." 
          />
          <PolicyCard 
            icon={<Clock className="text-white" />} 
            title="Failure to Deliver" 
            text="A full or partial refund will be provided if GrowX Labs fails to meet the agreed architectural deliverables within a reasonable grace period." 
          />
        </div>

        <section className="glass p-12 rounded-[3rem] border-white/5">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tighter underline decoration-white/10 underline-offset-8">The Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white/50 font-light text-lg">
            <p>
              To initiate a refund, please email <span className="text-white font-bold">hello@growxlabs.tech</span> with your project ID and reason for cancellation.
            </p>
            <p>
              Processing typically takes <span className="text-white font-bold">7–10 business days</span> following formal approval of the refund request.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function PolicyCard({ icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-8 rounded-3xl border-white/5 flex gap-8 items-start"
    >
      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-white/40 font-light leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}
