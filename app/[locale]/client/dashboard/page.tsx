"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { 
  FileText, CreditCard, Rocket, 
  ArrowUpRight, ShieldCheck, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Agreement, Invoice, Project } from "@/types/lifecycle";

const PROJECT_STAGES = ["Onboarding", "Design", "Development", "Review", "Delivered"];

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
      setData(json);
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) return null;

  return (
    <div className="space-y-12 py-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Project Dashboard
        </h1>
        <p className="text-lg text-[#A0A0A0] max-w-2xl leading-relaxed">
          Track your project status, manage invoices, and communicate with your team in real-time.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <DashboardStat 
          icon={<FileText className="text-[#00A86B]" />} 
          label="Agreements" 
          status={data.agreements[0]?.status || "None"} 
          link={data.agreements[0] ? `/client/dashboard/agreements/${data.agreements[0].id}` : "#"}
        />
        <DashboardStat 
          icon={<CreditCard className="text-[#00A86B]" />} 
          label="Financials" 
          status={data.invoices.some(inv => inv.status === 'pending') ? "Payment Due" : "Settled"} 
          link="/client/invoices"
        />
        <DashboardStat 
          icon={<Rocket className="text-[#00A86B]" />} 
          label="Project Health" 
          status={data.projects[0]?.status || "Awaiting Setup"} 
          link="/client/project"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 rounded-2xl">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">Active Projects</h3>
           </div>
           <div className="space-y-6">
              {data.projects.map(p => {
                const stageIndex = getStageIndex(p.progress);
                return (
                  <div key={p.id} className="p-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                       <p className="font-semibold text-white text-lg">{p.title}</p>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A86B]">Active</span>
                    </div>
                    
                    {/* Progress Stages */}
                    <div className="flex items-center gap-1 mb-4">
                      {PROJECT_STAGES.map((stage, i) => (
                        <div key={stage} className="flex-1 flex flex-col items-center">
                          <div className={`w-full h-1.5 rounded-full ${i <= stageIndex ? 'bg-[#00A86B]' : 'bg-white/5'}`} />
                          <span className={`text-[9px] mt-1.5 font-medium ${i <= stageIndex ? 'text-[#00A86B]' : 'text-white/20'}`}>
                            {stage}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-2">
                       <p className="text-[10px] font-bold uppercase text-white/20 tracking-widest">Current Stage: {PROJECT_STAGES[stageIndex]}</p>
                       <p className="text-sm font-bold text-white">{p.progress}%</p>
                    </div>
                  </div>
                );
              })}
           </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-8 rounded-2xl flex flex-col justify-center items-center text-center">
              <div className="h-16 w-16 rounded-full bg-[#00A86B]/10 flex items-center justify-center border border-[#00A86B]/20 mb-6">
                 <ShieldCheck size={32} className="text-[#00A86B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Architecture</h3>
              <p className="text-[#A0A0A0] text-sm max-w-xs leading-relaxed">
                Your project data is encrypted and managed through our high-performance internal systems.
              </p>
              <Button variant="outline" className="mt-6 rounded-xl border-white/10 text-xs font-bold uppercase tracking-widest px-8 h-10">
                 Download MSA
              </Button>
          </Card>

          {/* WhatsApp Contact */}
          <a
            href="https://wa.me/919121600000"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="p-6 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-[#00A86B]/40 transition-all">
              <div className="h-12 w-12 rounded-full bg-[#00A86B]/10 flex items-center justify-center border border-[#00A86B]/20 shrink-0">
                <MessageCircle size={20} className="text-[#00A86B]" />
              </div>
              <div>
                <p className="text-white font-semibold">Contact Your Manager</p>
                <p className="text-[#A0A0A0] text-sm">Chat directly on WhatsApp</p>
              </div>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}

function DashboardStat({ icon, label, status, link }: any) {
  return (
    <Link href={link}>
      <Card className="p-6 rounded-2xl hover:border-[rgba(0,168,107,0.3)] transition-all group flex justify-between items-start">
         <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-[#00A86B]/10 flex items-center justify-center border border-[#00A86B]/20">
               {icon}
            </div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]/60">{label}</p>
               <h4 className="text-xl font-bold text-white mt-1">{status}</h4>
            </div>
         </div>
         <ArrowUpRight className="text-white/20 group-hover:text-[#00A86B] transition-colors" size={18} />
      </Card>
    </Link>
  );
}
