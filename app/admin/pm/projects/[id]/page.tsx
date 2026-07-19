"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ArrowLeft, Calendar, FileText, CheckSquare, Zap, Bug, GitFork, ShieldAlert } from "lucide-react";
import { AgileKanban } from "@/components/admin/pm/AgileKanban";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const { id } = React.use(params);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"board" | "milestones" | "bugs" | "documents" | "activity">("board");

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pm/projects/${id}`); // Wait, our GET endpoint handles lists. We should write the single project endpoint at `/api/pm/projects/[id]` or we can fetch detailed metadata.
      // Wait, let's write `/app/api/pm/projects/[id]/route.ts` as well to fetch detailed project dashboard metadata.
      // Yes! Let's write the route controller next. For now we will assume the route endpoint returns details.
      const resDetails = await fetch(`/api/pm/projects/${id}`);
      const resData = await resDetails.json();
      setData(resData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/pm/tasks?id=${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Refresh
        const detailsRes = await fetch(`/api/pm/projects/${id}`);
        const detailsData = await detailsRes.json();
        setData(detailsData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
      </div>
    );
  }

  if (!data || !data.project) {
    return (
      <div className="text-center py-20 text-xs font-semibold text-neutral-400">
        Project delivery details not found.
      </div>
    );
  }

  const { project, members, milestones, epics, sprints, tasks, bugs, documents, activityLogs } = data;

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="bg-white border border-[#e6e6e6] p-6 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/admin/pm/projects" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#0075de] hover:underline">
            <ArrowLeft size={10} /> Back to Registry
          </Link>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight leading-none">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-bold uppercase tracking-wider text-[#a39e98]">
            <span>{project.company?.name || "Global Client"}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span className={cn(
              "px-2 py-0.5 rounded border text-[9px] lowercase font-bold tracking-tight",
              project.health === "ON_TRACK" ? "bg-green-500/10 text-green-600 border-green-200" : "bg-red-500/10 text-red-600 border-red-200"
            )}>
              {project.health.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="flex gap-4 border-l border-[#e6e6e6] pl-6 font-semibold">
          <div className="text-left">
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Hours Logged</span>
            <h4 className="text-base font-black text-neutral-900 font-mono">{Number(project.actual_hours || 0).toFixed(1)} hrs</h4>
          </div>
          <div className="text-left min-w-28">
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Progress</span>
            <h4 className="text-base font-black text-neutral-900 font-mono">{project.progress || 0}%</h4>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e6e6e6] gap-5 pb-0.5 overflow-x-auto">
        {[
          { id: "board", label: "Taskboard", icon: CheckSquare },
          { id: "milestones", label: "Milestones", icon: Calendar },
          { id: "bugs", label: "Bug QA Tracker", icon: Bug },
          { id: "documents", label: "Documents", icon: FileText },
          { id: "activity", label: "Activity Logs", icon: Zap }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider bg-transparent outline-none transition-colors border-b-2 cursor-pointer",
                isActive 
                  ? "border-[#0075de] text-[#0075de]" 
                  : "border-transparent text-neutral-400 hover:text-neutral-950"
              )}
            >
              <TabIcon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="min-h-[300px]">
        {activeTab === "board" && (
          <AgileKanban initialTasks={tasks} onTaskMove={handleTaskMove} />
        )}

        {activeTab === "milestones" && (
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-4">Milestone Progress Trajectory</h3>
            <div className="space-y-4">
              {milestones.map((m: any) => (
                <div key={m.id} className="border border-[#e6e6e6] p-4 rounded-md flex items-center justify-between hover:border-[#0075de]/30 transition-all">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-snug">{m.title}</h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Due Date: {m.due_date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0075de] font-mono">{m.completion_percentage}% Done</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "bugs" && (
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-4">QA Bugs Registry</h3>
            {bugs.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-400 font-semibold">No active bug tickets logged.</div>
            ) : (
              <div className="space-y-3">
                {bugs.map((b: any) => (
                  <div key={b.id} className="border border-[#e6e6e6] p-4 rounded-md flex items-center justify-between hover:border-red-200 transition-all">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-snug">{b.title}</h4>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Severity: {b.severity} • Status: {b.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === "documents" && (
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-4">Architecture Documents</h3>
            {documents.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-400 font-semibold">No uploaded delivery attachments found.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {documents.map((doc: any) => (
                  <div key={doc.id} className="border border-[#e6e6e6] p-4 rounded-md flex items-center gap-3.5 hover:border-[#0075de]/30 transition-all cursor-pointer">
                    <div className="h-10 w-10 bg-neutral-50 rounded border border-[#e6e6e6] flex items-center justify-center text-neutral-400">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-snug">{doc.title}</h4>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-450 mt-1">Category: {doc.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === "activity" && (
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-6">Execution Log</h3>
            <div className="space-y-4 relative pl-6 border-l border-[#e6e6e6] ml-4">
              {activityLogs.map((log: any) => (
                <div key={log.id} className="relative group text-xs font-medium">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border bg-neutral-50 border-neutral-300 flex items-center justify-center text-[8px] font-bold" />
                  <div className="bg-white border border-[#e6e6e6]/60 p-3 rounded-md">
                    <h4 className="font-bold text-neutral-900">{log.title}</h4>
                    {log.description && <p className="text-neutral-500 mt-1">{log.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
