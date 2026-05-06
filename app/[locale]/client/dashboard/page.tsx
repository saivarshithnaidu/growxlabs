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
    <div className="space-y-12 pb-12">
      {/* Welcome Header */}
      <Reveal y={-20}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to GrowXLabsTech</h1>
            <p className="text-[var(--text-secondary)] text-sm max-w-xl">
              Check your project progress, pay bills, and chat with us.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Quick Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DashboardStat 
          icon={<FileText size={18} />} 
          label="Working Plan" 
          status={data?.agreements?.[0]?.status || "No Active Plan"} 
          link={data?.agreements?.[0] ? `/client/dashboard/agreements/${data.agreements[0].id}` : "#"}
          accent="blue"
        />
        <DashboardStat 
          icon={<CreditCard size={18} />} 
          label="Payments" 
          status={(data?.invoices || []).some(inv => inv.status === 'pending') ? "Pending" : "All Paid"} 
          link="/client/invoices"
          accent="amber"
        />
        <DashboardStat 
          icon={<Rocket size={18} />} 
          label="Current Stage" 
          status={data?.projects?.[0]?.status || "Active"} 
          link="/client/project"
          accent="green"
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Project Progress */}
        <Reveal className="lg:col-span-2">
          <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl p-8 h-full">
             <h3 className="text-lg font-bold text-white tracking-tight mb-8">Project Progress</h3>
             
             <div className="space-y-8">
                {(data.projects.length ? data.projects : []).map(p => {
                  const stageIndex = getStageIndex(p.progress);
                  return (
                    <div key={p.id} className="space-y-8">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-xl font-bold text-white mb-1">{p.title}</p>
                            <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest">Currently: {PROJECT_STAGES[stageIndex]}</p>
                         </div>
                         <div className="text-right">
                            <span className="text-2xl font-bold text-white leading-none">{p.progress}%</span>
                         </div>
                      </div>
                      
                      {/* Progress Stages Bar */}
                      <div className="relative pt-2">
                        <div className="flex items-center gap-2">
                          {PROJECT_STAGES.map((stage, i) => (
                            <div key={stage} className="flex-1 space-y-3">
                              <div className={cn(
                                "h-1.5 rounded-full transition-all duration-700",
                                i <= stageIndex ? "bg-primary" : "bg-[var(--surface-2)]"
                              )} />
                              <p className={cn(
                                "text-[9px] font-bold uppercase tracking-wider text-center",
                                i <= stageIndex ? "text-primary" : "text-[var(--text-muted)]"
                              )}>
                                {stage}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-primary" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white mb-0.5">What's Next</p>
                            <p className="text-[10px] text-[var(--text-secondary)]">We are setting up your project and will update you soon.</p>
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
            <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                   <ShieldCheck size={28} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Project Agreement</h3>
                <p className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest font-bold mb-4">Safe & Private</p>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed mb-6">
                  Access your project agreement and documents at any time.
                </p>
                <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-widest border-[var(--border-subtle)]">
                   View Documents
                </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href="https://wa.me/918185958336"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] p-6 rounded-2xl flex items-center gap-5 hover:border-primary/40 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none mb-1.5">Chat with us</p>
                  <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider font-bold">We are online</p>
                </div>
                <ArrowUpRight className="ml-auto text-[var(--text-muted)] group-hover:text-primary transition-colors" size={16} />
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
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    green: "text-primary bg-primary/10 border-primary/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20"
  }[accent as "blue" | "green" | "amber"]!;

  return (
    <Link href={link}>
      <Reveal delay={0.05}>
        <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] p-6 rounded-2xl hover:border-[var(--border-hover)] transition-all group flex justify-between items-start cursor-pointer">
           <div className="space-y-4">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", accColors)}>
                 {icon}
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">{label}</p>
                 <h4 className="text-lg font-bold text-white">{status}</h4>
              </div>
           </div>
           <ArrowUpRight className="text-[var(--text-muted)] group-hover:text-primary transition-colors" size={16} />
        </div>
      </Reveal>
    </Link>
  );
}
