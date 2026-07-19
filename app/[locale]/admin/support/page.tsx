"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy, MessageSquare, CheckCircle, Clock, ShieldAlert, Sparkles, Users, Search,
  Plus, AlertTriangle, Send, RefreshCw, Layers, Award, FileText, ArrowUpRight, ArrowDownRight,
  UserCheck, ThumbsUp, ThumbsDown, Lock, Monitor, Laptop, Key, RefreshCcw, HelpCircle, BarChart3,
  Calendar, Zap, CheckSquare, Smile, Frown, Star, Globe, Cpu
} from "lucide-react";

type Role =
  | "Support Director"
  | "Support Manager"
  | "Support Agent"
  | "Technical Support Engineer"
  | "Customer Success Manager"
  | "Customer Success Executive"
  | "Knowledge Base Editor"
  | "Customer"
  | "Viewer"
  | "Super Admin";

interface TabItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: Role[];
}

const TABS: TabItem[] = [
  { id: "overview", label: "Dashboard", icon: BarChart3, allowedRoles: ["Super Admin", "Support Director", "Support Manager", "Customer Success Manager", "Viewer"] },
  { id: "tickets", label: "Ticket Desk", icon: LifeBuoy, allowedRoles: ["Super Admin", "Support Director", "Support Manager", "Support Agent", "Technical Support Engineer", "Customer"] },
  { id: "live_chat", label: "Live Chat", icon: MessageSquare, allowedRoles: ["Super Admin", "Support Manager", "Support Agent", "Technical Support Engineer", "Customer"] },
  { id: "success_health", label: "Customer Health", icon: Award, allowedRoles: ["Super Admin", "Support Director", "Customer Success Manager", "Customer Success Executive"] },
  { id: "onboarding_renewals", label: "Onboarding & Renewals", icon: CheckSquare, allowedRoles: ["Super Admin", "Support Director", "Customer Success Manager", "Customer Success Executive"] },
  { id: "knowledge_base", label: "Knowledge Base", icon: BookIcon, allowedRoles: ["Super Admin", "Support Director", "Support Manager", "Knowledge Base Editor", "Customer", "Viewer"] },
  { id: "sla_escalations", label: "SLAs & Escalations", icon: Clock, allowedRoles: ["Super Admin", "Support Director", "Support Manager", "Technical Support Engineer"] },
  { id: "community", label: "Community Forum", icon: Users, allowedRoles: ["Super Admin", "Support Director", "Support Manager", "Customer", "Viewer"] },
  { id: "remote_assets", label: "Remote & Assets", icon: Laptop, allowedRoles: ["Super Admin", "Support Manager", "Technical Support Engineer"] },
  { id: "ai_support", label: "AI Copilot", icon: Sparkles, allowedRoles: ["Super Admin", "Support Director", "Support Manager", "Support Agent", "Technical Support Engineer", "Customer Success Manager", "Knowledge Base Editor"] }
];

function BookIcon(props: any) {
  return <FileText {...props} />;
}

