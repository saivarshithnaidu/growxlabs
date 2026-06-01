"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, Terminal, Cpu, Clock, CheckCircle2, User, HelpCircle, 
  ArrowUpRight, AlertTriangle, Briefcase, FileText, BarChart3, Users, 
  Settings, PenTool, Sparkles, Database, Plus, ChevronRight, Download
} from "lucide-react";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "gxl";
  text: string;
  timestamp: string;
  activeAgents?: string[];
  activityLogs?: string[];
  proposal?: {
    clientName: string;
    budget: string;
    timeline: string;
    deliverables: string[];
    status: string;
  };
  chart?: { month: string; revenue: number }[];
}

export default function InteractiveWorkspace() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "gxl",
      text: `# Welcome to GXL Command Center

I am the central AI operating system for **GrowXLabs**. Behind this single chat interface stands your executive suite of specialized AI agents:

* **CEO Agent:** Formulates corporate expansion strategies and qualifies high-level risk mitigations.
* **CFO Agent:** Runs platform revenue modeling, project cost parameters, and cash flow projections.
* **CTO Agent:** Audits codebase architectures, verifies engineering targets, and reviews systems.
* **Research & Marketing Suite:** Performs deep competitor searches, tracks trends, and crafts SEO-ready content flows.
* **Sales & Proposal Suite:** Analyzes lead qualification matrices and generates milestones and scopes of work.

---

### How to use GXL Command Center:
Use the input console at the bottom to launch automated multi-agent tasks, or click one of the quick prompt templates below.
`,
      timestamp: "19:14"
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("command-center");
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [currentActiveAgents, setCurrentActiveAgents] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentLogs]);

  // List of all specialized GXL Agents and their statuses
  const [agentSuite, setAgentSuite] = useState([
    { name: "CEO Agent", role: "Strategy & Growth", status: "Idle", color: "text-[#355CFF]" },
    { name: "CFO Agent", role: "Revenue & Forecasts", status: "Idle", color: "text-emerald-400" },
    { name: "CTO Agent", role: "Code & Architecture", status: "Idle", color: "text-purple-400" },
    { name: "Research Agent", role: "Market intelligence", status: "Idle", color: "text-amber-400" },
    { name: "Content Agent", role: "Editorial & Strategy", status: "Idle", color: "text-pink-400" },
    { name: "SEO Agent", role: "Keyword ranking", status: "Idle", color: "text-teal-400" },
    { name: "Proposal Agent", role: "Scope & Timeline", status: "Idle", color: "text-blue-400" },
    { name: "Sales Agent", role: "Lead qualification", status: "Idle", color: "text-rose-400" },
    { name: "Project Agent", role: "Timeline tracking", status: "Idle", color: "text-indigo-400" },
  ]);

  // Command Examples Quick Triggers
  const examples = [
    { text: "Create a proposal for ABC Hospital", label: "Proposal System" },
    { text: "What should we post today?", label: "Content Flow" },
    { text: "Analyze GrowXLabs growth", label: "Growth Suite" },
    { text: "Review this codebase structure", label: "Technical Review" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setTimeout(() => {
      const newFiles = Array.from(files).map(f => f.name);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
    }, 1200);
  };

  const removeFile = (idx: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() && attachedFiles.length === 0) return;
    
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend || `Uploaded ${attachedFiles.length} file(s): ${attachedFiles.join(", ")}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);
    setCurrentLogs([]);
    setCurrentActiveAgents([]);

    try {
      const response = await fetch("/api/admin/command-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, files: attachedFiles }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Animate active agents list
      setAgentSuite(prev => prev.map(a => {
        if (data.activeAgents?.includes(a.name)) {
          return { ...a, status: "Thinking..." };
        }
        return a;
      }));

      setCurrentActiveAgents(data.activeAgents || []);

      // Cycle through orchestrator thought logs step-by-step for premium immersion
      for (let i = 0; i < data.activity.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 900));
        setCurrentLogs(prev => [...prev, data.activity[i]]);
        
        // Update specific agent statuses
        const activeName = data.activity[i].split(":")[0];
        setAgentSuite(prev => prev.map(a => {
          if (a.name === activeName) {
            return { ...a, status: "Active" };
          }
          return a;
        }));
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      const gxlMsg: Message = {
        id: `gxl-${Date.now()}`,
        sender: "gxl",
        text: data.output,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activeAgents: data.activeAgents,
        activityLogs: data.activity,
        proposal: data.proposal,
        chart: data.chart
      };

      setMessages(prev => [...prev, gxlMsg]);

    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "gxl",
        text: `### ⚠️ Orchestration Interrupted\nFailed to sync with internal AI operating system. Please check your credentials or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setAttachedFiles([]);
      setAgentSuite(prev => prev.map(a => ({ ...a, status: "Idle" })));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="w-full bg-[#0F0F12] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative text-white min-h-[calc(100vh-12rem)] flex flex-col md:flex-row">
      
      {/* ═══════════════════════════════════════════════════ */}
      {/* LEFT WORKSPACE SIDEBAR                              */}
      {/* ═══════════════════════════════════════════════════ */}
      <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/5 bg-[#121216] p-5 shrink-0 flex flex-col gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B7280]">Workspace Menu</p>
          <p className="text-xs text-white/50 leading-snug">GrowXLabs Command Center</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", href: "/admin", icon: BarChart3 },
            { id: "command-center", label: "Command Center", href: "/admin/command-center", icon: Terminal },
            { id: "projects", label: "Projects", href: "/admin/command-center", icon: Briefcase, inactive: true },
            { id: "proposals", label: "Proposals", href: "/admin/proposals", icon: FileText },
            { id: "content", label: "Content", href: "/admin/command-center", icon: PenTool, inactive: true },
            { id: "analytics", label: "Analytics", href: "/admin/command-center", icon: Sparkles, inactive: true },
            { id: "clients", label: "Clients", href: "/admin/clients", icon: Users },
            { id: "settings", label: "Settings", href: "/admin/settings", icon: Settings },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return tab.inactive ? (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessages(prev => [...prev, {
                    id: `tab-${Date.now()}`,
                    sender: "gxl",
                    text: `# ${tab.label} Workspace Tab\nThis workspace tab has been mapped directly to GXL Command Center. Use the main command input bar below to run specialized **${tab.label}** agentic operations.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className={cn(
                  "flex items-center h-10 px-3 rounded-xl text-[13px] font-medium text-[#9CA3AF] hover:text-white hover:bg-white/[0.02] transition-all text-left",
                  activeTab === tab.id && "bg-white/[0.04] text-white border border-white/5"
                )}
              >
                <tab.icon className="h-4 w-4 mr-3 text-[#6B7280]" />
                <span>{tab.label}</span>
              </button>
            ) : (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex items-center h-10 px-3 rounded-xl text-[13px] font-medium text-[#9CA3AF] hover:text-white hover:bg-white/[0.02] transition-all border border-transparent",
                  isSelected && "bg-white/[0.04] text-white border-white/5 shadow-inner"
                )}
              >
                <tab.icon className={cn("h-4 w-4 mr-3", isSelected ? "text-[#355CFF]" : "text-[#6B7280]")} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 pt-4">
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 font-bold uppercase">Ops OS Live</span>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════ */}
      {/* CENTRAL MAIN WORKSPACE & CHAT AREA                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-[#0b0b0e] overflow-hidden min-h-[500px]">
        
        {/* Workspace Conversation Panel */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={cn(
                "flex gap-4 max-w-4xl animate-fade-in",
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Avatar Indicator */}
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/5",
                msg.sender === "user" 
                  ? "bg-white/5 text-white" 
                  : "bg-gradient-to-br from-[#355CFF] to-[#1E3BB3] text-white shadow-lg shadow-[#355CFF]/15"
              )}>
                {msg.sender === "user" ? <User size={15} /> : <Terminal size={15} />}
              </div>

              {/* Message Content Layout */}
              <div className="space-y-4 flex-1 max-w-[calc(100%-3rem)]">
                {/* Meta details */}
                <div className="flex items-center gap-3 font-mono text-[9px] text-[#6B7280] uppercase tracking-wider">
                  <span className="font-bold text-white/70">{msg.sender === "user" ? "GrowXLabs Executive" : "GXL Command OS"}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Final Output Display */}
                <div className={cn(
                  "rounded-2xl p-6 border border-white/5 font-sans leading-[1.7] text-[15px] space-y-4",
                  msg.sender === "user"
                    ? "bg-white/[0.02] text-white/90"
                    : "bg-[#121216] text-[#D1D5DB]"
                )}>
                  {/* Executive Markdown Parser */}
                  <div className="prose prose-invert max-w-none text-white/90 space-y-4">
                    {msg.text.split("\n\n").map((block, i) => {
                      const trimmed = block.trim();
                      if (trimmed.startsWith("# ")) {
                        return <h2 key={i} className="text-2xl md:text-3xl font-black text-white tracking-tight border-b border-white/5 pb-2 pt-4">{trimmed.replace("# ", "")}</h2>;
                      }
                      if (trimmed.startsWith("## ")) {
                        return <h3 key={i} className="text-lg md:text-xl font-bold text-white tracking-tight pt-3 flex items-center gap-2">{trimmed.replace("## ", "")}</h3>;
                      }
                      if (trimmed.startsWith("### ")) {
                        return <h4 key={i} className="text-base font-bold text-white/80 pt-2">{trimmed.replace("### ", "")}</h4>;
                      }
                      if (trimmed.startsWith("* ")) {
                        return (
                          <ul key={i} className="list-none space-y-2 pl-4 border-l border-[#355CFF]/30">
                            {trimmed.split("\n").map((li, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-[14px]">
                                <span className="text-[#355CFF] font-bold mt-0.5">•</span>
                                <span>{li.replace("* ", "").replace("- ", "")}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      if (trimmed.startsWith("→ ") || trimmed.startsWith("- ")) {
                        return (
                          <ul key={i} className="list-none space-y-2 pl-4 border-l border-white/10">
                            {trimmed.split("\n").map((li, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-[14px] text-white/80">
                                <span className="text-[#6B7280] font-bold mt-0.5">→</span>
                                <span>{li.replace("→ ", "").replace("- ", "")}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      if (trimmed.startsWith("> ")) {
                        return (
                          <blockquote key={i} className="border-l-2 border-[#355CFF] bg-[#355CFF]/[0.02] pl-5 pr-5 py-4 rounded-r-xl italic text-white/80 text-[14px] leading-relaxed">
                            {trimmed.replace("> ", "")}
                          </blockquote>
                        );
                      }
                      if (trimmed.startsWith("| ")) {
                        // Table Parser
                        const rows = trimmed.split("\n").filter(r => r.trim() && !r.includes("---"));
                        const headers = rows[0].split("|").map(h => h.trim()).filter(Boolean);
                        const body = rows.slice(1).map(r => r.split("|").map(c => c.trim()).filter(Boolean));

                        return (
                          <div key={i} className="overflow-x-auto my-6 border border-white/5 rounded-xl">
                            <table className="w-full text-left text-[13px] border-collapse">
                              <thead>
                                <tr className="bg-white/5 text-white/70 font-mono border-b border-white/5">
                                  {headers.map((h, k) => (
                                    <th key={k} className="px-5 py-3.5 font-bold uppercase tracking-wider">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                                {body.map((r, k) => (
                                  <tr key={k} className="hover:bg-white/[0.01] transition-colors">
                                    {r.map((c, m) => (
                                      <td key={m} className={cn("px-5 py-3.5", m === r.length - 1 ? "font-mono font-bold text-white text-right" : "text-white/80")}>
                                        {c.replace(/\*\*/g, "")}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }
                      return <p key={i} className="text-[14px] md:text-[15px] leading-relaxed text-white/80">{trimmed}</p>;
                    })}
                  </div>

                  {/* Dynamic Revenue Chart Attachment */}
                  {msg.chart && (
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 my-6 max-w-2xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[#355CFF]/10 rounded-lg">
                          <Cpu size={16} className="text-[#355CFF]" />
                        </div>
                        <h4 className="font-semibold text-white tracking-tight text-sm">Automated Growth Forecast Tiers</h4>
                      </div>
                      
                      <div className="h-44 flex items-end gap-3 md:gap-5 pb-2 border-b border-white/5">
                        {msg.chart.map((point, k) => {
                          const percent = (point.revenue / 120000) * 100;
                          return (
                            <div key={k} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                              <div className="w-full relative flex items-end justify-center h-28">
                                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow">
                                  ₹{point.revenue.toLocaleString()}
                                </div>
                                <div 
                                  style={{ height: `${percent}%` }} 
                                  className="w-full bg-[#355CFF]/10 group-hover:bg-[#355CFF]/30 rounded-t-lg transition-all border border-[#355CFF]/20"
                                />
                              </div>
                              <span className="text-[10px] font-mono text-[#6B7280]">{point.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Proposal Generation Attachment */}
                  {msg.proposal && (
                    <div className="bg-white/[0.01] border border-[#355CFF]/20 rounded-2xl p-6 my-6 max-w-2xl relative overflow-hidden border-t-4 border-t-[#355CFF] shadow-xl shadow-[#355CFF]/2">
                      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#355CFF]/3 rounded-full blur-2xl" />
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono tracking-widest text-[#355CFF] uppercase font-bold">Proposal Generated</span>
                            <h4 className="text-lg font-bold text-white tracking-tight">{msg.proposal.clientName} Scope blueprint</h4>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full font-bold uppercase">
                            ✓ Ready for review
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-t border-b border-white/5 py-4 font-mono text-[11px]">
                          <div>
                            <p className="text-[#6B7280] uppercase">Calculated Budget</p>
                            <p className="text-white font-bold text-sm mt-1">{msg.proposal.budget}</p>
                          </div>
                          <div>
                            <p className="text-[#6B7280] uppercase">Target Delivery</p>
                            <p className="text-white font-bold text-sm mt-1">{msg.proposal.timeline}</p>
                          </div>
                          <div>
                            <p className="text-[#6B7280] uppercase">File Format</p>
                            <p className="text-white font-bold text-sm mt-1">SOW-PDF.spec</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[11px] font-mono text-[#6B7280] uppercase">Key Targets Included:</p>
                          <ul className="space-y-1.5 text-xs text-white/80">
                            {msg.proposal.deliverables.map((del, k) => (
                              <li key={k} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF]" />
                                <span>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2">
                          <a 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Simulating secure proposal PDF download for ${msg.proposal?.clientName || "Client"}.`);
                            }}
                            className="inline-flex items-center gap-2 bg-[#355CFF] hover:bg-[#355CFF]/90 text-white font-bold text-xs px-5 py-3 rounded-lg transition-all active:scale-[0.98]"
                          >
                            <Download size={14} />
                            <span>Download Full SOW Package</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}

          {/* Collaborative Thought Stream Animations */}
          {isLoading && (
            <div className="flex gap-4 max-w-4xl mr-auto animate-pulse">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[#355CFF]/30 bg-[#355CFF]/10 text-[#355CFF]">
                <Cpu size={15} className="animate-spin" />
              </div>

              <div className="space-y-3 flex-1 max-w-[calc(100%-3rem)]">
                <div className="flex items-center gap-3 font-mono text-[9px] text-[#355CFF] uppercase tracking-wider font-bold">
                  <span>Command Center Orchestrator</span>
                  <span>·</span>
                  <span>Running Thought Chain</span>
                </div>

                <div className="bg-[#121216]/50 border border-[#355CFF]/20 rounded-2xl p-6 space-y-4">
                  {/* Pulsing Active Agent Group */}
                  <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-white/5">
                    <span className="text-[10px] font-mono text-[#6B7280] uppercase">Active Agents:</span>
                    {currentActiveAgents.map((agent, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#355CFF]/10 border border-[#355CFF]/20 text-[10px] font-mono font-bold text-[#355CFF] animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF] animate-ping" />
                        {agent}
                      </span>
                    ))}
                  </div>

                  {/* Live Activity Log list */}
                  <div className="space-y-2.5 font-mono text-[11px] text-[#A0A0A0]">
                    {currentLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2.5 animate-fade-in">
                        <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-white/80">{log}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2.5 text-[#355CFF] pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF] animate-ping shrink-0" />
                      <span className="animate-pulse">Orchestrator resolving pipeline...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* BOTTOM COMMAND BAR & PRESET EXAMPLES                */}
        {/* ═══════════════════════════════════════════════════ */}
        <div className="p-6 bg-[#121216]/70 border-t border-white/5 relative z-20 space-y-4 shrink-0">
          
          {/* Preset Commands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-4xl mx-auto">
            {examples.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (isLoading) return;
                  setInputValue(item.text);
                  handleSendMessage(item.text);
                }}
                disabled={isLoading}
                className="bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl p-3 text-left transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none group"
              >
                <p className="text-[9px] font-mono text-[#6B7280] group-hover:text-[#355CFF] uppercase font-bold tracking-wider mb-1">{item.label}</p>
                <p className="text-[11px] text-white/70 group-hover:text-white leading-tight font-medium truncate">{item.text}</p>
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="max-w-4xl mx-auto relative space-y-3">
            {/* File upload previews */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                {attachedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F0F12] border border-white/5 text-[11px] font-mono">
                    <FileText size={12} className="text-[#355CFF]" />
                    <span className="text-white/80 max-w-[120px] truncate">{file}</span>
                    <button 
                      type="button" 
                      onClick={() => removeFile(i)}
                      className="text-[#6B7280] hover:text-red-400 font-bold ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Bar wrapper */}
            <div className="relative flex items-center bg-[#0F0F12] border border-white/5 focus-within:border-[#355CFF]/40 focus-within:ring-1 focus-within:ring-[#355CFF]/10 rounded-2xl overflow-hidden transition-all duration-300">
              
              {/* Attach File Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
                className="h-14 w-14 flex items-center justify-center text-[#6B7280] hover:text-white transition-colors border-r border-white/5 active:scale-95 disabled:opacity-40 shrink-0"
                title="Attach file (PDF, DOCX, CSV, Image)"
              >
                <Paperclip size={18} className={cn(isUploading && "animate-spin text-[#355CFF]")} />
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
                accept=".pdf,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.csv"
              />

              {/* Text Input */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isLoading ? "GXL Agents are collaborating..." : "Ask GXL anything..."}
                disabled={isLoading}
                className="flex-1 bg-transparent px-5 py-4 text-[14px] text-white placeholder-[#6B7280] focus:outline-none focus:ring-0 w-full disabled:opacity-60"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || (!inputValue.trim() && attachedFiles.length === 0)}
                className="h-10 w-10 rounded-xl bg-[#355CFF] hover:bg-[#355CFF]/90 text-white flex items-center justify-center transition-all absolute right-2.5 top-1/2 -translate-y-1/2 active:scale-95 disabled:opacity-20 shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* RIGHT SIDEBAR — AGENTS POOL MONITOR                */}
      {/* ═══════════════════════════════════════════════════ */}
      <aside className="w-full md:w-60 border-t md:border-t-0 md:border-l border-white/5 bg-[#121216] p-5 shrink-0 space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B7280]">Agent Intelligence</p>
          <p className="text-xs text-white/50 leading-snug">Autonomous Collaboration Suite</p>
        </div>

        {/* Live Agents Status list */}
        <div className="flex flex-col gap-3.5">
          {agentSuite.map((agent, i) => {
            const isThinking = agent.status === "Thinking...";
            const isActive = agent.status === "Active";
            return (
              <div 
                key={i} 
                className={cn(
                  "bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl p-3.5 space-y-1.5 transition-all",
                  isThinking && "border-[#355CFF]/20 bg-[#355CFF]/[0.01]",
                  isActive && "border-emerald-400/20 bg-emerald-400/[0.01]"
                )}
              >
                <div className="flex items-center justify-between gap-3 font-sans">
                  <span className="text-[13px] font-bold text-white">{agent.name}</span>
                  {/* Status Indicator lights */}
                  <div className="flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isThinking && "bg-[#355CFF] animate-ping",
                      isActive && "bg-emerald-400 animate-pulse",
                      agent.status === "Idle" && "bg-[#6B7280]/40"
                    )} />
                    <span className={cn(
                      isThinking && "text-[#355CFF]",
                      isActive && "text-emerald-400",
                      agent.status === "Idle" && "text-[#6B7280]"
                    )}>{agent.status}</span>
                  </div>
                </div>
                <p className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wide">{agent.role}</p>
              </div>
            );
          })}
        </div>
      </aside>

    </div>
  );
}
