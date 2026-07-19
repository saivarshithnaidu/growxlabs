"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Bot, Workflow, Database, Cpu, Activity, Send, MessageSquare,
  ShieldCheck, RefreshCw, Plus, CheckCircle, Search, Terminal, Lock, UserCheck,
  Zap, Layers, ArrowUpRight, Check
} from "lucide-react";

type Role =
  | "AI Platform Director"
  | "Prompt Engineer"
  | "AI Workflow Builder"
  | "AI Observability Lead"
  | "Viewer"
  | "Super Admin";

interface TabItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: Role[];
}

const TABS: TabItem[] = [
  { id: "command_center", label: "AI Command Center", icon: Terminal, allowedRoles: ["Super Admin", "AI Platform Director", "Prompt Engineer", "AI Workflow Builder", "Viewer"] },
  { id: "agents", label: "AI Agents Hub", icon: Bot, allowedRoles: ["Super Admin", "AI Platform Director", "Prompt Engineer"] },
  { id: "workflows", label: "Agent Workflows", icon: Workflow, allowedRoles: ["Super Admin", "AI Platform Director", "AI Workflow Builder"] },
  { id: "knowledge", label: "Vector Search & RAG", icon: Database, allowedRoles: ["Super Admin", "AI Platform Director", "Prompt Engineer"] },
  { id: "observability", label: "Token Usage & Cost", icon: Activity, allowedRoles: ["Super Admin", "AI Platform Director", "AI Observability Lead", "Viewer"] }
];

