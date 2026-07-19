"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy, Ticket, MessageSquare, BookOpen, ShieldAlert, HeartPulse, Sparkles,
  BarChart3, RefreshCw, Plus, CheckCircle, Search, Clock, AlertTriangle, UserCheck,
  Send, Lock, ThumbsUp, ArrowUpRight, Check
} from "lucide-react";

type Role =
  | "Support Director"
  | "Support Lead"
  | "Support Agent"
  | "Customer Success Manager"
  | "KB Editor"
  | "Viewer"
  | "Super Admin";

interface TabItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: Role[];
}

const TABS: TabItem[] = [
  { id: "overview", label: "Support Dashboard", icon: BarChart3, allowedRoles: ["Super Admin", "Support Director", "Support Lead", "Customer Success Manager", "Viewer"] },
  { id: "tickets", label: "Ticket Desk & SLA", icon: Ticket, allowedRoles: ["Super Admin", "Support Director", "Support Lead", "Support Agent"] },
  { id: "live_chat", label: "Live Chat Center", icon: MessageSquare, allowedRoles: ["Super Admin", "Support Lead", "Support Agent"] },
  { id: "customer_health", label: "Customer Health & NPS", icon: HeartPulse, allowedRoles: ["Super Admin", "Support Director", "Customer Success Manager"] },
  { id: "knowledge_base", label: "Knowledge Base (KB)", icon: BookOpen, allowedRoles: ["Super Admin", "Support Lead", "Support Agent", "KB Editor"] },
  { id: "ai_triage", label: "AI Ticket Copilot", icon: Sparkles, allowedRoles: ["Super Admin", "Support Director", "Support Lead", "Support Agent"] }
];

