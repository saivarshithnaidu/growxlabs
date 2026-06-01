"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Paperclip, Terminal, Cpu, User, Briefcase, FileText,
  BarChart3, PenTool, Sparkles, Download, Command, X,
  PanelLeftClose, PanelLeft, Plus, MessageSquare, Loader2,
  ArrowUp, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Plan, { Task, Subtask } from "@/components/ui/agent-plan";

/* ─────────────────────────────────────────────────────────
   Auto-resize textarea hook
   ───────────────────────────────────────────────────────── */
function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const ta = textareaRef.current;
      if (!ta) return;
      if (reset) { ta.style.height = `${minHeight}px`; return; }
      ta.style.height = `${minHeight}px`;
      ta.style.height = `${Math.max(minHeight, Math.min(ta.scrollHeight, maxHeight ?? Infinity))}px`;
    },
    [minHeight, maxHeight],
  );
  useEffect(() => { if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`; }, [minHeight]);
  useEffect(() => { const h = () => adjustHeight(); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, [adjustHeight]);
  return { textareaRef, adjustHeight };
}

/* ─────────────────────────────────────────────────────────
   Dynamic greeting based on time-of-day
   ───────────────────────────────────────────────────────── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ─────────────────────────────────────────────────────────
   Agent plan initializers (per intent)
   ───────────────────────────────────────────────────────── */
const getInitialPlanForIntent = (intent: string): Task[] => {
  switch (intent) {
    case "PROPOSAL":
      return [
        { id: "1", title: "Market & Workflows Diagnostics", description: "Analyze target industry requirements and regional intake lags", status: "pending", priority: "high", level: 0, dependencies: [],
          subtasks: [
            { id: "1.1", title: "Review regional healthcare latency", description: "Audit current patient scheduling lag factors", status: "pending", priority: "medium", tools: ["file-system", "browser"] },
            { id: "1.2", title: "Research HIPAA compliance schemas", description: "Establish compliance constraints for custom database fields", status: "pending", priority: "high", tools: ["browser", "security-compliance-scanner"] },
          ],
        },
        { id: "2", title: "Sales Pipeline & Pain Qualification", description: "Map prospect conversions to operational CRM suites", status: "pending", priority: "high", level: 0, dependencies: ["1"],
          subtasks: [{ id: "2.1", title: "Evaluate prospect intake latency metrics", description: "Audit sales pipeline drop-offs and patient onboarding schemas", status: "pending", priority: "medium", tools: ["crm-intelligence", "lead-scoring-engine"] }],
        },
        { id: "3", title: "Financial Margin & Pricing Projections", description: "Develop automated cost models and standard/custom margins", status: "pending", priority: "medium", level: 1, dependencies: ["2"],
          subtasks: [{ id: "3.1", title: "Generate standard vs custom SaaS pricing models", description: "Forecast software delivery expenses and lifetime value", status: "pending", priority: "high", tools: ["financial-forecaster", "pricing-tier-builder"] }],
        },
        { id: "4", title: "Proposal (SOW) Blueprint Design", description: "Establish delivery milestones, specifications, and PDF blueprints", status: "pending", priority: "high", level: 1, dependencies: ["3"],
          subtasks: [{ id: "4.1", title: "Generate custom milestones scope", description: "Compile final proposal deliverables package and draft SOW.spec", status: "pending", priority: "high", tools: ["project-manager", "markdown-compiler"] }],
        },
      ];
    case "CONTENT":
      return [
        { id: "1", title: "Trend Scan & Competitor Intelligence", description: "Scan high-volume developer trends across social channels", status: "pending", priority: "high", level: 0, dependencies: [],
          subtasks: [{ id: "1.1", title: "LinkedIn & X developer hubs scrape", description: "Find top engineering and automation trends", status: "pending", priority: "medium", tools: ["linkedin-scraper", "x-trend-tracker"] }],
        },
        { id: "2", title: "SEO Keyword & Ranking Analysis", description: "Establish ranking parameters and keyword competition analysis", status: "pending", priority: "high", level: 0, dependencies: ["1"],
          subtasks: [{ id: "2.1", title: "Scrape SEO competition indices", description: "Run primary focus keyword metrics for AI vs Chatbots", status: "pending", priority: "high", tools: ["semrush-connector", "google-analytics"] }],
        },
        { id: "3", title: "Copywriting Hook & Body Drafting", description: "Craft high-converting social hooks, body copy, and metadata hashtags", status: "pending", priority: "high", level: 1, dependencies: ["2"],
          subtasks: [{ id: "3.1", title: "Draft target CTA & body framework", description: "Generate premium outreach copy", status: "pending", priority: "medium", tools: ["copywriting-assistant", "linguistic-processor"] }],
        },
      ];
    case "GROWTH":
      return [
        { id: "1", title: "Transactional Student Analytics", description: "Pull lifetime enrollments, curriculum records, and exam scores", status: "pending", priority: "high", level: 0, dependencies: [],
          subtasks: [{ id: "1.1", title: "Scan database analytics models", description: "Examine MoM expansion velocity stats", status: "pending", priority: "high", tools: ["postgres-connector", "upstash-redis"] }],
        },
        { id: "2", title: "SaaS Subscription Revenue Modeling", description: "Process financial trajectories and forecast revenue streams", status: "pending", priority: "high", level: 0, dependencies: ["1"],
          subtasks: [{ id: "2.1", title: "Run cost margins spreadsheets", description: "Simulate LTV and predictable MRR subscription lifecycles", status: "pending", priority: "high", tools: ["financial-forecaster", "pricing-tier-builder"] }],
        },
        { id: "3", title: "Strategic Risk & Expansion Roadmap", description: "Formulate strategic recommendations and manual-to-automated latency maps", status: "pending", priority: "medium", level: 1, dependencies: ["2"],
          subtasks: [{ id: "3.1", title: "Compile CEO strategic briefing", description: "Outline integration targets for administrative systems", status: "pending", priority: "medium", tools: ["strategy-analyzer", "executive-planner"] }],
        },
      ];
    case "CTO":
      return [
        { id: "1", title: "Repository Layout & Code Audit", description: "Examine client/server framework boundaries and dependencies", status: "pending", priority: "high", level: 0, dependencies: [],
          subtasks: [{ id: "1.1", title: "Check ESLint & Next.js compilation specs", description: "Confirm standard code quality rules", status: "pending", priority: "high", tools: ["file-system", "eslint-checker"] }],
        },
        { id: "2", title: "Security Logging & GPU Auditing", description: "Verify hardware acceleration settings and sentry error logging limits", status: "pending", priority: "medium", level: 0, dependencies: ["1"],
          subtasks: [{ id: "2.1", title: "Trace composition performance benchmarks", description: "Verify VRAM safety limits and clean compile margins", status: "pending", priority: "medium", tools: ["shell", "sentry-connector"] }],
        },
      ];
    default:
      return [
        { id: "1", title: "Context Mapping & Query Investigation", description: "Scan administrative and automation files for target query details", status: "pending", priority: "high", level: 0, dependencies: [],
          subtasks: [{ id: "1.1", title: "Query search indices", description: "Extract reference context details", status: "pending", priority: "medium", tools: ["browser", "search-engine"] }],
        },
        { id: "2", title: "Actionable Operational Advice Formulation", description: "Unify background findings into executive strategic suggestions", status: "pending", priority: "high", level: 1, dependencies: ["1"],
          subtasks: [{ id: "2.1", title: "Draft operational checklist recommendation", description: "Structure diagnostic markdown outputs", status: "pending", priority: "high", tools: ["strategy-analyzer", "markdown-processor"] }],
        },
      ];
  }
};

/* ─────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────── */
interface Message {
  id: string;
  sender: "user" | "gxl";
  text: string;
  timestamp: string;
  activeAgents?: string[];
  activityLogs?: string[];
  proposal?: { clientName: string; budget: string; timeline: string; deliverables: string[]; status: string };
  chart?: { month: string; revenue: number }[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

/* ─────────────────────────────────────────────────────────
   Markdown renderer — clean prose blocks
   ───────────────────────────────────────────────────────── */
function MarkdownBlock({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {text.split("\n\n").map((block, i) => {
        const t = block.trim();
        if (!t) return null;

        // Headings
        if (t.startsWith("# ")) return <h2 key={i} className="text-xl font-semibold text-white tracking-tight pt-2">{t.slice(2)}</h2>;
        if (t.startsWith("## ")) return <h3 key={i} className="text-lg font-semibold text-white/95 tracking-tight pt-1">{t.slice(3)}</h3>;
        if (t.startsWith("### ")) return <h4 key={i} className="text-base font-medium text-white/90 pt-1">{t.slice(4)}</h4>;

        // Horizontal rule
        if (t === "---") return <hr key={i} className="border-white/[0.06] my-2" />;

        // Bullet lists
        if (t.startsWith("* ") || t.startsWith("- ")) {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {t.split("\n").map((li, j) => {
                const content = li.replace(/^[\*\-]\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                return (
                  <li key={j} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF] mt-2 shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: content }} />
                  </li>
                );
              })}
            </ul>
          );
        }

        // Numbered lists
        if (/^\d+\.\s/.test(t)) {
          return (
            <ol key={i} className="space-y-1.5 pl-1">
              {t.split("\n").map((li, j) => {
                const content = li.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                return (
                  <li key={j} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-white/80">
                    <span className="text-[#355CFF] font-mono text-xs font-bold mt-0.5 shrink-0 w-5">{j + 1}.</span>
                    <span dangerouslySetInnerHTML={{ __html: content }} />
                  </li>
                );
              })}
            </ol>
          );
        }

        // Blockquotes
        if (t.startsWith("> ")) {
          const inner = t.split("\n").map(l => l.replace(/^>\s?/, "")).join("\n");
          return (
            <blockquote key={i} className="border-l-2 border-[#355CFF]/50 pl-4 py-2 text-[14px] text-white/70 leading-relaxed italic">
              <span dangerouslySetInnerHTML={{ __html: inner.replace(/\*\*(.*?)\*\*/g, "<strong class='text-white/90 not-italic'>$1</strong>") }} />
            </blockquote>
          );
        }

        // Tables
        if (t.startsWith("| ")) {
          const rows = t.split("\n").filter(r => r.trim() && !r.includes("---"));
          const headers = rows[0].split("|").map(h => h.trim()).filter(Boolean);
          const body = rows.slice(1).map(r => r.split("|").map(c => c.trim()).filter(Boolean));
          return (
            <div key={i} className="overflow-x-auto my-4 rounded-xl border border-white/[0.06]">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-white/[0.03] text-white/60 text-[11px] font-mono uppercase tracking-wider">
                    {headers.map((h, k) => <th key={k} className="px-4 py-3 font-medium">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {body.map((r, k) => (
                    <tr key={k} className="hover:bg-white/[0.02] transition-colors">
                      {r.map((c, m) => (
                        <td key={m} className={cn("px-4 py-3 text-white/80", m === r.length - 1 && "font-mono font-semibold text-white")}>
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

        // Paragraphs
        const html = t.replace(/\*\*(.*?)\*\*/g, "<strong class='text-white'>$1</strong>")
                       .replace(/`(.*?)`/g, "<code class='bg-white/[0.06] px-1.5 py-0.5 rounded text-[13px] font-mono text-[#c4b5fd]'>$1</code>");
        return <p key={i} className="text-[14px] leading-[1.75] text-white/75" dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════ */
export default function InteractiveWorkspace() {

  // ── Conversations & state ──
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "default", title: "New conversation", messages: [], createdAt: new Date() },
  ]);
  const [activeConvoId, setActiveConvoId] = useState("default");
  const activeConvo = conversations.find(c => c.id === activeConvoId)!;
  const messages = activeConvo.messages;

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentActiveAgents, setCurrentActiveAgents] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [livePlan, setLivePlan] = useState<Task[]>([]);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 48, maxHeight: 200 });

  const hasMessages = messages.length > 0;

  // ── Agents ──
  const [agentSuite, setAgentSuite] = useState([
    { name: "CEO Agent", role: "Strategy & Growth", status: "Idle" },
    { name: "CFO Agent", role: "Revenue & Forecasts", status: "Idle" },
    { name: "CTO Agent", role: "Code & Architecture", status: "Idle" },
    { name: "Research Agent", role: "Market intelligence", status: "Idle" },
    { name: "Content Agent", role: "Editorial & Strategy", status: "Idle" },
    { name: "SEO Agent", role: "Keyword ranking", status: "Idle" },
    { name: "Proposal Agent", role: "Scope & Timeline", status: "Idle" },
    { name: "Sales Agent", role: "Lead qualification", status: "Idle" },
    { name: "Project Agent", role: "Timeline tracking", status: "Idle" },
  ]);

  // ── Quick commands ──
  const commandSuggestions: CommandSuggestion[] = [
    { icon: <Briefcase className="w-4 h-4" />, label: "Create a proposal", description: "Create a proposal for ABC Hospital", prefix: "/proposal" },
    { icon: <PenTool className="w-4 h-4" />, label: "Content strategy", description: "What should we post today?", prefix: "/content" },
    { icon: <BarChart3 className="w-4 h-4" />, label: "Analyze growth", description: "Analyze GrowXLabs growth", prefix: "/growth" },
    { icon: <Terminal className="w-4 h-4" />, label: "Technical review", description: "Review this codebase structure", prefix: "/code" },
  ];

  // ── Auto-scroll ──
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  // ── Scroll detection for "scroll down" button ──
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollDown(scrollHeight - scrollTop - clientHeight > 120);
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // ── Click outside to dismiss command palette ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const btn = document.querySelector("[data-command-button]");
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(target) && !btn?.contains(target)) {
        setShowCommandPalette(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Typing "/" to open command palette ──
  useEffect(() => {
    if (inputValue.startsWith("/") && !inputValue.includes(" ")) {
      setShowCommandPalette(true);
      const idx = commandSuggestions.findIndex(cmd => cmd.prefix.startsWith(inputValue));
      setActiveSuggestion(idx >= 0 ? idx : 0);
    } else {
      setShowCommandPalette(false);
    }
  }, [inputValue]);

  // ── Helper: update messages in active conversation ──
  const pushMessage = (msg: Message) => {
    setConversations(prev => prev.map(c =>
      c.id === activeConvoId ? { ...c, messages: [...c.messages, msg] } : c,
    ));
  };

  // ── Update conversation title from first user message ──
  const updateConvoTitle = (text: string) => {
    const title = text.length > 40 ? text.slice(0, 40) + "…" : text;
    setConversations(prev => prev.map(c =>
      c.id === activeConvoId && c.title === "New conversation" ? { ...c, title } : c,
    ));
  };

  // ── New conversation ──
  const startNewConversation = () => {
    const id = `convo-${Date.now()}`;
    setConversations(prev => [{ id, title: "New conversation", messages: [], createdAt: new Date() }, ...prev]);
    setActiveConvoId(id);
    setLivePlan([]);
    setCurrentActiveAgents([]);
  };

  // ── Send message orchestrator ──
  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text && attachedFiles.length === 0) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text || `Uploaded ${attachedFiles.length} file(s): ${attachedFiles.join(", ")}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    pushMessage(userMsg);
    updateConvoTitle(text);
    setInputValue("");
    adjustHeight(true);
    setIsLoading(true);
    setCurrentActiveAgents([]);
    setLivePlan([]);

    try {
      const response = await fetch("/api/admin/command-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, files: attachedFiles }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Initialize plan
      const initialPlan = getInitialPlanForIntent(data.intent || "GENERAL");
      setLivePlan(initialPlan);

      // Activate agents
      setAgentSuite(prev => prev.map(a =>
        data.activeAgents?.includes(a.name) ? { ...a, status: "Thinking..." } : a,
      ));
      setCurrentActiveAgents(data.activeAgents || []);

      // Step through activity logs
      for (let i = 0; i < data.activity.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 900));

        const activeName = data.activity[i].split(":")[0];
        setAgentSuite(prev => prev.map(a => a.name === activeName ? { ...a, status: "Active" } : a));

        setLivePlan(prevPlan =>
          prevPlan.map((task, idx) => {
            if (idx === i) return { ...task, status: "in-progress", subtasks: task.subtasks.map(sub => ({ ...sub, status: "in-progress" })) };
            if (idx < i) return { ...task, status: "completed", subtasks: task.subtasks.map(sub => ({ ...sub, status: "completed" })) };
            return task;
          }),
        );
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      // Finalize plan
      setLivePlan(prevPlan => prevPlan.map(task => ({
        ...task, status: "completed",
        subtasks: task.subtasks.map(sub => ({ ...sub, status: "completed" })),
      })));

      const gxlMsg: Message = {
        id: `gxl-${Date.now()}`,
        sender: "gxl",
        text: data.output,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        activeAgents: data.activeAgents,
        activityLogs: data.activity,
        proposal: data.proposal,
        chart: data.chart,
      };

      pushMessage(gxlMsg);
    } catch {
      pushMessage({
        id: `err-${Date.now()}`,
        sender: "gxl",
        text: "### ⚠️ Orchestration Interrupted\nFailed to sync with internal AI operating system. Please check your credentials or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } finally {
      setIsLoading(false);
      setAttachedFiles([]);
      setAgentSuite(prev => prev.map(a => ({ ...a, status: "Idle" })));
    }
  };

  // ── Keyboard ──
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveSuggestion(p => p < commandSuggestions.length - 1 ? p + 1 : 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveSuggestion(p => p > 0 ? p - 1 : commandSuggestions.length - 1); }
      else if (e.key === "Tab" || e.key === "Enter") { e.preventDefault(); if (activeSuggestion >= 0) { setInputValue(commandSuggestions[activeSuggestion].description); setShowCommandPalette(false); } }
      else if (e.key === "Escape") { e.preventDefault(); setShowCommandPalette(false); }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) handleSendMessage(inputValue);
    }
  };

  // ── File handling ──
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setIsUploading(true);
    setTimeout(() => {
      setAttachedFiles(prev => [...prev, ...Array.from(files).map(f => f.name)]);
      setIsUploading(false);
    }, 800);
  };

  // ═══════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div className="flex h-full bg-[#0a0a0b] text-white overflow-hidden">

      {/* ─── LEFT SIDEBAR ─── */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full border-r border-white/[0.06] bg-[#0f0f11] flex flex-col overflow-hidden shrink-0"
          >
            {/* New chat button */}
            <div className="p-3">
              <button
                onClick={startNewConversation}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.1] transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                New chat
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 custom-scrollbar">
              <p className="px-3 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">Recent</p>
              {conversations.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setActiveConvoId(c.id); setLivePlan([]); setCurrentActiveAgents([]); }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-[13px] truncate transition-all",
                    c.id === activeConvoId
                      ? "bg-white/[0.07] text-white font-medium"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-50" />
                    <span className="truncate">{c.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom brand */}
            <div className="p-4 border-t border-white/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#355CFF] to-[#1E3BB3] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white/80">GXL Command Center</p>
                  <p className="text-[9px] text-white/30 font-mono">v2.0 · Internal</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── MAIN CHAT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 relative">

        {/* Top bar */}
        <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-white/[0.04] bg-[#0a0a0b]/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.05] transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
            <span className="text-[13px] font-medium text-white/60 hidden sm:inline">
              {activeConvo.title === "New conversation" ? "GXL Command Center" : activeConvo.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentActiveAgents.length > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#355CFF]/10 border border-[#355CFF]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF] animate-pulse" />
                <span className="text-[10px] font-mono text-[#355CFF] font-medium">
                  {currentActiveAgents.length} agent{currentActiveAgents.length > 1 ? "s" : ""} active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chat scroll container */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">

          {/* ─── EMPTY STATE (Claude-inspired) ─── */}
          {!hasMessages && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center max-w-2xl mx-auto"
              >
                {/* Logo */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#355CFF] to-[#6B7BFF] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#355CFF]/20">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-2">
                  {getGreeting()}.
                </h1>
                <p className="text-[15px] text-white/40 mb-10">
                  How can I help you today?
                </p>

                {/* Suggestion grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {commandSuggestions.map((item, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                      onClick={() => { if (!isLoading) handleSendMessage(item.description); }}
                      className="group flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] text-left transition-all active:scale-[0.98]"
                    >
                      <div className="p-2 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] text-white/50 group-hover:text-white/80 transition-colors shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-white/80 group-hover:text-white mb-0.5 transition-colors">{item.label}</p>
                        <p className="text-[12px] text-white/35 group-hover:text-white/50 leading-snug transition-colors">{item.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* ─── MESSAGE STREAM ─── */}
          {hasMessages && (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn("group", msg.sender === "user" ? "flex justify-end" : "")}
                >
                  {msg.sender === "user" ? (
                    /* ── User message ── */
                    <div className="max-w-[85%] sm:max-w-[70%]">
                      <div className="bg-white/[0.06] rounded-2xl rounded-br-md px-5 py-3.5">
                        <p className="text-[14px] leading-relaxed text-white/90">{msg.text}</p>
                      </div>
                      <p className="text-[10px] text-white/20 mt-1.5 text-right font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.timestamp}
                      </p>
                    </div>
                  ) : (
                    /* ── GXL message ── */
                    <div className="w-full">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#355CFF] to-[#1E3BB3] flex items-center justify-center shrink-0 shadow-md shadow-[#355CFF]/10">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[12px] font-semibold text-white/60">GXL Command Center</span>
                          <span className="text-[10px] text-white/20 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{msg.timestamp}</span>
                        </div>
                      </div>

                      <div className="pl-10">
                        <MarkdownBlock text={msg.text} />

                        {/* Chart attachment */}
                        {msg.chart && (
                          <div className="mt-6 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                            <div className="flex items-center gap-2.5 mb-5">
                              <Cpu className="w-4 h-4 text-[#355CFF]" />
                              <h4 className="text-[13px] font-semibold text-white/80">Revenue Forecast</h4>
                            </div>
                            <div className="h-36 flex items-end gap-3 pb-2 border-b border-white/[0.04]">
                              {msg.chart.map((point, k) => {
                                const pct = (point.revenue / 120000) * 100;
                                return (
                                  <div key={k} className="flex-1 flex flex-col items-center gap-2 group/bar cursor-pointer">
                                    <div className="w-full relative flex items-end justify-center h-24">
                                      <div className="absolute -top-6 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white text-black font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow-lg">
                                        ₹{point.revenue.toLocaleString()}
                                      </div>
                                      <div style={{ height: `${pct}%` }} className="w-full bg-[#355CFF]/15 group-hover/bar:bg-[#355CFF]/30 rounded-t-md transition-all border border-[#355CFF]/20" />
                                    </div>
                                    <span className="text-[10px] font-mono text-white/30">{point.month}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Proposal attachment */}
                        {msg.proposal && (
                          <div className="mt-6 p-5 rounded-xl border border-[#355CFF]/20 bg-[#355CFF]/[0.03] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#355CFF]/5 rounded-full blur-3xl" />
                            <div className="relative space-y-4">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                  <p className="text-[10px] font-mono text-[#355CFF] uppercase tracking-widest font-bold mb-1">Proposal Generated</p>
                                  <h4 className="text-base font-semibold text-white">{msg.proposal.clientName} Scope Blueprint</h4>
                                </div>
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full font-semibold">
                                  ✓ Ready for review
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-3 border-y border-white/[0.06] py-3 text-[11px] font-mono">
                                <div><p className="text-white/30 uppercase mb-1">Budget</p><p className="text-white font-semibold">{msg.proposal.budget}</p></div>
                                <div><p className="text-white/30 uppercase mb-1">Delivery</p><p className="text-white font-semibold">{msg.proposal.timeline}</p></div>
                                <div><p className="text-white/30 uppercase mb-1">Format</p><p className="text-white font-semibold">SOW-PDF.spec</p></div>
                              </div>

                              <div>
                                <p className="text-[10px] font-mono text-white/30 uppercase mb-2">Key Deliverables</p>
                                <ul className="space-y-1.5">
                                  {msg.proposal.deliverables.map((del, k) => (
                                    <li key={k} className="flex items-center gap-2 text-[12px] text-white/70">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF]" />
                                      {del}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <button
                                onClick={() => alert(`Simulating download for ${msg.proposal?.clientName}.`)}
                                className="inline-flex items-center gap-2 bg-[#355CFF] hover:bg-[#355CFF]/90 text-white font-medium text-[12px] px-4 py-2.5 rounded-lg transition-all active:scale-[0.97]"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Download Full SOW Package
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* ── THINKING STATE (inline, Claude-style) ── */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#355CFF] to-[#1E3BB3] flex items-center justify-center shrink-0 shadow-md shadow-[#355CFF]/10">
                      <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[12px] font-semibold text-white/60">GXL Command Center</span>
                      <span className="text-[10px] text-[#355CFF] font-mono animate-pulse">thinking…</span>
                    </div>
                  </div>

                  <div className="pl-10 space-y-4">
                    {/* Active agents */}
                    {currentActiveAgents.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {currentActiveAgents.map((agent, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] font-medium text-white/60"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#355CFF] animate-pulse" />
                            {agent}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Live plan */}
                    {livePlan.length > 0 && (
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
                        <Plan tasks={livePlan} />
                      </div>
                    )}

                    {/* Shimmer loading indicator */}
                    <div className="flex items-center gap-2 text-white/30 text-[12px] font-mono">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span>Processing multi-agent pipeline…</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}

          {/* Scroll-to-bottom FAB */}
          <AnimatePresence>
            {showScrollDown && hasMessages && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                onClick={scrollToBottom}
                className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-white/70" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ─── BOTTOM INPUT CONSOLE ─── */}
        <div className="shrink-0 border-t border-white/[0.04] bg-[#0a0a0b] relative z-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 space-y-2">

            {/* Command palette overlay */}
            <AnimatePresence>
              {showCommandPalette && (
                <motion.div
                  ref={commandPaletteRef}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-4 right-4 sm:left-6 sm:right-6 bottom-full mb-2 bg-[#141416] rounded-xl border border-white/[0.08] shadow-2xl overflow-hidden max-w-3xl mx-auto z-50"
                >
                  <div className="py-1">
                    {commandSuggestions
                      .filter(cmd => cmd.prefix.startsWith(inputValue))
                      .map((sug, index) => (
                        <button
                          key={sug.prefix}
                          onClick={() => { setInputValue(sug.description); setShowCommandPalette(false); textareaRef.current?.focus(); }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            activeSuggestion === index ? "bg-white/[0.06] text-white" : "text-white/60 hover:bg-white/[0.03]",
                          )}
                        >
                          <div className="w-5 h-5 flex items-center justify-center text-white/40">{sug.icon}</div>
                          <span className="text-[13px] font-medium">{sug.label}</span>
                          <span className="text-[11px] text-white/25 font-mono ml-1">{sug.prefix}</span>
                          <span className="text-[11px] text-white/30 ml-auto">{sug.description}</span>
                        </button>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Attached files */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {attachedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono">
                    <FileText className="w-3 h-3 text-[#355CFF]" />
                    <span className="text-white/60 max-w-[120px] truncate">{file}</span>
                    <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} className="text-white/30 hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="relative flex flex-col bg-[#141416] border border-white/[0.08] focus-within:border-white/[0.15] rounded-2xl transition-all duration-200 shadow-lg shadow-black/20">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); adjustHeight(); }}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? "Agents are working…" : "Message GXL Command Center…"}
                disabled={isLoading}
                rows={1}
                className="w-full bg-transparent px-4 pt-3.5 pb-2 text-[14px] text-white placeholder-white/25 focus:outline-none resize-none min-h-[48px] max-h-[200px] leading-relaxed custom-scrollbar"
              />

              <div className="px-3 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isUploading}
                    className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors disabled:opacity-30"
                    title="Attach file"
                  >
                    <Paperclip className={cn("w-4 h-4", isUploading && "animate-spin text-[#355CFF]")} />
                  </button>
                  <button
                    type="button"
                    data-command-button
                    onClick={(e) => { e.stopPropagation(); setShowCommandPalette(p => !p); }}
                    className={cn(
                      "p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors",
                      showCommandPalette && "bg-white/[0.06] text-white/60",
                    )}
                    title="Commands"
                  >
                    <Command className="w-4 h-4" />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                    accept=".pdf,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.csv"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    inputValue.trim()
                      ? "bg-white text-black hover:bg-neutral-200 shadow-md active:scale-95"
                      : "bg-white/[0.06] text-white/20 cursor-not-allowed",
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-[10px] text-white/15 text-center font-mono">
              GXL Command Center can make mistakes. Verify important outputs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
