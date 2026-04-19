"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, MapPin, Target, Radar, Loader2, Zap, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminSearchLeads() {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    category: "",
    city: "",
    radius: "100"
  });
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/search-leads", {
        method: "POST",
        body: JSON.stringify(params)
      });
      const data = await res.json();
      setResults(data.leads || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">Outbound Radar.</h1>
          <p className="text-white/40 font-medium mt-1">Hyper-local market scanning for high-potential business opportunities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left: Filters (1/4) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 border-white/10 bg-white/[0.02] rounded-3xl space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Business Vertical</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                  <Input 
                    placeholder="e.g. Restaurants" 
                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl pl-12 text-sm font-bold"
                    value={params.category}
                    onChange={e => setParams({...params, category: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Target Geolocation</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                  <Input 
                    placeholder="e.g. London" 
                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl pl-12 text-sm font-bold"
                    value={params.city}
                    onChange={e => setParams({...params, city: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Scan Radius (KM)</label>
                <div className="relative">
                  <Radar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                  <Input 
                    type="number"
                    placeholder="100" 
                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl pl-12 text-sm font-bold"
                    value={params.radius}
                    onChange={e => setParams({...params, radius: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-neutral-200 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              onClick={handleSearch}
              disabled={loading || !params.category || !params.city}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Initialize Scan"}
            </Button>
          </Card>

          <Card className="p-6 border-white/5 bg-white/[0.01] rounded-2xl relative overflow-hidden">
             <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#00A86B] animate-pulse" />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Maps Sync Operational</p>
             </div>
          </Card>
        </div>

        {/* Right: Results (3/4) */}
        <div className="lg:col-span-3">
          <Card className="min-h-[600px] border-white/5 bg-white/[0.01] rounded-3xl relative overflow-hidden flex flex-col">
             <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 space-y-8"
                  >
                    <div className="relative">
                      <Zap className="h-20 w-20 text-white animate-pulse mx-auto" />
                      <div className="absolute inset-0 bg-white/20 blur-[80px] animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-black text-white tracking-widest uppercase italic">System Synchronizing</h3>
                      <p className="text-white/20 font-light italic">Intercepting Google Maps data streams for {params.category} in {params.city}...</p>
                    </div>
                  </motion.div>
                ) : results.length > 0 ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 w-full space-y-8"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                       <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Market Prospects Found ({results.length})</h3>
                       <Button variant="outline" className="h-9 px-4 border-white/10 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                          Export Data
                       </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.map((res, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group flex flex-col justify-between"
                        >
                           <div className="space-y-2">
                              <h4 className="text-white font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{res.business_name}</h4>
                              <p className="text-white/20 text-xs font-medium flex items-center gap-2">
                                <MapPin size={12} /> {res.address}
                              </p>
                           </div>
                           <div className="mt-6 flex items-center justify-between">
                              <span className="text-[10px] font-black text-white/10 uppercase tracking-widest italic">{params.category}</span>
                              <Button className="h-9 px-4 bg-white/[0.05] hover:bg-white text-white hover:text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
                                 Collect Lead
                              </Button>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-20 grayscale"
                  >
                    <Radar className="h-24 w-24 text-white mx-auto stroke-[1px]" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white tracking-widest uppercase">Radar Standby</h3>
                      <p className="text-sm font-medium italic">Awaiting targeting parameters to initialize market scan.</p>
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}
