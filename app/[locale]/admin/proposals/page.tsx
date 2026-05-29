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
  Copy, XCircle, CheckSquare, Printer
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
  name: "GrowXLabsTech",
  founder: "Varshith Pujala",
  website: "growxlabs.tech",
  email: "hello@growxlabs.tech",
  tagline: "Engineering Digital Growth. Globally.",
};

const CAPABILITIES = [
  { 
    name: "Custom Web Architectures", 
    description: "High-performance React/Next.js systems designed strictly for lead capturing and speed optimization.",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
  },
  { 
    name: "Intelligent Systems Automation", 
    description: "Tailored server-side n8n processes, lead routing, autonomous webhook hooks, and custom CRM syncing.",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
  },
  { 
    name: "Technical Infrastructure & SLAs", 
    description: "Secure Cloudflare CDN staging, database encryption layers, SSL certifications, and post-deployment maintenance.",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.599-3.749A11.96 11.96 0 0112 2.714z"
  }
];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

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
      if (!res.ok) {
        console.error(`API Error: ${res.status}`);
        setProposals([]);
        return;
      }
      const data = await res.json();
      setProposals(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (e) { 
      console.error(e);
      setProposals([]);
    }
    finally { setLoading(false); }
  };

  const filteredProposals = useMemo(() => {
    if (!Array.isArray(proposals)) return [];
    return proposals.filter(p => p && typeof p === 'object' && (activeFilter === "all" || p.status === activeFilter));
  }, [proposals, activeFilter]);

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
          nav, aside, .no-print, header, footer { display: none !important; }
          body, html { background: white !important; color: black !important; }
          .proposal-preview { 
             position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; 
             height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important;
          }
          .proposal-page-wrapper {
             margin: 0 !important;
             padding: 0 !important;
             page-break-after: always;
             background: white !important;
          }
          .proposal-page {
             width: 210mm !important;
             height: 297mm !important;
             box-shadow: none !important;
             border: none !important;
             margin: 0 !important;
             padding: 2.2cm !important;
             background: white !important;
             color: black !important;
          }
          .proposal-page * {
             color: black !important;
          }
          .text-primary, .text-\[\#355CFF\] {
             color: #355CFF !important;
          }
          .bg-zinc-50, .bg-neutral-50, .bg-zinc-100\/50 {
             background-color: #f8fafc !important;
             border-color: #e2e8f0 !important;
          }
          .border-zinc-200\/60, .border-zinc-200, .border-zinc-150 {
             border-color: #e2e8f0 !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center no-print border-b border-zinc-800/40 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Rocket size={16} />
             </div>
             <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight italic">
                Proposal Engine v2
             </h1>
          </div>
          <p className="text-[var(--text-secondary)] text-sm max-w-xl font-medium">
             Deploy luxury digital solutions and outbound architectural agreements globally.
          </p>
        </div>
        <Button
          onClick={() => setShowGenerator(!showGenerator)}
          className="bg-white hover:bg-zinc-200 text-black font-black uppercase text-[10px] tracking-[0.2em] h-12 px-8 rounded-xl shadow-2xl transition-all"
        >
          {showGenerator ? "Discard Draft" : "New Global Proposal"}
        </Button>
      </div>

      <AnimatePresence>
        {showGenerator ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="grid lg:grid-cols-2 gap-10 no-print"
          >
            {/* FORM SIDE */}
            <Card className="p-8 border border-zinc-800 bg-[#0B0F19] rounded-2xl space-y-8 h-fit sticky top-10 max-h-[85vh] overflow-y-auto no-scrollbar shadow-3xl">
               <div className="space-y-6">
                  <div>
                     <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary border-b border-zinc-800 pb-3 mb-6 italic">Lead Intelligence</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Client Name</label>
                        <input value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl h-11 px-4 text-sm font-medium text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-600" placeholder="Jane Doe" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Business Name</label>
                        <input value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl h-11 px-4 text-sm font-medium text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-600" placeholder="Acme Global" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Country</label>
                        <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl h-11 px-4 text-sm font-medium text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all">
                           <option value="India" className="bg-zinc-950">India</option>
                           <option value="United States" className="bg-zinc-950">United States</option>
                           <option value="United Kingdom" className="bg-zinc-950">United Kingdom</option>
                           <option value="Canada" className="bg-zinc-950">Canada</option>
                           <option value="Germany" className="bg-zinc-950">Germany</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Currency</label>
                        <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl h-11 px-4 text-sm font-medium text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all">
                           {CURRENCIES.map(c => <option key={c.value} value={c.value} className="bg-zinc-950">{c.label}</option>)}
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Industry / Niche</label>
                     <input value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl h-11 px-4 text-sm font-medium text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-600" placeholder="SaaS / Real Estate / Fintech" />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Pain Point Description</label>
                     <textarea value={form.problem} onChange={e => setForm({...form, problem: e.target.value})} className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 text-sm font-medium text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-600 min-h-[90px] no-scrollbar" placeholder="What specific problem are they facing?" />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Business Impact (The Cost)</label>
                     <textarea value={form.impact} onChange={e => setForm({...form, impact: e.target.value})} className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 text-sm font-medium text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-600 min-h-[90px] no-scrollbar" placeholder="What is this costing their business monthly?" />
                  </div>

                  <div className="space-y-4 pt-6 border-t border-zinc-800/80">
                     <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Solution Architecture</label>
                     <div className="grid grid-cols-3 gap-3 bg-zinc-950/40 p-1.5 border border-zinc-800 rounded-xl">
                        {Object.keys(PACKAGES).map(pk => {
                           const p = PACKAGES[pk as keyof typeof PACKAGES];
                           const isSelected = form.selectedPackage === pk;
                           return (
                              <button 
                                type="button"
                                key={pk} 
                                onClick={() => setForm({...form, selectedPackage: pk as any})}
                                className={cn(
                                   "p-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer", 
                                   isSelected 
                                     ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                     : "bg-transparent border-transparent text-zinc-400 hover:text-white"
                                )}
                              >
                                 <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{p.name}</span>
                                 <span className="text-[8px] opacity-75 font-semibold mt-1">{p.price[form.currency as 'INR']}</span>
                              </button>
                           );
                        })}
                     </div>
                     <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                           <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Price Override</label>
                           <input value={form.customPrice} onChange={e => setForm({...form, customPrice: e.target.value})} className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl h-11 px-4 text-sm font-medium text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-600" placeholder="e.g. ₹28,000" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-1">Discovery Call</label>
                           <input type="datetime-local" value={form.callDate} onChange={e => setForm({...form, callDate: e.target.value})} className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl h-11 px-4 text-xs font-medium text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" />
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 grid grid-cols-2 gap-4">
                     <Button 
                        onClick={handleCreate} 
                        disabled={submitting} 
                        className="h-14 bg-white hover:bg-zinc-200 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                     >
                        {submitting ? <Loader2 className="animate-spin" size={14} /> : <CheckSquare size={14} />}
                        Deploy Architecture
                     </Button>
                     <Button 
                        onClick={handlePrint} 
                        variant="outline" 
                        className="h-14 border border-zinc-800 hover:border-zinc-700 bg-transparent text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                     >
                        <Printer size={14} />
                        System Print
                     </Button>
                  </div>
               </div>
            </Card>

            {/* PREVIEW SIDE (DRAFTBOARD CANVAS) */}
            <div className="proposal-preview space-y-16 h-[85vh] overflow-y-auto no-scrollbar rounded-2xl pb-24 bg-zinc-950 border border-zinc-900 shadow-3xl p-8 relative bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px]">
               
               {/* PAGE 1 - COVER */}
               <div className="proposal-page-wrapper space-y-3">
                  <div className="flex justify-between items-center px-4">
                     <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">PAGE 01 — COVER PAGE</span>
                     <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div className="proposal-page bg-[#FAF9F6] text-slate-900 p-20 flex flex-col justify-between shadow-2xl relative overflow-hidden aspect-[1/1.414]">
                     <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-[#355CFF] rounded flex items-center justify-center text-white text-[10px] font-black italic">G</div>
                              <h2 className="text-sm font-bold tracking-tight uppercase">{COMPANY_DETAILS.name}</h2>
                           </div>
                           <p className="text-[8px] font-mono font-bold uppercase tracking-[0.4em] text-zinc-400">{COMPANY_DETAILS.tagline}</p>
                        </div>
                        <div className="px-4 py-1.5 border border-[#355CFF]/20 bg-[#355CFF]/5 text-[#355CFF] rounded-full text-[8px] font-mono font-bold uppercase tracking-widest">
                           PARTNERSHIP BRIEF
                        </div>
                     </div>

                     <div className="relative z-10 my-auto space-y-6">
                        <div className="space-y-2">
                           <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-[#355CFF] block">SYSTEM ENGINEERING PROPOSAL</span>
                           <h1 className="text-4xl font-extrabold tracking-tight leading-none text-zinc-900 break-words max-w-[90%]">
                              {form.businessName || "Dynamic Enterprise"}
                           </h1>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="h-[1.5px] w-12 bg-[#355CFF]" />
                           <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                              {form.industry || "Target Sector"}
                           </span>
                        </div>
                     </div>

                     <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-zinc-200/60 pt-8 mt-auto">
                        <div className="grid grid-cols-2 gap-4 text-[9px] font-mono">
                           <div className="space-y-1">
                              <span className="text-zinc-400 uppercase tracking-wider block">PROJECT INITIATIVE</span>
                              <span className="font-bold text-zinc-700">Digital Solutions Framework</span>
                           </div>
                           <div className="space-y-1">
                              <span className="text-zinc-400 uppercase tracking-wider block">DATE ISSUED</span>
                              <span className="font-bold text-zinc-700">{new Date().toLocaleDateString()}</span>
                           </div>
                        </div>
                        <div className="text-right space-y-1">
                           <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">LEAD ENGINEERING ARCHITECT</span>
                           <span className="text-xs font-bold text-zinc-800 block">{COMPANY_DETAILS.founder}</span>
                           <span className="text-[8px] font-mono font-bold text-[#355CFF] uppercase tracking-widest block">{COMPANY_DETAILS.email}</span>
                        </div>
                     </div>
                     
                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-0 -mr-60 -mt-60" />
                  </div>
               </div>

               {/* PAGE 2 - CHALLENGE */}
               <div className="proposal-page-wrapper space-y-3">
                  <div className="flex justify-between items-center px-4">
                     <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">PAGE 02 — GAP ASSESSMENT</span>
                     <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <div className="proposal-page bg-[#FAF9F6] text-slate-900 p-20 flex flex-col justify-between shadow-2xl relative overflow-hidden aspect-[1/1.414]">
                     <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3 text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                        <span>GROWXLABSTECH · SYSTEM BRIEFING</span>
                        <span>REF: GXL-{new Date().getFullYear()}-PRP</span>
                     </div>

                     <div className="my-auto space-y-8">
                        <div className="space-y-1.5">
                           <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#355CFF] block">01 / ANALYTICS DECK</span>
                           <h3 className="text-2xl font-bold tracking-tight text-zinc-950 leading-tight">Operational Gap Assessment</h3>
                        </div>

                        <div className="grid grid-cols-12 gap-8 pt-4">
                           {/* Left Side: Client Pain Points */}
                           <div className="col-span-7 space-y-4">
                              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400 block">OBSERVED OPERATIONAL CHALLENGES</span>
                              <div className="bg-zinc-50 border border-zinc-200/30 p-5 rounded-xl">
                                 <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                                    {form.problem ? `"${form.problem}"` : "Your current system parameters fall short of optimizing global operations, causing drop-offs in customer response speed and structural performance."}
                                 </p>
                              </div>
                              <div className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                                 Analyzing the current framework reveals a core need for architectural restructuring to achieve fast loading speeds and reliable conversions.
                              </div>
                           </div>

                           {/* Right Side: Cost of Inaction */}
                           <div className="col-span-5 flex flex-col justify-between border-l border-zinc-200 pl-8 space-y-4">
                              <div className="space-y-2">
                                 <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#355CFF] block">OPERATIONAL IMPACT</span>
                                 <p className="text-xs font-semibold text-zinc-700 leading-relaxed">
                                    {form.impact || "Every day without dynamic optimizations directly reduces platform scalability and structural customer retention."}
                                 </p>
                              </div>
                              
                              <div className="space-y-1.5 pt-4 border-t border-zinc-150">
                                 <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">RESOLUTION DIRECTIVE</span>
                                 <p className="text-[9px] text-zinc-500 leading-relaxed">
                                    Deploy a high-performance system structure engineered to minimize operational friction and maximize retention.
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex justify-between items-center border-t border-zinc-200/50 pt-3 text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400 mt-auto">
                        <span>CONFIDENTIAL · OPERATIONAL GAP DECK</span>
                        <span>PAGE 02 OF 05</span>
                     </div>
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-0 -ml-32 -mb-32" />
                  </div>
               </div>

               {/* PAGE 3 - INVESTMENT */}
               <div className="proposal-page-wrapper space-y-3">
                  <div className="flex justify-between items-center px-4">
                     <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">PAGE 03 — ARCHITECTURE & INVESTMENT</span>
                     <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <div className="proposal-page bg-[#FAF9F6] text-slate-900 p-20 flex flex-col justify-between shadow-2xl aspect-[1/1.414]">
                     <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3 text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                        <span>GROWXLABSTECH · SYSTEM BRIEFING</span>
                        <span>REF: GXL-{new Date().getFullYear()}-PRP</span>
                     </div>

                     <div className="my-auto space-y-8">
                        <div className="text-center space-y-1.5">
                           <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#355CFF]">02 / STRATEGY FRAMEWORK</span>
                           <h3 className="text-2xl font-bold tracking-tight text-zinc-950 leading-tight">Investment Architecture</h3>
                           <p className="text-[10px] text-zinc-400 max-w-xl mx-auto">Scalable system integrations structured for professional corporate returns.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                           {Object.keys(PACKAGES).map(pk => {
                              const p = PACKAGES[pk as keyof typeof PACKAGES];
                              const isSelected = form.selectedPackage === pk;
                              return (
                                 <div 
                                   key={pk} 
                                   className={cn(
                                      "p-4 rounded-xl border flex flex-col justify-between h-[300px] relative transition-all duration-300",
                                      isSelected 
                                        ? "border-[#355CFF] bg-[#355CFF]/[0.01] shadow-lg shadow-[#355CFF]/5" 
                                        : "border-zinc-200 bg-white"
                                   )}
                                 >
                                    {isSelected && (
                                       <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#355CFF] text-white px-2.5 py-0.5 rounded-full text-[6px] font-mono font-bold uppercase tracking-wider shadow-sm">
                                          SELECTED ARCHITECTURE
                                       </div>
                                    )}
                                    
                                    <div>
                                       <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">TIER LEVEL</span>
                                       <h4 className={cn("text-xs font-black uppercase mt-0.5", isSelected ? "text-[#355CFF]" : "text-zinc-700")}>{p.name}</h4>
                                       
                                       <div className="mt-4 space-y-0.5">
                                          <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">FEES</span>
                                          <p className="text-sm font-extrabold text-zinc-900 tracking-tight">
                                             {isSelected && form.customPrice ? form.customPrice : p.price[form.currency as 'INR']}
                                          </p>
                                       </div>

                                       <div className="flex items-center gap-1.5 mt-2.5 text-[8px] text-zinc-400 font-bold uppercase">
                                          <Clock size={11} className="text-zinc-400 shrink-0" />
                                          <span>Engineering: {p.timeline}</span>
                                       </div>
                                    </div>

                                    <ul className="space-y-1.5 mt-4 pt-3 border-t border-zinc-150 flex-1 overflow-hidden">
                                       {p.features.slice(0, 5).map((f, i) => (
                                          <li key={i} className="flex items-start gap-1.5 text-[8px] font-medium text-zinc-500 leading-tight">
                                             <CheckCircle2 size={10} className="text-[#355CFF] shrink-0 mt-0.5" />
                                             <span className="truncate">{f}</span>
                                          </li>
                                       ))}
                                    </ul>

                                    <div className={cn(
                                       "w-full py-2 rounded-lg text-center text-[7px] font-mono font-bold uppercase tracking-wider mt-3",
                                       isSelected ? "bg-zinc-900 text-white font-extrabold" : "bg-zinc-100 text-zinc-400"
                                    )}>
                                       {isSelected ? "CHOSEN DIRECTION" : "AVAILABLE"}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>

                        <p className="text-center text-[7px] text-zinc-400 font-mono max-w-lg mx-auto leading-relaxed border-t border-zinc-200/50 pt-3">
                           *All architectural fees are inclusive of post-deployment support and core maintenance. Custom price overrides reflect specialized automation logic as defined in discovery.
                        </p>
                     </div>

                     <div className="flex justify-between items-center border-t border-zinc-200/50 pt-3 text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400 mt-auto">
                        <span>CONFIDENTIAL · INVESTMENT FRAMEWORK</span>
                        <span>PAGE 03 OF 05</span>
                     </div>
                  </div>
               </div>

               {/* PAGE 4 - CAPABILITIES */}
               <div className="proposal-page-wrapper space-y-3">
                  <div className="flex justify-between items-center px-4">
                     <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">PAGE 04 — CORE CAPABILITIES</span>
                     <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <div className="proposal-page bg-[#FAF9F6] text-slate-900 p-20 flex flex-col justify-between shadow-2xl aspect-[1/1.414]">
                     <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3 text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                        <span>GROWXLABSTECH · SYSTEM BRIEFING</span>
                        <span>REF: GXL-{new Date().getFullYear()}-PRP</span>
                     </div>

                     <div className="my-auto space-y-8">
                        <div className="text-center space-y-1.5">
                           <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#355CFF]">03 / ENGINEERING VALUE</span>
                           <h3 className="text-2xl font-bold tracking-tight text-zinc-950 leading-tight">Core Capabilities & Scope</h3>
                           <p className="text-[10px] text-zinc-400 max-w-xl mx-auto">Custom technology assets deployed to secure corporate performance and data scaling.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                           {CAPABILITIES.map((cap, idx) => (
                              <div key={idx} className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl flex flex-col justify-between h-[160px]">
                                 <div className="h-8 w-8 bg-white border border-zinc-200 rounded-lg flex items-center justify-center mb-4 shadow-sm shrink-0">
                                    <svg className="w-4 h-4 text-[#355CFF]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" d={cap.icon} />
                                    </svg>
                                 </div>
                                 <div className="space-y-1 flex-1 flex flex-col justify-end">
                                    <h4 className="text-[11px] font-bold tracking-tight text-zinc-900 uppercase leading-snug">{cap.name}</h4>
                                    <p className="text-[8px] font-medium leading-relaxed text-zinc-400 mt-1">{cap.description}</p>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-5 border-t border-zinc-200/60">
                           {[
                              {
                                 title: "AI-Accelerated",
                                 desc: "Leveraging structured LLM check loops to deliver projects 3x faster than conventional methods."
                              },
                              {
                                 title: "UDYAM Accountable",
                                 desc: "Registered Indian micro-enterprise entity under Ministry of MSME, ensuring solid compliance."
                              },
                              {
                                 title: "Professional Standards",
                                 desc: "Deploying enterprise-grade codebases, optimized database queries, and custom configurations."
                              }
                           ].map((t, idx) => (
                              <div key={idx} className="space-y-1.5">
                                 <h5 className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-700">{t.title}</h5>
                                 <p className="text-[8px] text-zinc-400 font-medium leading-normal">{t.desc}</p>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="flex justify-between items-center border-t border-zinc-200/50 pt-3 text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400 mt-auto">
                        <span>CONFIDENTIAL · SYSTEM ENGINEERING CAPABILITIES</span>
                        <span>PAGE 04 OF 05</span>
                     </div>
                  </div>
               </div>

               {/* PAGE 5 - NEXT STEPS */}
               <div className="proposal-page-wrapper space-y-3">
                  <div className="flex justify-between items-center px-4">
                     <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">PAGE 05 — EXECUTION & SIGN-OFF</span>
                     <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <div className="proposal-page bg-[#FAF9F6] text-slate-900 p-20 flex flex-col justify-between shadow-2xl aspect-[1/1.414] relative overflow-hidden">
                     <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3 text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                        <span>GROWXLABSTECH · SYSTEM BRIEFING</span>
                        <span>REF: GXL-{new Date().getFullYear()}-PRP</span>
                     </div>

                     <div className="my-auto space-y-8">
                        <div className="text-center space-y-1.5">
                           <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#355CFF]">04 / CONTRACT DECK</span>
                           <h3 className="text-2xl font-bold tracking-tight text-zinc-950 leading-tight">Execution Protocol</h3>
                           <p className="text-[10px] text-zinc-400 max-w-xl mx-auto">Structured pipeline coordinates to proceed with custom development.</p>
                        </div>

                        <div className="grid gap-2 max-w-2xl mx-auto w-full">
                           {[
                              { step: "01", title: "Select Solution Tier", desc: "Confirm the chosen architecture level via email or securely in our client workspace." },
                              { step: "02", title: "Scope Execution", desc: "We prepare and execute the formal Agreement detailing deliverables within 4 hours." },
                              { step: "03", title: "Kick-off Transfer", desc: "Process the 50% mobilization fee to secure system engineering capacity." },
                              { step: "04", title: "Production Phase", desc: "Engineering sprints begin immediately. Live client progress dashboard access is issued." },
                              { step: "05", title: "Launch Check", desc: "We complete database caching, perform speed audits, and deploy live to production." }
                           ].map((s, idx) => (
                              <div key={idx} className="flex items-center gap-5 bg-zinc-50 border border-zinc-200/50 p-3.5 rounded-lg w-full">
                                 <span className="text-[9px] font-mono font-bold text-zinc-300 tracking-widest">{s.step}</span>
                                 <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-zinc-800 leading-none">{s.title}</p>
                                    <p className="text-[8px] text-zinc-400 font-medium tracking-wide uppercase leading-none">{s.desc}</p>
                                 </div>
                              </div>
                           ))}
                        </div>

                        {/* Sign-off Blocks */}
                        <div className="grid grid-cols-2 gap-10 pt-6 border-t border-zinc-200/50 max-w-xl mx-auto mt-4 w-full">
                           <div className="space-y-4">
                              <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">FOR GROWXLABSTECH</span>
                              <div className="h-[1px] bg-zinc-300 w-full pt-8" />
                              <div className="text-[8px] font-mono">
                                 <span className="font-bold text-zinc-800 block">Varshith Pujala</span>
                                 <span className="text-zinc-400 block">Founding Engineer & Director</span>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">FOR {form.businessName ? form.businessName.toUpperCase() : "THE CLIENT"}</span>
                              <div className="h-[1px] bg-zinc-300 w-full pt-8" />
                              <div className="text-[8px] font-mono">
                                 <span className="font-bold text-zinc-800 block">Authorized Representative</span>
                                 <span className="text-zinc-400 block">Title & Date</span>
                              </div>
                           </div>
                        </div>

                        <div className="text-center text-[7px] font-mono text-zinc-400 tracking-wider">
                           This proposal remains valid for 7 business days. All operations governed by standard framework terms.
                        </div>
                     </div>

                     <div className="flex justify-between items-center border-t border-zinc-200/50 pt-3 text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400 mt-auto">
                        <span>CONFIDENTIAL · PARTNERSHIP SIGN-OFF</span>
                        <span>PAGE 05 OF 05</span>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-8 no-print">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <h2 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-3">
                  Proposal Repositories <span className="h-6 px-3 bg-white/5 rounded-full text-[10px] font-bold flex items-center non-italic tracking-widest border border-zinc-800/80 text-zinc-400">{filteredProposals.length} TOTAL</span>
               </h2>
               <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-800/80 overflow-x-auto scrollbar-hide max-w-full">
                  {["all", "sent", "viewed", "accepted", "rejected"].map((st) => (
                    <button 
                      key={st} 
                      onClick={() => setActiveFilter(st)}
                      className={cn(
                        "h-8 px-5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer", 
                        activeFilter === st ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:text-white"
                      )}
                    >
                      {st}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid gap-4">
              {loading ? (
                 <div className="h-64 flex items-center justify-center border border-zinc-800 border-dashed rounded-3xl bg-[#0B0F19]">
                    <Loader2 className="animate-spin text-primary/40" />
                 </div>
              ) : filteredProposals.length > 0 ? (
                 filteredProposals.map((p, i) => {
                    if (!p || typeof p !== 'object') return null;
                    const statusColors: any = { 
                      sent: "text-blue-400 bg-blue-500/10 border-blue-500/20", 
                      viewed: "text-purple-400 bg-purple-500/10 border-purple-500/20", 
                      accepted: "text-green-400 bg-green-500/10 border-green-500/20", 
                      rejected: "text-red-400 bg-red-500/10 border-red-500/20" 
                    };
                    return (
                       <motion.div key={p.id || `proposal-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                          <Card className="p-6 border border-zinc-800 bg-[#0B0F19] hover:border-zinc-700 transition-all group rounded-2xl shadow-xl">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-6">
                                   <div className="h-14 w-14 bg-zinc-950 rounded-xl flex items-center justify-center text-zinc-500 border border-zinc-800 shadow-inner group-hover:border-zinc-700 group-hover:text-primary transition-colors">
                                      <FileText size={22} />
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                                         <h3 className="text-lg font-black text-white tracking-tight leading-none hover:italic transition-all cursor-pointer">{p.business_name || "Unidentified Niche"}</h3>
                                         <span className={cn("h-5 px-2.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider flex items-center border", statusColors[p.status || ""] || "text-zinc-400 bg-zinc-500/10 border-zinc-500/20")}>
                                            {p.status || "UNKNOWN"}
                                         </span>
                                         {p.viewed_at && <span className="h-5 px-2 bg-green-500/10 text-green-400 border border-green-500/20 text-[8px] font-mono font-bold rounded flex items-center">VIEWED</span>}
                                      </div>
                                      <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                                         <span>{p.client_name || "Unknown"}</span>
                                         <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                         <span className="text-[#355CFF] font-bold">{p.selected_package && typeof p.selected_package === 'string' ? p.selected_package.toUpperCase() : "UNKNOWN"} PKG</span>
                                         <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                         <span className="text-zinc-600 font-medium normal-case italic">Valid until: {p.valid_until ? new Date(p.valid_until).toLocaleDateString() : "N/A"}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t border-zinc-900 md:border-0 pt-4 md:pt-0">
                                   <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                      <Button onClick={() => updateStatus(p.id, 'accepted')} title="Mark Accepted" variant="outline" className="h-9 w-9 p-0 border-zinc-800 hover:border-zinc-700 rounded-lg hover:bg-green-500 hover:text-white cursor-pointer"><CheckSquare size={14} /></Button>
                                      <Button onClick={() => updateStatus(p.id, 'rejected')} title="Mark Rejected" variant="outline" className="h-9 w-9 p-0 border-zinc-800 hover:border-zinc-700 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer"><XCircle size={14} /></Button>
                                      <Button onClick={() => {
                                         navigator.clipboard.writeText(`${window.location.origin}/proposal/${p.id}`);
                                         alert("Share link copied to clipboard!");
                                      }} title="Copy Client Link" variant="outline" className="h-9 w-9 p-0 border-zinc-800 hover:border-zinc-700 rounded-lg hover:bg-white hover:text-black cursor-pointer"><Copy size={14} /></Button>
                                      <Button variant="outline" className="h-9 w-9 p-0 border-zinc-800 hover:border-zinc-700 rounded-lg hover:bg-[#355CFF] hover:text-white cursor-pointer" onClick={async () => {
                                          const res = await fetch("/api/proposals/send", {
                                            method: "POST", headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ proposalId: p.id })
                                          });
                                          if (res.ok) alert("Email Dispatched.");
                                      }}><Send size={14} /></Button>
                                   </div>
                                   <Link href={`/proposal/${p.id}`} target="_blank">
                                      <Button className="h-10 px-6 bg-white hover:bg-zinc-200 text-black font-black uppercase text-[9px] tracking-widest rounded-lg shadow-md cursor-pointer transition-all">
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
                 <div className="h-64 flex flex-col items-center justify-center border border-zinc-800 border-dashed rounded-3xl bg-[#0B0F19] space-y-4">
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.4em] italic">Proposals Repository Void</p>
                 </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
