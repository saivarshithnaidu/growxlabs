"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck, UserCheck, Activity, Radar, Target, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail");
    
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
      setEmail(storedEmail);
      if (storedRole === "Admin" || storedRole === "Co-Admin") {
        fetchRecentLeads();
      }
    }
  }, [router]);

  const fetchRecentLeads = async () => {
    try {
      const res = await fetch("/api/lead/list");
      const data = await res.json();
      setRecentLeads((data || []).slice(0, 3));
    } catch (e) {
      console.error("Recent Leads Error:", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  if (!role) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
              Welcome to <span className="text-gradient">GrowX Labs Dashboard.</span>
            </h1>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-2 px-3 py-1 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                {role === "Admin" ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
                <span>{role} Access</span>
              </span>
              <span className="text-white/40 text-sm font-light tracking-wide">{email}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="rounded-full border-white/5 text-white/40 hover:text-white hover:border-white/20 px-8"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link href="/admin/search">
            <Card className="p-10 glass border-primary/20 bg-primary/5 group hover:bg-primary/10 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center p-2">
                  <Radar className="text-primary h-6 w-6 animate-pulse" />
                </div>
                <ArrowUpRight className="text-white/20 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Market Radar</h3>
              <p className="text-white/40 text-sm font-light">Initialize hyper-local market scans to identify high-potential prospects using the Apify intelligence engine.</p>
            </Card>
          </Link>

          <Link href="/admin/leads">
            <Card className="p-10 glass border-white/5 group hover:border-white/10 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center p-2">
                  <Target className="text-white h-6 w-6" />
                </div>
                <ArrowUpRight className="text-white/20 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Prospect Hub</h3>
              <p className="text-white/40 text-sm font-light">Manage, enrich, and dispatch outreach strategies to identified targets and track conversion milestones.</p>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-10 glass border-white/5 space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden p-2">
              <div className="relative h-full w-full">
                <Image src="/favicon-logo.png" alt="X" fill className="object-contain" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">System Status</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                All core systems are operational. The GrowX infrastructure is fully synchronized.
              </p>
            </div>
            <div className="pt-4 flex items-center space-x-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Live Infrastructure</span>
            </div>
          </Card>

          <Card className="p-10 glass border-white/5 space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Activity className="text-white h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Active Analytics</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                Monitoring global project metrics and deployment health. Performance is optimal.
              </p>
            </div>
            <div className="pt-4 flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Data Streams Synchronized</span>
            </div>
          </Card>

          <Card className="p-10 glass border-white/5 space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <ShieldCheck className="text-white h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Access Control</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                Enterprise-grade security is active. All access logs are being recorded for auditing.
              </p>
            </div>
            <div className="pt-4 flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Secured Node</span>
            </div>
          </Card>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Recent Project Activity.</h2>
            <Button 
              variant="ghost" 
              onClick={() => router.push("/dashboard/leads")}
              className="text-primary font-black uppercase tracking-widest text-[10px]"
            >
              View All Insights
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {recentLeads.length > 0 ? (
               recentLeads.map((lead) => (
                 <Card 
                   key={lead.id} 
                   className="p-6 glass border-white/5 flex flex-col space-y-4 hover:border-white/20 transition-all cursor-pointer group"
                   onClick={() => router.push("/dashboard/leads")}
                 >
                    <div className="flex items-center justify-between">
                       <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full group-hover:bg-primary group-hover:text-black transition-all">PROJECT LEAD</span>
                       <span className="text-[8px] font-black uppercase tracking-widest text-white/20 tracking-[0.2em]">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-white font-bold tracking-tight text-lg">{lead.name}</h4>
                       <p className="text-white/40 text-xs truncate italic">"{lead.requirement}"</p>
                    </div>
                 </Card>
               ))
             ) : (
               <Card className="p-8 glass border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-4 col-span-full">
                 <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center overflow-hidden p-3 opacity-20">
                   <div className="relative h-full w-full">
                     <Image src="/favicon-logo.png" alt="X" fill className="object-contain grayscale" />
                   </div>
                 </div>
                 <p className="text-sm font-light text-white/20 italic">
                   Awaiting new project inquiries...
                 </p>
               </Card>
             )}
          </div>
        </div>

        <div className="mt-24 text-center">
          <p className="text-white/10 text-xs font-black uppercase tracking-[0.4em]">
            GrowX Labs Management Portal
          </p>
        </div>

      </div>
    </div>
  );
}
