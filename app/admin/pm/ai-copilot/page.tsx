"use client";

import React, { useState } from "react";
import { Loader2, Zap, AlertTriangle, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AiCopilotPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any | null>(null);

  const handlePlanSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("/api/pm/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "plan_sprint", description })
      });
      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze requirements");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none flex items-center gap-2">
          <Zap size={28} className="text-[#0075de]" /> PM AI Copilot
        </h1>
        <p className="text-neutral-500 text-xs">Agile sprint planners, workload balances optimizer, and timeline risk trackers.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Requirements form */}
        <div className="md:col-span-1">
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <form onSubmit={handlePlanSprint} className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Agile Requirements Breakdown</h3>
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase text-neutral-450">Project Description</span>
                <textarea
                  rows={6}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Paste client requirements e.g. 'We need a SaaS dashboard with Supabase auth and Stripe invoicing...'"
                  className="w-full text-xs bg-[#f6f5f4] border border-[#e6e6e6] rounded p-3 focus:outline-none focus:bg-white focus:border-[#0075de] transition-all"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0075de] text-white hover:bg-[#0075de]/95 font-bold uppercase tracking-widest text-[10px] h-10 rounded-md"
              >
                {loading ? "Analyzing Scope..." : "Generate Sprint Backlog"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Results */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center border border-[#e6e6e6] rounded-md bg-white">
              <Loader2 className="animate-spin text-[#0075de] h-8 w-8 mb-2" />
              <span className="text-xs font-semibold text-neutral-450">Gemini parsing requirements scope...</span>
            </div>
          ) : plan ? (
            <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm space-y-6">
              <div className="border-b border-[#e6e6e6] pb-3">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Generated Sprint Goals</h3>
                <p className="text-xs text-neutral-600 font-medium mt-2 bg-[#f6f5f4] p-3.5 rounded border border-[#e6e6e6]/60 leading-relaxed">
                  {plan.goal}
                </p>
              </div>

              <div className="space-y-3.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Backlog Items Proposal</span>
                <div className="space-y-3">
                  {plan.tasks?.map((t: any, idx: number) => (
                    <div key={idx} className="border border-[#e6e6e6] p-4 rounded-md flex items-center justify-between hover:border-[#0075de]/30 transition-all bg-white shadow-sm">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-neutral-900 leading-snug">{t.title}</h4>
                        {t.description && <p className="text-[10px] text-neutral-500">{t.description}</p>}
                      </div>
                      <span className="text-[10px] font-bold bg-[#f6f5f4] border border-[#e6e6e6] text-[#0075de] px-2.5 py-0.5 rounded-full shrink-0">
                        {t.points} SP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#e6e6e6] rounded-md bg-white text-center p-6">
              <Zap className="w-10 h-10 text-neutral-300 mb-2" />
              <h4 className="text-sm font-bold text-neutral-850">Sprint Planning Workspace</h4>
              <p className="text-xs text-neutral-400 max-w-xs mt-1">Submit your requirements specs to auto-populate story logs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