export default function AIPlatformPage() {
  const [activeTab, setActiveTab] = useState("command_center");
  const [selectedRole, setSelectedRole] = useState<Role>("Super Admin");
  const [loading, setLoading] = useState(false);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "GrowXLabs Copilot", text: "Hello! I am your Enterprise AI Orchestrator. How can I assist you with CRM, Finance, HRMS, Support, or Workflows today?", time: "10:00 AM" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // AI Agents State
  const [agents, setAgents] = useState<any[]>([]);

  // AI Workflows State
  const [workflows, setWorkflows] = useState<any[]>([]);

  // Observability State
  const [usageStats, setUsageStats] = useState<any>(null);

  useEffect(() => {
    fetchAgents();
    fetchWorkflows();
    fetchObservability();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/ai-platform/agents");
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (e) {
      toast.error("Failed to load AI agents.");
    }
  };

  const fetchWorkflows = async () => {
    try {
      const res = await fetch("/api/ai-platform/workflows");
      const data = await res.json();
      setWorkflows(data.workflows || []);
    } catch (e) {
      toast.error("Failed to load AI workflows.");
    }
  };

  const fetchObservability = async () => {
    try {
      const res = await fetch("/api/ai-platform/observability");
      const data = await res.json();
      setUsageStats(data);
    } catch (e) {
      toast.error("Failed to load AI observability stats.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: "User", text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);
    const currentPrompt = chatInput;
    setChatInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-platform/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentPrompt })
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages((prev) => [
          ...prev,
          { sender: "GrowXLabs Copilot", text: data.response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }
    } catch (e) {
      toast.error("Failed to communicate with AI Copilot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 text-white pb-20">
      
      {/* ═ HEADER & ROLE SWITCHER ═ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3.5 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Centralized AI Platform &amp; Enterprise Intelligence Layer
            </h1>
          </div>
          <p className="text-neutral-400 text-sm">
            Orchestrate business context, 16 specialized AI agents, multi-agent workflows, vector knowledge search, &amp; LLM token cost observability.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2.5 bg-neutral-900 border border-white/10 rounded-xl px-4 py-2">
            <UserCheck className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Simulation Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="bg-transparent border-0 text-white font-extrabold text-[12px] uppercase tracking-wide focus:outline-none cursor-pointer"
            >
              {([
                "AI Platform Director", "Prompt Engineer", "AI Workflow Builder",
                "AI Observability Lead", "Viewer", "Super Admin"
              ] as Role[]).map((r) => (
                <option key={r} value={r} className="bg-neutral-950 text-white">{r}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => {
              fetchAgents();
              fetchWorkflows();
              fetchObservability();
              toast.success("Synchronized AI Platform Engine.");
            }}
            variant="outline"
            className="h-10 px-4 bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Sync AI Platform
          </Button>
        </div>
      </div>

      {/* ═ CORE NAVIGATION GRID ═ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR TABS NAV */}
        <div className="lg:col-span-3 xl:col-span-2 space-y-2">
          {TABS.map((tab) => {
            const isAllowed = tab.allowedRoles.includes(selectedRole);
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (isAllowed) {
                    setActiveTab(tab.id);
                  } else {
                    toast.error(`Clearance Restricted: ${tab.label} is locked for role ${selectedRole}.`);
                  }
                }}
                className={`w-full flex items-center justify-between h-11 px-4 rounded-xl border text-[13px] font-bold tracking-tight transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
                    : isAllowed
                    ? "bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                    : "bg-black/20 border-white/5 text-neutral-600 cursor-not-allowed opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-purple-400" : "text-neutral-500"}`} />
                  <span>{tab.label}</span>
                </div>
                {!isAllowed && <Lock className="h-3 w-3 text-neutral-600" />}
              </button>
            );
          })}
        </div>

        {/* TAB WORKSPACE */}
        <div className="lg:col-span-9 xl:col-span-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >

              {/* ══ 1. AI COMMAND CENTER ══ */}
              {activeTab === "command_center" && (
                <Card className="p-6 bg-white/[0.02] border-white/10 flex flex-col h-[650px]">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                        <Terminal size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">Enterprise AI Orchestrator</h3>
                        <p className="text-xs text-neutral-400">Context-Aware Gemini 1.5 Engine · RAG Enabled</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Stream */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {chatMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${m.sender === "User" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-2xl p-4 rounded-2xl text-sm leading-relaxed ${
                            m.sender === "User"
                              ? "bg-purple-600 text-white rounded-br-none"
                              : "bg-neutral-900 border border-white/10 text-neutral-200 rounded-bl-none font-mono"
                          }`}
                        >
                          <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">{m.sender} · {m.time}</p>
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask AI Copilot to qualify leads, forecast revenue, score resumes, or analyze tickets..."
                      className="h-11 bg-white/5 border-white/10 text-white font-medium"
                    />
                    <Button type="submit" disabled={loading} className="bg-purple-500 hover:bg-purple-600 text-white font-bold h-11 px-6 rounded-md">
                      {loading ? "Thinking..." : <Send size={18} />}
                    </Button>
                  </form>
                </Card>
              )}

              {/* ══ 2. AI AGENTS HUB ══ */}
              {activeTab === "agents" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {agents.map((agent) => (
                    <Card key={agent.id} className="p-6 bg-white/[0.02] border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl"><Bot size={18} /></span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase rounded-full">{agent.status}</span>
                        </div>
                        <h4 className="font-bold text-white text-base mb-1">{agent.name}</h4>
                        <p className="text-xs text-neutral-400 mb-4">{agent.description}</p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-neutral-400 font-mono">
                        <span>Executions: <strong className="text-white">{agent.runs}</strong></span>
                        <span className="text-purple-400 font-bold">{agent.module}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* ══ 5. OBSERVABILITY TAB ══ */}
              {activeTab === "observability" && usageStats && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Total Prompt Tokens</p>
                      <h3 className="text-3xl font-black text-white">{usageStats.totalPromptTokens.toLocaleString()}</h3>
                    </Card>

                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Completion Tokens</p>
                      <h3 className="text-3xl font-black text-purple-400">{usageStats.totalCompletionTokens.toLocaleString()}</h3>
                    </Card>

                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Estimated Cost ($)</p>
                      <h3 className="text-3xl font-black text-emerald-400">${usageStats.estimatedCostUsd}</h3>
                    </Card>

                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Average Latency</p>
                      <h3 className="text-3xl font-black text-amber-400">{usageStats.avgLatencyMs} ms</h3>
                    </Card>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
