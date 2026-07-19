"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Bug, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function BugsPage() {
  const [bugs, setBugs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newBug, setNewBug] = useState({
    project_id: "",
    title: "",
    severity: "MEDIUM",
    priority: "MEDIUM",
    environment: "Staging",
    steps_to_reproduce: "",
    expected_result: "",
    actual_result: "",
    status: "NEW"
  });

  useEffect(() => {
    fetchBugsData();
  }, []);

  const fetchBugsData = async () => {
    try {
      setLoading(true);
      const [bugRes, projRes] = await Promise.all([
        fetch("/api/pm/bugs"),
        fetch("/api/pm/projects")
      ]);

      const bugData = await bugRes.json();
      const projData = await projRes.json();

      setBugs(bugData.bugs || []);
      setProjects(projData.projects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBug = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/pm/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBug)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewBug({
          project_id: "",
          title: "",
          severity: "MEDIUM",
          priority: "MEDIUM",
          environment: "Staging",
          steps_to_reproduce: "",
          expected_result: "",
          actual_result: "",
          status: "NEW"
        });
        fetchBugsData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none flex items-center gap-2">
            <Bug size={28} className="text-[#0075de]" /> QA Bug Tracker
          </h1>
          <p className="text-neutral-500 text-xs">Manage software bug reports, developer assignments, and replication steps.</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[10px] px-6 h-10 rounded-md"
        >
          <Plus size={14} className="mr-1" /> Log Ticket
        </Button>
      </div>

      {/* Grid/List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-6 w-6" />
        </div>
      ) : bugs.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#e6e6e6] rounded-md bg-white text-center p-6">
          <Bug className="w-10 h-10 text-neutral-300 mb-2" />
          <h4 className="text-sm font-bold text-neutral-850">All quiet on Bug QA</h4>
          <p className="text-xs text-neutral-400 max-w-xs mt-1">No active issues logged for your current projects.</p>
        </div>
      ) : (
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto text-xs text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                  <th className="py-2.5 pl-2">Bug Summary</th>
                  <th className="py-2.5">Severity</th>
                  <th className="py-2.5">Priority</th>
                  <th className="py-2.5">Environment</th>
                  <th className="py-2.5 pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map((bug) => (
                  <tr key={bug.id} className="border-b border-[#e6e6e6]/60 hover:bg-[#f6f5f4]/30 font-medium">
                    <td className="py-3 pl-2 text-neutral-900 font-bold">{bug.title}</td>
                    <td className="py-3 text-red-500 font-bold">{bug.severity}</td>
                    <td className="py-3 text-neutral-500">{bug.priority}</td>
                    <td className="py-3 text-neutral-600">{bug.environment || "Testing"}</td>
                    <td className="py-3 pr-2 text-right">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#0075de] bg-[#0075de]/5 px-2 py-0.5 rounded border border-[#0075de]/10">
                        {bug.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white border border-[#e6e6e6] w-full max-w-md p-6 shadow-xl rounded-lg space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Create Bug Ticket</h3>
            <form onSubmit={handleCreateBug} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Bug Title Summary</span>
                  <Input required placeholder="Button click crashes app" value={newBug.title} onChange={e => setNewBug({ ...newBug, title: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-neutral-400">Associated Project</span>
                    <select
                      required
                      value={newBug.project_id}
                      onChange={e => setNewBug({ ...newBug, project_id: e.target.value })}
                      className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2 text-xs text-neutral-805"
                    >
                      <option value="">Select project...</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-neutral-400">Severity</span>
                    <select
                      value={newBug.severity}
                      onChange={e => setNewBug({ ...newBug, severity: e.target.value })}
                      className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2 text-xs text-neutral-805"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="BLOCKER">BLOCKER</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Steps to Reproduce</span>
                  <textarea
                    rows={2}
                    required
                    value={newBug.steps_to_reproduce}
                    onChange={e => setNewBug({ ...newBug, steps_to_reproduce: e.target.value })}
                    placeholder="1. Open app..."
                    className="w-full text-xs bg-white border border-[#e6e6e6] rounded p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-[#e6e6e6] pt-4">
                <Button type="button" onClick={() => setShowAddModal(false)} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-neutral-500 hover:bg-neutral-50 rounded-md px-4">Cancel</Button>
                <Button type="submit" className="h-9 text-[10px] font-bold uppercase tracking-widest bg-red-500 text-white hover:bg-red-500/90 rounded-md px-4">Log Bug</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
