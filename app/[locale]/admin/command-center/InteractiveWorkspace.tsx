"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Paperclip, Terminal, Cpu, User, Briefcase, FileText,
  BarChart3, PenTool, Download, Command, X,
  PanelLeftClose, PanelLeft, Plus, MessageSquare, Loader2,
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
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  
  let currentList: { type: "bullet" | "number"; items: string[] } | null = null;
  let currentBlockquote: string[] | null = null;
  let currentTable: string[] | null = null;
  let currentParagraph: string[] | null = null;
  
  const renderFormattedText = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-neutral-950'>$1</strong>")
      .replace(/`(.*?)`/g, "<code class='bg-[#f6f5f4] border border-[#e6e6e6] px-1.5 py-0.5 rounded text-[13px] font-mono text-purple-600'>$1</code>");
  };

  const flush = (key: string | number) => {
    if (currentList) {
      if (currentList.type === "bullet") {
        elements.push(
          <ul key={`ul-${key}`} className="space-y-1.5 pl-1 my-2">
            {currentList.items.map((item, idx) => {
              const html = renderFormattedText(item);
              return (
                <li key={idx} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-neutral-700">
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
                <li key={idx} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-neutral-700">
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
        <blockquote key={`bq-${key}`} className="border-l-2 border-[#0075de]/50 pl-4 py-2 text-[14px] text-neutral-600 leading-relaxed italic my-2">
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
          <div key={`tab-${key}`} className="overflow-x-auto my-4 rounded-lg border border-[#e6e6e6]">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#f6f5f4] text-neutral-500 text-[11px] font-mono uppercase tracking-wider">
                  {headers.map((h, k) => <th key={k} className="px-4 py-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e6e6]">
                {body.map((r, k) => (
                  <tr key={k} className="hover:bg-neutral-50 transition-colors">
                    {r.map((c, m) => {
                      const html = renderFormattedText(c);
                      return (
                        <td key={m} className={cn("px-4 py-3 text-neutral-700", m === r.length - 1 && "font-mono font-semibold text-neutral-950")}>
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
          <p key={`p-${key}`} className="text-[14px] leading-[1.75] text-neutral-700 my-2" dangerouslySetInnerHTML={{ __html: html }} />
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

    // Headings
    if (trimmed.startsWith("# ")) {
      flush(i);
      elements.push(<h2 key={`h2-${i}`} className="text-xl font-bold text-neutral-900 tracking-tight pt-2 my-2">{trimmed.slice(2)}</h2>);
    } else if (trimmed.startsWith("## ")) {
      flush(i);
      elements.push(<h3 key={`h3-${i}`} className="text-lg font-bold text-neutral-800 tracking-tight pt-1 my-2">{trimmed.slice(3)}</h3>);
    } else if (trimmed.startsWith("### ")) {
      flush(i);
      elements.push(<h4 key={`h4-${i}`} className="text-base font-semibold text-neutral-700 pt-1 my-2">{trimmed.slice(4)}</h4>);
    } 
    // Horizontal rule
    else if (trimmed === "---") {
      flush(i);
      elements.push(<hr key={`hr-${i}`} className="border-[#e6e6e6] my-4" />);
    }
    // Blockquotes
    else if (trimmed.startsWith("> ")) {
      if (currentList || currentTable || currentParagraph) flush(i);
      if (!currentBlockquote) currentBlockquote = [];
      currentBlockquote.push(trimmed.slice(2));
    }
    // Tables
    else if (trimmed.startsWith("| ")) {
      if (currentList || currentBlockquote || currentParagraph) flush(i);
      if (!currentTable) currentTable = [];
      currentTable.push(trimmed);
    }
    // Bullet lists
    else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      if (currentBlockquote || currentTable || currentParagraph || (currentList && currentList.type !== "bullet")) flush(i);
      if (!currentList) currentList = { type: "bullet", items: [] };
      currentList.items.push(trimmed.slice(2));
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      if (currentBlockquote || currentTable || currentParagraph || (currentList && currentList.type !== "number")) flush(i);
      if (!currentList) currentList = { type: "number", items: [] };
      currentList.items.push(trimmed.replace(/^\d+\.\s*/, ""));
    }
    // Normal paragraphs
    else {
      if (currentList || currentBlockquote || currentTable) flush(i);
      if (!currentParagraph) currentParagraph = [];
      currentParagraph.push(trimmed);
    }
  }

  flush("final");

  return <div className="space-y-3">{elements}</div>;
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
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentActiveAgents, setCurrentActiveAgents] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

    const targetConvoId = activeConvoId;
    const gxlMsgId = `gxl-${Date.now()}`;

    const history = activeConvo.messages.map(m => ({
      sender: m.sender,
      text: m.text
    }));

    try {
      const response = await fetch("/api/admin/command-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
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
        if (c.id !== targetConvoId) return c;
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

          if (eventName === "text_delta") {
            setConversations(prev => prev.map(c => {
              if (c.id !== targetConvoId) return c;
              return {
                ...c,
                messages: c.messages.map(m => m.id === gxlMsgId ? { ...m, text: m.text + data.text } : m)
              };
            }));
          } else if (eventName === "tool_call") {
            setConversations(prev => prev.map(c => {
              if (c.id !== targetConvoId) return c;
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
              if (c.id !== targetConvoId) return c;
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
              if (c.id !== targetConvoId) return c;
              return {
                ...c,
                messages: c.messages.map(m => m.id === gxlMsgId ? { ...m, proposal: data } : m)
              };
            }));
          } else if (eventName === "chart") {
            setConversations(prev => prev.map(c => {
              if (c.id !== targetConvoId) return c;
              return {
                ...c,
                messages: c.messages.map(m => m.id === gxlMsgId ? { ...m, chart: data } : m)
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

      {/* ─── MAIN CHAT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 relative">

        {/* Top bar */}
        <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-[#e6e6e6] bg-white/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
            <span className="text-[13px] font-bold text-neutral-600 hidden sm:inline">
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
                    <div className="max-w-[85%] sm:max-w-[70%]">
                      <div className="bg-[#f6f5f4] border border-[#e6e6e6] rounded-2xl rounded-br-md px-5 py-3.5">
                        <p className="text-[14px] leading-relaxed text-neutral-800">{msg.text}</p>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1.5 text-right font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.timestamp}
                      </p>
                    </div>
                  ) : (
                    /* ── GXL message ── */
                    <div className="w-full">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0075de] to-[#005bab] flex items-center justify-center shrink-0 shadow-md shadow-[#0075de]/10">
                          <Command className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[12px] font-bold text-neutral-700">GXL Command Center</span>
                          <span className="text-[10px] text-neutral-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{msg.timestamp}</span>
                        </div>
                      </div>

                      <div className="pl-10">
                        <ToolCallActivityWidget toolCalls={msg.toolCalls} />
                        <MarkdownBlock text={msg.text} />

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
    </div>
  );
}