export default function SupportHubPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState<Role>("Super Admin");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  // Tickets State
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newTicket, setNewTicket] = useState({
    title: "", description: "", customer_email: "", company_name: "", priority: "Medium", severity: "Minor", source: "Portal"
  });

  // Customer Health & Renewals State
  const [customerHealthList, setCustomerHealthList] = useState<any[]>([]);

  // Live Chat State
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [chatInput, setChatInput] = useState("");

  // Knowledge Base State
  const [articles, setArticles] = useState<any[]>([]);
  const [newArticle, setNewArticle] = useState({ title: "", category: "General", content: "" });

  // AI Copilot State
  const [aiType, setAiType] = useState("classify");
  const [aiPromptTitle, setAiPromptTitle] = useState("");
  const [aiPromptDesc, setAiPromptDesc] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Remote Diagnostic Simulator State
  const [remoteCode, setRemoteCode] = useState("");
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchTickets();
    fetchCustomerHealth();
    fetchLiveChatSessions();
    fetchKnowledgeArticles();
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

  const fetchDashboardMetrics = async () => {
    try {
      const res = await fetch("/api/support/dashboard");
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      toast.error("Failed to load support dashboard metrics.");
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/support/tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
      if (data.tickets && data.tickets.length > 0) {
        setSelectedTicket(data.tickets[0]);
      }
    } catch (e) {
      toast.error("Failed to load tickets.");
    }
  };

  const fetchCustomerHealth = async () => {
    try {
      const res = await fetch("/api/support/customer-health");
      const data = await res.json();
      setCustomerHealthList(data.customerHealth || []);
    } catch (e) {
      toast.error("Failed to load customer health metrics.");
    }
  };

  const fetchLiveChatSessions = async () => {
    try {
      const res = await fetch("/api/support/live-chat");
      const data = await res.json();
      setChatSessions(data.chatSessions || []);
      if (data.chatSessions && data.chatSessions.length > 0) {
        setActiveChat(data.chatSessions[0]);
      }
    } catch (e) {
      toast.error("Failed to load live chat sessions.");
    }
  };

  const fetchKnowledgeArticles = async () => {
    try {
      const res = await fetch("/api/support/knowledge-base");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (e) {
      toast.error("Failed to load knowledge articles.");
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.customer_email) return toast.error("Title and Customer Email required");
    
    setLoading(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Support Ticket ${data.ticket.ticket_number} created!`);
        fetchTickets();
        setNewTicket({ title: "", description: "", customer_email: "", company_name: "", priority: "Medium", severity: "Minor", source: "Portal" });
      }
    } catch (err) {
      toast.error("Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const res = await fetch(`/api/support/tickets?id=${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Ticket stage set to ${status}`);
        fetchTickets();
      }
    } catch (e) {
      toast.error("Failed to update status.");
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput || !activeChat) return;
    try {
      const res = await fetch("/api/support/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeChat.id,
          senderName: selectedRole,
          message: chatInput,
          senderType: "agent"
        })
      });
      const data = await res.json();
      if (res.ok && data.message) {
        const updatedMessages = [...(activeChat.messages || []), data.message];
        setActiveChat({ ...activeChat, messages: updatedMessages });
        setChatInput("");
        toast.success("Message sent");
      }
    } catch (e) {
      toast.error("Failed to send chat message.");
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return toast.error("Title and content required");

    try {
      const res = await fetch("/api/support/knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle)
      });
      if (res.ok) {
        toast.success("Knowledge Base Article Published!");
        setNewArticle({ title: "", category: "General", content: "" });
        fetchKnowledgeArticles();
      }
    } catch (e) {
      toast.error("Failed to publish article.");
    }
  };

  const runAISupportAnalysis = async () => {
    if (!aiPromptTitle) return toast.error("Please enter a ticket title or description.");
    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch("/api/support/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: aiType,
          inputData: { title: aiPromptTitle, description: aiPromptDesc, customerName: "Acme Corp" }
        })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setAiResult(data.result);
        toast.success("AI Copilot Analysis Complete!");
      }
    } catch (e) {
      toast.error("AI Analysis connection error.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateRemoteSession = () => {
    const code = "REM-" + Math.floor(100000 + Math.random() * 900000);
    setRemoteCode(code);
    setSessionActive(true);
    toast.success(`Generated Secure Remote Assistance Token: ${code}`);
  };

  return (
    <div className="space-y-10 text-white pb-20">
      
      {/* ═ HEADER & ROLE SWITCHER ═ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3.5 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Customer Support & Customer Success Central
            </h1>
          </div>
          <p className="text-neutral-400 text-sm">
            Post-sales customer lifecycle management: SLAs, multi-channel ticketing, live chat, knowledge base, health scoring, &amp; contract renewals.
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
                "Support Director", "Support Manager", "Support Agent", "Technical Support Engineer",
                "Customer Success Manager", "Customer Success Executive", "Knowledge Base Editor", "Customer", "Viewer", "Super Admin"
              ] as Role[]).map((r) => (
                <option key={r} value={r} className="bg-neutral-950 text-white">{r}</option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={() => {
              fetchDashboardMetrics();
              fetchTickets();
              fetchCustomerHealth();
              toast.success("Synchronized Support & Success Hub.");
            }}
            variant="outline"
            className="h-10 px-4 bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Sync Hub
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

              {/* ══ 1. DASHBOARD OVERVIEW ══ */}
              {activeTab === "overview" && metrics && (
                <div className="space-y-8">
                  {/* KPI Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    <Card className="bg-white/[0.02] border-white/10 hover:border-blue-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400"><LifeBuoy size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-blue-400 flex items-center"><ArrowUpRight size={12} className="mr-0.5" /> Live</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Open Tickets</p>
                      <h3 className="text-3xl font-black text-white">{metrics.openTickets}</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400"><CheckCircle size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center"><ArrowUpRight size={12} className="mr-0.5" /> 12% today</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Resolved Today</p>
                      <h3 className="text-3xl font-black text-white">{metrics.resolvedToday}</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-purple-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400"><Clock size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-purple-400">Target &lt; 30m</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Avg Response Time</p>
                      <h3 className="text-3xl font-black text-white">{metrics.avgResponseTimeMins} mins</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-amber-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400"><Smile size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-amber-400">CSAT Score</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Customer Satisfaction</p>
                      <h3 className="text-3xl font-black text-white">{metrics.csatScore} / 5.0</h3>
                    </Card>
                  </div>

                  {/* Customer Health & SLA Charts */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Customer Health Breakdown */}
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Customer Health Score Distribution</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider text-neutral-400">
                            <span>Healthy Accounts (Score 80–100)</span>
                            <span className="text-emerald-400 font-black">{metrics.healthDistribution.healthy} Accounts</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: "82%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider text-neutral-400">
                            <span>Warning Accounts (Score 50–79)</span>
                            <span className="text-amber-400 font-black">{metrics.healthDistribution.warning} Accounts</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: "14%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider text-neutral-400">
                            <span>At Churn Risk (Score &lt; 50)</span>
                            <span className="text-red-400 font-black">{metrics.healthDistribution.atRisk} Accounts</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: "4%" }} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 border-t border-white/5 mt-6 pt-6 text-center">
                        <div>
                          <p className="text-[10px] font-black uppercase text-neutral-400">SLA Compliance</p>
                          <p className="text-lg font-extrabold text-emerald-400">{metrics.slaComplianceRate}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-neutral-400">Renewals (30 Days)</p>
                          <p className="text-lg font-extrabold text-blue-400">{metrics.renewalsDue30Days} Accounts</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-neutral-400">NPS Index</p>
                          <p className="text-lg font-extrabold text-purple-400">+{metrics.npsScore}</p>
                        </div>
                      </div>
                    </Card>

                    {/* Support Channels Breakdown */}
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Omnichannel Support Ticket Volume</h3>
                      <div className="space-y-4">
                        {metrics.ticketsByChannel.map((ch: any, i: number) => (
                          <div key={i} className="flex items-center gap-4">
                            <span className="w-36 text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">{ch.channel}</span>
                            <div className="flex-1 h-3.5 bg-white/5 rounded-md overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-md" style={{ width: `${ch.percentage}%` }} />
                            </div>
                            <span className="w-12 text-right text-xs font-bold text-white">{ch.count} tix</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* ══ 2. TICKET DESK TAB ══ */}
              {activeTab === "tickets" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Create Ticket Panel */}
                  <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Create Support Ticket</h3>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Subject / Title</label>
                        <Input
                          value={newTicket.title}
                          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                          placeholder="e.g. Database connection timeout error"
                          className="h-10 border-white/10 bg-white/5"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Customer Email</label>
                        <Input
                          type="email"
                          value={newTicket.customer_email}
                          onChange={(e) => setNewTicket({ ...newTicket, customer_email: e.target.value })}
                          placeholder="client@company.com"
                          className="h-10 border-white/10 bg-white/5"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Company / Client Name</label>
                        <Input
                          value={newTicket.company_name}
                          onChange={(e) => setNewTicket({ ...newTicket, company_name: e.target.value })}
                          placeholder="Acme Corporation"
                          className="h-10 border-white/10 bg-white/5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Priority</label>
                          <select
                            value={newTicket.priority}
                            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none"
                          >
                            <option value="Low" className="bg-neutral-950">Low</option>
                            <option value="Medium" className="bg-neutral-950">Medium</option>
                            <option value="High" className="bg-neutral-950">High</option>
                            <option value="Urgent" className="bg-neutral-950">Urgent</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Channel Source</label>
                          <select
                            value={newTicket.source}
                            onChange={(e) => setNewTicket({ ...newTicket, source: e.target.value })}
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none"
                          >
                            <option value="Portal" className="bg-neutral-950">Portal</option>
                            <option value="Email" className="bg-neutral-950">Email</option>
                            <option value="Live Chat" className="bg-neutral-950">Live Chat</option>
                            <option value="WhatsApp" className="bg-neutral-950">WhatsApp</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Issue Description</label>
                        <textarea
                          value={newTicket.description}
                          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                          placeholder="Provide detailed steps to reproduce..."
                          className="w-full h-28 p-3 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none"
                        />
                      </div>

                      <Button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 mt-4 rounded-md">
                        {loading ? "Filing Ticket..." : "Submit Ticket Node"}
                      </Button>
                    </form>
                  </Card>

                  {/* Tickets Queue & Workflow Stages */}
                  <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Support Ticket Desk &amp; Stage Workflow</h3>
                    
                    <div className="space-y-4">
                      {tickets.map((t) => (
                        <div key={t.id} className="border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-2xl space-y-4 transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-blue-400 text-xs">{t.ticket_number}</span>
                                <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  t.priority === "Urgent" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                }`}>{t.priority}</span>
                                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Source: {t.source}</span>
                              </div>
                              <h4 className="font-bold text-white text-base mt-1.5">{t.title}</h4>
                              <p className="text-xs text-neutral-400 mt-1">{t.description}</p>
                            </div>
                            
                            <select
                              value={t.status}
                              onChange={(e) => handleUpdateTicketStatus(t.id, e.target.value)}
                              className="bg-neutral-900 border border-white/10 rounded-lg text-xs font-bold px-3 py-1.5 text-white focus:outline-none cursor-pointer"
                            >
                              <option value="New" className="bg-neutral-950">New</option>
                              <option value="Assigned" className="bg-neutral-950">Assigned</option>
                              <option value="In Progress" className="bg-neutral-950">In Progress</option>
                              <option value="Waiting For Customer" className="bg-neutral-950">Waiting For Customer</option>
                              <option value="Escalated" className="bg-neutral-950">Escalated</option>
                              <option value="Resolved" className="bg-neutral-950">Resolved</option>
                              <option value="Closed" className="bg-neutral-950">Closed</option>
                            </select>
                          </div>

                          <div className="flex justify-between items-center text-xs text-neutral-400 border-t border-white/5 pt-3">
                            <span>Client: <strong className="text-white">{t.customer_name}</strong> ({t.company_name})</span>
                            <span>Agent: <strong className="text-neutral-200">{t.assigned_agent || "Unassigned"}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 3. LIVE CHAT TAB ══ */}
              {activeTab === "live_chat" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Sessions sidebar */}
                  <Card className="lg:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Active Live Chat Sessions</h3>
                    <div className="space-y-3">
                      {chatSessions.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => setActiveChat(session)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            activeChat?.id === session.id
                              ? "bg-blue-500/10 border-blue-500/30 text-white"
                              : "bg-white/5 border-white/5 text-neutral-400 hover:text-white"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-white">{session.visitor_name}</span>
                            <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{session.status}</span>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">{session.channel} · {session.visitor_email}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Chat Console */}
                  <Card className="lg:col-span-2 p-6 bg-white/[0.02] border-white/10 flex flex-col h-[550px] justify-between">
                    <div>
                      <div className="border-b border-white/5 pb-4 mb-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-white">{activeChat?.visitor_name || "Visitor Chat"}</h4>
                          <p className="text-[10px] text-neutral-400">{activeChat?.visitor_email}</p>
                        </div>
                        <Button onClick={() => toast.success("Chat transferred to Senior Technical Engineer.")} size="sm" variant="outline" className="h-8 border-white/10 text-xs">
                          Transfer Chat
                        </Button>
                      </div>

                      {/* Messages thread */}
                      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                        {activeChat?.messages?.map((msg: any, i: number) => (
                          <div key={i} className={`flex flex-col ${msg.sender === "visitor" ? "items-start" : "items-end"}`}>
                            <div className={`p-3.5 rounded-2xl max-w-md text-xs font-medium ${
                              msg.sender === "visitor" ? "bg-neutral-800 text-white" : "bg-blue-600 text-white"
                            }`}>
                              {msg.text}
                            </div>
                            <span className="text-[9px] text-neutral-500 mt-1 px-1">{msg.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-white/5 pt-4">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                        placeholder="Type response to visitor..."
                        className="h-10 bg-white/5 border-white/10"
                      />
                      <Button onClick={handleSendChatMessage} className="bg-blue-500 hover:bg-blue-600 text-white h-10 px-5">
                        <Send size={16} />
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 4. CUSTOMER HEALTH & SUCCESS TAB ══ */}
              {activeTab === "success_health" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Account Health Cards */}
                  <Card className="xl:col-span-3 p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Customer Success Account Roster</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-white/10 bg-white/5">
                          <tr>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Customer Account</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">CS Manager</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Health Score</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Churn Risk</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Usage Frequency</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Contract Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-transparent">
                          {customerHealthList.map((ch) => (
                            <tr key={ch.id} className="hover:bg-white/[0.01]">
                              <td className="px-5 py-4">
                                <span className="font-bold text-white block">{ch.company_name}</span>
                                <span className="text-[10px] text-neutral-400">{ch.customer_name}</span>
                              </td>
                              <td className="px-5 py-4 text-xs font-bold text-neutral-300">{ch.csm}</td>
                              <td className="px-5 py-4 font-black">
                                <span className={`text-base ${ch.health_score >= 80 ? "text-emerald-400" : ch.health_score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                                  {ch.health_score} / 100
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  ch.churn_risk === "Low" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : ch.churn_risk === "Medium" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                                }`}>{ch.churn_risk}</span>
                              </td>
                              <td className="px-5 py-4 text-xs font-bold text-neutral-300">{ch.usage_frequency}</td>
                              <td className="px-5 py-4 text-xs font-bold text-white">${Number(ch.contract_value).toLocaleString()}/yr</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 5. ONBOARDING & RENEWALS TAB ══ */}
              {activeTab === "onboarding_renewals" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Onboarding Checklist */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Customer Onboarding Tracker</h3>
                    <div className="space-y-4">
                      {customerHealthList.map((ch) => (
                        <div key={ch.id} className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-white">{ch.company_name}</h4>
                            <span className="text-xs font-black text-blue-400">{ch.onboarding?.progress || 0}% Complete</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400" /> Kickoff Meeting</span>
                            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400" /> Account Setup</span>
                            <span className="flex items-center gap-1.5"><CheckCircle size={14} className={ch.onboarding?.data_migration ? "text-emerald-400" : "text-neutral-600"} /> Data Migration</span>
                            <span className="flex items-center gap-1.5"><CheckCircle size={14} className={ch.onboarding?.training ? "text-emerald-400" : "text-neutral-600"} /> User Training</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Renewals Pipeline */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Upcoming Contract Renewals</h3>
                    <div className="space-y-4">
                      {customerHealthList.map((ch) => (
                        <div key={ch.id} className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-white">{ch.company_name}</h4>
                            <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">Expiry Date: {ch.renewal_date}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[9px] font-black text-blue-400 uppercase tracking-widest">{ch.renewal_stage}</span>
                            <p className="text-xs font-bold text-white mt-1.5">${Number(ch.contract_value).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 6. KNOWLEDGE BASE TAB ══ */}
              {activeTab === "knowledge_base" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Create Article */}
                  <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Publish Article</h3>
                    <form onSubmit={handleCreateArticle} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Article Title</label>
                        <Input
                          value={newArticle.title}
                          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                          placeholder="e.g. Setting up Webhook Retries"
                          className="h-10 bg-white/5 border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Category</label>
                        <select
                          value={newArticle.category}
                          onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none"
                        >
                          <option value="General" className="bg-neutral-950">General</option>
                          <option value="Authentication" className="bg-neutral-950">Authentication</option>
                          <option value="Developer APIs" className="bg-neutral-950">Developer APIs</option>
                          <option value="Billing" className="bg-neutral-950">Billing</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Content</label>
                        <textarea
                          value={newArticle.content}
                          onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                          placeholder="Write article guide documentation..."
                          className="w-full h-36 p-3 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 mt-2 rounded-md">
                        Publish KB Entry
                      </Button>
                    </form>
                  </Card>

                  {/* Articles List */}
                  <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Knowledge Base Library</h3>
                    <div className="space-y-4">
                      {articles.map((art) => (
                        <div key={art.id} className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl flex justify-between items-center">
                          <div>
                            <span className="px-2 py-0.5 bg-neutral-900 border border-white/10 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{art.category}</span>
                            <h4 className="font-bold text-white text-base mt-1.5">{art.title}</h4>
                            <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{art.content}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-white">{art.views} Views</p>
                            <p className="text-[10px] font-black text-emerald-400 mt-1">{art.helpful_count} Helpful</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 7. SLAs & ESCALATIONS TAB ══ */}
              {activeTab === "sla_escalations" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">SLA Policy Rules</h3>
                    <div className="space-y-4">
                      <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-white">Urgent SLA Tier</h4>
                          <p className="text-xs text-neutral-400 mt-0.5">Response: &lt; 15 mins · Resolution: &lt; 4 hours</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">Enforced</span>
                      </div>

                      <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-white">Standard SLA Tier</h4>
                          <p className="text-xs text-neutral-400 mt-0.5">Response: &lt; 1 hour · Resolution: &lt; 24 hours</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">Enforced</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Manager Escalation Queue</h3>
                    <div className="space-y-4">
                      <div className="border border-white/5 bg-amber-500/5 p-4 rounded-xl border-amber-500/20 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-black uppercase text-amber-400">Escalated to Engineering</span>
                          <h4 className="font-bold text-white mt-1">TICK-9082: SSO Integration failing</h4>
                        </div>
                        <Button onClick={() => toast.success("Review complete: Assigned to Senior Dev.")} size="sm" className="bg-amber-500 text-black font-bold h-8 text-[10px] uppercase">
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 8. COMMUNITY FORUM TAB ══ */}
              {activeTab === "community" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Feature Requests &amp; Ideas Voting</h3>
                    <div className="space-y-4">
                      <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-white">Dark Mode Option for Customer Portal</h4>
                          <p className="text-xs text-neutral-400">Submitted by Carlos R.</p>
                        </div>
                        <div className="text-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                          <p className="text-xs font-black text-emerald-400">142</p>
                          <p className="text-[8px] font-bold text-neutral-400 uppercase">Votes</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Product Release Announcements</h3>
                    <div className="space-y-4">
                      <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl">
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase">Release v5.2</span>
                        <h4 className="font-bold text-white mt-1.5">Phase 6 Customer Support Hub Live</h4>
                        <p className="text-xs text-neutral-400 mt-1">Introducing live chat transfers, AI auto-replies, and SLA management.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 9. REMOTE SUPPORT & ASSETS TAB ══ */}
              {activeTab === "remote_assets" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Remote Assistance Generator</h3>
                    <div className="space-y-4 text-center">
                      <p className="text-xs text-neutral-400">Generate a secure token for web-based remote diagnostic assistance.</p>
                      
                      {sessionActive ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl space-y-2">
                          <p className="text-xs font-bold text-emerald-400 uppercase">Active Session Token</p>
                          <p className="text-3xl font-black text-white tracking-widest">{remoteCode}</p>
                          <p className="text-[10px] text-neutral-400">Customer connected · Diagnostic log streaming live</p>
                        </div>
                      ) : (
                        <Button onClick={generateRemoteSession} className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 px-6">
                          <Laptop className="mr-2 h-4 w-4" /> Start Remote Session
                        </Button>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Customer Installed Assets</h3>
                    <div className="space-y-3">
                      <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-white">Apex Enterprise Domain SSL</h4>
                          <p className="text-xs text-neutral-400">Expires: 2027-01-15</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">Valid</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 10. AI SUPPORT COPILOT TAB ══ */}
              {activeTab === "ai_support" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Gemini Support Copilot</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">AI Mode</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: "classify", label: "Classify" },
                            { id: "suggest-solution", label: "Auto-Reply" },
                            { id: "summarize", label: "Summarize" },
                            { id: "predict-health", label: "Predict Churn" }
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setAiType(t.id)}
                              className={`h-9 rounded-lg border text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                aiType === t.id
                                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                  : "bg-white/5 border-white/5 text-neutral-400 hover:text-white"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Ticket Subject</label>
                        <Input
                          value={aiPromptTitle}
                          onChange={(e) => setAiPromptTitle(e.target.value)}
                          placeholder="e.g. SSO authentication 403 error"
                          className="h-10 bg-white/5 border-white/10"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Details / Thread Content</label>
                        <textarea
                          value={aiPromptDesc}
                          onChange={(e) => setAiPromptDesc(e.target.value)}
                          placeholder="Paste customer message or thread details..."
                          className="w-full h-32 p-3 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none"
                        />
                      </div>

                      <Button
                        onClick={runAISupportAnalysis}
                        disabled={aiLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 rounded-md"
                      >
                        {aiLoading ? "Analyzing Ticket..." : "Run AI Support Copilot"}
                      </Button>
                    </div>
                  </Card>

                  {/* AI Results Output */}
                  <Card className="p-6 bg-white/[0.02] border-white/10 min-h-[400px]">
                    <h3 className="text-base font-bold text-white mb-6">Copilot Analysis Output</h3>
                    
                    {aiResult ? (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {aiType === "classify" && (
                          <div className="space-y-3">
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl">
                              <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Detected Priority</p>
                              <span className="text-sm font-black text-red-400">{aiResult.priority}</span>
                            </div>
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl">
                              <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Category &amp; Sentiment</p>
                              <p className="text-sm font-bold text-white">{aiResult.category} ({aiResult.sentiment})</p>
                            </div>
                          </div>
                        )}

                        {aiType === "suggest-solution" && (
                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase text-neutral-400">Suggested Auto-Reply</p>
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-xs text-neutral-200 whitespace-pre-line font-mono">
                              {aiResult.suggestedReply}
                            </div>
                          </div>
                        )}

                        {aiType === "summarize" && (
                          <div className="space-y-3">
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-xs text-neutral-300">
                              <p className="font-bold text-white mb-1">Summary</p>
                              <p>{aiResult.summary}</p>
                            </div>
                          </div>
                        )}

                        {aiType === "predict-health" && (
                          <div className="space-y-3">
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl">
                              <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Predicted Health Score</p>
                              <p className="text-2xl font-black text-emerald-400">{aiResult.predictedHealthScore} / 100 ({aiResult.churnRisk} Churn Risk)</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 text-neutral-500">
                        <Sparkles size={28} className="text-neutral-600 mb-4" />
                        <p className="font-bold">AI Copilot Standby</p>
                        <p className="text-xs max-w-xs mt-1">Submit a ticket context to classify, auto-reply, or predict customer churn.</p>
                      </div>
                    )}
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
