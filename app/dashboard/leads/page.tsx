"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { 
  MessageSquare, Search, Filter, Mail, Phone, 
  Calendar, CheckCircle2, Clock, MoreHorizontal, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  requirement: string;
  status: string;
  created_at: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (!storedRole) {
      router.push("/login");
    } else if (storedRole !== "Admin" && storedRole !== "Co-Admin") {
      router.push("/dashboard");
    } else {
      setRole(storedRole);
      fetchLeads();
    }
  }, [router]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/lead/list");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLeads(data || []);
    } catch (e) {
      console.error("Fetch Leads Error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 italic">
            Prospect Stream.
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed">
            Real-time intelligence from the GrowX AI Agent. Converting curiosity into engineering.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 h-5 w-5" />
          <input 
            placeholder="Search leads by name, email, or intent..." 
            className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 text-white font-medium focus:outline-none focus:border-white/20 transition-all font-sans"
          />
        </div>
        <Button onClick={fetchLeads} variant="outline" className="h-16 px-6 rounded-2xl border-white/5 text-white/40 hover:text-white transition-all">
          <Calendar className={cn("h-5 w-5 mr-2", loading && "animate-spin")} />
          Sync
        </Button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {leads.length > 0 ? (
            leads.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-0 overflow-hidden glass border-white/5 rounded-[2.5rem] hover:border-white/20 transition-all group">
                  <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                    <div className="space-y-6 flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/5">
                           <MessageSquare size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white tracking-tight">{lead.name}</h3>
                          <div className="flex items-center space-x-3 mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                            <span className={cn(
                              "flex items-center",
                              lead.status === "NEW" ? "text-primary" : "text-green-500"
                            )}>
                              <span className={cn("h-1.5 w-1.5 rounded-full mr-2", lead.status === "NEW" ? "bg-primary animate-pulse" : "bg-green-500")} />
                              {lead.status}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm">
                         <div className="flex items-center text-white/60 font-bold bg-white/[0.03] px-5 py-3 rounded-2xl border border-white/5">
                            <Mail size={16} className="mr-3 text-white/20" />
                            {lead.email}
                         </div>
                         <div className="flex items-center text-white/60 font-bold bg-white/[0.03] px-5 py-3 rounded-2xl border border-white/5">
                            <Phone size={16} className="mr-3 text-white/20" />
                            {lead.phone}
                         </div>
                      </div>

                      <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/10">
                         <p className="text-white font-medium italic leading-relaxed">"{lead.requirement}"</p>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-4">
                       <Button className="h-14 px-8 rounded-2xl bg-white text-black font-black hover:bg-neutral-200 transition-all uppercase tracking-tighter">
                         Respond
                       </Button>
                       <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/5 text-white font-black hover:bg-white/5 transition-all uppercase tracking-tighter">
                         Archive
                       </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="h-96 flex flex-col items-center justify-center glass rounded-[3rem] border-dashed border-white/10 italic text-white/20 space-y-4">
               {loading ? (
                 <Loader2 className="animate-spin h-12 w-12 opacity-20" />
               ) : (
                 <Rocket className="h-12 w-12 opacity-20" />
               )}
               <p className="text-xl font-light">{loading ? "Synchronizing intelligence..." : "Awaiting new project intelligence..."}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Rocket({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.71-2.13.09-2.91" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12l3 3" />
    </svg>
  );
}
