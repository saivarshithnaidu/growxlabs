"use client";

import { motion } from "framer-motion";
import { Check, Calendar, FileText, Rocket, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const VALUE_TRACKS = [
  {
    name: "Digital Presence",
    description: "A professional website that works as your 24/7 sales machine by capturing leads, building trust, and converting visitors into customers automatically.",
    outcomes: [
      "Customers find you on Google",
      "Leads captured even at midnight",
      "Professional first impression",
      "Mobile first, fast loading",
      "WhatsApp and enquiry integration"
    ],
    cta: "Discuss Your Website →",
    popular: false,
    color: "from-blue-600/20 to-blue-400/10"
  },
  {
    name: "Growth Automation",
    description: "n8n automation systems that eliminate manual work. follow ups, lead nurturing, invoice reminders, customer win back. all running without you lifting a finger.",
    outcomes: [
      "Zero missed follow ups",
      "Leads contacted within 60 seconds",
      "Customers never go cold",
      "Save 20 plus hours per week",
      "Works while you sleep"
    ],
    cta: "Discuss Automation →",
    popular: true,
    color: "from-primary/30 to-primary/10"
  },
  {
    name: "Complete Digital System",
    description: "A complete digital infrastructure. website, automation, AI integration, and ongoing maintenance. built as one connected system for serious business growth.",
    outcomes: [
      "Full website and automation stack",
      "AI powered features",
      "Custom admin dashboard",
      "Dedicated monthly support",
      "Scales as your business grows"
    ],
    cta: "Get a Custom Scope →",
    popular: false,
    color: "from-purple-600/20 to-purple-400/10"
  }
];

const PRICING_PROCESS = [
  {
    icon: Calendar,
    title: "Book a Free Call",
    text: "15 minutes. We understand your business and what you actually need."
  },
  {
    icon: FileText,
    title: "We Send a Proposal",
    text: "Custom scope and pricing based on your exact requirements. No generic packages."
  },
  {
    icon: Rocket,
    title: "We Start Building",
    text: "50% to start. 50% on delivery. Simple, fair, no surprises."
  }
];

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-xs"
          >
            HOW WE WORK
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(40px,7vw,72px)] font-black text-white mt-4 mb-6 tracking-tighter leading-[1.1]"
          >
            We Build Systems That <br className="hidden md:block" /> Grow Your Business.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/40 max-w-[720px] mx-auto font-medium"
          >
            Every project starts with understanding your exact problem. We do not sell packages. We solve problems. Pricing depends on scope, timeline, and what you actually need.
          </motion.p>
        </div>

        {/* Value Tracks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12 mb-32">
          {VALUE_TRACKS.map((track, i) => (
            <motion.div
              key={track.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <Card className={cn(
                "p-10 h-full flex flex-col relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border-white/10 shadow-2xl",
                track.popular ? "bg-white/[0.04] border-primary/50 shadow-primary/5" : "bg-white/[0.02]"
              )}>
                {track.popular && (
                  <div className="absolute top-0 right-0 py-2 px-6 bg-primary text-white font-black uppercase text-[8px] tracking-[0.3em] rounded-bl-2xl">
                    Most Popular
                  </div>
                )}
                <div className={cn("absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] -z-10 bg-gradient-to-br", track.color)} />

                <div className="mb-10">
                  <h3 className="text-3xl font-black text-white italic tracking-tighter mb-4">{track.name}</h3>
                  <p className="text-base text-white/40 font-medium leading-relaxed">{track.description}</p>
                </div>

                <ul className="space-y-4 mb-12 flex-grow">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6 italic">Expected Outcomes</p>
                  {track.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="text-primary" size={12} />
                      </div>
                      <span className="text-base font-medium text-white/60">{outcome}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="mt-auto">
                  <Button
                    className={cn(
                      "w-full h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all",
                      track.popular ? "bg-primary text-white hover:bg-primary/90" : "bg-white text-black hover:bg-white/90"
                    )}
                  >
                    {track.cta}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How Pricing Works Section */}
        <div className="space-y-16 mb-32">
           <div className="text-center">
              <h2 className="text-4xl font-black text-white tracking-tighter italic">How Pricing Actually Works.</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRICING_PROCESS.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] space-y-6 hover:border-primary/20 transition-all duration-500"
                >
                   <div className="p-4 bg-primary/10 rounded-2xl w-fit">
                      <point.icon className="text-primary" size={24} />
                   </div>
                   <h4 className="text-xl font-bold text-white tracking-tight italic">{point.title}</h4>
                   <p className="text-white/40 text-sm font-medium leading-relaxed">{point.text}</p>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group lg:pt-10"
        >
           <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
           <div className="relative bg-[#0A0A0A] border-2 border-primary/20 rounded-[56px] p-12 md:p-20 text-center space-y-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-20 opacity-[0.03]">
                 <MessageSquare size={300} />
              </div>
              
              <div className="space-y-6 relative z-10">
                 <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase">Not Sure Where <br /> to Start?</h2>
                 <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                   Most businesses we work with start with one question: what is the fastest way to get more customers online? Let us answer that for free.
                 </p>
              </div>

              <div className="space-y-6 relative z-10">
                 <Link href="/contact" className="inline-block">
                    <Button size="lg" className="h-20 px-16 rounded-3xl bg-white text-black font-black text-lg hover:bg-primary hover:text-white transition-all shadow-2xl group/btn">
                       Book Your Free 15 Minute Call 
                       <ArrowRight className="ml-3 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                 </Link>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                   No commitment. No sales pressure. Just clarity on what will actually help.
                 </p>
              </div>
           </div>
        </motion.div>

      </div>
    </div>
  );
}
