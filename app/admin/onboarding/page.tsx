"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2, FileText, User, Briefcase, Calendar } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";

export default function AdminOnboardingPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/onboarding/list");
      const data = await res.json();
      setSubmissions(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Reveal y={-20}>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Onboarding Submissions</h1>
            <p className="text-[var(--text-secondary)] text-sm">Review potential client project details.</p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6">
        {submissions.length > 0 ? (
          submissions.map((sub, i) => (
            <Reveal key={sub.id} delay={i * 0.05}>
              <div className="p-8 border border-[var(--border-subtle)] bg-[var(--surface-1)] hover:border-[var(--border-hover)] transition-all rounded-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="grid md:grid-cols-4 gap-8 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2"><User size={12} /> Client</p>
                    <p className="font-bold text-white text-lg tracking-tight">{sub.full_name}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">{sub.email}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">{sub.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2"><Briefcase size={12} /> Business</p>
                    <p className="font-bold text-white text-lg tracking-tight">{sub.business_name}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">{sub.business_type}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">{sub.city}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2"><Calendar size={12} /> Project</p>
                    <p className="font-bold text-white text-lg tracking-tight">{sub.plan}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Budget: {sub.budget}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Timeline: {sub.timeline}</p>
                  </div>
                  <div className="flex flex-col items-end justify-center gap-4">
                     <div className="text-right w-full">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Submitted On</p>
                       <p className="text-xs text-[var(--text-secondary)] font-medium">{new Date(sub.created_at).toLocaleDateString()}</p>
                     </div>
                     <button 
                       onClick={() => window.location.href = `/admin/agreements/preview?from_onboarding=${sub.id}`}
                       className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all shadow-xl shadow-white/5"
                     >
                       <FileText size={14} />
                       Create Agreement
                     </button>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-[var(--border-subtle)] grid md:grid-cols-2 gap-8 relative z-10">
                  <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Description</p>
                     <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">{sub.description || "No description provided."}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Features Requested</p>
                     <div className="flex flex-wrap gap-2">
                       {sub.features?.map((f: string) => (
                         <span key={f} className="text-[10px] font-bold uppercase tracking-widest bg-[var(--surface-2)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg text-[var(--text-secondary)]">
                           {f}
                         </span>
                       )) || <span className="text-xs text-[var(--text-muted)]">None</span>}
                     </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <Reveal>
            <div className="h-64 flex flex-col items-center justify-center border border-[var(--border-subtle)] border-dashed rounded-2xl bg-[var(--surface-1)]">
               <FileText className="text-[var(--text-muted)] mb-4" size={48} />
               <p className="text-[var(--text-secondary)] text-sm font-medium">No onboarding submissions found.</p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
