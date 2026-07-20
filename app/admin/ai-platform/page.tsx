"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Bot, Workflow, Database, Cpu, Activity, Send, MessageSquare,
  ShieldCheck, RefreshCw, Plus, CheckCircle, Search, Terminal, Lock, UserCheck,
  Zap, Layers, ArrowUpRight, Check, Paperclip, FileText, ChevronDown, ChevronUp,
  X, Table, Code, FileSpreadsheet
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

  // Plus Dropdown & Model Selection
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Gemini 1.5 Pro");
  const [activeAttachment, setActiveAttachment] = useState<string | null>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);

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

  // Close + dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
        setShowPlusMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    if (!chatInput.trim() && !activeAttachment) return;

    const fullPrompt = activeAttachment 
      ? `[Context Attached: ${activeAttachment}]\n${chatInput}` 
      : chatInput;

    const userMsg = { sender: "User", text: fullPrompt, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setActiveAttachment(null);
    setShowPlusMenu(false);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-platform/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullPrompt, prompt: fullPrompt, model: selectedModel })
      });
      const data = await res.json();
      if (res.ok && (data.response || data.message?.message_text)) {
        const replyText = data.response || data.message?.message_text;
        setChatMessages((prev) => [
          ...prev,
          { sender: "GrowXLabs Copilot", text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      } else {
        toast.error(data.error || "Failed to communicate with AI Copilot.");
      }
    } catch (e) {
      toast.error("Failed to communicate with AI Copilot.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (prompt: string) => {
    setChatInput(prompt);
    setShowPlusMenu(false);
  };

  const handleSelectAttachment = (name: string) => {
    setActiveAttachment(name);
    setShowPlusMenu(false);
    toast.success(`Attached ${name} to prompt context`);
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
            className="h-10 px-4 bg-white/5 border border-white/10 text-neutral-300 hover:text-white whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2 shrink-0" /> Sync AI Platform
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
              className="space-y-8"
            >

              {/* ══ 1. AI COMMAND CENTER ══ */}
              {activeTab === "command_center" && (
                <Card className="p-6 bg-white border border-[#E5E7EB] shadow-xs flex flex-col h-[700px] relative overflow-hidden rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB] mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl shrink-0">
                        <Terminal size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#111827] text-base">Enterprise AI Orchestrator</h3>
                        <p className="text-xs text-[#6B7280] flex items-center gap-2">
                          <span>Context-Aware Engine</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                          <span className="text-purple-700 font-bold">{selectedModel}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> RAG Knowledge Active
                      </span>
                    </div>
                  </div>

                  {/* Chat Stream */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {chatMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${m.sender === "User" ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-2 mb-1 px-1">
                          {m.sender !== "User" && <Bot size={14} className="text-purple-600" />}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{m.sender} · {m.time}</span>
                        </div>
                        <div
                          className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                            m.sender === "User"
                              ? "bg-[#2563EB] text-white rounded-br-none shadow-sm"
                              : "bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] rounded-bl-none shadow-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-2xl w-fit text-xs text-purple-700 font-semibold">
                        <Sparkles size={14} className="animate-spin text-purple-600" />
                        <span>AI Copilot is analyzing context &amp; generating response…</span>
                      </div>
                    )}
                  </div>

                  {/* Prompt Preset Quick Pills */}
                  <div className="pt-3 pb-1 border-t border-[#E5E7EB] flex items-center gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
                    <span className="text-[10px] font-bold uppercase text-[#6B7280] whitespace-nowrap shrink-0">Quick Prompts:</span>
                    {[
                      "📊 Forecast Q3 Sales Revenue",
                      "🎯 Score & Qualify Top 10 SDR Leads",
                      "📄 Audit Offer Letter Clause 05",
                      "⚡ Trigger Multi-Agent Workflow"
                    ].map((pill, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectPreset(pill.substring(3))}
                        className="px-3 py-1 bg-[#F3F4F6] hover:bg-purple-50 border border-[#E5E7EB] hover:border-purple-300 text-[#374151] hover:text-purple-700 text-[11px] font-semibold rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>

                  {/* Active Attachment Badge */}
                  {activeAttachment && (
                    <div className="mt-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-700 w-fit">
                      <div className="flex items-center gap-2 font-semibold">
                        <Paperclip size={14} />
                        <span>{activeAttachment}</span>
                      </div>
                      <button
                        onClick={() => setActiveAttachment(null)}
                        className="ml-3 hover:text-blue-900 text-blue-500 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Chat Input Container with Sleek + Dropdown */}
                  <form onSubmit={handleSendMessage} className="mt-3 relative flex items-center gap-2">
                    
                    {/* Plus Button Container with Non-Jumping Dropdown Popup */}
                    <div className="relative" ref={plusMenuRef}>
                      <button
                        type="button"
                        onClick={() => setShowPlusMenu(!showPlusMenu)}
                        className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          showPlusMenu 
                            ? "bg-[#2563EB] border-[#2563EB] text-white shadow-md" 
                            : "bg-[#F3F4F6] border-[#E5E7EB] text-[#374151] hover:text-[#111827] hover:bg-[#E5E7EB]"
                        }`}
                        title="Add attachments, prompts, or select model"
                      >
                        <Plus size={20} className={`transition-transform duration-200 ${showPlusMenu ? "rotate-45" : ""}`} />
                      </button>

                      {/* Interactive + Dropdown Menu anchored top-floating */}
                      <AnimatePresence>
                        {showPlusMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 bottom-full mb-3 z-50 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-3.5 space-y-3.5 text-[#111827] drop-shadow-xl"
                          >
                            {/* Option Group 1: Attach Context */}
                            <div>
                              <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 px-2.5 mb-1.5 flex items-center gap-1.5">
                                <Paperclip size={12} className="text-purple-600" /> Attach Context / Document
                              </p>
                              <div className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => handleSelectAttachment("B2B_Leads_Database_Q3.csv")}
                                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#F3F4F6] text-xs font-semibold text-[#111827] flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <FileSpreadsheet size={16} className="text-emerald-600 shrink-0" />
                                  <span className="truncate">B2B Leads Database (CSV)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelectAttachment("SDR_Employment_Contract.pdf")}
                                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#F3F4F6] text-xs font-semibold text-[#111827] flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <FileText size={16} className="text-blue-600 shrink-0" />
                                  <span className="truncate">Offer Letter Template (PDF)</span>
                                </button>
                              </div>
                            </div>

                            {/* Option Group 2: Switch Model */}
                            <div className="pt-2.5 border-t border-[#E5E7EB]">
                              <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 px-2.5 mb-1.5 flex items-center gap-1.5">
                                <Cpu size={12} className="text-purple-600" /> Switch LLM Model Engine
                              </p>
                              <div className="space-y-1">
                                {[
                                  "Gemini 1.5 Pro (RAG)",
                                  "Claude 3.5 Sonnet",
                                  "GPT-4o Multimodal"
                                ].map((model) => (
                                  <button
                                    key={model}
                                    type="button"
                                    onClick={() => {
                                      setSelectedModel(model);
                                      setShowPlusMenu(false);
                                      toast.success(`Switched AI Engine to ${model}`);
                                    }}
                                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                      selectedModel === model 
                                        ? "bg-purple-50 text-purple-700 font-bold border border-purple-200" 
                                        : "hover:bg-[#F3F4F6] text-[#374151] font-medium"
                                    }`}
                                  >
                                    <span>{model}</span>
                                    {selectedModel === model && <Check size={14} className="text-purple-600" />}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Option Group 3: Quick AI Workflows */}
                            <div className="pt-2.5 border-t border-[#E5E7EB]">
                              <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 px-2.5 mb-1.5 flex items-center gap-1.5">
                                <Zap size={12} className="text-purple-600" /> Trigger AI Preset Workflow
                              </p>
                              <div className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => handleSelectPreset("Run automated BANT qualification on recent SDR leads.")}
                                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#F3F4F6] text-xs font-semibold text-[#111827] flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Bot size={16} className="text-amber-600 shrink-0" />
                                  <span className="truncate">Qualify SDR Leads</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelectPreset("Generate PDF Offer Letter for candidate Lakshmi (SDR).")}
                                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#F3F4F6] text-xs font-semibold text-[#111827] flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <FileText size={16} className="text-purple-600 shrink-0" />
                                  <span className="truncate">Generate Offer Letter PDF</span>
                                </button>
                              </div>
                            </div>

                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask AI Copilot to qualify leads, forecast revenue, score resumes, or analyze contracts..."
                      className="h-11 bg-white border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] font-medium pl-4 pr-4 rounded-xl focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                    />

                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shrink-0 whitespace-nowrap active:scale-95 cursor-pointer shadow-md"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Sparkles size={16} className="animate-spin" />
                          <span>Thinking...</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send size={16} />
                          <span>Send</span>
                        </span>
                      )}
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
