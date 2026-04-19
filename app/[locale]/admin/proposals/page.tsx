"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  FileText, Send, Download, Plus, 
  Trash2, ChevronRight, CheckCircle2, 
  Target, Rocket, Shield, Clock, 
  Globe, Briefcase, MapPin, Loader2,
  Package, Layout, Zap, Users,
  ExternalLink, Calendar, DollarSign,
  Copy, XCircle, CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Data Types & Constants ---

const CURRENCIES = [
  { label: "₹ INR", value: "INR", symbol: "₹" },
  { label: "$ USD", value: "USD", symbol: "$" },
  { label: "£ GBP", value: "GBP", symbol: "£" },
  { label: "€ EUR", value: "EUR", symbol: "€" }
];

const PACKAGES = {
  starter: {
    name: "Starter",
    price: { INR: "₹8k - 12k", USD: "$100 - 150", GBP: "£80 - 120", EUR: "€90 - 140" },
    timeline: "7 days",
    features: [
      "3-5 page website",
      "Mobile responsive",
      "Contact + WhatsApp integration",
      "Basic SEO setup",
      "SSL + fast hosting",
      "2 revision rounds",
      "14-day support"
    ],
    color: "from-blue-500/10 to-blue-500/5",
    accent: "text-blue-500"
  },
  growth: {
    name: "Growth",
    price: { INR: "₹20k - 35k", USD: "$250 - 420", GBP: "£200 - 330", EUR: "€230 - 380" },
    timeline: "14 days",
    features: [
      "8-10 pages",
      "Blog/news section",
      "Google Analytics",
      "90+ PageSpeed score",
      "n8n lead automation",
      "Admin content panel",
      "Priority support"
    ],
    color: "from-primary/10 to-primary/5",
    accent: "text-primary"
  },
  enterprise: {
    name: "Enterprise",
    price: { INR: "₹40k+", USD: "$500+", GBP: "£400+", EUR: "€450+" },
    timeline: "21-30 days",
    features: [
      "Custom web application",
      "Full n8n automation suite",
      "AI chat integration",
      "API integrations",
      "Custom admin dashboard",
      "Monthly maintenance",
      "Dedicated support channel"
    ],
    color: "from-purple-500/10 to-purple-500/5",
    accent: "text-purple-500"
  }
};

const COMPANY_DETAILS = {
  name: "GrowX Labs",
  founder: "Varshith Pujala",
  website: "growxlabs.tech",
  email: "hello@growxlabs.tech",
  tagline: "Engineering Digital Growth. Globally.",
};

