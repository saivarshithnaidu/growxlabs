"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { 
  FileText, CreditCard, Rocket, 
  ArrowUpRight, ShieldCheck, MessageCircle,
  Clock, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Agreement, Invoice, Project } from "@/types/lifecycle";
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/utils";

const PROJECT_STAGES = ["Getting Started", "Styling", "Building", "Checking", "Live"];

function getStageIndex(progress: number) {
  if (progress >= 100) return 4;
  if (progress >= 75) return 3;
  if (progress >= 40) return 2;
  if (progress >= 15) return 1;
  return 0;
}

export default function ClientDashboard() {
  const [data, setData] = useState<{
    agreements: Agreement[];
    invoices: Invoice[];
    projects: Project[];
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/client/portal-data");
      const json = await res.json();
      
      // Defensive check: Ensure we have the expected arrays
      if (json && !json.error && Array.isArray(json.agreements)) {
        setData(json);
      } else {
        console.error("Malformed portal data:", json);
        setData({ agreements: [], invoices: [], projects: [] });
      }
    } catch (e) {
      console.error(e);
      setData({ agreements: [], invoices: [], projects: [] });
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }


  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <Reveal y={-20}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-neutral-900 -tracking-[0.025em]">Welcome to GrowXLabsTech</h1>
            <p className="text-[#615d59] text-sm max-w-xl">
              Check your project progress, pay bills, and chat with us.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Quick Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DashboardStat 
          icon={<FileText size={16} />} 
          label="Working Plan" 
          status={data?.agreements?.[0]?.status || "No Active Plan"} 
          link={data?.agreements?.[0] ? `/client/dashboard/agreements/${data.agreements[0].id}` : "#"}
          accent="blue"
        />
        <DashboardStat 
          icon={<CreditCard size={16} />} 
          label="Payments" 
          status={(data?.invoices || []).some(inv => inv.status === 'pending') ? "Pending" : "All Paid"} 
          link="/client/invoices"
          accent="amber"
        />
        <DashboardStat 
          icon={<Rocket size={16} />} 
          label="Current Stage" 
          status={data?.projects?.[0]?.status || "Active"} 
          link="/client/project"
          accent="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Project Progress */}
        <Reveal className="lg:col-span-2">
          <div className="bg-white border border-[#e6e6e6] rounded-md p-5 sm:p-6 h-full shadow-sm">
             <h3 className="text-base font-bold text-neutral-900 -tracking-[0.02em] mb-6">Project Progress</h3>
             
             <div className="space-y-6">
                 {(data.projects.length ? data.projects : []).map(p => {
                   const stageIndex = getStageIndex(p.progress);
                   return (
                     <div key={p.id} className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-lg font-bold text-neutral-900 -tracking-[0.02em] mb-1">{p.title}</p>
                             <p className="text-[#a39e98] text-[8px] font-bold uppercase tracking-widest">Currently: {PROJECT_STAGES[stageIndex]}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-xl font-bold text-neutral-900 leading-none">{p.progress}%</span>
                          </div>
                       </div>
                       
                       {/* Progress Stages Bar */}
                       <div className="relative pt-1">
                         <div className="flex items-center gap-2">
                           {PROJECT_STAGES.map((stage, i) => (
                             <div key={stage} className="flex-1 space-y-2">
                               <div className={cn(
                                 "h-1.5 rounded-full transition-all duration-700",
                                 i <= stageIndex ? "bg-[#0075de]" : "bg-[#f6f5f4] border border-[#e6e6e6]"
                               )} />
                               <p className={cn(
                                 "text-[8px] font-bold uppercase tracking-wider text-center",
                                 i <= stageIndex ? "text-[#0075de]" : "text-[#615d59]"
                               )}>
                                 {stage}
                               </p>
                             </div>
                           ))}
                         </div>
                       </div>

                       <div className="p-4 bg-[#f6f5f4]/50 border border-[#e6e6e6] rounded-md flex items-center gap-4">
                          <div className="w-8 h-8 rounded-md bg-[#0075de]/10 flex items-center justify-center shrink-0">
                             <CheckCircle2 size={16} className="text-[#0075de]" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-neutral-900 mb-0.5">What's Next</p>
                             <p className="text-[10px] text-[#615d59]">We are setting up your project and will update you soon.</p>
                          </div>
                       </div>
                     </div>
                   );
                 })}
             </div>
          </div>
        </Reveal>

        {/* Support & Documents Sidebar */}
        <div className="space-y-6">
          <Reveal delay={0.1}>
            <div className="bg-white border border-[#e6e6e6] rounded-md p-5 sm:p-6 text-center flex flex-col items-center shadow-sm">
                <div className="h-10 w-10 rounded-md bg-[#0075de]/5 border border-[#0075de]/10 flex items-center justify-center mb-4">
                   <ShieldCheck size={20} className="text-[#0075de]" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-1">Project Agreement</h3>
                <p className="text-[#a39e98] text-[9px] uppercase tracking-widest font-bold mb-3">Safe & Private</p>
                <p className="text-[#615d59] text-xs leading-relaxed mb-4">
                  Access your project agreement and documents at any time.
                </p>
                <Button variant="outline" className="w-full h-9 rounded-md text-[10px] font-bold uppercase tracking-wider border-[#e6e6e6] hover:bg-[#f6f5f4]">
                   View Documents
                </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href="https://wa.me/918790907144"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="bg-white border border-[#e6e6e6] p-4 rounded-md flex items-center gap-4 hover:border-[#a39e98] transition-all group shadow-sm">
                <div className="h-10 w-10 rounded-md bg-[#0075de]/5 flex items-center justify-center border border-[#0075de]/10 shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle size={18} className="text-[#0075de]" />
                </div>
                <div>
                  <p className="text-neutral-900 font-bold text-sm leading-none mb-1">Chat with us</p>
                  <p className="text-[#a39e98] text-[8px] uppercase tracking-wider font-bold">We are online</p>
                </div>
                <ArrowUpRight className="ml-auto text-[#a39e98] group-hover:text-[#0075de] transition-colors" size={14} />
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function DashboardStat({ icon, label, status, link, accent }: any) {
  const accColors = {
    blue: "text-[#0075de] bg-[#0075de]/5 border-[#0075de]/10",
    green: "text-[#1aae39] bg-[#1aae39]/5 border-[#1aae39]/10",
    amber: "text-[#dd5b00] bg-[#dd5b00]/5 border-[#dd5b00]/10"
  }[accent as "blue" | "green" | "amber"]!;

  return (
    <Link href={link}>
      <Reveal delay={0.05}>
        <div className="bg-white border border-[#e6e6e6] p-5 rounded-md shadow-sm hover:border-[#a39e98] transition-all group flex justify-between items-start cursor-pointer">
           <div className="space-y-4">
              <div className={cn("h-8 w-8 rounded-md flex items-center justify-center border", accColors)}>
                 {icon}
              </div>
              <div>
                 <p className="text-[9px] font-bold uppercase tracking-wider text-[#615d59] mb-1">{label}</p>
                 <h4 className="text-base font-bold text-neutral-900">{status}</h4>
              </div>
           </div>
           <ArrowUpRight className="text-[#a39e98] group-hover:text-[#0075de] transition-colors" size={14} />
        </div>
      </Reveal>
    </Link>
  );
}
