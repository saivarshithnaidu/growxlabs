"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Search, MapPin, Rocket, Loader2, CheckCircle2, ShieldCheck, Zap, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CITIES = ["Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi"];
const CATEGORIES = [
  "tiffin center", "mess", "small restaurant", "local cafe", 
  "dhaba", "budget hotel", "lodge", "guest house", 
  "salon", "gym", "tuition center"
];

export default function ScrapeLeadsPage() {
  const [city, setCity] = useState("Bengaluru");
  const [category, setCategory] = useState("tiffin center");
  const [radius, setRadius] = useState(100);
  const [maxResults, setMaxResults] = useState(100);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isBulk, setIsBulk] = useState(false);

  const handleScrape = async (bulkMode = false) => {
    // DEBUG LOG
    console.log("TRIGGERING SCRAPE:", { city, category, radius, maxResults, bulkMode });

    setLoading(true);
    setError(null);
    setIsBulk(bulkMode);
    
    try {
      const res = await fetch("/api/leads/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          city: bulkMode ? CITIES.join(",") : city, 
          category: bulkMode ? CATEGORIES.slice(0, 3).join(",") : category, 
          radius: Number(radius), 
          maxResults: Number(maxResults)
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.leads || []);
      console.log("SCRAPE SUCCESS:", data.count, "leads found");
    } catch (e: any) {
      console.error("SCRAPE ERROR:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleScrape(false);
    }
  };

  return (
    <div className="space-y-10" onKeyDown={handleKeyDown}>
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Production Bulk Scraper</h1>
          <p className="text-white/40 font-medium">Scalable business intelligence for low digital presence markets.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">System Ready</span>
           </div>
        </div>
      </div>

      <Card className="p-8 border-white/5 rounded-2xl bg-white/[0.02]">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Target City</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
              <select 
                value={city}
                onChange={(e) => {
                  console.log("UI: SET CITY ->", e.target.value);
                  setCity(e.target.value);
                }}
                className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-lg pl-11 pr-4 text-white text-sm focus:outline-none focus:border-white/20 appearance-none cursor-pointer hover:bg-white/[0.05] transition-colors"
                autoFocus
              >
                {CITIES.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Business Niche</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
              <select 
                value={category}
                onChange={(e) => {
                  console.log("UI: SET CATEGORY ->", e.target.value);
                  setCategory(e.target.value);
                }}
                className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-lg pl-11 pr-4 text-white text-sm focus:outline-none focus:border-white/20 appearance-none cursor-pointer hover:bg-white/[0.05] transition-colors"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Scanning Radius (km)</label>
            <select 
              value={radius}
              onChange={(e) => {
                const val = Number(e.target.value);
                console.log("UI: SET RADIUS ->", val);
                setRadius(val);
              }}
              className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-white/20 cursor-pointer hover:bg-white/[0.05] transition-colors"
            >
              {[10, 25, 50, 100, 200, 500].map(r => <option key={r} value={r} className="bg-neutral-900">{r} km</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Volume (Per Search)</label>
            <select 
              value={maxResults}
              onChange={(e) => {
                const val = Number(e.target.value);
                console.log("UI: SET VOLUME ->", val);
                setMaxResults(val);
              }}
              className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-white/20 cursor-pointer hover:bg-white/[0.05] transition-colors"
            >
              {[20, 50, 100, 200, 500].map(n => <option key={n} value={n} className="bg-neutral-900">{n} leads</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Button 
            onClick={() => handleScrape(false)}
            disabled={loading}
            className="h-12 bg-white text-black font-bold hover:bg-neutral-200"
          >
            {loading && !isBulk ? (
              <><Loader2 className="mr-3 animate-spin h-4 w-4" /> Scanning Area...</>
            ) : (
              <><Zap size={16} className="mr-2" /> Targeted Hunt</>
            )}
          </Button>
          <Button 
            onClick={() => handleScrape(true)}
            variant="outline"
            disabled={loading}
            className="h-12 border-white/10 text-white font-bold hover:bg-white/5"
          >
            {loading && isBulk ? (
              <><Loader2 className="mr-3 animate-spin h-4 w-4" /> Bulk Processing...</>
            ) : (
              <><Layers size={16} className="mr-2" /> Production Bulk Mode</>
            )}
          </Button>
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
          {error}
        </div>
      )}

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {results.map((lead, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.01 }}
              className="p-5 border border-white/5 rounded-xl flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center space-x-4">
                 <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                    <ShieldCheck size={18} />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white tracking-tight">{lead.business_name}</h3>
                   <p className="text-white/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 mt-0.5">
                     <MapPin size={10} /> {lead.city} • NO WEBSITE DETECTED
                   </p>
                 </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-xs font-bold text-white">{lead.lead_score}<span className="text-white/20 text-[10px] ml-1">Opportunity Score</span></p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500/5 flex items-center justify-center border border-green-500/10">
                  <CheckCircle2 className="text-green-500 h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
