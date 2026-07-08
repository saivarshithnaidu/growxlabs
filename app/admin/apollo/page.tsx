"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Zap, Loader2, Database, ShieldCheck, 
  MapPin, CheckCircle2, AlertCircle, Search,
  ArrowRight, Users, Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ApolloLeadsPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [results, setResults] = useState<any>(null);
  const [stats, setStats] = useState({ awaiting: 0, enriched: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/leads/list");
      const data = await res.json();
      const awaiting = data.filter((l: any) => !l.email).length;
      const enriched = data.filter((l: any) => l.status === "enriched").length;
      setStats({ awaiting, enriched });
    } catch (e) {
      console.error(e);
    }
  };

  const runEnrichment = async () => {
    try {
      setLoading(true);
      setStatus("running");
      const res = await fetch("/api/apollo/enrich", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        setResults(data);
        setStatus("success");
        fetchStats();
      } else {
        throw new Error(data.error || "Enrichment failed");
      }
    } catch (e: any) {
      console.error(e);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">Apollo Intelligence.</h1>
          <p className="text-white/40 font-medium mt-1">Direct intercept of enterprise organization data and decision-maker contacts.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Awaiting Enrichment</p>
                 <p className="text-xl font-black text-white">{stats.awaiting}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                 <Database size={20} />
              </div>
           </div>
           <div className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Total Enriched</p>
                 <p className="text-xl font-black text-white">{stats.enriched}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-[#00A86B]/10 flex items-center justify-center text-[#00A86B] border border-[#00A86B]/20">
                 <Users size={20} />
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Main Action Zone (2/3) */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="p-12 border-white/10 bg-white/[0.01] rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-all duration-700">
                 <Zap size={200} />
              </div>
              
              <div className="relative space-y-10">
                 <div className="space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl">
                       <Zap size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Initialize Global Enrichment</h2>
                    <p className="text-white/40 font-medium leading-relaxed max-w-md">
                       Scan your pipeline for businesses missing verified email addresses and run the Apollo cross-match protocol to identify key personnel.
                    </p>
                 </div>

                 <div className="flex flex-col gap-4">
                    <Button 
                      disabled={loading || stats.awaiting === 0}
                      onClick={runEnrichment}
                      className="h-16 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl hover:bg-neutral-200 active:scale-95 transition-all w-full"
                    >
                       {loading ? <><Loader2 className="animate-spin mr-3" /> Processing Intercept...</> : "Start Apollo Intercept"}
                    </Button>
                    <p className="text-[10px] text-white/20 text-center font-bold uppercase tracking-widest">
                       {stats.awaiting === 0 ? "Pipeline fully enriched" : `Target Batch: up to 20 leads`}
                    </p>
                 </div>
              </div>
           </Card>

           <AnimatePresence>
              {status === "success" && results && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="p-8 border-green-500/20 bg-green-500/5 rounded-3xl space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                              <CheckCircle2 size={24} />
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-white tracking-tight">Intercept Process Completed</h3>
                              <p className="text-green-500/60 text-[10px] font-black uppercase tracking-widest mt-1">
                                {results.enriched} Success • {results.failed} Failed • {results.processed} Total Processed
                              </p>
                              {results.error && (
                                <p className="text-red-500/60 text-[10px] font-bold uppercase tracking-widest mt-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                                   Error: {results.error}
                                </p>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="grid gap-3 pt-4">
                        {results.data?.map((item: any) => (
                          <div key={item.id} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#00A86B] transition-colors">
                                   <Mail size={14} />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-white uppercase tracking-tight">{item.designation}</p>
                                   <span className="text-xs font-medium text-white/40">{item.email}</span>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Match Confirmed</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </Card>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="p-8 border-red-500/20 bg-red-500/5 rounded-3xl space-y-4 text-center">
                     <AlertCircle className="mx-auto text-red-500" size={32} />
                     <div>
                        <h3 className="text-lg font-bold text-white">System Error</h3>
                        <p className="text-red-500/60 text-xs font-medium">Verify your Apollo API key and system connectivity.</p>
                     </div>
                  </Card>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Sidebar Intel (1/3) */}
        <div className="space-y-8">
           <Card className="p-8 border-white/5 bg-white/[0.02] rounded-3xl space-y-8">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Framework Protocol</h3>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                       <Search size={16} className="text-white/40" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white">Domain Identification</p>
                       <p className="text-[10px] text-white/20 font-medium mt-1">Extracts root domain from business website for organization mapping.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                       <Zap size={16} className="text-white/40" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white">Person Match</p>
                       <p className="text-[10px] text-white/20 font-medium mt-1">Cross-references Apollo's database of 275M+ professionals.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 text-white/40">
                       <ShieldCheck size={16} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white">Email Verification</p>
                       <p className="text-[10px] text-white/20 font-medium mt-1">Appends verified direct emails to the lead profile.</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="p-8 border-white/5 bg-white/[0.02] rounded-3xl space-y-4">
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Api Status</p>
              </div>
              <div className="flex justify-between items-center bg-white/[0.03] p-4 rounded-xl border border-white/5">
                 <span className="text-xs font-bold text-white/60">Apollo Link</span>
                 <span className="text-[10px] font-black text-green-500 uppercase">Operational</span>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
