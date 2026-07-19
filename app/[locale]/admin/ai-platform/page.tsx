"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Bot, Cpu, MessageSquare, Mic, Layers, Search, FileText, Zap, ShieldCheck,
  BarChart3, RefreshCw, Send, CheckCircle, Clock, ArrowUpRight, Lock, UserCheck, Code,
  Database, HardDrive, Terminal, Play, Plus, BookOpen, AlertCircle, Share2, HelpCircle
} from "lucide-react";

type Role =
  | "AI Administrator"
  | "AI Engineer"
  | "Automation Manager"
  | "Knowledge Manager"
  | "Business User"
  | "Viewer"
  | "Super Admin";

interface TabItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: Role[];
}

const TABS: TabItem[] = [
  { id: "command_center", label: "AI Command Center", icon: MessageSquare, allowedRoles: ["Super Admin", "AI Administrator", "AI Engineer", "Automation Manager", "Knowledge Manager", "Business User", "Viewer"] },
  { id: "agent_roster", label: "Agent Roster", icon: Bot, allowedRoles: ["Super Admin", "AI Administrator", "AI Engineer"] },
  { id: "orchestrator", label: "Multi-Agent Pipeline", icon: Cpu, allowedRoles: ["Super Admin", "AI Administrator", "AI Engineer"] },
  { id: "workflows", label: "Workflow Builder", icon: Zap, allowedRoles: ["Super Admin", "AI Administrator", "Automation Manager"] },
  { id: "knowledge_hub", label: "Knowledge Hub", icon: BookOpen, allowedRoles: ["Super Admin", "AI Administrator", "Knowledge Manager", "Business User"] },
  { id: "enterprise_search", label: "Enterprise Search", icon: Search, allowedRoles: ["Super Admin", "AI Administrator", "Knowledge Manager", "Business User", "Viewer"] },
  { id: "document_intel", label: "Document Intelligence", icon: FileText, allowedRoles: ["Super Admin", "AI Administrator", "Knowledge Manager", "Business User"] },
  { id: "voice_studio", label: "Voice AI Studio", icon: Mic, allowedRoles: ["Super Admin", "AI Administrator", "Business User"] },
  { id: "recommendations", label: "AI Recommendations", icon: Sparkles, allowedRoles: ["Super Admin", "AI Administrator", "Business User", "Viewer"] },
  { id: "prompt_library", label: "Prompt Library", icon: Code, allowedRoles: ["Super Admin", "AI Administrator", "AI Engineer"] },
  { id: "observability", label: "Model Observability", icon: BarChart3, allowedRoles: ["Super Admin", "AI Administrator", "AI Engineer"] }
];