export default function SupportHubPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState<Role>("Super Admin");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  // Tickets State
  const [tickets, setTickets] = useState<any[]>([]);
  const [newTicket, setNewTicket] = useState({ title: "", description: "", customer_name: "", priority: "Medium", category: "Technical Support" });

  // Live Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Customer Health State
  const [customers, setCustomers] = useState<any[]>([]);

  // KB Articles State
  const [kbArticles, setKbArticles] = useState<any[]>([]);

  // AI Copilot State
  const [aiType, setAiType] = useState("classify");
  const [aiTicketInput, setAiTicketInput] = useState({ title: "Database Connection Error on Dashboard", description: "Our team is receiving HTTP 500 error when clicking on Finance Invoices section." });
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchTickets();
    fetchLiveChat();
    fetchCustomerHealth();
    fetchKBArticles();
  }, []);

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
    } catch (e) {
      toast.error("Failed to load support tickets.");
    }
  };

  const fetchLiveChat = async () => {
    try {
      const res = await fetch("/api/support/live-chat");
      const data = await res.json();
      setChatMessages(data.messages || []);
    } catch (e) {
      toast.error("Failed to load live chat messages.");
    }
  };

  const fetchCustomerHealth = async () => {
    try {
      const res = await fetch("/api/support/customer-health");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (e) {
      toast.error("Failed to load customer health scores.");
    }
  };

  const fetchKBArticles = async () => {
    try {
      const res = await fetch("/api/support/knowledge-base");
      const data = await res.json();
      setKbArticles(data.articles || []);
    } catch (e) {
      toast.error("Failed to load KB articles.");
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.customer_name) return toast.error("Title and Customer Name required.");

    setLoading(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket)
      });
      if (res.ok) {
        toast.success("Support Ticket Created!");
        setNewTicket({ title: "", description: "", customer_name: "", priority: "Medium", category: "Technical Support" });
        fetchTickets();
        fetchDashboardMetrics();
      }
    } catch (e) {
      toast.error("Failed to create support ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/support/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "Support Agent",
          message: chatInput
        })
      });
      if (res.ok) {
        setChatInput("");
        fetchLiveChat();
      }
    } catch (e) {
      toast.error("Failed to send chat message.");
    } finally {
      setLoading(false);
    }
  };

  const runAITriage = async () => {
    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch("/api/support/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: aiType, inputData: aiTicketInput })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setAiResult(data.result);
        toast.success("AI Ticket Triage Analysis Complete!");
      }
    } catch (e) {
      toast.error("AI Triage error.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-10 text-white pb-20">
      
      {/* ═ HEADER & ROLE SWITCHER ═ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3.5 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Customer Support &amp; Customer Success Platform
            </h1>
          </div>
          <p className="text-neutral-400 text-sm">
            Enterprise customer lifecycle management post-onboarding: SLA ticket desk, live chat, customer health scoring, &amp; AI triage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2.5 bg-neutral-900 border border-white/10 rounded-xl px-4 py-2">
            <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Simulation Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="bg-transparent border-0 text-white font-extrabold text-[12px] uppercase tracking-wide focus:outline-none cursor-pointer"
            >
              {([
                "Support Director", "Support Lead", "Support Agent", "Customer Success Manager",
                "KB Editor", "Viewer", "Super Admin"
              ] as Role[]).map((r) => (
                <option key={r} value={r} className="bg-neutral-950 text-white">{r}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => {
              fetchDashboardMetrics();
              fetchTickets();
              fetchLiveChat();
              toast.success("Synchronized Support Hub.");
            }}
            variant="outline"
            className="h-10 px-4 bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Sync Support Engine
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
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    : isAllowed
                    ? "bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                    : "bg-black/20 border-white/5 text-neutral-600 cursor-not-allowed opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-neutral-500"}`} />
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
                    <Card className="bg-white/[0.02] border-white/10 hover:border-amber-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400"><Ticket size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-amber-400">{metrics.pendingTickets} Pending</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Open Support Tickets</p>
                      <h3 className="text-3xl font-black text-white">{metrics.openTickets}</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400"><CheckCircle size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-emerald-400">Target 98%</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">SLA Compliance</p>
                      <h3 className="text-3xl font-black text-white">{metrics.slaCompliance}%</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-blue-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400"><ThumbsUp size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-blue-400">NPS: +{metrics.npsScore}</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">CSAT Satisfaction</p>
                      <h3 className="text-3xl font-black text-white">{metrics.csatScore}%</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-purple-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400"><HeartPulse size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-purple-400">Renewals: ${metrics.renewalsDueValue.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Avg Customer Health Score</p>
                      <h3 className="text-3xl font-black text-white">{metrics.avgHealthScore} / 100</h3>
                    </Card>
                  </div>

                  {/* SLA Benchmarks */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Support Response &amp; Resolution Performance</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl">
                          <span className="text-xs font-bold text-neutral-300">Average First Response Time</span>
                          <span className="text-xs font-black text-emerald-400">{metrics.avgResponseTime}</span>
                        </div>
                        <div className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl">
                          <span className="text-xs font-bold text-neutral-300">Average Full Resolution Time</span>
                          <span className="text-xs font-black text-blue-400">{metrics.avgResolutionTime}</span>
                        </div>
                        <div className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl">
                          <span className="text-xs font-bold text-neutral-300">Tickets Resolved Today</span>
                          <span className="text-xs font-black text-purple-400">{metrics.resolvedToday} Tickets</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Team Support Performance</h3>
                      <div className="space-y-4">
                        {metrics.teamPerformance.map((t: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl">
                            <div>
                              <p className="text-xs font-bold text-white">{t.agent}</p>
                              <p className="text-[10px] text-neutral-400">{t.resolved} Resolved · CSAT: {t.csat}%</p>
                            </div>
                            <span className="text-xs font-black text-emerald-400">{t.avgTime}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* ══ 2. TICKETS & SLA TAB ══ */}
              {activeTab === "tickets" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Create Ticket */}
                  <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Create SLA Ticket</h3>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Customer / Account</label>
                        <Input
                          value={newTicket.customer_name}
                          onChange={(e) => setNewTicket({ ...newTicket, customer_name: e.target.value })}
                          placeholder="e.g. Acme Corp (Enterprise)"
                          className="h-10 border-white/10 bg-white/5"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Ticket Subject</label>
                        <Input
                          value={newTicket.title}
                          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                          placeholder="API Authentication Timeout in Staging"
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
                            <option value="Urgent" className="bg-neutral-950">Urgent (4hr SLA)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Category</label>
                          <select
                            value={newTicket.category}
                            onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none"
                          >
                            <option value="Technical Support" className="bg-neutral-950">Technical Support</option>
                            <option value="Billing & Invoicing" className="bg-neutral-950">Billing &amp; Invoicing</option>
                            <option value="Feature Request" className="bg-neutral-950">Feature Request</option>
                            <option value="Security Audit" className="bg-neutral-950">Security Audit</option>
                          </select>
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 mt-4 rounded-md">
                        {loading ? "Submitting..." : "Submit SLA Ticket"}
                      </Button>
                    </form>
                  </Card>

                  {/* Tickets Queue */}
                  <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Active SLA Ticket Queue</h3>
                    <div className="space-y-4">
                      {tickets.map((t) => (
                        <div key={t.id} className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-neutral-400 font-bold">{t.ticket_number}</span>
                              <span className={`px-2 py-0.5 border rounded-md text-[9px] font-black uppercase ${
                                t.priority === "Urgent" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              }`}>{t.priority} Priority</span>
                            </div>
                            <h4 className="font-bold text-white text-base mt-1.5">{t.title}</h4>
                            <p className="text-xs text-neutral-400 mt-1">Customer: <strong className="text-white">{t.customer_name}</strong> · SLA Due: <strong className="text-emerald-400">{t.sla_due}</strong></p>
                          </div>
                          
                          <div className="text-right">
                            <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[9px] font-black uppercase">{t.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 4. CUSTOMER HEALTH & NPS TAB ══ */}
              {activeTab === "customer_health" && (
                <Card className="p-6 bg-white/[0.02] border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-base font-bold text-white">Customer Success Health &amp; Retention Matrix</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">Automated churn risk evaluation based on ticket activity, usage &amp; NPS scores.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="border-b border-white/10 bg-white/5">
                        <tr>
                          <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Customer Account</th>
                          <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">ARR Value</th>
                          <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Health Score</th>
                          <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">NPS</th>
                          <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Churn Risk</th>
                          <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Renewal Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-transparent">
                        {customers.map((c) => (
                          <tr key={c.id} className="hover:bg-white/[0.01]">
                            <td className="px-5 py-4 font-bold text-white">{c.name}</td>
                            <td className="px-5 py-4 font-mono font-bold text-emerald-400">${c.arr.toLocaleString()}</td>
                            <td className="px-5 py-4 font-black text-base text-blue-400">{c.health_score} / 100</td>
                            <td className="px-5 py-4 font-bold text-white">+{c.nps}</td>
                            <td className="px-5 py-4">
                              <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase ${
                                c.churn_risk === "Low" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                              }`}>{c.churn_risk} Risk</span>
                            </td>
                            <td className="px-5 py-4 text-xs font-bold text-neutral-400">{c.renewal_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* ══ 6. AI TICKET TRIAGE COPILOT ══ */}
              {activeTab === "ai_triage" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Gemini Support Copilot</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Analysis Function</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "classify", label: "Classify & Priority" },
                            { id: "suggest-solution", label: "Auto Resolution Reply" },
                            { id: "summarize", label: "Thread Summary" },
                            { id: "predict-health", label: "Predict Churn Risk" }
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setAiType(t.id)}
                              className={`h-9 rounded-lg border text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                aiType === t.id
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
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
                          value={aiTicketInput.title}
                          onChange={(e) => setAiTicketInput({ ...aiTicketInput, title: e.target.value })}
                          className="h-10 bg-white/5 border-white/10"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Ticket Description / Context</label>
                        <textarea
                          value={aiTicketInput.description}
                          onChange={(e) => setAiTicketInput({ ...aiTicketInput, description: e.target.value })}
                          className="w-full h-28 p-3 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none"
                        />
                      </div>

                      <Button
                        onClick={runAITriage}
                        disabled={aiLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 rounded-md"
                      >
                        {aiLoading ? "Analyzing Support Context..." : "Run AI Ticket Triage"}
                      </Button>
                    </div>
                  </Card>

                  {/* Output */}
                  <Card className="p-6 bg-white/[0.02] border-white/10 min-h-[400px]">
                    <h3 className="text-base font-bold text-white mb-6">AI Triage &amp; Resolution Output</h3>

                    {aiResult ? (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {aiType === "classify" && (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase rounded-md">Priority: {aiResult.priority}</span>
                              <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase rounded-md">Category: {aiResult.category}</span>
                            </div>
                            <p className="text-xs text-neutral-300">Sentiment: <strong className="text-white">{aiResult.sentiment}</strong></p>
                            <p className="text-xs text-neutral-300">Suggested Agent Role: <strong className="text-emerald-400">{aiResult.suggestedAgentRole}</strong></p>
                          </div>
                        )}

                        {aiType === "suggest-solution" && (
                          <div className="space-y-3">
                            <p className="text-xs font-bold text-emerald-400">Suggested Auto Resolution Reply:</p>
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-xs text-neutral-200 whitespace-pre-line font-mono">
                              {aiResult.suggestedReply}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 text-neutral-500">
                        <Sparkles size={28} className="text-neutral-600 mb-4" />
                        <p className="font-bold">AI Support Copilot Standby</p>
                        <p className="text-xs max-w-xs mt-1">Select a triage mode and click Run AI Ticket Triage.</p>
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
