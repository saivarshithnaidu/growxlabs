"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2, FileText, User, Briefcase, Calendar } from "lucide-react";

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
        <Loader2 className="animate-spin text-[#00b894]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Onboarding Submissions</h1>
          <p className="text-white/40">Review potential client project details.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {submissions.length > 0 ? (
          submissions.map((sub) => (
            <Card key={sub.id} className="p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#00b894]">Client</p>
                  <p className="font-bold text-white">{sub.full_name}</p>
                  <p className="text-xs text-white/40">{sub.email}</p>
                  <p className="text-xs text-white/40">{sub.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#00b894]">Business</p>
                  <p className="font-bold text-white">{sub.business_name}</p>
                  <p className="text-xs text-white/40">{sub.business_type}</p>
                  <p className="text-xs text-white/40">{sub.city}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#00b894]">Project</p>
                  <p className="font-bold text-white">{sub.plan}</p>
                  <p className="text-xs text-white/40">Budget: {sub.budget}</p>
                  <p className="text-xs text-white/40">Timeline: {sub.timeline}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                   <div className="text-right w-full">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Submitted On</p>
                     <p className="text-xs text-white/40">{new Date(sub.created_at).toLocaleDateString()}</p>
                   </div>
                   <button 
                     onClick={() => window.location.href = `/admin/agreements/preview?from_onboarding=${sub.id}`}
                     className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00b894] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#00b894]/20"
                   >
                     <FileText size={14} />
                     Create Agreement
                   </button>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5 grid md:grid-cols-2 gap-8">
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Description</p>
                   <p className="text-sm text-white/60 leading-relaxed italic">{sub.description || "No description provided."}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Features Requested</p>
                   <div className="flex flex-wrap gap-2">
                     {sub.features?.map((f: string) => (
                       <span key={f} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white/60">
                         {f}
                       </span>
                     )) || <span className="text-xs text-white/20">None</span>}
                   </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-xl">
             <FileText className="text-white/10 mb-4" size={48} />
             <p className="text-white/40">No onboarding submissions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
