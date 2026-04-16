"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, Target, Radar, Loader2, Zap } from "lucide-react";
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
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 italic">
            Outbound Radar.
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed">
            Scanning hyper-local markets to identify high-potential business opportunities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 glass border-white/5 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Business Vertical</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                  <input 
                    placeholder="e.g. Restaurants" 
                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 text-white font-medium focus:outline-none focus:border-white/20"
                    value={params.category}
                    onChange={e => setParams({...params, category: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Target City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                  <input 
                    placeholder="e.g. London" 
                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 text-white font-medium focus:outline-none focus:border-white/20"
                    value={params.city}
                    onChange={e => setParams({...params, city: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Scan Radius (KM)</label>
                <div className="relative">
                  <Radar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                  <input 
                    type="number"
                    placeholder="100" 
                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 text-white font-medium focus:outline-none focus:border-white/20"
                    value={params.radius}
                    onChange={e => setParams({...params, radius: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-neutral-200 transition-all shadow-xl shadow-white/5"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Initialize Scan"}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full min-h-[500px] glass border-dashed border-white/5 flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
             {loading ? (
                <div className="space-y-6">
                  <div className="relative">
                    <Zap className="h-16 w-16 text-primary animate-pulse mx-auto" />
                    <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-widest uppercase">System Synchronizing</h3>
                  <p className="text-white/20 font-light italic">Intercepting Google Maps data streams for {params.category} In {params.city}...</p>
                </div>
             ) : results.length > 0 ? (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {results.slice(0, 6).map((res, i) => (
                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
                       <h4 className="text-white font-bold truncate">{res.business_name}</h4>
                       <p className="text-white/20 text-xs">{res.address}</p>
                    </div>
                  ))}
                  <div className="col-span-full pt-8">
                    <p className="text-primary font-black uppercase text-[10px] tracking-widest">Total Prospects Found: {results.length}</p>
                    <p className="text-white/40 text-sm mt-2">All leads have been automatically queued for enrichment and scoring.</p>
                  </div>
                </div>
             ) : (
                <div className="space-y-6">
                  <Radar className="h-16 w-16 text-white/5 mx-auto" />
                  <h3 className="text-xl font-light text-white/20 italic">No active data streams. Awaiting search parameters...</h3>
                </div>
             )}
          </Card>
        </div>
      </div>
    </div>
  );
}
