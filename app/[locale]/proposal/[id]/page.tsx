"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Zap, Shield, Globe, Target, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Reusing Constants locally for simplicity
const PACKAGES = {
  starter: {
    name: "Starter",
    timeline: "7 days",
    features: [
      "3-5 page website", "Mobile responsive", "Contact + WhatsApp integration",
      "Basic SEO setup", "SSL + fast hosting", "2 revision rounds", "14-day support"
    ]
  },
  growth: {
    name: "Growth",
    timeline: "14 days",
    features: [
      "8-10 pages", "Blog/news section", "Google Analytics", "90+ PageSpeed score",
      "n8n lead automation", "Admin content panel", "Priority support"
    ]
  },
  enterprise: {
    name: "Enterprise",
    timeline: "21-30 days",
    features: [
      "Custom web application", "Full n8n automation suite", "AI chat integration",
      "API integrations", "Custom admin dashboard", "Monthly maintenance", "Dedicated support channel"
    ]
  }
};

const CURRENCY_SYMBOLS: any = { INR: "₹", USD: "$", GBP: "£", EUR: "€" };

export default function PublicProposalView() {
  const params = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) fetchProposal();
  }, [params.id]);

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/proposals/${params.id}/view`);
      const data = await res.json();
      setProposal(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0D1B4B] flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!proposal) return (
    <div className="min-h-screen bg-[#0D1B4B] flex items-center justify-center text-white">
      <p className="text-xl font-black uppercase tracking-widest opacity-20 italic">Architectural Vault Unavailable</p>
    </div>
  );

  const sym = CURRENCY_SYMBOLS[proposal.currency] || "₹";

  return (
    <div className="bg-[#f0f2f5] min-h-screen py-20 px-4 md:px-0">
      <div className="max-w-[900px] mx-auto space-y-20">
        
        {/* Page 1 - Cover */}
        <section className="bg-white text-[#0D1B4B] p-12 md:p-24 shadow-2xl rounded-3xl relative overflow-hidden aspect-[1/1.414] flex flex-col justify-between">
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-24">
                 <div>
                   <h2 className="text-4xl font-black tracking-tighter leading-none">GrowXLabsTech</h2>
                   <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 italic mt-2">Engineering Digital Growth. Globally.</p>
                 </div>
                 <div className="px-8 py-3 bg-[#0D1B4B] text-white rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Proposal</span>
                 </div>
              </div>
              <div className="space-y-6">
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Prepared Exclusively For</p>
                 <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.85]">{proposal.business_name}</h1>
                 <div className="flex items-center gap-6 pt-6 italic">
                    <div className="h-0.5 w-16 bg-primary" />
                    <p className="text-2xl font-black text-neutral-300">{proposal.industry}</p>
                 </div>
              </div>
           </div>
           <div className="relative z-10 grid grid-cols-2 gap-12 border-t border-gray-100 pt-16">
              <div className="space-y-8">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Architect</p>
                    <p className="font-bold text-lg">Varshith Pujala</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Issued On</p>
                    <p className="font-bold text-sm">{new Date(proposal.created_at).toLocaleDateString()}</p>
                 </div>
              </div>
              <div className="text-right flex flex-col justify-end">
                 <p className="text-sm font-black text-primary uppercase tracking-widest italic">growxlabs.tech</p>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-2">hello@growxlabs.tech</p>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -z-0 -mr-96 -mt-96" />
        </section>

        {/* Challenge Section */}
        <section className="bg-white text-[#0D1B4B] p-12 md:p-24 shadow-2xl rounded-3xl space-y-16">
           <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary border-b-4 border-primary w-fit pb-3 italic">01. The Challenge</h2>
           <div className="space-y-12">
              <div className="bg-neutral-50 p-10 rounded-[2.5rem] space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-300 flex items-center gap-3">What We Understand</h4>
                 <p className="text-xl font-bold italic leading-relaxed">"{proposal.problem_description}"</p>
              </div>
              <div className="border-l-8 border-primary/20 pl-10 py-2">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary italic mb-4">The Impact of Inaction</h4>
                 <p className="text-2xl font-black tracking-tighter">{proposal.pain_point_cost}</p>
              </div>
           </div>
        </section>

        {/* Investment Section */}
        <section className="bg-white text-[#0D1B4B] p-12 md:p-24 shadow-2xl rounded-3xl space-y-16">
           <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary border-b-4 border-primary w-fit pb-3 italic text-center mx-auto">02. Selected Solution Architecture</h2>
           <div className="max-w-md mx-auto p-12 bg-primary/5 rounded-[3rem] border border-primary/10 space-y-8 text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">Architect's Pick</div>
              <div>
                 <h4 className="text-3xl font-black italic tracking-tighter text-primary uppercase">{proposal.selected_package}</h4>
                 <p className="text-4xl font-black mt-4">{sym}{proposal.custom_price?.toLocaleString() || "Standard Fee"}</p>
                 <div className="flex items-center justify-center gap-2 mt-4 opacity-40 font-black text-[10px] uppercase tracking-widest">
                    <Clock size={14} /> 14-Day Engineering Cycle
                 </div>
              </div>
              <ul className="space-y-4 text-left">
                 {PACKAGES[proposal.selected_package as keyof typeof PACKAGES]?.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-4 text-xs font-bold text-neutral-500">
                       <CheckCircle2 size={16} className="text-primary shrink-0" />
                       <span>{f}</span>
                    </li>
                 ))}
              </ul>
              <div className="pt-8 border-t border-primary/10">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Global Infrastructure Standard</p>
              </div>
           </div>
        </section>

        {/* Trust Section */}
        <section className="bg-[#0D1B4B] text-white p-12 md:p-24 shadow-2xl rounded-3xl space-y-20 relative overflow-hidden">
           <div className="relative z-10 space-y-6 text-center">
              <h2 className="text-[11px] font-black uppercase tracking-[0.6em] opacity-40 italic">03. The GrowXLabsTech Advantage</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter italic">We Build. We Operate.</h3>
              <p className="text-lg opacity-40 font-medium max-w-2xl mx-auto">Every solution we deploy is battle-tested on our own stack. We don't just build for clients; we build and operate 3 live AI products globally.</p>
           </div>
           <div className="relative z-10 grid md:grid-cols-3 gap-8">
              {["ResumeForgeAI", "UniversalAI", "RecruitAI"].map((p, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                   <Zap className="text-primary mb-6" size={24} />
                   <p className="font-black text-lg italic tracking-tight">{p}</p>
                   <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">{i===0 ? "Career Intelligence" : i===1 ? "AI Aggregator" : "Talent Acquisition"}</p>
                </div>
              ))}
           </div>
           <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-0 -mr-64 -mb-64" />
        </section>

        {/* Global CTA */}
        <section className="text-center space-y-12 py-10">
           <div className="space-y-4">
              <h3 className="text-5xl font-black tracking-tighter italic">Ready to Engineer Growth?</h3>
              <p className="text-neutral-400 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2">
                 <Clock size={16} className="text-primary" /> This Proposal Expires in 7 Days
              </p>
           </div>
           <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <a href={`mailto:hello@growxlabs.tech?subject=Accepted Proposal for ${proposal.business_name}`} className="px-12 py-6 bg-[#0D1B4B] text-white rounded-full font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-black transition-all">
                 Accept Architecture →
              </a>
              <a href="mailto:hello@growxlabs.tech?subject=Strategy Sync Request" className="font-black text-[11px] uppercase tracking-widest text-neutral-400 hover:text-black transition-all underline underline-offset-8">
                 Book Final Strategy Sync
              </a>
           </div>
        </section>

      </div>
    </div>
  );
}
