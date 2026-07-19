"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Zap } from "lucide-react";
import { AutomationBuilder } from "@/components/admin/AutomationBuilder";

export default function WorkflowsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowsData();
  }, []);

  const fetchWorkflowsData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/workflows");
      const data = await res.json();
      setRules(data.rules || []);
      setRuns(data.runs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (ruleData: any) => {
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ruleData)
      });
      if (res.ok) {
        fetchWorkflowsData();
      } else {
        throw new Error("Failed to save workflow rule");
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none flex items-center gap-2">
          <Zap size={28} className="text-[#0075de]" /> Workflow Automations
        </h1>
        <p className="text-neutral-500 text-xs">Build visual event triggers, assign tasks, send emails, and log audits.</p>
      </div>

      {/* Builder */}
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <AutomationBuilder 
          initialRules={rules}
          recentRuns={runs}
          onCreateRule={handleCreateRule}
        />
      )}
    </div>
  );
}
