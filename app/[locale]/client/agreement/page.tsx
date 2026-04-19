"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, ShieldCheck, Clock, CheckCircle2, Loader2, Download } from "lucide-react";
import { Agreement } from "@/types/lifecycle";

export default function ClientAgreementPage() {
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    fetchAgreement();
  }, []);

  const fetchAgreement = async () => {
    const res = await fetch("/api/client/agreement");
    const json = await res.json();
    setAgreement(json);
  };

  const handleSign = async () => {
    setSigning(true);
    try {
      const res = await fetch("/api/agreements/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agreementId: agreement?.id })
      });
      if (res.ok) fetchAgreement();
    } catch (error) {
      console.error(error);
    } finally {
      setSigning(false);
    }
  };

  if (!agreement) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tighter italic">
            Partnership Agreement.
          </h1>
          <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed">
            Legal framework and scope orchestration for our collaboration.
          </p>
        </div>
        {agreement.pdf_url && (
          <a href={agreement.pdf_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/5 text-white/40 hover:text-white uppercase tracking-widest font-black text-xs">
              <Download className="mr-2" size={16} /> Save PDF
            </Button>
          </a>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatusBox label="Service Type" value={agreement.service_type} />
        <StatusBox label="Total Fee" value={`$${agreement.total_amount}`} />
        <StatusBox label="Status" value={agreement.status.toUpperCase()} highlight={agreement.status === 'signed'} />
      </div>

      <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="bg-white/5 p-8 flex items-center justify-between border-b border-white/5">
           <div className="flex items-center space-x-4">
              <ShieldCheck className="text-primary" />
              <h3 className="text-xl font-bold text-white uppercase tracking-widest text-xs">Agreement Document</h3>
           </div>
           {agreement.status === 'signed' && (
             <div className="flex items-center text-green-500 font-bold text-[10px] uppercase tracking-widest">
                <CheckCircle2 size={12} className="mr-2" /> Signed on {new Date(agreement.signed_at!).toLocaleDateString()}
             </div>
           )}
        </div>

        <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
           {/* Visual rendering of the sections based on Agreement data */}
           <section className="space-y-4">
              <h4 className="text-lg font-black text-white text-xs uppercase tracking-widest">1. Scope of Development</h4>
              <p className="text-white/60 leading-relaxed italic border-l-2 border-primary/20 pl-6 py-2">
                "{agreement.project_description}"
              </p>
           </section>

           <section className="space-y-4">
              <h4 className="text-lg font-black text-white text-xs uppercase tracking-widest">2. Payment Archetype</h4>
              <ul className="text-white/60 space-y-4 text-sm font-medium">
                 <li className="flex items-center space-x-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Advance Payment (50%): ${agreement.advance_amount}</span>
                 </li>
                 <li className="flex items-center space-x-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Balance Milestone: ${agreement.balance_amount}</span>
                 </li>
              </ul>
           </section>

           <section className="space-y-4 opacity-40">
              <h4 className="text-lg font-black text-white text-xs uppercase tracking-widest text-white/40">3. Standard Legal Articles</h4>
              <p className="text-xs text-white/40 italic">
                Revision Policy, Intellectual Property, Termination, Confidentiality, Liability, and Force Majeure sections are outlined in the Master Service Agreement. Reference MS-0421.
              </p>
           </section>
        </div>

        <div className="p-10 bg-white/[0.02] border-t border-white/5">
           {agreement.status !== 'signed' ? (
             <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="space-y-1">
                   <p className="text-white font-black text-xs uppercase tracking-widest">Electronic Acceptance</p>
                   <p className="text-white/40 text-xs">By clicking accept, you authorize the project to begin under these terms.</p>
                </div>
                <Button 
                  onClick={handleSign}
                  disabled={signing}
                  className="w-full md:w-auto h-16 px-12 rounded-2xl bg-white text-black font-black hover:bg-neutral-200 transition-all uppercase tracking-tighter"
                >
                  {signing ? <Loader2 className="animate-spin" /> : "Sign & Accept Agreement"}
                </Button>
             </div>
           ) : (
             <div className="text-center py-4">
                <p className="text-green-500 font-black text-xs uppercase tracking-widest flex items-center justify-center">
                   <CheckCircle2 className="mr-2" /> Partnership Locked
                </p>
             </div>
           )}
        </div>
      </Card>
    </div>
  );
}

function StatusBox({ label, value, highlight }: any) {
  return (
    <Card className="p-6 glass border-white/5 rounded-3xl bg-white/[0.02]">
       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{label}</p>
       <h4 className={`text-xl font-black ${highlight ? 'text-green-500' : 'text-white'}`}>{value}</h4>
    </Card>
  );
}
