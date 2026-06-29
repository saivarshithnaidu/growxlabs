"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Paperclip, Terminal, Cpu, User, Briefcase, FileText,
  BarChart3, PenTool, Download, Command, X,
  PanelLeftClose, PanelLeft, PanelRightClose, PanelRight, Plus, MessageSquare, Loader2,
  ArrowUp, ChevronDown, Check, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
   Types
   ───────────────────────────────────────────────────────── */
interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  status: "calling" | "complete" | "error";
  result?: any;
  duration?: number;
}

interface Message {
  id: string;
  sender: "user" | "gxl";
  text: string;
  timestamp: string;
  activeAgents?: string[];
  activityLogs?: string[];
  proposal?: { clientName: string; budget: string; timeline: string; deliverables: string[]; status: string };
  chart?: { month: string; revenue: number }[];
  toolCalls?: ToolCall[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface Subagent {
  id: string;
  name: string;
  focus: string;
  mission: string;
  status: "running" | "completed" | "error";
  logs: string[];
  result?: string;
}

const DEFAULT_CONVO: Conversation = {
  id: "default",
  title: "New conversation",
  messages: [],
  createdAt: new Date(0)
};

function mapToolToAgent(toolName: string): string {
  switch (toolName) {
    case "search_web":
      return "Research Agent";
    case "query_leads":
    case "create_lead":
      return "Sales Agent";
    case "get_company_stats":
      return "CFO Agent";
    case "generate_proposal":
      return "Proposal Agent";
    default:
      return "Research Agent";
  }
}

function ToolCallActivityWidget({ toolCalls }: { toolCalls?: ToolCall[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="my-4 rounded-lg border border-[#e6e6e6] bg-[#f6f5f4]/50 overflow-hidden text-[13px] shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#f6f5f4] hover:bg-neutral-100 transition-colors font-semibold text-neutral-700"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#0075de] animate-pulse" />
          <span>Real Agent Activity ({toolCalls.length})</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="divide-y divide-[#e6e6e6] bg-white">
          {toolCalls.map((tc) => {
            const formatArgs = () => {
              if (!tc.args || Object.keys(tc.args).length === 0) return null;
              return (
                <pre className="mt-1 text-[10px] font-mono text-neutral-500 bg-neutral-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(tc.args, null, 2)}
                </pre>
              );
            };

            const formatResult = () => {
              if (!tc.result) return null;
              if (tc.name === "get_company_stats") {
                return (
                  <div className="mt-1.5 text-xs text-neutral-600 space-y-0.5 font-mono">
                    <p>Total Leads: {tc.result.totalLeads}</p>
                    <p>Average Score: {tc.result.averageLeadScore}</p>
                  </div>
                );
              }
              if (tc.name === "query_leads") {
                const count = Array.isArray(tc.result) ? tc.result.length : 0;
                return (
                  <p className="mt-1.5 text-xs text-neutral-600 font-mono">
                    → Found {count} lead(s) matching query
                  </p>
                );
              }
              if (tc.name === "create_lead") {
                return (
                  <p className="mt-1.5 text-xs text-emerald-600 font-mono">
                    → Created lead: {tc.result.business_name} ({tc.result.city})
                  </p>
                );
              }
              if (tc.name === "generate_proposal") {
                return (
                  <p className="mt-1.5 text-xs text-emerald-600 font-mono">
                    → Generated proposal ID: {tc.result.proposalId}
                  </p>
                );
              }
              return (
                <pre className="mt-1.5 text-[10px] font-mono text-neutral-500 bg-neutral-50 p-2 rounded overflow-x-auto max-h-24">
                  {typeof tc.result === "string" ? tc.result : JSON.stringify(tc.result, null, 2)}
                </pre>
              );
            };

            return (
              <div key={tc.id} className="p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tc.status === "calling" ? (
                      <Loader2 className="w-4 h-4 text-[#0075de] animate-spin" />
                    ) : tc.status === "complete" ? (
                      <Check className="w-4 h-4 text-emerald-600 font-bold" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="font-mono font-bold text-neutral-800">{tc.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {tc.status === "calling" ? "Running..." : "Finished"}
                  </span>
                </div>
                {formatArgs()}
                {formatResult()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SubagentCard({ agent }: { agent: Subagent }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "rounded-lg border bg-white p-3.5 shadow-sm space-y-2.5 transition-all text-left",
      agent.status === "running" ? "border-[#0075de]/30 bg-[#0075de]/[0.01]" : "border-[#e6e6e6]"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {agent.status === "running" ? (
              <Loader2 className="w-3.5 h-3.5 text-[#0075de] animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
            )}
            <h5 className="font-bold text-neutral-800 text-[13px] truncate">{agent.name}</h5>
          </div>
          <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">Focus: {agent.focus}</p>
        </div>
      </div>

      <div className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-100 font-mono leading-relaxed">
        <p className="text-[10px] uppercase text-neutral-400 font-bold mb-1 tracking-wider">Mission</p>
        <p>{agent.mission}</p>
      </div>

      <div className="space-y-1.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-bold text-neutral-500 hover:text-neutral-800 flex items-center gap-1 font-mono uppercase tracking-wider"
        >
          <span>Activity Log ({agent.logs.length})</span>
          <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", expanded && "rotate-180")} />
        </button>

        {expanded && (
          <div className="pl-1 pt-1.5 space-y-2 border-l border-neutral-200 ml-1.5">
            {agent.logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed text-neutral-500">
                <span className="w-1 h-1 rounded-full bg-neutral-400 mt-2 shrink-0" />
                <span>{log}</span>
              </div>
            ))}
            {agent.result && (
              <div className="mt-2 pt-2 border-t border-dashed border-[#e6e6e6] text-[11px] text-neutral-700 bg-neutral-50/50 p-2 rounded">
                <p className="font-bold text-neutral-800 font-mono text-[10px] uppercase tracking-wider mb-1">Findings Summary</p>
                <p className="whitespace-pre-line leading-relaxed font-sans">{agent.result}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
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
function MarkdownBlock({ text, isDark }: { text: string; isDark?: boolean }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  
  let currentList: { type: "bullet" | "number"; items: string[] } | null = null;
  let currentBlockquote: string[] | null = null;
  let currentTable: string[] | null = null;
  let currentParagraph: string[] | null = null;
  
  const renderFormattedText = (str: string) => {
    const strongClass = isDark ? "text-zinc-50 font-bold" : "text-neutral-950 font-bold";
    const codeClass = isDark 
      ? "bg-zinc-800 border border-white/10 px-1.5 py-0.5 rounded text-[13px] font-mono text-purple-400"
      : "bg-[#f6f5f4] border border-[#e6e6e6] px-1.5 py-0.5 rounded text-[13px] font-mono text-purple-600";
      
    return str
      .replace(/\*\*(.*?)\*\*/g, `<strong class="${strongClass}">$1</strong>`)
      .replace(/\`(.*?)\`/g, `<code class="${codeClass}">$1</code>`);
  };

  const flush = (key: string | number) => {
    if (currentList) {
      if (currentList.type === "bullet") {
        elements.push(
          <ul key={`ul-${key}`} className="space-y-1.5 pl-1 my-2">
            {currentList.items.map((item, idx) => {
              const html = renderFormattedText(item);
              return (
                <li key={idx} className={cn("flex items-start gap-2.5 text-[14px] leading-relaxed", isDark ? "text-zinc-300" : "text-neutral-700")}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0075de] mt-2 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: html }} />
                </li>
              );
            })}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${key}`} className="space-y-1.5 pl-1 my-2">
            {currentList.items.map((item, idx) => {
              const html = renderFormattedText(item);
              return (
                <li key={idx} className={cn("flex items-start gap-2.5 text-[14px] leading-relaxed", isDark ? "text-zinc-300" : "text-neutral-700")}>
                  <span className="text-[#0075de] font-mono text-xs font-bold mt-0.5 shrink-0 w-5">{idx + 1}.</span>
                  <span dangerouslySetInnerHTML={{ __html: html }} />
                </li>
              );
            })}
          </ol>
        );
      }
      currentList = null;
    }
    
    if (currentBlockquote) {
      const inner = currentBlockquote.join("\n");
      const html = renderFormattedText(inner);
      elements.push(
        <blockquote key={`bq-${key}`} className={cn("border-l-2 border-[#0075de]/50 pl-4 py-2 text-[14px] leading-relaxed italic my-2", isDark ? "text-zinc-400" : "text-neutral-600")}>
          <span dangerouslySetInnerHTML={{ __html: html }} />
        </blockquote>
      );
      currentBlockquote = null;
    }
    
    if (currentTable) {
      const rows = currentTable.filter(r => r.trim() && !r.includes("---"));
      if (rows.length > 0) {
        const headers = rows[0].split("|").map(h => h.trim()).filter(Boolean);
        const body = rows.slice(1).map(r => r.split("|").map(c => c.trim()).filter(Boolean));
        elements.push(
          <div key={`tab-${key}`} className={cn("overflow-x-auto my-4 rounded-lg border", isDark ? "border-white/10" : "border-[#e6e6e6]")}>
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className={cn("text-[11px] font-mono uppercase tracking-wider", isDark ? "bg-white/5 text-zinc-400" : "bg-[#f6f5f4] text-neutral-500")}>
                  {headers.map((h, k) => <th key={k} className="px-4 py-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody className={cn("divide-y", isDark ? "divide-white/5" : "divide-[#e6e6e6]")}>
                {body.map((r, k) => (
                  <tr key={k} className={cn("transition-colors", isDark ? "hover:bg-white/[0.02]" : "hover:bg-neutral-50")}>
                    {r.map((c, m) => {
                      const html = renderFormattedText(c);
                      return (
                        <td key={m} className={cn("px-4 py-3", isDark ? "text-zinc-300" : "text-neutral-700", m === r.length - 1 && (isDark ? "font-mono font-semibold text-zinc-100" : "font-mono font-semibold text-neutral-950"))}>
                          <span dangerouslySetInnerHTML={{ __html: html }} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      currentTable = null;
    }
    
    if (currentParagraph) {
      const content = currentParagraph.join(" ");
      if (content.trim()) {
        const html = renderFormattedText(content);
        elements.push(
          <p key={`p-${key}`} className={cn("text-[14px] leading-[1.75] my-2", isDark ? "text-zinc-300" : "text-neutral-700")} dangerouslySetInnerHTML={{ __html: html }} />
        );
      }
      currentParagraph = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flush(i);
      continue;
    }

    if (trimmed.startsWith("#")) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        flush(i);
        const level = match[1].length;
        const headerText = match[2];
        const levelNormalized = Math.min(6, level + 1);
        
        const sizeClass = 
          level === 1 ? cn("text-lg font-bold tracking-tight pt-2 my-1.5", isDark ? "text-zinc-100" : "text-neutral-900") :
          level === 2 ? cn("text-base font-bold tracking-tight pt-1 my-1.5", isDark ? "text-zinc-200" : "text-neutral-800") :
          level === 3 ? cn("text-sm font-semibold pt-1 my-1", isDark ? "text-zinc-300" : "text-neutral-800") :
          cn("text-xs font-bold uppercase tracking-wider pt-1 my-1", isDark ? "text-zinc-400" : "text-neutral-700");
        
        let headerElement;
        if (levelNormalized === 2) {
          headerElement = <h2 key={`h-${i}`} className={sizeClass}>{headerText}</h2>;
        } else if (levelNormalized === 3) {
          headerElement = <h3 key={`h-${i}`} className={sizeClass}>{headerText}</h3>;
        } else if (levelNormalized === 4) {
          headerElement = <h4 key={`h-${i}`} className={sizeClass}>{headerText}</h4>;
        } else if (levelNormalized === 5) {
          headerElement = <h5 key={`h-${i}`} className={sizeClass}>{headerText}</h5>;
        } else {
          headerElement = <h6 key={`h-${i}`} className={sizeClass}>{headerText}</h6>;
        }
        elements.push(headerElement);
        continue;
      }
    }
    
    else if (trimmed === "---") {
      flush(i);
      elements.push(<hr key={`hr-${i}`} className={cn("my-4", isDark ? "border-white/10" : "border-[#e6e6e6]")} />);
    }
    else if (trimmed.startsWith("> ")) {
      if (currentList || currentTable || currentParagraph) flush(i);
      if (!currentBlockquote) currentBlockquote = [];
      currentBlockquote.push(trimmed.slice(2));
    }
    else if (trimmed.startsWith("|")) {
      if (currentList || currentBlockquote || currentParagraph) flush(i);
      if (!currentTable) currentTable = [];
      currentTable.push(trimmed);
    }
    else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      if (currentBlockquote || currentTable || currentParagraph || (currentList && currentList.type !== "bullet")) flush(i);
      if (!currentList) currentList = { type: "bullet", items: [] };
      currentList.items.push(trimmed.slice(2));
    }
    else if (/^\d+\.\s/.test(trimmed)) {
      if (currentBlockquote || currentTable || currentParagraph || (currentList && currentList.type !== "number")) flush(i);
      if (!currentList) currentList = { type: "number", items: [] };
      currentList.items.push(trimmed.replace(/^\d+\.\s*/, ""));
    }
    else {
      if (currentList || currentBlockquote || currentTable) flush(i);
      if (!currentParagraph) currentParagraph = [];
      currentParagraph.push(trimmed);
    }
  }

  flush("final");

  return <div className="space-y-3">{elements}</div>;
}

interface ActivePanel {
  id: string;
  agentName: string;
  role: string;
  status: "idle" | "running" | "completed" | "error";
  logs: string[];
  input: string;
  chatHistory: { sender: "user" | "agent"; text: string; timestamp: string }[];
}

function getLogStepsForAgent(agentName: string): string[] {
  const common = [
    "[COGNITION] Loading GrowX Labs company vision & Q3 milestones...",
    "[PROCESS] Parsing user instructions and attached context..."
  ];

  if (agentName.includes("CEO")) {
    return [
      "[SYSTEM] Booting CEO neural cognitive engine...",
      ...common,
      "[DATABASE] Fetching GrowX corporate data & pipeline stats...",
      "[ANALYSIS] Running SWOT matrix generators on competitor landscape...",
      "[SYNTHESIS] Generating high-level tactical growth blueprints...",
      "[SYSTEM] Strategic alignment successfully completed."
    ];
  }
  if (agentName.includes("CFO")) {
    return [
      "[SYSTEM] Initializing financial ledger & modeling engine...",
      ...common,
      "[LEDGER] Querying Supabase subscriber totals & invoice datasets...",
      "[MODEL] Processing Monte Carlo revenue forecasting (Standard vs Growth Tiers)...",
      "[MARGIN] Calculating operational margin metrics & budget recommendations...",
      "[SYSTEM] Financial projections generated."
    ];
  }
  if (agentName.includes("CTO")) {
    return [
      "[SYSTEM] Initializing static analysis codebase parser...",
      ...common,
      "[PARSER] Scanning project app/ structure & API route endpoints...",
      "[PERFORMANCE] Running simulated query load-testing on Supabase channels...",
      "[SECURITY] Code scan complete: 0 vulnerabilities found.",
      "[SYSTEM] Engineering architecture brief compiled."
    ];
  }
  if (agentName.includes("Research")) {
    return [
      "[SYSTEM] Connecting to global web index crawlers...",
      ...common,
      "[CRAWLER] Searching queries across TechCrunch, Gartner, and McKinsey...",
      "[ANALYSIS] Extraction complete. Categorizing semantic themes...",
      "[COMPETITIVE] Mapping competitor pricing matrices & market entry angles...",
      "[SYSTEM] Competitive market report compiled."
    ];
  }
  if (agentName.includes("Sales")) {
    return [
      "[SYSTEM] Initializing sales pipeline qualification parser...",
      ...common,
      "[DATABASE] Querying CRM lead statuses, cities, and interaction notes...",
      "[LEADS] Analyzing lead scores and conversion probability ratios...",
      "[SOW] Formatting follow-up messaging blueprints...",
      "[SYSTEM] Sales qualification complete."
    ];
  }
  if (agentName.includes("Content") || agentName.includes("SEO")) {
    return [
      "[SYSTEM] Launching editorial calendar & copy generation engine...",
      ...common,
      "[DATABASE] Retrieving blog engagement metrics & newsletter topics...",
      "[COPY] Formulating social media copy briefs & campaign outlines...",
      "[SEO] Aligning copy with target keyword density constraints...",
      "[SYSTEM] Content brief successfully generated."
    ];
  }
  return [
    "[SYSTEM] Booting agent workspace pipeline...",
    ...common,
    "[DATABASE] Executing localized database search queries...",
    "[SYNTHESIS] Combining data vectors into unified operational briefs...",
    "[SYSTEM] Task completed."
  ];
}

function generateSubagentResult(agentName: string, prompt: string): string {
  const contextMatch = prompt.match(/\[Context:\s*"(.*?)"\]/i);
  const context = contextMatch ? contextMatch[1] : "";
  const cleanPrompt = prompt.replace(/\[Context:\s*".*?"\]/gi, "").trim();
  
  // Extract a domain name if present in prompt or context
  const domainMatch = (cleanPrompt + " " + context).match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,6})/);
  const targetDomain = domainMatch ? domainMatch[1] : "growxlabs.com";
  
  // Extract keywords or target subjects
  const words = cleanPrompt.split(/\s+/).filter(w => w.length > 4);
  const targetSubject = words.length > 0 ? words.slice(0, 3).join(" ") : "Operational Strategy";

  const timestamp = new Date().toLocaleDateString();

  if (agentName.includes("CEO")) {
    return "### CEO Strategic Brief: " + targetDomain + "\n" +
      "Generated in response to: *\"" + cleanPrompt + "\"*" + "\n" +
      "Date: " + timestamp + "\n\n" +
      "## 1. Strategic Summary\n" +
      "We have parsed the operational blueprint for **" + targetDomain + "** aligning with your directive: \"" + cleanPrompt + "\". Our core strategic mandate centers on accelerating product-market fit.\n\n" +
      (context ? "## 2. Dragged Context Integration\nWe analyzed the provided context: *\"" + context.slice(0, 100) + "...\"*. Based on this telemetry, we recommend restructuring Q3 priorities.\n\n" : "") +
      "## 3. SWOT Matrix for " + targetDomain + "\n" +
      "| Strengths | Weaknesses |\n" +
      "| :--- | :--- |\n" +
      "| Strong positioning on \"" + targetSubject + "\" | Legacy database constraints |\n" +
      "| High organic engagement | Dependency on external API pipelines |\n\n" +
      "| Opportunities | Threats |\n" +
      "| :--- | :--- |\n" +
      "| Expand services under " + targetDomain + " brand | Rapidly falling model inference cost margins |\n" +
      "| Integrated agent orchestration workspace | Aggressive competitor feature matching |\n\n" +
      "## 4. Action Items\n" +
      "* **Immediate**: Spin up a sandbox to isolate telemetry for the \"" + targetSubject + "\" initiative.\n" +
      "* **Medium Term**: Refactor Supabase pipelines to optimize speed.\n";
  }

  if (agentName.includes("CFO")) {
    return "### CFO Financial Model & Audit: " + targetDomain + "\n" +
      "Generated in response to: *\"" + cleanPrompt + "\"*" + "\n\n" +
      "## 1. Revenue Forecast & Projections\n" +
      "Based on financial metrics associated with **" + targetDomain + "** and targeting \"" + targetSubject + "\":\n\n" +
      "| Month | Active Accounts | Projected Billing | COGS (Model APIs) | Net Margin |\n" +
      "| :--- | :--- | :--- | :--- | :--- |\n" +
      "| Month 1 | 100 | ₹3,0,000 | ₹60,000 | ₹2,40,000 |\n" +
      "| Month 2 | 135 | ₹4,05,000 | ₹78,000 | ₹3,27,000 |\n" +
      "| Month 3 | 185 | ₹5,55,000 | ₹1,02,000 | ₹4,53,000 |\n\n" +
      (context ? "## 2. Audited Context Reference\nOur financial model ingested the context payload: *\"" + context.slice(0, 100) + "...\"*.\n\n" : "") +
      "## 3. Margin Insights\n" +
      "- **Gross Margin**: **81.6%**\n" +
      "- **Action Item**: Implement query caching to reduce COGS for the " + targetDomain + " API endpoints by 12%.\n";
  }

  if (agentName.includes("CTO")) {
    return "### CTO Engineering & Architecture Spec: " + targetDomain + "\n" +
      "Generated in response to: *\"" + cleanPrompt + "\"*" + "\n\n" +
      "## 1. Technical Audit\n" +
      "Analyzing codebase structure and endpoints for **" + targetDomain + "** in relation to \"" + targetSubject + "\".\n\n" +
      "- **Core Framework**: Next.js App Router (React 19).\n" +
      "- **Database Layer**: Supabase PostgreSQL.\n" +
      "- **Identified Bottleneck**: telemetry requests lack caching.\n\n" +
      (context ? "## 2. Context Integration Spec\nBased on the dragged code/text context:\n```text\n" + context.slice(0, 150) + "\n```\nWe propose implementing standard debounce hooks on input listeners.\n\n" : "") +
      "## 3. Proposed Fix\n" +
      "```typescript\n" +
      "export async function POST(req: Request) {\n" +
      "  // Optimizing " + targetDomain + " route handler\n" +
      "  const { query } = await req.json();\n" +
      "  const cached = await redis.get(query);\n" +
      "  if (cached) return Response.json(cached);\n" +
      "  \n" +
      "  // Execute database telemetry logic...\n" +
      "}\n" +
      "```\n";
  }

  if (agentName.includes("Research") || agentName.includes("SEO") || agentName.includes("Content") || agentName.includes("Proposal") || agentName.includes("Sales") || agentName.includes("Project")) {
    const isSEO = agentName.includes("SEO");
    const isContent = agentName.includes("Content");
    
    return "### " + (isSEO ? "SEO Audit" : isContent ? "Content Brief" : "Intelligence Report") + ": " + targetDomain + "\n" +
      "Generated in response to: *\"" + cleanPrompt + "\"*" + "\n\n" +
      "## 1. Core Findings for " + targetDomain + "\n" +
      "Our crawlers analyzed **" + targetDomain + "** for query targets matching \"" + targetSubject + "\".\n\n" +
      "- **Performance Score**: **78/100**\n" +
      "- **Keyword Targets**: \"" + targetSubject + "\", \"" + targetDomain + " features\", \"AI CRM Automation\".\n\n" +
      (context ? "## 2. Contextual Focus\nWe integrated your reference: *\"" + context.slice(0, 100) + "...\"*.\n\n" : "") +
      "## 3. Strategic Action Plan\n" +
      "1. **Target Keyword Group**: Focus content around the primary term **\"" + targetSubject + "\"** to capture high-intent organic traffic.\n" +
      "2. **Backlink Acquisition**: Build authoritative referring domains pointing back to **" + targetDomain + "**.\n" +
      "3. **On-Page Optimization**: Ensure main landing page headers match semantic search criteria.\n";
  }

  return "### Subagent Findings Report: " + targetDomain + "\n" +
    "Generated in response to: *\"" + cleanPrompt + "\"*" + "\n\n" +
    "## 1. Mission Status\n" +
    "The " + agentName + " has qualified the task: \"" + cleanPrompt + "\".\n\n" +
    "## 2. Key Findings\n" +
    "- Subject domain evaluated: **" + targetDomain + "**.\n" +
    "- Primary focus: **" + targetSubject + "**.\n" +
    (context ? "- Dragged Context Contextualized: *\"" + context.slice(0, 85) + "...\"*\n" : "");
}

function StreamingTerminal({
  agentName,
  logs,
  status
}: {
  agentName: string;
  logs: string[];
  status: string;
}) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getTheme = () => {
    if (agentName.includes("CEO")) return { text: "text-blue-400", border: "border-blue-900/30", bg: "bg-[#0b0f19]" };
    if (agentName.includes("CFO")) return { text: "text-amber-400", border: "border-amber-900/30", bg: "bg-[#18120a]" };
    if (agentName.includes("CTO")) return { text: "text-purple-400", border: "border-purple-900/30", bg: "bg-[#140b1e]" };
    if (agentName.includes("Sales")) return { text: "text-emerald-400", border: "border-emerald-900/30", bg: "bg-[#09150f]" };
    return { text: "text-neutral-300", border: "border-neutral-800", bg: "bg-neutral-950" };
  };

  const theme = getTheme();

  return (
    <div className={cn("rounded-lg border font-mono text-xs flex flex-col h-48 overflow-hidden shadow-inner", theme.border, theme.bg)}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-white/[0.02] text-[10px] text-white/50 select-none">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === "running" ? "bg-amber-500 animate-ping" :
            status === "completed" ? "bg-emerald-500" : "bg-neutral-500"
          )} />
          <span>{agentName.toUpperCase()} // MONITOR</span>
        </div>
        <span className="opacity-60">CPU CLOCK: OK</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar text-[11px]">
        {logs.map((log, i) => (
          <div key={i} className={cn("leading-relaxed flex items-start gap-1.5", theme.text)}>
            <span className="opacity-40 select-none">&gt;</span>
            <span>{log}</span>
          </div>
        ))}
        {status === "running" && (
          <div className="flex items-center gap-1 text-white/60">
            <span className="opacity-40 select-none">&gt;</span>
            <span className="animate-pulse">Analyzing datastreams...</span>
            <span className="w-1 h-3.5 bg-white/80 animate-pulse inline-block" />
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      <div className="px-3 py-1 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[9px] text-white/40 select-none">
        <span>BAUD RATE: 115200</span>
        <span>STATUS: {status.toUpperCase()}</span>
      </div>
    </div>
  );
}

interface SubagentWorkspacePanelProps {
  panel: ActivePanel;
  onClose: () => void;
  onRunWorkflow: (promptText: string) => void;
  onPushToMainChat: (text: string) => void;
  draggedMessage: string | null;
  setDraggedMessage: (val: string | null) => void;
}

function SubagentWorkspacePanel({
  panel,
  onClose,
  onRunWorkflow,
  onPushToMainChat,
  draggedMessage,
  setDraggedMessage
}: SubagentWorkspacePanelProps) {
  const [localInput, setLocalInput] = useState(panel.input);
  const [isDragOverInput, setIsDragOverInput] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panel.input) {
      setLocalInput(panel.input);
    }
  }, [panel.input]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [panel.chatHistory]);

  const handleSend = () => {
    if (!localInput.trim() || panel.status === "running") return;
    const text = localInput;
    setLocalInput("");
    onRunWorkflow(text);
  };

  return (
    <div className="flex flex-col h-full border-l border-white/10 bg-[#0c0d12]/95 backdrop-blur-md overflow-hidden text-zinc-300 animate-in fade-in duration-300">
      <div className="px-4 py-3 bg-[#08090d] border-b border-white/5 flex items-center justify-between shadow-sm shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10">
            <Cpu className="w-3 h-3 text-[#0075de]" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-zinc-100 leading-tight">{panel.agentName}</h4>
            <p className="text-[10px] text-zinc-400 font-medium leading-none mt-0.5">{panel.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border",
            panel.status === "idle" ? "text-zinc-400 bg-white/5 border-white/10" :
            panel.status === "running" ? "text-amber-400 bg-amber-500/10 border-amber-500/30 animate-pulse" :
            "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
          )}>
            {panel.status}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0b0c10]">
        {panel.chatHistory.length === 0 && panel.status === "idle" ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 select-none">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 shadow-sm flex items-center justify-center animate-pulse">
              <Terminal className="w-6 h-6 text-[#0075de]" />
            </div>
            <div>
              <h5 className="text-[13px] font-bold text-zinc-100">Workspace Ready</h5>
              <p className="text-[11px] text-zinc-400 max-w-[200px] mt-1.5 leading-relaxed">
                Provide instructions or drag a chat bubble here as context to execute the subagent workflow.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {(panel.status === "running" || panel.status === "completed") && (
              <StreamingTerminal
                agentName={panel.agentName}
                logs={panel.logs}
                status={panel.status}
              />
            )}

            <div className="space-y-3.5 pt-2">
              {panel.chatHistory.map((ch, idx) => (
                <div key={idx} className={cn("flex flex-col", ch.sender === "user" ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[90%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed border shadow-sm min-w-0 overflow-hidden",
                    ch.sender === "user"
                      ? "bg-white/5 border-white/10 text-zinc-100 rounded-tr-none"
                      : "bg-[#0075de]/10 border border-[#0075de]/20 text-zinc-100 rounded-tl-none font-sans"
                  )}>
                    {ch.sender === "agent" ? (
                      <MarkdownBlock text={ch.text} isDark />
                    ) : (
                      <p className="whitespace-pre-wrap">{ch.text}</p>
                    )}
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono mt-1 px-1">{ch.timestamp}</span>
                </div>
              ))}
            </div>

            {panel.status === "completed" && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    const agentAnswer = panel.chatHistory.filter(ch => ch.sender === "agent").pop();
                    if (agentAnswer) onPushToMainChat(agentAnswer.text);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#0075de] to-[#005bab] hover:from-[#005bab] hover:to-[#004785] text-white font-bold text-[10px] uppercase tracking-wider py-3 rounded-md shadow-[0_0_15px_rgba(0,117,222,0.2)] hover:shadow-[0_0_20px_rgba(0,117,222,0.4)] transition-all active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  Synthesize & Send to Main Chat
                </button>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/5 bg-[#08090d] shrink-0">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOverInput(true);
          }}
          onDragLeave={() => setIsDragOverInput(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOverInput(false);
            const droppedText = e.dataTransfer.getData("messageText") || draggedMessage;
            if (droppedText) {
              setLocalInput(prev => prev ? `${prev}\n\n[Context: "${droppedText}"]` : `[Context: "${droppedText}"]`);
              setDraggedMessage(null);
            }
          }}
          className={cn(
            "relative flex items-center bg-white/5 border rounded-md transition-all px-2.5 py-2",
            isDragOverInput 
              ? "border-[#0075de] ring-2 ring-[#0075de]/20 bg-[#0075de]/10" 
              : "border-white/10 focus-within:border-[#0075de] focus-within:bg-white/[0.08]"
          )}
        >
          {isDragOverInput && (
            <div className="absolute inset-0 bg-[#0075de]/20 border border-[#0075de] rounded-md flex items-center justify-center text-xs font-bold text-white pointer-events-none">
              Drop message to add context
            </div>
          )}

          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={panel.status === "running" ? "Agent is working..." : "Provide instructions to agent..."}
            disabled={panel.status === "running"}
            className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-500 py-1"
          />

          <button
            onClick={handleSend}
            disabled={panel.status === "running" || !localInput.trim()}
            className={cn(
              "w-7 h-7 rounded flex items-center justify-center transition-all shrink-0 ml-1.5",
              localInput.trim() && panel.status !== "running"
                ? "bg-[#0075de] text-white hover:bg-[#005bab]"
                : "bg-white/5 text-zinc-500 cursor-not-allowed"
            )}
          >
            {panel.status === "running" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ArrowUp className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════ */
export default function InteractiveWorkspace() {

  // ── Conversations & state ──
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string>("");
  const activeConvo = conversations.find(c => c.id === activeConvoId) || DEFAULT_CONVO;
  const messages = activeConvo.messages;

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentActiveAgents, setCurrentActiveAgents] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [subagents, setSubagents] = useState<Subagent[]>([]);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 48, maxHeight: 200 });

  const hasMessages = messages.length > 0;

  // ── Drag & Drop / Split-screen states ──
  const [activePanels, setActivePanels] = useState<ActivePanel[]>([]);
  const [draggedAgent, setDraggedAgent] = useState<string | null>(null);
  const [draggedMessage, setDraggedMessage] = useState<string | null>(null);
  const [isDragOverDropZone, setIsDragOverDropZone] = useState(false);
  const [pendingAgentTask, setPendingAgentTask] = useState<{ agentName: string; prompt: string } | null>(null);

  const handleAgentDragStart = (e: React.DragEvent, agentName: string) => {
    e.dataTransfer.setData("agentName", agentName);
    setDraggedAgent(agentName);
  };

  const handleAgentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverDropZone(false);
    const agentName = e.dataTransfer.getData("agentName") || draggedAgent;
    if (!agentName) return;

    if (activePanels.some(p => p.agentName === agentName)) {
      setDraggedAgent(null);
      return;
    }

    if (activePanels.length >= 2) {
      alert("Maximum of 2 active agent panels can be open concurrently.");
      setDraggedAgent(null);
      return;
    }

    const rolesMap: Record<string, string> = {
      "CEO Agent": "Strategy & Growth",
      "CFO Agent": "Revenue & Forecasts",
      "CTO Agent": "Code & Architecture",
      "Research Agent": "Market intelligence",
      "Content Agent": "Editorial & Strategy",
      "SEO Agent": "Keyword ranking",
      "Proposal Agent": "Scope & Timeline",
      "Sales Agent": "Lead qualification",
      "Project Agent": "Timeline tracking",
    };

    const panelId = `${agentName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const pendingPrompt = pendingAgentTask?.agentName === agentName ? pendingAgentTask.prompt : "";

    const newPanel: ActivePanel = {
      id: panelId,
      agentName,
      role: rolesMap[agentName] || "Specialized Assistant",
      status: pendingPrompt ? "running" : "idle",
      logs: [],
      input: pendingPrompt,
      chatHistory: pendingPrompt ? [
        { sender: "user" as const, text: pendingPrompt, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
      ] : []
    };

    setActivePanels(prev => [...prev, newPanel]);
    setDraggedAgent(null);

    if (pendingAgentTask?.agentName === agentName) {
      setPendingAgentTask(null);
      setTimeout(() => {
        runSubagentWorkflow(panelId, pendingPrompt);
      }, 100);
    }
  };

  const closePanel = (panelId: string) => {
    setActivePanels(prev => prev.filter(p => p.id !== panelId));
  };

  const runSubagentWorkflow = (panelId: string, promptText: string) => {
    setActivePanels(prev => prev.map(p => {
      if (p.id !== panelId) return p;
      const historyHasUserMsg = p.chatHistory.some(ch => ch.sender === "user" && ch.text === promptText);
      return {
        ...p,
        status: "running",
        input: promptText,
        logs: [],
        chatHistory: historyHasUserMsg ? p.chatHistory : [
          ...p.chatHistory,
          { sender: "user" as const, text: promptText, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
        ]
      };
    }));

    setTimeout(() => {
      setActivePanels(prev => {
        const found = prev.find(p => p.id === panelId);
        if (found) {
          const logSteps = getLogStepsForAgent(found.agentName);
          let currentLogIndex = 0;
          const interval = setInterval(() => {
            setActivePanels(currentPanels => {
              const panelToUpdate = currentPanels.find(p => p.id === panelId);
              if (!panelToUpdate) {
                clearInterval(interval);
                return currentPanels;
              }
              if (currentLogIndex < logSteps.length) {
                const updated = currentPanels.map(p => {
                  if (p.id !== panelId) return p;
                  return {
                    ...p,
                    logs: [...p.logs, logSteps[currentLogIndex]]
                  };
                });
                currentLogIndex++;
                return updated;
              } else {
                clearInterval(interval);
                const finalResult = generateSubagentResult(panelToUpdate.agentName, promptText);
                return currentPanels.map(p => {
                  if (p.id !== panelId) return p;
                  return {
                    ...p,
                    status: "completed",
                    chatHistory: [
                      ...p.chatHistory,
                      { sender: "agent" as const, text: finalResult, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
                    ]
                  };
                });
              }
            });
          }, 800);
        }
        return prev;
      });
    }, 50);
  };

  const pushSubagentResultToMainChat = async (agentName: string, text: string) => {
    const targetConvoId = activeConvoId;
    let currentIdToUpdate = targetConvoId;
    const gxlMsgId = `gxl-${Date.now()}`;

    const systemMsg: Message = {
      id: `sys-${Date.now()}`,
      sender: "user",
      text: `[Synthesizing findings from ${agentName}]`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    pushMessage(systemMsg);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/command-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `[Synthesizing findings from ${agentName}]`, 
          conversationId: targetConvoId, 
          systemMessageText: `### 🤖 Synthesized Findings: ${agentName}\n\n${text}` 
        }),
      });

      if (!response.ok) throw new Error("Sync failed");
      const data = await response.json();
      
      setIsLoading(false);

      if (data.message) {
        if (currentIdToUpdate === "default" && data.message.conversation_id) {
          const newId = data.message.conversation_id;
          setConversations(prev => prev.map(c =>
            c.id === "default" ? { ...c, id: newId, title: `Synthesis: ${agentName}` } : c
          ));
          setActiveConvoId(newId);
          currentIdToUpdate = newId;
        }

        const synthMsg: Message = {
          id: data.message.id || gxlMsgId,
          sender: "gxl",
          text: data.message.text,
          timestamp: new Date(data.message.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          toolCalls: []
        };
        
        setConversations(prev => prev.map(c => {
          if (c.id !== currentIdToUpdate) return c;
          // Avoid duplicate messages if loadMessages triggered in parallel
          if (c.messages.some(m => m.id === synthMsg.id)) return c;
          return {
            ...c,
            messages: [...c.messages, synthMsg]
          };
        }));
      }

    } catch (err) {
      console.error("Push to main chat failed:", err);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

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

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await fetch("/api/admin/command-center");
        if (!response.ok) throw new Error("Failed to load conversations");
        const data = await response.json();
        
        if (data.conversations && data.conversations.length > 0) {
          const mapped = data.conversations.map((c: any) => ({
            id: c.id,
            title: c.title,
            messages: [],
            createdAt: new Date(c.created_at)
          }));
          setConversations(mapped);
          setActiveConvoId(mapped[0].id);
        } else {
          setConversations([
            { id: "default", title: "New conversation", messages: [], createdAt: new Date() }
          ]);
          setActiveConvoId("default");
        }
      } catch (err) {
        console.error("Error loading conversations:", err);
        setConversations([
          { id: "default", title: "New conversation", messages: [], createdAt: new Date() }
        ]);
        setActiveConvoId("default");
      }
    };

    loadConversations();
  }, []);

  // Load messages when conversation selection changes
  useEffect(() => {
    if (!activeConvoId || activeConvoId === "default") return;

    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/admin/command-center?conversationId=${activeConvoId}`);
        if (!response.ok) throw new Error("Failed to load messages");
        const data = await response.json();

        if (data.messages) {
          const mapped = data.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender,
            text: m.text,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            toolCalls: m.tool_calls || [],
            proposal: m.proposal || undefined,
            chart: m.chart || undefined
          }));

          setConversations(prev => prev.map(c =>
            c.id === activeConvoId ? { ...c, messages: mapped } : c
          ));
        }
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    const convo = conversations.find(c => c.id === activeConvoId);
    if (convo && convo.messages.length === 0) {
      loadMessages();
    }
  }, [activeConvoId, conversations]);

  // Load subagents from messages history on conversation selection
  useEffect(() => {
    if (isStreaming) return; // Do not overwrite live streaming logs!

    if (!messages || messages.length === 0) {
      setSubagents([]);
      return;
    }

    const loadedSubagents: Subagent[] = [];
    messages.forEach(msg => {
      if (msg.toolCalls) {
        msg.toolCalls.forEach(tc => {
          if (tc.name === "spawn_subagent" && tc.args) {
            const findings = tc.result?.findings || tc.result?.result;
            if (!loadedSubagents.some(s => s.id === tc.id)) {
              loadedSubagents.push({
                id: tc.id || (tc.name + "-" + Math.random()),
                name: tc.args.name || "Specialized Agent",
                focus: tc.args.focus || "",
                mission: tc.args.mission || "",
                status: tc.status === "complete" ? "completed" : "running",
                logs: [
                  "Initializing agent workspace...",
                  `Executing deep-dive search for: "${tc.args.focus}"`,
                  "Search completed. Analyzing snippets...",
                  "Synthesizing intelligence report...",
                  "Completed mission successfully."
                ],
                result: findings
              });
            }
          }
        });
      }
    });

    setSubagents(loadedSubagents);
  }, [activeConvoId, messages, isStreaming]);

  // ── Helper: update messages in active conversation ──
  const pushMessage = (msg: Message) => {
    setConversations(prev => prev.map(c =>
      c.id === activeConvoId ? { ...c, messages: [...c.messages, msg] } : c,
    ));
  };

  // ── Update conversation title from first user message ──
  const updateConvoTitle = (text: string) => {
    const title = text.length > 40 ? text.slice(0, 37) + "..." : text;
    setConversations(prev => prev.map(c =>
      c.id === activeConvoId && c.title === "New conversation" ? { ...c, title } : c,
    ));
  };

  // ── New conversation ──
  const startNewConversation = () => {
    if (conversations.some(c => c.id === "default")) {
      setActiveConvoId("default");
      return;
    }
    setConversations(prev => [
      { id: "default", title: "New conversation", messages: [], createdAt: new Date() },
      ...prev
    ]);
    setActiveConvoId("default");
    setCurrentActiveAgents([]);
  };

  // ── Send message orchestrator ──
  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text && attachedFiles.length === 0) return;

    // Parse for commands like "run ceo to/for <task>"
    const lowerText = text.toLowerCase();
    let detectedAgent = "";
    let detectedPrompt = "";

    if (lowerText.includes("run ceo")) {
      detectedAgent = "CEO Agent";
      detectedPrompt = text.split(/run ceo\s*(?:to|for)?/i)[1]?.trim() || "";
    } else if (lowerText.includes("run cfo")) {
      detectedAgent = "CFO Agent";
      detectedPrompt = text.split(/run cfo\s*(?:to|for)?/i)[1]?.trim() || "";
    } else if (lowerText.includes("run cto")) {
      detectedAgent = "CTO Agent";
      detectedPrompt = text.split(/run cto\s*(?:to|for)?/i)[1]?.trim() || "";
    } else if (lowerText.includes("run research")) {
      detectedAgent = "Research Agent";
      detectedPrompt = text.split(/run research\s*(?:to|for)?/i)[1]?.trim() || "";
    } else if (lowerText.includes("run sales")) {
      detectedAgent = "Sales Agent";
      detectedPrompt = text.split(/run sales\s*(?:to|for)?/i)[1]?.trim() || "";
    }

    if (detectedAgent) {
      setPendingAgentTask({ agentName: detectedAgent, prompt: detectedPrompt });
    }

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
    setSubagents([]);

    const targetConvoId = activeConvoId;
    let currentIdToUpdate = targetConvoId;
    const gxlMsgId = `gxl-${Date.now()}`;

    const history = activeConvo.messages.map(m => ({
      sender: m.sender,
      text: m.text
    }));

    try {
      const response = await fetch("/api/admin/command-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId: targetConvoId, history }),
      });

      if (!response.ok) throw new Error("Sync failed");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      setIsLoading(false);
      setIsStreaming(true);

      const initialGxlMsg: Message = {
        id: gxlMsgId,
        sender: "gxl",
        text: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolCalls: [],
      };

      setConversations(prev => prev.map(c => {
        if (c.id !== currentIdToUpdate) return c;
        return {
          ...c,
          messages: [...c.messages, initialGxlMsg]
        };
      }));

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.trim()) continue;

          const lines = part.split("\n");
          let eventName = "";
          let dataStr = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventName = line.substring(7).trim();
            } else if (line.startsWith("data: ")) {
              dataStr = line.substring(6).trim();
            }
          }

          if (!eventName) continue;
          let data: any = {};
          try {
            data = JSON.parse(dataStr);
          } catch (e) {
            console.error("Parse error", dataStr, e);
            continue;
          }

          if (eventName === "conversation_id") {
            const newId = data.conversationId;
            if (currentIdToUpdate === "default") {
              setConversations(prev => prev.map(c =>
                c.id === "default" ? { ...c, id: newId, title: text.length > 40 ? text.slice(0, 37) + "..." : text } : c
              ));
              setActiveConvoId(newId);
              currentIdToUpdate = newId;
            }
          } else if (eventName === "text_delta") {
            setConversations(prev => prev.map(c => {
              if (c.id !== currentIdToUpdate) return c;
              return {
                ...c,
                messages: c.messages.map(m => m.id === gxlMsgId ? { ...m, text: m.text + data.text } : m)
              };
            }));
          } else if (eventName === "tool_call") {
            setConversations(prev => prev.map(c => {
              if (c.id !== currentIdToUpdate) return c;
              return {
                ...c,
                messages: c.messages.map(m => m.id === gxlMsgId ? {
                  ...m,
                  toolCalls: [...(m.toolCalls || []), {
                    id: data.name + "-" + Date.now(),
                    name: data.name,
                    args: data.args,
                    status: "calling"
                  }]
                } : m)
              };
            }));

            const agentName = mapToolToAgent(data.name);
            setAgentSuite(prev => prev.map(a => a.name === agentName ? { ...a, status: "Thinking..." } : a));
            setCurrentActiveAgents(prev => prev.includes(agentName) ? prev : [...prev, agentName]);
          } else if (eventName === "tool_result") {
            setConversations(prev => prev.map(c => {
              if (c.id !== currentIdToUpdate) return c;
              return {
                ...c,
                messages: c.messages.map(m => m.id === gxlMsgId ? {
                  ...m,
                  toolCalls: (m.toolCalls || []).map(tc =>
                    tc.name === data.name && tc.status === "calling" ? {
                      ...tc,
                      status: "complete",
                      result: data.result
                    } : tc
                  )
                } : m)
              };
            }));

            const agentName = mapToolToAgent(data.name);
            setAgentSuite(prev => prev.map(a => a.name === agentName ? { ...a, status: "Active" } : a));
          } else if (eventName === "proposal") {
            setConversations(prev => prev.map(c => {
              if (c.id !== currentIdToUpdate) return c;
              return {
                ...c,
                messages: c.messages.map(m => m.id === gxlMsgId ? { ...m, proposal: data } : m)
              };
            }));
          } else if (eventName === "chart") {
            setConversations(prev => prev.map(c => {
              if (c.id !== currentIdToUpdate) return c;
              return {
                ...c,
                messages: c.messages.map(m => m.id === gxlMsgId ? { ...m, chart: data } : m)
              };
            }));
          } else if (eventName === "subagent_spawn") {
            setSubagents(prev => {
              if (prev.some(s => s.id === data.id)) return prev;
              return [...prev, {
                id: data.id,
                name: data.name,
                focus: data.focus,
                mission: data.mission,
                status: "running",
                logs: ["Initializing subagent workspace..."]
              }];
            });
          } else if (eventName === "subagent_log") {
            setSubagents(prev => prev.map(s =>
              s.id === data.id ? { ...s, logs: [...s.logs, data.log] } : s
            ));
          } else if (eventName === "subagent_complete") {
            setSubagents(prev => prev.map(s =>
              s.id === data.id ? { ...s, status: "completed", result: data.result, logs: [...s.logs, "Completed mission successfully."] } : s
            ));
          } else if (eventName === "error") {
            setConversations(prev => prev.map(c => {
              if (c.id !== currentIdToUpdate) return c;
              return {
                ...c,
                messages: c.messages.map(m => m.id === gxlMsgId ? { ...m, text: m.text + (data.message || "An internal error occurred.") } : m)
              };
            }));
          }
        }
      }

    } catch (err) {
      console.error("Fetch/Stream failed", err);
      pushMessage({
        id: `err-${Date.now()}`,
        sender: "gxl",
        text: "### ⚠️ Orchestration Interrupted\nFailed to sync with internal AI operating system. Please check your credentials or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setAttachedFiles([]);
      setAgentSuite(prev => prev.map(a => ({ ...a, status: "Idle" })));
      setCurrentActiveAgents([]);
    }
  };

  const handleDownloadSOW = (msg: Message) => {
    if (!msg.proposal) return;
    const clientNameClean = msg.proposal.clientName.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `SOW_${clientNameClean}.md`;
    
    const fileContent = `${msg.text}

---

### Proposal Metadata
- **Client:** ${msg.proposal.clientName}
- **Budget:** ${msg.proposal.budget}
- **Timeline:** ${msg.proposal.timeline}
- **Deliverables:**
${msg.proposal.deliverables.map(d => `  - ${d}`).join("\n")}
- **Status:** ${msg.proposal.status}
`;

    const blob = new Blob([fileContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    <div className="flex h-full bg-white text-neutral-900 overflow-hidden">

      {/* ─── LEFT SIDEBAR ─── */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full border-r border-[#e6e6e6] bg-[#f6f5f4] flex flex-col overflow-hidden shrink-0"
          >
            {/* New chat button */}
            <div className="p-3">
              <button
                onClick={startNewConversation}
                disabled={isLoading || isStreaming}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-[13px] font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-[#e6e6e6] shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                New chat
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 custom-scrollbar">
              <p className="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Recent</p>
              {conversations.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setActiveConvoId(c.id); setCurrentActiveAgents([]); }}
                  disabled={isLoading || isStreaming}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-md text-[13px] truncate transition-all disabled:opacity-80 disabled:cursor-not-allowed",
                    c.id === activeConvoId
                      ? "bg-white shadow-sm border border-[#e6e6e6] text-neutral-900 font-semibold"
                      : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/40",
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
            <div className="p-4 border-t border-[#e6e6e6]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0075de] to-[#005bab] flex items-center justify-center">
                  <Command className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-neutral-800">GXL Command Center</p>
                  <p className="text-[9px] text-neutral-400 font-mono">v2.0 · Internal</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── WORKSPACE PANELS CONTAINER (SPLIT SCREEN) ─── */}
      <div className="flex-1 flex flex-row divide-x divide-[#e6e6e6] h-full overflow-hidden relative">
        {/* Drop zone overlay for dragging core agents */}
        {isDragOverDropZone && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setIsDragOverDropZone(false)}
            onDrop={handleAgentDrop}
            className="absolute inset-0 z-50 bg-[#0075de]/10 border-4 border-dashed border-[#0075de] flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-white border border-[#e6e6e6] shadow-lg flex items-center justify-center text-[#0075de] animate-bounce">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-neutral-800">Drop here to open Agent Workspace Panel</p>
            <p className="text-xs text-neutral-500">Supports up to 2 active agent workspaces side-by-side</p>
          </div>
        )}

        {/* ─── Column 1: Main Chat Area ─── */}
        <div
          onDragOver={(e) => {
            if (draggedAgent) {
              e.preventDefault();
              setIsDragOverDropZone(true);
            }
          }}
          className={cn(
            "flex flex-col min-w-0 h-full relative transition-all duration-300",
            activePanels.length === 0 ? "w-full" :
            activePanels.length === 1 ? "w-1/2" : "w-[40%]"
          )}
        >

        {/* Top bar */}
        <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-[#e6e6e6] bg-white/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors shrink-0"
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
            <span className="text-[13px] font-bold text-neutral-600 hidden sm:inline truncate max-w-[150px] md:max-w-[280px] lg:max-w-[360px]">
              {activeConvo.title === "New conversation" ? "GXL Command Center" : activeConvo.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentActiveAgents.length > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0075de]/10 border border-[#0075de]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0075de] animate-pulse" />
                <span className="text-[10px] font-mono text-[#0075de] font-bold uppercase tracking-wide">
                  {currentActiveAgents.length} agent{currentActiveAgents.length > 1 ? "s" : ""} active
                </span>
              </div>
            )}
            <button
              onClick={() => setRightSidebarOpen(p => !p)}
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
              title="Toggle Agent Workspace"
            >
              {rightSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Chat scroll container */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden w-full min-w-0 custom-scrollbar relative">

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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0075de] to-[#62aef0] flex items-center justify-center mx-auto mb-8 shadow-md shadow-[#0075de]/10">
                  <Command className="w-7 h-7 text-white" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-2">
                  {getGreeting()}.
                </h1>
                <p className="text-[15px] text-neutral-500 mb-10">
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
                      className="group flex items-start gap-3 p-4 rounded-md border border-[#e6e6e6] hover:border-[#a39e98] bg-white hover:bg-[#f6f5f4] text-left shadow-sm transition-all active:scale-[0.98]"
                    >
                      <div className="p-2 rounded-md bg-neutral-100 group-hover:bg-neutral-200 text-neutral-500 group-hover:text-neutral-900 transition-colors shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-neutral-800 group-hover:text-neutral-950 mb-0.5 transition-colors">{item.label}</p>
                        <p className="text-[12px] text-neutral-500 group-hover:text-neutral-600 leading-snug transition-colors">{item.description}</p>
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
                    <div 
                      className="max-w-[85%] sm:max-w-[70%]"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("messageText", msg.text);
                        setDraggedMessage(msg.text);
                      }}
                      onDragEnd={() => setDraggedMessage(null)}
                    >
                      <div className="bg-[#f6f5f4] border border-[#e6e6e6] rounded-2xl rounded-br-md px-5 py-3.5 cursor-grab active:cursor-grabbing hover:bg-neutral-100/70 hover:shadow-sm transition-all">
                        <p className="text-[14px] leading-relaxed text-neutral-800">{msg.text}</p>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1.5 text-right font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.timestamp}
                      </p>
                    </div>
                  ) : (
                    /* ── GXL message ── */
                    <div className="w-full min-w-0 overflow-hidden">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0075de] to-[#005bab] flex items-center justify-center shrink-0 shadow-md shadow-[#0075de]/10">
                          <Command className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[12px] font-bold text-neutral-700">GXL Command Center</span>
                          <span className="text-[10px] text-neutral-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{msg.timestamp}</span>
                        </div>
                      </div>

                      <div className="pl-10 min-w-0 w-full overflow-hidden">
                        <ToolCallActivityWidget toolCalls={msg.toolCalls} />
                        <div
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("messageText", msg.text);
                            setDraggedMessage(msg.text);
                          }}
                          onDragEnd={() => setDraggedMessage(null)}
                          className="cursor-grab active:cursor-grabbing hover:bg-neutral-50 rounded-lg p-2.5 -ml-2.5 transition-colors border border-transparent hover:border-[#e6e6e6]/40 min-w-0 w-full overflow-hidden"
                        >
                          <MarkdownBlock text={msg.text} />
                        </div>

                        {/* Chart attachment */}
                        {msg.chart && (
                          <div className="mt-6 p-5 rounded-md border border-[#e6e6e6] bg-[#f6f5f4]/50 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-5">
                              <Cpu className="w-4 h-4 text-[#0075de]" />
                              <h4 className="text-[13px] font-bold text-neutral-800">Revenue Forecast</h4>
                            </div>
                            <div className="h-36 flex items-end gap-3 pb-2 border-b border-[#e6e6e6]">
                              {msg.chart.map((point, k) => {
                                const pct = (point.revenue / 120000) * 100;
                                return (
                                  <div key={k} className="flex-1 flex flex-col items-center gap-2 group/bar cursor-pointer">
                                    <div className="w-full relative flex items-end justify-center h-24">
                                      <div className="absolute -top-6 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-neutral-900 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow-md z-10">
                                        ₹{point.revenue.toLocaleString()}
                                      </div>
                                      <div style={{ height: `${pct}%` }} className="w-full bg-[#0075de]/20 group-hover/bar:bg-[#0075de]/40 rounded-t-sm transition-all border border-[#0075de]/30" />
                                    </div>
                                    <span className="text-[10px] font-mono text-neutral-500">{point.month}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Proposal attachment */}
                        {msg.proposal && (
                          <div className="mt-6 p-5 rounded-md border border-[#0075de]/20 bg-[#0075de]/[0.03] relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0075de]/5 rounded-full blur-3xl" />
                            <div className="relative space-y-4">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                  <p className="text-[10px] font-mono text-[#0075de] uppercase tracking-widest font-bold mb-1">Proposal Generated</p>
                                  <h4 className="text-base font-bold text-neutral-900">{msg.proposal.clientName} Scope Blueprint</h4>
                                </div>
                                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                                  ✓ Ready for review
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-3 border-y border-[#e6e6e6] py-3 text-[11px] font-mono">
                                <div><p className="text-neutral-400 uppercase mb-1">Budget</p><p className="text-neutral-900 font-bold">{msg.proposal.budget}</p></div>
                                <div><p className="text-neutral-400 uppercase mb-1">Delivery</p><p className="text-neutral-900 font-bold">{msg.proposal.timeline}</p></div>
                                <div><p className="text-neutral-400 uppercase mb-1">Format</p><p className="text-neutral-900 font-bold">SOW-PDF.spec</p></div>
                              </div>

                              <div>
                                <p className="text-[10px] font-mono text-neutral-400 uppercase mb-2">Key Deliverables</p>
                                <ul className="space-y-1.5">
                                  {msg.proposal.deliverables.map((del, k) => (
                                    <li key={k} className="flex items-center gap-2 text-[12px] text-neutral-700">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#0075de]" />
                                      {del}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <button
                                onClick={() => handleDownloadSOW(msg)}
                                className="inline-flex items-center gap-2 bg-[#0075de] hover:bg-[#005bab] text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-md shadow-sm transition-all active:scale-[0.97]"
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
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0075de] to-[#005bab] flex items-center justify-center shrink-0 shadow-md shadow-[#0075de]/10">
                      <Command className="w-3.5 h-3.5 text-white animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[12px] font-bold text-neutral-700">GXL Command Center</span>
                      <span className="text-[10px] text-[#0075de] font-mono animate-pulse uppercase tracking-wide">thinking…</span>
                    </div>
                  </div>

                  <div className="pl-10 space-y-4">
                    {/* Active agents */}
                    {currentActiveAgents.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {currentActiveAgents.map((agent, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f6f5f4] border border-[#e6e6e6] text-[11px] font-bold uppercase tracking-wider text-neutral-600"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#0075de] animate-pulse" />
                            {agent}
                          </span>
                        ))}
                      </div>
                    )}



                    {/* Shimmer loading indicator */}
                    <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-mono uppercase tracking-wider">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0075de] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0075de] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0075de] animate-bounce" style={{ animationDelay: "300ms" }} />
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
                className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 w-8 h-8 rounded-full bg-white hover:bg-neutral-100 border border-[#e6e6e6] flex items-center justify-center shadow-md transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-neutral-600" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ─── BOTTOM INPUT CONSOLE ─── */}
        <div className="shrink-0 border-t border-[#e6e6e6] bg-white relative z-20">
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
                  className="absolute left-4 right-4 sm:left-6 sm:right-6 bottom-full mb-2 bg-white rounded-md border border-[#e6e6e6] shadow-xl overflow-hidden max-w-3xl mx-auto z-50"
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
                            activeSuggestion === index ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50",
                          )}
                        >
                          <div className="w-5 h-5 flex items-center justify-center text-neutral-400">{sug.icon}</div>
                          <span className="text-[13px] font-medium">{sug.label}</span>
                          <span className="text-[11px] text-neutral-400 font-mono ml-1">{sug.prefix}</span>
                          <span className="text-[11px] text-neutral-400 ml-auto">{sug.description}</span>
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
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#f6f5f4] border border-[#e6e6e6] text-[11px] font-mono text-neutral-700">
                    <FileText className="w-3 h-3 text-[#0075de]" />
                    <span className="text-neutral-700 max-w-[120px] truncate">{file}</span>
                    <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} className="text-neutral-400 hover:text-red-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="relative flex flex-col bg-white border border-[#e6e6e6] focus-within:border-[#0075de] focus-within:ring-1 focus-within:ring-[#0075de] rounded-md transition-all duration-200 shadow-sm">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); adjustHeight(); }}
                onKeyDown={handleKeyDown}
                placeholder={isLoading || isStreaming ? "Agents are working…" : "Message GXL Command Center…"}
                disabled={isLoading || isStreaming}
                rows={1}
                className="w-full bg-transparent px-4 pt-3.5 pb-2 text-[14px] text-neutral-800 placeholder-neutral-400 focus:outline-none resize-none min-h-[48px] max-h-[200px] leading-relaxed custom-scrollbar"
              />

              <div className="px-3 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isUploading || isStreaming}
                    className="p-2 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-30"
                    title="Attach file"
                  >
                    <Paperclip className={cn("w-4 h-4", isUploading && "animate-spin text-[#0075de]")} />
                  </button>
                  <button
                    type="button"
                    data-command-button
                    onClick={(e) => { e.stopPropagation(); setShowCommandPalette(p => !p); }}
                    disabled={isLoading || isStreaming}
                    className={cn(
                      "p-2 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors",
                      showCommandPalette && "bg-neutral-100 text-neutral-700",
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
                  disabled={isLoading || isStreaming || !inputValue.trim()}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    inputValue.trim()
                      ? "bg-[#0075de] hover:bg-[#005bab] text-white shadow-sm active:scale-95"
                      : "bg-neutral-100 text-neutral-300 cursor-not-allowed border border-[#e6e6e6]",
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

            <p className="text-[10px] text-neutral-400 text-center font-mono uppercase tracking-wider">
              GXL Command Center can make mistakes. Verify important outputs.
            </p>
          </div>
        </div>
      </div>

        {/* ─── Columns 2 & 3: Active Subagent Panels ─── */}
        {activePanels.map((panel) => (
          <div
            key={panel.id}
            className={cn(
              "h-full overflow-hidden transition-all duration-300 shrink-0",
              activePanels.length === 1 ? "w-1/2" : "w-[30%]"
            )}
          >
            <SubagentWorkspacePanel
              panel={panel}
              onClose={() => closePanel(panel.id)}
              onRunWorkflow={(promptText) => runSubagentWorkflow(panel.id, promptText)}
              onPushToMainChat={(text) => pushSubagentResultToMainChat(panel.agentName, text)}
              draggedMessage={draggedMessage}
              setDraggedMessage={setDraggedMessage}
            />
          </div>
        ))}
      </div>

      {/* ─── RIGHT WORKSPACE SIDEBAR ─── */}
      <AnimatePresence mode="wait">
        {rightSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full border-l border-[#e6e6e6] bg-[#f6f5f4] flex flex-col overflow-hidden shrink-0"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#e6e6e6] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#0075de]" />
                <span className="text-[13px] font-bold text-neutral-800">Agent Workspace</span>
              </div>
              <button
                onClick={() => setRightSidebarOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content scroll area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
              
              {/* Specialized Subagents Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Specialized Subagents ({subagents.length})</p>
                {subagents.length === 0 ? (
                  <div className="p-4 rounded-lg border border-dashed border-[#e6e6e6] bg-white text-center text-neutral-400 text-xs py-8">
                    No active subagents. Ask GXL to create subagents to perform background research.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subagents.map(agent => (
                      <SubagentCard key={agent.id} agent={agent} />
                    ))}
                  </div>
                )}
              </div>

              {/* Core Agent Suite Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Core Agent Suite</p>
                <div className="divide-y divide-[#e6e6e6] rounded-md border border-[#e6e6e6] bg-white overflow-hidden">
                  {agentSuite.map(agent => (
                    <div 
                      key={agent.name} 
                      draggable
                      onDragStart={(e) => handleAgentDragStart(e, agent.name)}
                      onDragEnd={() => setDraggedAgent(null)}
                      className="p-3 flex items-center justify-between text-xs text-left cursor-grab active:cursor-grabbing hover:bg-neutral-50 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-neutral-800">{agent.name}</p>
                        <p className="text-[10px] text-neutral-400">{agent.role}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold",
                        agent.status === "Idle" ? "text-neutral-400 bg-neutral-100" :
                        agent.status === "Active" ? "text-emerald-700 bg-emerald-50 border border-emerald-200" :
                        "text-[#0075de] bg-[#0075de]/10 border border-[#0075de]/20 animate-pulse"
                      )}>
                        {agent.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