const PRODUCTS = [
  { name: "ResumeForgeAI", description: "AI-Powered Career Intelligence" },
  { name: "UniversalAI", description: "Multi-Model AI Aggregator" },
  { name: "RecruitAI", description: "Autonomous Talent Sourcing" }
];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Form State ---
  const [form, setForm] = useState({
    clientName: "",
    businessName: "",
    country: "India",
    currency: "INR",
    industry: "",
    problem: "",
    impact: "",
    selectedPackage: "growth" as keyof typeof PACKAGES,
    customPrice: "",
    validDays: 7,
    callDate: "",
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/proposals/list");
      const data = await res.json();
      setProposals(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/proposals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowGenerator(false);
        fetchProposals();
      }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchProposals();
    } catch (e) { console.error(e); }
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-10 pb-20">
      <style jsx global>{`
        @media print {
          nav, aside, .no-print { display: none !important; }
          body { background: white !important; }
          .proposal-preview { 
             position: absolute; top: 0; left: 0; width: 100% !important; 
             height: auto !important; margin: 0 !important; padding: 0 !important;
          }
           .proposal-page {
            height: 297mm !important;
            page-break-after: always;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 2cm !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center no-print">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight italic">
             <Rocket className="text-primary" /> Proposal Engine v2
          </h1>
          <p className="text-white/40 font-medium">Engineer global digital assets that convert leads into revenue.</p>
        </div>
        <Button
          onClick={() => setShowGenerator(!showGenerator)}
          className="bg-white text-black font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-full shadow-2xl shadow-white/5"
        >
          {showGenerator ? "Discard Draft" : "New Global Proposal"}
        </Button>
      </div>

      <AnimatePresence>
        {showGenerator ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid lg:grid-cols-2 gap-10 no-print"
          >
            {/* FORM SIDE */}
            <Card className="p-8 border-white/5 bg-white/[0.02] space-y-8 h-fit sticky top-10 max-h-[90vh] overflow-y-auto">
               <div className="space-y-6">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4 italic">Lead Intelligence</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Client Name</label>
                        <input value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl h-12 px-4 text-sm font-bold text-white outline-none focus:border-primary" placeholder="Jane Doe" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Business Name</label>
                        <input value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl h-12 px-4 text-sm font-bold text-white outline-none focus:border-primary" placeholder="Acme Global" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Country</label>
                        <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl h-12 px-4 text-sm font-bold text-white outline-none focus:border-primary">
                           <option value="India" className="bg-neutral-900">India</option>
                           <option value="United States" className="bg-neutral-900">United States</option>
                           <option value="United Kingdom" className="bg-neutral-900">United Kingdom</option>
                           <option value="Canada" className="bg-neutral-900">Canada</option>
                           <option value="Germany" className="bg-neutral-900">Germany</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Currency</label>
                        <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl h-12 px-4 text-sm font-bold text-white outline-none focus:border-primary">
                           {CURRENCIES.map(c => <option key={c.value} value={c.value} className="bg-neutral-900">{c.label}</option>)}
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Industry / Niche</label>
                     <input value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl h-12 px-4 text-sm font-bold text-white outline-none focus:border-primary" placeholder="SaaS / Real Estate / Fintech" />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Pain Point Description</label>
                     <textarea value={form.problem} onChange={e => setForm({...form, problem: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-primary min-h-[80px]" placeholder="What specific problem are they facing?" />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Business Impact (The Cost)</label>
                     <textarea value={form.impact} onChange={e => setForm({...form, impact: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-primary min-h-[80px]" placeholder="What is this costing their business monthly?" />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Solution Architecture</h3>
                     <div className="grid grid-cols-3 gap-3">
                        {Object.keys(PACKAGES).map(pk => (
                           <button 
                             key={pk} onClick={() => setForm({...form, selectedPackage: pk as any})}
                             className={cn("p-4 rounded-2xl border transition-all flex flex-col items-center", form.selectedPackage === pk ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/5 text-white/20 hover:border-white/10")}
                           >
                              <span className="text-[9px] font-black uppercase tracking-widest mb-1">{PACKAGES[pk as keyof typeof PACKAGES].name}</span>
                              <span className="text-[8px] opacity-60 font-bold">{PACKAGES[pk as keyof typeof PACKAGES].price[form.currency as 'INR']}</span>
                           </button>
                        ))}
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Price Override</label>
                           <input value={form.customPrice} onChange={e => setForm({...form, customPrice: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl h-11 px-4 text-sm font-bold text-white outline-none focus:border-primary" placeholder="e.g. ₹28,000" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Discovery Call</label>
                           <input type="datetime-local" value={form.callDate} onChange={e => setForm({...form, callDate: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl h-11 px-4 text-xs font-bold text-white outline-none focus:border-primary" />
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 grid grid-cols-2 gap-4">
                     <Button onClick={handleCreate} disabled={submitting} className="h-14 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-3xl shadow-2xl">
                        {submitting ? <Loader2 className="animate-spin" /> : "Deploy Architecture"}
                     </Button>
                     <Button onClick={handlePrint} variant="outline" className="h-14 border-white/10 font-black uppercase text-[10px] tracking-widest rounded-3xl">System Print</Button>
                  </div>
               </div>
            </Card>

            {/* PREVIEW SIDE */}
            <div className="proposal-preview space-y-12 h-[90vh] overflow-y-auto scrollbar-hide rounded-[2rem] pb-20">
               {/* PAGE 1 - COVER */}
               <div className="proposal-page bg-white text-[#0D1B4B] p-24 flex flex-col justify-between shadow-2xl relative overflow-hidden aspect-[1/1.414]">
                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-24">
                        <div className="space-y-2">
                           <h2 className="text-4xl font-black tracking-tighter leading-none">{COMPANY_DETAILS.name}</h2>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">{COMPANY_DETAILS.tagline}</p>
                        </div>
                        <div className="px-8 py-3 bg-[#0D1B4B] text-white rounded-full">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Proposal</span>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Prepared Exclusively For</p>
                        <h1 className="text-7xl font-black tracking-tight leading-[0.85]">{form.businessName || "Dynamic Enterprise Entity"}</h1>
                        <div className="flex items-center gap-6 pt-6">
                           <div className="h-0.5 w-16 bg-primary" />
                           <p className="text-2xl font-black text-neutral-300 italic">{form.industry || "Target Industry Sector"}</p>
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 gap-12 border-t border-gray-100 pt-16">
                     <div className="space-y-8">
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Project Directive</p>
                           <p className="font-bold text-lg">Full-Stack Digital Infrastructure</p>
                        </div>
                        <div className="flex gap-12">
                           <div>
                              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Issued On</p>
                              <p className="font-bold text-sm">{new Date().toLocaleDateString()}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Discovery Call</p>
                              <p className="font-bold text-sm tracking-tighter">{form.callDate ? new Date(form.callDate).toLocaleString() : "TBD"}</p>
                           </div>
                        </div>
                     </div>
                     <div className="text-right space-y-8">
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Architect</p>
                           <p className="font-bold text-lg">{COMPANY_DETAILS.founder}</p>
                           <p className="text-[10px] font-black uppercase text-primary tracking-widest mt-1">Founding Engineer, GrowX Labs</p>
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] space-y-1">
                           <p className="text-neutral-300">{COMPANY_DETAILS.website}</p>
                           <p className="text-neutral-300">{COMPANY_DETAILS.email}</p>
                        </div>
                     </div>
                  </div>
                  
                  {/* Backdrop Decoration */}
                  <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -z-0 -mr-96 -mt-96" />
               </div>

               {/* PAGE 2 - CHALLENGE */}
               <div className="proposal-page bg-white text-[#0D1B4B] p-24 flex flex-col justify-center shadow-2xl space-y-20 aspect-[1/1.414] relative overflow-hidden">
                  <div className="space-y-6">
                     <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary border-b-4 border-primary w-fit pb-3 italic">01. The Challenge</h2>
                     <h3 className="text-5xl font-black tracking-tighter leading-tight">We Understand Your Bottlenecks.</h3>
                  </div>

                  <div className="grid gap-16 relative z-10">
                     <div className="space-y-6 bg-neutral-50 p-12 rounded-[3rem]">
                        <h4 className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-neutral-300"><Target className="text-primary" size={24} /> What We Heard</h4>
                        <p className="text-xl text-neutral-700 leading-relaxed font-bold tracking-tight">
                           "{form.problem || "Your current digital presence fails to match the scale of your ambition. You are losing high-intent leads due to technical friction and manual overhead."}"
                        </p>
                     </div>

                     <div className="space-y-6 border-l-8 border-primary/20 pl-12 py-4">
                        <h4 className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-primary italic"><Shield size={24} /> The Cost of Inaction</h4>
                        <p className="text-2xl text-primary leading-tight font-black tracking-tighter">
                           {form.impact || "Every 24 hours without a high-performance system is a day of uncaptured revenue and operational stagnation."}
                        </p>
                     </div>

                     <div className="space-y-4 px-12">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 italic">Our Strategic Directive</h4>
                        <p className="text-lg text-neutral-500 leading-relaxed font-bold">
                           GrowX Labs doesn't build simple websites. We engineer revenue assets. Our mission is to eliminate the friction between your business and your global growth.
                        </p>
                     </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-0 -ml-32 -mb-32" />
               </div>

               {/* PAGE 3 - INVESTMENT */}
               <div className="proposal-page bg-white text-[#0D1B4B] p-16 flex flex-col justify-center shadow-2xl space-y-16 aspect-[1/1.414]">
                  <div className="text-center space-y-4">
                     <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary italic">02. Investment Architecture</h2>
                     <h3 className="text-5xl font-black tracking-tighter italic">Scales for Global Infrastructure.</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                     {Object.keys(PACKAGES).map(pk => {
                        const p = PACKAGES[pk as keyof typeof PACKAGES];
                        const isSelected = form.selectedPackage === pk;
                        return (
                          <div 
                            key={pk} 
                            className={cn(
                              "p-8 rounded-[2.5rem] border-2 flex flex-col h-full relative transition-all duration-500",
                              isSelected ? "border-primary bg-primary/[0.02] shadow-2xl shadow-primary/10 scale-[1.05]" : "border-neutral-100 bg-white"
                            )}
                          >
                             {isSelected && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-lg">Recommended</div>}
                             <div className="mb-8">
                               <h4 className={cn("text-2xl font-black tracking-tighter italic", isSelected ? "text-primary" : "text-neutral-300")}>{p.name}</h4>
                               <p className="text-sm font-black mt-2 tracking-tight">
                                 {form.selectedPackage === pk && form.customPrice ? form.customPrice : p.price[form.currency as 'INR']}
                               </p>
                               <div className="flex items-center gap-2 mt-2 opacity-40">
                                  <Clock size={12} />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">{p.timeline}</span>
                               </div>
                             </div>
                             <ul className="space-y-4 flex-grow mb-10">
                                {p.features.map((f, i) => (
                                  <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-neutral-500 leading-tight">
                                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                                    <span>{f}</span>
                                  </li>
                                ))}
                             </ul>
                             <div className={cn(
                               "w-full py-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                               isSelected ? "bg-[#0D1B4B] text-white shadow-xl shadow-[#0D1B4B]/20" : "bg-neutral-50 text-neutral-300"
                             )}>
                                Chosen Vector
                             </div>
                          </div>
                        )
                     })}
                  </div>

                  <p className="text-center text-[10px] text-neutral-300 font-bold max-w-2xl mx-auto leading-relaxed border-t border-neutral-50 pt-8 italic">
                     *All architectural fees are inclusive of post-deployment support and core maintenance. Custom price overrides reflect specialized automation logic as defined in discovery.
                  </p>
               </div>

               {/* PAGE 4 - WHY US */}
               <div className="proposal-page bg-white text-[#0D1B4B] p-24 flex flex-col justify-center shadow-2xl space-y-20 aspect-[1/1.414]">
                  <div className="space-y-6 text-center">
                     <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary italic underline underline-offset-8">03. The GrowX Labs Advantage</h2>
                     <h3 className="text-6xl font-black tracking-tighter">We Don't Just Build.<br /><span className="text-primary italic">We Operate.</span></h3>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                     {PRODUCTS.map((prod, idx) => (
                        <div key={idx} className="bg-neutral-50 p-10 rounded-[3rem] border border-neutral-100 flex flex-col justify-between group hover:bg-primary transition-all duration-500">
                           <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-neutral-100 group-hover:bg-white/10 group-hover:border-transparent">
                              <Zap size={24} className="text-primary group-hover:text-white" />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-xl font-black tracking-tight group-hover:text-white">{prod.name}</h4>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-white/60">{prod.description}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-3 gap-12 pt-12">
                     {[
                       { icon: Zap, title: "AI-Powered", desc: "3x faster delivery through AI-first workflows." },
                       { icon: Shield, title: "Accountable", desc: "MSME registered Indian entity (UDYAM)." },
                       { icon: Globe, title: "Global Reach", desc: "India-built assets serving global markets." }
                     ].map((t, idx) => (
                        <div key={idx} className="space-y-4">
                           <div className="flex items-center gap-3">
                              <t.icon size={20} className="text-primary" />
                              <h5 className="text-[11px] font-black uppercase tracking-widest">{t.title}</h5>
                           </div>
                           <p className="text-[10px] font-bold text-neutral-400 leading-relaxed">{t.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* PAGE 5 - NEXT STEPS */}
               <div className="proposal-page bg-[#0D1B4B] text-white p-24 flex flex-col justify-between shadow-2xl aspect-[1/1.414] relative overflow-hidden">
                  <div className="space-y-16 relative z-10">
                     <div className="text-center space-y-6 mb-16">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.6em] opacity-30 italic">Execution Protocol</h2>
                        <h3 className="text-7xl font-black tracking-tighter leading-none italic">Let's Start.</h3>
                     </div>

                     <div className="grid gap-4">
                        {[
                          { step: "01", title: "Review & Reply", action: "Confirm your chosen tier via email or our secure portal." },
                          { step: "02", title: "Digital Agreement", action: "We dispatch the MSA and Project Proposal within 2-4 hours." },
                          { step: "03", title: "Kickoff Advance", action: "Pay 50% advance to move into full-scale production." },
                          { step: "04", title: "Build Sprint", action: "Project starts instantly. Dashboard access provided." },
                          { step: "05", title: "Global Launch", action: "Ship your high-performance asset to the world." }
                        ].map((s, idx) => (
                          <div key={idx} className="flex items-center gap-10 bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-all group">
                             <span className="text-[10px] font-black opacity-20 group-hover:opacity-100 transition-opacity tracking-[0.5em]">{s.step}</span>
                             <div className="space-y-1">
                                <p className="text-lg font-black tracking-tight group-hover:italic transition-all">{s.title}</p>
                                <p className="text-[11px] opacity-40 font-medium leading-relaxed uppercase tracking-widest">{s.action}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="text-center relative z-10 space-y-12">
                     <div className="inline-flex flex-col gap-6">
                        <div className="px-16 py-5 bg-white text-[#0D1B4B] rounded-full font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-neutral-100 transition-all cursor-pointer">
                           Accept Architecture → hello@growxlabs.tech
                        </div>
                        <div className="flex items-center justify-center gap-4 opacity-40">
                           <div className="h-[1px] w-12 bg-white" />
                           <p className="text-[9px] font-black tracking-[0.3em] uppercase underline cursor-pointer">Or Book Your Final Strategy Sync</p>
                           <div className="h-[1px] w-12 bg-white" />
                        </div>
                     </div>
                     <p className="text-[9px] font-black uppercase opacity-20 tracking-[0.5em]">This architectural proposal expires in 7 business days</p>
                  </div>
                  
                  {/* Backdrop Decoration */}
                  <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[200px] -z-0 -ml-[500px] -mt-[500px]" />
               </div>
            </div>
          </motion.div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
               <h2 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-3">
                  Proposal Repositories <span className="h-6 px-3 bg-white/5 rounded-full text-[10px] font-bold flex items-center non-italic tracking-widest border border-white/5">{proposals.length} TOTAL</span>
               </h2>
               <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                  {["all", "sent", "viewed", "accepted", "rejected"].map((st) => (
                    <button 
                      key={st} className={cn("h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", st === "all" ? "bg-white text-black" : "text-white/40 hover:text-white")}
                    >
                      {st}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid gap-4">
              {loading ? (
                 <div className="h-64 flex items-center justify-center border border-white/5 border-dashed rounded-[3rem]">
                    <Loader2 className="animate-spin text-white/20" />
                 </div>
              ) : proposals.length > 0 ? (
                 proposals.map((p, i) => {
                    const statusColors: any = { sent: "text-blue-500", viewed: "text-purple-500", accepted: "text-green-500", rejected: "text-red-500" };
                    return (
                       <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                          <Card className="p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group rounded-[2.5rem]">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="flex items-center gap-8">
                                   <div className="h-16 w-16 bg-white/5 rounded-3xl flex items-center justify-center text-white/20 border border-white/5 shadow-2xl group-hover:text-primary transition-colors">
                                      <FileText size={28} />
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-3 mb-2">
                                         <h3 className="text-xl font-black text-white tracking-tighter leading-none hover:italic transition-all cursor-pointer">{p.business_name || "Unidentified Niche"}</h3>
                                         <span className={cn("h-4 px-2 bg-white/5 rounded text-[8px] font-black uppercase tracking-widest flex items-center", statusColors[p.status])}>
                                            {p.status}
                                         </span>
                                         {p.viewed_at && <span className="h-4 px-2 bg-green-500/10 text-green-500 text-[8px] font-black rounded flex items-center">VIEWED</span>}
                                      </div>
                                      <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em]">
                                         <span className="text-white/40">{p.client_name}</span>
                                         <span className="w-1 h-1 bg-white/10 rounded-full" />
                                         <span className="text-primary italic tracking-normal font-bold">{p.selected_package?.toUpperCase()} PKG</span>
                                         <span className="w-1 h-1 bg-white/10 rounded-full" />
                                         <span className="text-white/20 font-medium tracking-normal italic">Valid until: {new Date(p.valid_until).toLocaleDateString()}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                                   <div className="flex items-center -space-x-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                      <Button onClick={() => updateStatus(p.id, 'accepted')} title="Mark Accepted" variant="outline" className="h-10 w-10 p-0 border-white/5 rounded-xl hover:bg-green-500 hover:text-white"><CheckSquare size={16} /></Button>
                                      <Button onClick={() => updateStatus(p.id, 'rejected')} title="Mark Rejected" variant="outline" className="h-10 w-10 p-0 border-white/5 rounded-xl hover:bg-red-500 hover:text-white"><XCircle size={16} /></Button>
                                      <Button onClick={() => {
                                         navigator.clipboard.writeText(`${window.location.origin}/proposal/${p.id}`);
                                         alert("Share link copied to clipboard!");
                                      }} title="Copy Client Link" variant="outline" className="h-10 w-10 p-0 border-white/5 rounded-xl hover:bg-white hover:text-black"><Copy size={16} /></Button>
                                      <Button variant="outline" className="h-10 w-10 p-0 border-white/5 rounded-xl hover:bg-primary hover:text-white" onClick={async () => {
                                          const res = await fetch("/api/proposals/send", {
                                            method: "POST", headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ proposalId: p.id })
                                          });
                                          if (res.ok) alert("Email Dispatched.");
                                      }}><Send size={16} /></Button>
                                   </div>
                                   <Link href={`/proposal/${p.id}`} target="_blank">
                                      <Button className="h-12 px-8 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-white/5">
                                         Review Vault
                                      </Button>
                                   </Link>
                                </div>
                             </div>
                          </Card>
                       </motion.div>
                    )
                 })
              ) : (
                 <div className="h-64 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-[3rem] space-y-4">
                    <p className="text-white/20 text-xs font-black uppercase tracking-[0.4em] italic">Proposals Repository Void</p>
                 </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
