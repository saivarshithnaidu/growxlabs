"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Save, AlertTriangle, History } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";

export default function AdminTermsPage() {
  const [content, setContent] = useState("");
  const [version, setVersion] = useState("1.0");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchActiveTerms();
  }, []);

  const fetchActiveTerms = async () => {
    try {
      const res = await fetch("/api/team/terms");
      const data = await res.json();
      if (data.terms) {
        setContent(data.terms.content);
        const v = parseFloat(data.terms.version);
        setVersion(isNaN(v) ? "1.0" : (v + 0.1).toFixed(1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version, content }),
      });
      
      if (!res.ok) throw new Error("Failed to save terms");
      setMessage("Terms updated successfully. All agents will be required to re-accept.");
    } catch (err: any) {
      setMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Reveal y={-20}>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Team Terms & Conditions</h1>
          <p className="text-[var(--text-secondary)] text-sm">Manage the legal agreement that CRM agents must accept before logging in.</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4 text-sm text-amber-200">
           <AlertTriangle className="w-6 h-6 shrink-0 text-amber-500" />
           <div>
              <strong className="block text-amber-500 mb-1 text-base tracking-tight">Important Notice</strong>
              Saving a new version of the terms will immediately invalidate all previous acceptances. Every team member will be forced to read and accept the new terms upon their next login.
           </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden flex flex-col shadow-xl">
           <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--surface-2)] flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-3">
                    <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">Version:</label>
                    <input 
                       type="text" 
                       value={version} 
                       onChange={(e) => setVersion(e.target.value)}
                       className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-sm font-semibold text-white w-24 focus:outline-none focus:border-[var(--border-hover)] transition-colors"
                    />
                 </div>
              </div>
              <Button variant="outline" size="sm" className="h-9 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white bg-transparent text-[10px] font-bold uppercase tracking-widest">
                 <History className="w-3 h-3 mr-2" /> View History
              </Button>
           </div>
           <div className="p-0">
              <textarea
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 placeholder="Enter terms and conditions text here..."
                 className="w-full h-[500px] bg-transparent text-[var(--text-secondary)] p-8 focus:outline-none resize-none custom-scrollbar font-mono text-sm leading-relaxed"
              />
           </div>
           <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--surface-2)] flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-widest text-green-400">{message}</div>
              <Button onClick={handleSave} disabled={loading} className="bg-white text-black hover:bg-gray-200 text-[10px] font-bold uppercase tracking-widest h-10 px-6">
                 <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Publish New Terms"}
              </Button>
           </div>
        </div>
      </Reveal>
    </div>
  );
}