export default function AIPlatformPage() {
  const [activeTab, setActiveTab] = useState("command_center");
  const [selectedRole, setSelectedRole] = useState<Role>("Super Admin");
  const [loading, setLoading] = useState(false);

  // Chat State
  const [selectedAgent, setSelectedAgent] = useState("Executive Assistant Agent");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: "m0",
      sender_type: "agent",
      sender_name: "Executive Assistant Agent",
      message_text: "Welcome to GrowXLabs AI Platform. How can I orchestrate cross-module workflows or analyze business data for you today?",
      created_at: new Date().toLocaleTimeString()
    }
  ]);

  // Roster & Orchestrator State
  const [agents, setAgents] = useState<any[]>([]);
  const [orchestrationGoal, setOrchestrationGoal] = useState("");
  const [orchestrationResult, setOrchestrationResult] = useState<any>(null);
  const [orchestrating, setOrchestrating] = useState(false);

  // Workflows & Knowledge State
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Document Intelligence & Voice AI State
  const [docType, setDocType] = useState("document-intelligence");
  const [docInputText, setDocInputText] = useState("");
  const [docOutput, setDocOutput] = useState<any>(null);

  // Observability State
  const [observabilityData, setObservabilityData] = useState<any>(null);

  useEffect(() => {
    fetchAgents();
    fetchWorkflows();
    fetchKnowledge();
    fetchObservability();
  }, []);

  // Enforce role clearance on tabs
  useEffect(() => {
    const tabObj = TABS.find(t => t.id === activeTab);
    if (tabObj && !tabObj.allowedRoles.includes(selectedRole)) {
      const firstAllowed = TABS.find(t => t.allowedRoles.includes(selectedRole));
      if (firstAllowed) {
        setActiveTab(firstAllowed.id);
        toast.info(`Switched tab to ${firstAllowed.label} based on ${selectedRole} clearance.`);
      }
    }
  }, [selectedRole]);

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
      toast.error("Failed to load workflows.");
    }
  };

  const fetchKnowledge = async () => {
    try {
      const res = await fetch("/api/ai-platform/knowledge");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (e) {
      toast.error("Failed to load knowledge documents.");
    }
  };

  const fetchObservability = async () => {
    try {
      const res = await fetch("/api/ai-platform/observability");
      const data = await res.json();
      setObservabilityData(data);
    } catch (e) {
      toast.error("Failed to load AI observability.");
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput) return;

    const userMsg = {
      id: crypto.randomUUID(),
      sender_type: "user",
      sender_name: selectedRole,
      message_text: chatInput,
      created_at: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");

    try {
      const res = await fetch("/api/ai-platform/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentInput, agentName: selectedAgent })
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setChatMessages(prev => [...prev, data.message]);
      }
    } catch (e) {
      toast.error("Failed to execute AI chat.");
    }
  };

  const handleRunOrchestrator = async () => {
    if (!orchestrationGoal) return toast.error("Please enter an orchestration goal.");
    setOrchestrating(true);
    setOrchestrationResult(null);

    try {
      const res = await fetch("/api/ai-platform/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "orchestrate", goalPrompt: orchestrationGoal })
      });
      const data = await res.json();
      if (res.ok) {
        setOrchestrationResult(data);
        toast.success("Multi-Agent Orchestration complete!");
      }
    } catch (e) {
      toast.error("Orchestration error.");
    } finally {
      setOrchestrating(false);
    }
  };

  const handleEnterpriseSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(`/api/ai-platform/knowledge?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.searchResults || []);
      toast.success(`Semantic search completed for: "${searchQuery}"`);
    } catch (e) {
      toast.error("Search error.");
    }
  };

  const handleRunDocIntelligence = async () => {
    setLoading(true);
    setDocOutput(null);

    try {
      const res = await fetch("/api/ai-platform/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: docType,
          inputData: { text: docInputText || "Sample invoice details for Acme Cloud Services Inc." }
        })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setDocOutput(data.result);
        toast.success("AI Engine Processing Complete!");
      }
    } catch (e) {
      toast.error("AI Engine error.");
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
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              AI Platform &amp; Intelligence Layer
            </h1>
          </div>
          <p className="text-neutral-400 text-sm">
            Enterprise AI operating system powering CRM, Projects, Finance, HRMS, Marketing, Support, Admin, &amp; Analytics with multi-agent collaboration &amp; vector search.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2.5 bg-neutral-900 border border-white/10 rounded-xl px-4 py-2">
            <UserCheck className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Simulation Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="bg-transparent border-0 text-white font-extrabold text-[12px] uppercase tracking-wide focus:outline-none cursor-pointer"
            >
              {([
                "AI Administrator", "AI Engineer", "Automation Manager", "Knowledge Manager", "Business User", "Viewer", "Super Admin"
              ] as Role[]).map((r) => (
                <option key={r} value={r} className="bg-neutral-950 text-white">{r}</option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={() => {
              fetchAgents();
              fetchWorkflows();
              fetchKnowledge();
              fetchObservability();
              toast.success("Synchronized AI Platform Operating System.");
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
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.05)]"
                    : isAllowed
                    ? "bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                    : "bg-black/20 border-white/5 text-neutral-600 cursor-not-allowed opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-neutral-500"}`} />
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
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Agent Selector Sidebar */}
                  <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Active Copilot Agent</h3>
                    <div className="space-y-2">
                      {[
                        "Executive Assistant Agent", "Sales Agent", "Finance Agent",
                        "HR & Recruiter Agent", "Support Agent", "Project Manager Agent"
                      ].map((ag) => (
                        <button
                          key={ag}
                          onClick={() => setSelectedAgent(ag)}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                            selectedAgent === ag
                              ? "bg-blue-500/10 border-blue-500/30 text-white"
                              : "bg-white/5 border-white/5 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {ag}
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Chat Console */}
                  <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10 flex flex-col h-[600px] justify-between">
                    <div>
                      <div className="border-b border-white/5 pb-4 mb-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Bot className="text-blue-400 h-5 w-5" />
                          <div>
                            <h4 className="font-bold text-white text-base">{selectedAgent}</h4>
                            <p className="text-[10px] text-neutral-400">Context Aware · Google Gemini 1.5 Flash</p>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className={`flex flex-col ${msg.sender_type === "user" ? "items-end" : "items-start"}`}>
                            <span className="text-[9px] text-neutral-500 mb-1 px-1 font-bold">{msg.sender_name}</span>
                            <div className={`p-4 rounded-2xl max-w-xl text-xs font-medium whitespace-pre-line leading-relaxed ${
                              msg.sender_type === "user" ? "bg-blue-600 text-white" : "bg-neutral-900 border border-white/10 text-neutral-200"
                            }`}>
                              {msg.message_text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-white/5 pt-4">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                        placeholder={`Ask ${selectedAgent} across CRM, PM, Finance, HR...`}
                        className="h-11 bg-white/5 border-white/10"
                      />
                      <Button onClick={handleSendChatMessage} className="bg-blue-500 hover:bg-blue-600 text-white h-11 px-6">
                        <Send size={16} />
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 2. AGENT ROSTER ══ */}
              {activeTab === "agent_roster" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {agents.map((ag) => (
                    <Card key={ag.id} className="p-5 bg-white/[0.02] border-white/10 flex flex-col justify-between hover:border-blue-500/30 transition-all">
                      <div>
                        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 w-fit mb-4">
                          <Bot size={20} />
                        </div>
                        <h4 className="font-bold text-white text-base mb-1.5">{ag.agent_name}</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">{ag.role_description}</p>
                      </div>
                      <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px]">
                        <span className="font-mono text-neutral-400">{ag.model_name}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-black uppercase">Active</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* ══ 3. MULTI-AGENT PIPELINE ORCHESTRATOR ══ */}
              {activeTab === "orchestrator" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Multi-Agent Task Orchestration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">High-Level Objective / Goal</label>
                        <textarea
                          value={orchestrationGoal}
                          onChange={(e) => setOrchestrationGoal(e.target.value)}
                          placeholder="e.g. Audit Q3 software licenses, cross-reference with active team headcount, and generate cost optimization report."
                          className="w-full h-36 p-3 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none"
                        />
                      </div>
                      <Button
                        onClick={handleRunOrchestrator}
                        disabled={orchestrating}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 rounded-md"
                      >
                        {orchestrating ? "Orchestrating Agents..." : "Launch Multi-Agent Pipeline"}
                      </Button>
                    </div>
                  </Card>

                  {/* Pipeline Output */}
                  <Card className="p-6 bg-white/[0.02] border-white/10 min-h-[400px]">
                    <h3 className="text-base font-bold text-white mb-6">Orchestration Pipeline Execution</h3>
                    
                    {orchestrationResult ? (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="space-y-2">
                          {orchestrationResult.pipelineSteps.map((step: any, idx: number) => (
                            <div key={idx} className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="font-bold text-xs text-white">{step.stage}</span>
                              </div>
                              <span className="text-[10px] text-neutral-400">{step.action}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-xs text-emerald-300 font-medium">
                          {orchestrationResult.summaryResult}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 text-neutral-500">
                        <Cpu size={28} className="text-neutral-600 mb-4" />
                        <p className="font-bold">Pipeline Orchestrator Standby</p>
                        <p className="text-xs max-w-xs mt-1">Submit a high-level goal to trigger Planner $\rightarrow$ Researcher $\rightarrow$ Executor $\rightarrow$ Reviewer agents.</p>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* ══ 4. WORKFLOW BUILDER ══ */}
              {activeTab === "workflows" && (
                <Card className="p-6 bg-white/[0.02] border-white/10">
                  <h3 className="text-base font-bold text-white mb-6">Cross-Module Visual Workflow Automations</h3>
                  <div className="space-y-4">
                    {workflows.map((wf) => (
                      <div key={wf.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-white">{wf.workflow_name}</span>
                            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase">{wf.trigger_module}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">{wf.description}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase">Active</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ══ 5. KNOWLEDGE HUB ══ */}
              {activeTab === "knowledge_hub" && (
                <Card className="p-6 bg-white/[0.02] border-white/10">
                  <h3 className="text-base font-bold text-white mb-6">Enterprise Knowledge Document Store</h3>
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="px-2 py-0.5 bg-neutral-900 border border-white/10 text-[9px] font-bold text-neutral-400 uppercase">{doc.category} · {doc.file_type}</span>
                          <h4 className="font-bold text-white text-sm mt-1.5">{doc.title}</h4>
                          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{doc.content_text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ══ 6. ENTERPRISE SEARCH ══ */}
              {activeTab === "enterprise_search" && (
                <Card className="p-6 bg-white/[0.02] border-white/10 space-y-6">
                  <h3 className="text-base font-bold text-white">Cross-Module Vector Semantic Search</h3>
                  
                  <div className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEnterpriseSearch()}
                      placeholder="Search across CRM, Projects, Invoices, HRMS, Tickets..."
                      className="h-11 bg-white/5 border-white/10 text-white font-bold"
                    />
                    <Button onClick={handleEnterpriseSearch} className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 px-6">
                      <Search size={16} className="mr-2" /> Search
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      {searchResults.map((res, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl">
                          <span className="text-[9px] font-black uppercase text-blue-400">{res.category}</span>
                          <h4 className="font-bold text-white text-sm mt-1">{res.title}</h4>
                          <p className="text-xs text-neutral-300 mt-1">{res.content_text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* ══ 7. DOCUMENT INTELLIGENCE TAB ══ */}
              {activeTab === "document_intel" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Gemini Document Intelligence Processor</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Document Text / Raw Content</label>
                        <textarea
                          value={docInputText}
                          onChange={(e) => setDocInputText(e.target.value)}
                          placeholder="Paste PDF invoice, resume, contract, or meeting notes text..."
                          className="w-full h-36 p-3 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none"
                        />
                      </div>
                      <Button
                        onClick={handleRunDocIntelligence}
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 rounded-md"
                      >
                        {loading ? "Extracting Document Metadata..." : "Parse Document with Gemini AI"}
                      </Button>
                    </div>
                  </Card>

                  {/* Document Intelligence Output */}
                  <Card className="p-6 bg-white/[0.02] border-white/10 min-h-[400px]">
                    <h3 className="text-base font-bold text-white mb-6">Extracted Metadata &amp; AI Summary</h3>
                    
                    {docOutput ? (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="bg-black/10 border border-white/5 p-4 rounded-xl">
                          <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Document Type</p>
                          <p className="text-sm font-bold text-blue-400">{docOutput.documentType}</p>
                        </div>
                        <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-xs space-y-2">
                          <p className="font-bold text-white">Extracted Metadata:</p>
                          <pre className="font-mono text-neutral-300 text-[11px] whitespace-pre-wrap">{JSON.stringify(docOutput.extractedMetadata, null, 2)}</pre>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 text-neutral-500">
                        <FileText size={28} className="text-neutral-600 mb-4" />
                        <p className="font-bold">Document Parser Standby</p>
                        <p className="text-xs max-w-xs mt-1">Submit invoice or contract text to extract metadata and summaries.</p>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* ══ 8. VOICE AI STUDIO TAB ══ */}
              {activeTab === "voice_studio" && (
                <Card className="p-6 bg-white/[0.02] border-white/10 space-y-6">
                  <h3 className="text-base font-bold text-white">Speech-to-Text &amp; Meeting Assistant Studio</h3>
                  <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center space-y-3">
                    <Mic size={32} className="mx-auto text-blue-400" />
                    <p className="text-sm font-bold text-white">Voice Command &amp; Speech Recording Simulator</p>
                    <Button onClick={() => toast.success("Voice recording session active. Transcribing speech in real-time...")} className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 px-6">
                      Start Voice Session
                    </Button>
                  </div>
                </Card>
              )}

              {/* ══ 9. AI RECOMMENDATIONS TAB ══ */}
              {activeTab === "recommendations" && (
                <Card className="p-6 bg-white/[0.02] border-white/10">
                  <h3 className="text-base font-bold text-white mb-6">Cross-Module Next Best Actions</h3>
                  <div className="space-y-4">
                    {[
                      { mod: "CRM Sales", rec: "Follow up with Acme Corporation — Deal closing probability estimated at 92%.", score: "0.95" },
                      { mod: "Finance", rec: "Approve vendor invoice INV-90812 before 2026-08-15 to maintain early payment discount.", score: "0.98" },
                      { mod: "Support", rec: "Reassign ticket TICK-9082 to Senior Dev team due to SLA priority requirement.", score: "0.96" }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{item.mod}</span>
                          <h4 className="font-bold text-white text-sm mt-1.5">{item.rec}</h4>
                        </div>
                        <span className="text-xs font-black text-blue-400">Confidence: {item.score}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ══ 10. AI PROMPT LIBRARY TAB ══ */}
              {activeTab === "prompt_library" && (
                <Card className="p-6 bg-white/[0.02] border-white/10">
                  <h3 className="text-base font-bold text-white mb-6">Enterprise Prompt Template Library</h3>
                  <div className="space-y-4">
                    {observabilityData?.prompts?.map((pr: any) => (
                      <div key={pr.id} className="p-4 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-[9px] font-black uppercase text-blue-400">{pr.category}</span>
                        <h4 className="font-bold text-white text-sm mt-1">{pr.title}</h4>
                        <p className="text-xs font-mono text-neutral-400 mt-1 bg-black/20 p-2.5 rounded-md">{pr.template_text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ══ 11. MODEL OBSERVABILITY TAB ══ */}
              {activeTab === "observability" && observabilityData && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Monthly Token Usage</p>
                      <h3 className="text-3xl font-black text-white">{(observabilityData.totalTokensThisMonth / 1000000).toFixed(2)} M Tokens</h3>
                    </Card>
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Total API Cost (USD)</p>
                      <h3 className="text-3xl font-black text-emerald-400">${observabilityData.totalCostUsd.toFixed(2)}</h3>
                    </Card>
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Avg AI Latency</p>
                      <h3 className="text-3xl font-black text-blue-400">{observabilityData.avgLatencyMs} ms</h3>
                    </Card>
                  </div>

                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Model Cost Breakdown</h3>
                    <div className="space-y-3">
                      {observabilityData.modelUsageBreakdown.map((m: any, idx: number) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-white text-sm">{m.model}</h4>
                            <p className="text-xs text-neutral-400">{m.calls} Total API Calls</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-emerald-400">{m.cost}</p>
                            <p className="text-[10px] font-bold text-neutral-400">{m.tokens}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
