"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Search, MapPin, Rocket, Loader2, CheckCircle2, ShieldCheck, Zap, Layers, Mail, Globe, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom SVG component to bypass missing Lucide Instagram export
function Instagram({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const CITIES = ["Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi"];
const CATEGORIES = [
  "Logistics & Warehousing",
  "Manufacturing Plant",
  "Chemical & Industrial Distributor",
  "Real Estate Agency",
  "Private Hospital & Lab",
  "Financial & Accounting Firm",
  "Law Firm & Legal Services",
  "Consulting Agency",
  "Wholesale & Retail Distributor"
];

const EMAIL_DOMAINS = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];

const IG_NICHES = [
  "All Niches",
  "clothing brand",
  "sarees",
  "restaurant",
  "salon",
  "gym",
  "bakery",
  "cafe",
  "boutique",
  "founder"
];

const IG_CITIES = [
  "All Cities",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Delhi"
];

export default function ScrapeLeadsPage() {
  const [activeTab, setActiveTab] = useState<"local" | "instagram">("local");

  // Local Scraper States
  const [city, setCity] = useState("Bengaluru");
  const [category, setCategory] = useState("Logistics & Warehousing");
  const [radius, setRadius] = useState(100);
  const [maxResults, setMaxResults] = useState(100);
  
  // Instagram Scraper States
  const [igNiche, setIgNiche] = useState("All Niches");
  const [igCity, setIgCity] = useState("All Cities");
  const [igEmailDomain, setIgEmailDomain] = useState("@gmail.com");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isBulk, setIsBulk] = useState(false);

  const handleScrape = async (bulkMode = false) => {
    setLoading(true);
    setError(null);
    setIsBulk(bulkMode);
    setResults([]);
    
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

  const handleInstagramScrape = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const res = await fetch("/api/leads/scrape/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          niche: igNiche, 
          city: igCity, 
          emailDomain: igEmailDomain
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.leads || []);
      console.log("INSTAGRAM SCRAPE SUCCESS:", data.count, "leads found");
    } catch (e: any) {
      console.error("INSTAGRAM SCRAPE ERROR:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      if (activeTab === "local") {
        handleScrape(false);
      } else {
        handleInstagramScrape();
      }
    }
  };

  return (
    <div className="space-y-10" onKeyDown={handleKeyDown}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Production Bulk Scraper</h1>
          <p className="text-white/40 font-medium">Scalable business intelligence for low digital presence markets.</p>
        </div>
        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">System Ready</span>
        </div>
      </div>

      {/* Premium Tab Switcher */}
      <div className="flex border-b border-white/5 space-x-6">
        <button
          onClick={() => {
            setActiveTab("local");
            setResults([]);
            setError(null);
          }}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer relative ${
            activeTab === "local" ? "text-white" : "text-white/40 hover:text-white/70"
          }`}
        >
          Local Business Scraper
          {activeTab === "local" && (
            <motion.div layoutId="activeScraperTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("instagram");
            setResults([]);
            setError(null);
          }}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer relative ${
            activeTab === "instagram" ? "text-white" : "text-white/40 hover:text-white/70"
          }`}
        >
          Instagram X-Ray Scraper
          {activeTab === "instagram" && (
            <motion.div layoutId="activeScraperTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "local" ? (
          <motion.div
            key="localTab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-8 border-white/5 rounded-2xl bg-white/[0.02]">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Target City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                    <select 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-lg pl-11 pr-4 text-white text-sm focus:outline-none focus:border-white/20 appearance-none cursor-pointer hover:bg-white/[0.05] transition-colors"
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
                      onChange={(e) => setCategory(e.target.value)}
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
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-white/20 cursor-pointer hover:bg-white/[0.05] transition-colors"
                  >
                    {[10, 25, 50, 100, 200, 500].map(r => <option key={r} value={r} className="bg-neutral-900">{r} km</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Volume (Per Search)</label>
                  <select 
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
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
          </motion.div>
        ) : (
          <motion.div
            key="instagramTab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-8 border-white/5 rounded-2xl bg-white/[0.02]">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Target Niche / Role</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                    <select 
                      value={igNiche}
                      onChange={(e) => setIgNiche(e.target.value)}
                      className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-lg pl-11 pr-4 text-white text-sm focus:outline-none focus:border-white/20 appearance-none cursor-pointer hover:bg-white/[0.05] transition-colors"
                    >
                      {IG_NICHES.map(n => <option key={n} value={n} className="bg-neutral-900">{n}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Target City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                    <select 
                      value={igCity}
                      onChange={(e) => setIgCity(e.target.value)}
                      className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-lg pl-11 pr-4 text-white text-sm focus:outline-none focus:border-white/20 appearance-none cursor-pointer hover:bg-white/[0.05] transition-colors"
                    >
                      {IG_CITIES.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Email Provider</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
                    <select 
                      value={igEmailDomain}
                      onChange={(e) => setIgEmailDomain(e.target.value)}
                      className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-lg pl-11 pr-4 text-white text-sm focus:outline-none focus:border-white/20 appearance-none cursor-pointer hover:bg-white/[0.05] transition-colors"
                    >
                      {EMAIL_DOMAINS.map(d => <option key={d} value={d} className="bg-neutral-900">{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleInstagramScrape}
                  disabled={loading || !igNiche || !igCity}
                  className="w-full md:w-auto px-8 h-12 bg-white text-black font-bold hover:bg-neutral-200"
                >
                  {loading ? (
                    <><Loader2 className="mr-3 animate-spin h-4 w-4" /> Scanning Google Index...</>
                  ) : (
                    <><Instagram size={16} className="mr-2 text-pink-500" /> Start Instagram X-Ray Scrape</>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
          {error}
        </div>
      )}

      {/* Scraping results */}
      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {results.map((lead, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.01 }}
              className="p-5 border border-white/5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start space-x-4">
                 <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/20 border border-white/5 mt-1">
                    {activeTab === "instagram" ? <Instagram size={18} className="text-pink-500" /> : <ShieldCheck size={18} />}
                 </div>
                 <div>
                   <div className="flex items-center gap-2">
                     <h3 className="text-sm font-bold text-white tracking-tight">{lead.business_name}</h3>
                     {lead.alreadyExists && (
                       <span className="px-1.5 py-0.5 bg-neutral-800 text-white/40 text-[8px] font-bold uppercase rounded tracking-wider border border-white/5">
                         In CRM
                       </span>
                     )}
                   </div>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 mt-0.5">
                      <MapPin size={10} /> {lead.city} 
                      {activeTab === "instagram" ? (
                        <>
                          <span>•</span>
                          <span className={lead.has_website ? "text-white/60" : "text-green-400 font-bold"}>
                            {lead.has_website ? "Website Detected" : "No Website Detected (LDP)"}
                          </span>
                        </>
                      ) : (
                        <span>• NO WEBSITE DETECTED</span>
                      )}
                    </p>
                    {lead.notes && (
                      <p className="text-white/70 text-xs font-normal mt-2 leading-relaxed max-w-xl">
                        {lead.notes
                          .replace(/^Instagram:\s*@[a-zA-Z0-9_\.]+\s*\|\s*Email:\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*\|\s*Bio:\s*/i, "")
                          .replace(/&quot;/g, '"')
                          .replace(/&amp;/g, '&')
                          .replace(/&lt;/g, '<')
                          .replace(/&gt;/g, '>')
                        }
                      </p>
                    )}
                 </div>
              </div>

              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t border-white/5 md:border-none pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  {lead.notes && lead.notes.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) ? (
                    <div className="flex items-center gap-1.5 text-xs text-white font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      <Mail size={11} className="text-primary" />
                      {lead.notes.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)[0]}
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-white">
                      {lead.lead_score}
                      <span className="text-white/20 text-[10px] ml-1">Opportunity Score</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {lead.website_url && (
                    <a 
                      href={lead.website_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 text-white/60 hover:text-white transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <div className="h-8 w-8 rounded-full bg-green-500/5 flex items-center justify-center border border-green-500/10">
                    <CheckCircle2 className="text-green-500 h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
