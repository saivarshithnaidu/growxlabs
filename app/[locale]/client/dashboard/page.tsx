"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { 
  FileText, CreditCard, Layout, Rocket, 
  ArrowUpRight, Clock, ShieldCheck, Zap 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Agreement, Invoice, Project } from "@/types/lifecycle";

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
      const res = await fetch("/api/client/portal-data"); // Need to create this
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
        <h1 className="text-7xl font-black text-white tracking-tighter italic">
          GrowX System Dashboard.
        </h1>
        <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed">
          Secure instrumentation for your engineering project. Manage legal, 
          financial, and delivery status in real-time.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <DashboardStat 
          icon={<FileText className="text-blue-500" />} 
          label="Agreements" 
          status={data.agreements[0]?.status || "None"} 
          link="/client/agreement"
        />
        <DashboardStat 
          icon={<CreditCard className="text-yellow-500" />} 
          label="Financials" 
          status={data.invoices.some(inv => inv.status === 'pending') ? "Payment Due" : "Settled"} 
          link="/client/invoices"
        />
        <DashboardStat 
          icon={<Rocket className="text-primary" />} 
          label="Project Health" 
          status={data.projects[0]?.status || "Awaiting Setup"} 
          link="/client/project"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 glass border-white/5 rounded-[2.5rem]">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-white italic">Active Projects.</h3>
              <Layout size={20} className="text-white/20" />
           </div>
           <div className="space-y-6">
              {data.projects.map(p => (
                <div key={p.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                   <div className="flex justify-between items-start mb-4">
                      <p className="font-bold text-white text-lg">{p.title}</p>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Active</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress}%` }}
                        className="h-full bg-primary"
                      />
                   </div>
                   <div className="flex justify-between mt-3">
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Engineering Phase</p>
                      <p className="text-sm font-bold text-white">{p.progress}%</p>
                   </div>
                </div>
              ))}
           </div>
        </Card>

        <Card className="p-8 glass border-white/5 rounded-[2.5rem] bg-white/[0.02] flex flex-col justify-center items-center text-center">
            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center border border-white/5 mb-8">
               <ShieldCheck size={48} className="text-primary opacity-50" />
            </div>
            <h3 className="text-2xl font-black text-white italic mb-4">Secure Architecture.</h3>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed font-medium">
              Your project data is encrypted and managed through our high-performance internal orchestration engine.
            </p>
            <Button variant="outline" className="mt-8 rounded-xl border-white/5 text-xs font-black uppercase tracking-widest px-8 h-12">
               Download MSA
            </Button>
        </Card>
      </div>
    </div>
  );
}

function DashboardStat({ icon, label, status, link }: any) {
  return (
    <Link href={link}>
      <Card className="p-8 glass border-white/5 rounded-[2rem] hover:border-white/20 transition-all group flex justify-between items-start">
         <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
               {icon}
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{label}</p>
               <h4 className="text-2xl font-black text-white mt-1">{status}</h4>
            </div>
         </div>
         <ArrowUpRight className="text-white/20 group-hover:text-white transition-all" size={20} />
      </Card>
    </Link>
  );
}
