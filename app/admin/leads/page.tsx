"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Filter, 
  Mail, 
  Globe, 
  Phone, 
  Trophy, 
  ExternalLink,
  Loader2,
  RefreshCw,
  Send
} from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/client/list"); // This existing endpoint fetches from 'leads' table
      const data = await res.json();
      setLeads(data.clients || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleEnrich = async () => {
    setEnriching(true);
    await fetch("/api/enrich-leads", { method: "POST" });
    await fetchLeads();
    setEnriching(false);
  };

  const filteredLeads = leads.filter(l => {
    if (filter === "high_score") return (l.lead_score || 0) >= 7;
    if (filter === "no_website") return !l.website;
    return true;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 italic">
            Prospect Hub.
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed">
            Managing global market intelligence and high-potential client leads.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-white/40 hover:text-white"
            onClick={handleEnrich}
            disabled={enriching}
          >
            {enriching ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Enrich Intelligence
          </Button>
          <Button onClick={fetchLeads} variant="outline" className="border-white/10 text-white">
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
        <Button 
          variant={filter === "all" ? "primary" : "ghost"}
          onClick={() => setFilter("all")}
          className="rounded-full px-8 whitespace-nowrap"
        >
          All Intelligence
        </Button>
        <Button 
          variant={filter === "high_score" ? "primary" : "ghost"}
          onClick={() => setFilter("high_score")}
          className="rounded-full px-8 flex items-center gap-2 whitespace-nowrap"
        >
          <Trophy className="h-4 w-4" /> High Scorers (7+)
        </Button>
        <Button 
          variant={filter === "no_website" ? "primary" : "ghost"}
          onClick={() => setFilter("no_website")}
          className="rounded-full px-8 flex items-center gap-2 whitespace-nowrap"
        >
          <Globe className="h-4 w-4" /> No Website
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-white/5 opacity-40">
            <p className="italic font-light">No prospects matching your criteria found in the database.</p>
          </Card>
        ) : (
          filteredLeads.map((lead, i) => (
            <Card key={lead.id} className="p-8 glass border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-white/10 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{lead.business_name || lead.name}</h3>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase text-primary">
                    Score: {lead.lead_score || 0}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/40 font-light">
                  <span className="flex items-center gap-2"><Phone className="h-3 w-3" /> {lead.phone || "No Phone"}</span>
                  <span className="flex items-center gap-2 font-medium text-white/60"><Mail className="h-3 w-3" /> {lead.email || "No Email"}</span>
                  {lead.website && (
                    <a href={lead.website} target="_blank" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Globe className="h-3 w-3" /> Visit System <ExternalLink className="h-2 w-2" />
                    </a>
                  )}
                </div>
              </div>
              <div className="w-full md:w-auto">
                <Button 
                  className="w-full md:w-auto h-12 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-white/5"
                  disabled={!lead.email}
                  onClick={async () => {
                    await fetch("/api/send-email", {
                      method: "POST",
                      body: JSON.stringify({ email: lead.email, leadId: lead.id })
                    });
                    alert("Outreach strategy dispatched.");
                  }}
                >
                  <Send className="h-4 w-4" /> Dispatch Outreach
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
