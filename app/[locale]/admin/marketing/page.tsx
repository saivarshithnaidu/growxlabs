"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Users, Target, Layers, ArrowUpRight, ArrowDownRight, Mail, Calendar, CheckSquare,
  TrendingUp, Globe, FileText, Search, Settings, AlertTriangle, Play, Plus, Trash2, Send,
  HelpCircle, Eye, RefreshCw, Sparkles, Image as ImageIcon, CheckCircle, BarChart3, Clock,
  Smartphone, Monitor, Code, ShieldCheck, UserCheck, Check, Info, Lock
} from "lucide-react";

type Role =
  | "Marketing Director"
  | "Marketing Manager"
  | "Content Writer"
  | "SEO Specialist"
  | "Social Media Manager"
  | "Performance Marketer"
  | "Designer"
  | "Viewer"
  | "Super Admin";

interface TabItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: Role[];
}

const TABS: TabItem[] = [
  { id: "overview", label: "Dashboard", icon: BarChart3, allowedRoles: ["Super Admin", "Marketing Director", "Marketing Manager", "Performance Marketer", "Viewer"] },
  { id: "campaigns", label: "Campaigns", icon: Megaphone, allowedRoles: ["Super Admin", "Marketing Director", "Marketing Manager", "Performance Marketer"] },
  { id: "landing_pages", label: "Pages & Forms", icon: Globe, allowedRoles: ["Super Admin", "Marketing Director", "Marketing Manager", "Designer", "SEO Specialist"] },
  { id: "emails", label: "Email Marketing", icon: Mail, allowedRoles: ["Super Admin", "Marketing Director", "Marketing Manager", "Content Writer"] },
  { id: "social", label: "Social Scheduler", icon: Calendar, allowedRoles: ["Super Admin", "Marketing Manager", "Social Media Manager", "Content Writer"] },
  { id: "seo", label: "SEO & Pagespeed", icon: Search, allowedRoles: ["Super Admin", "SEO Specialist", "Marketing Manager"] },
  { id: "automation", label: "Workflows", icon: Layers, allowedRoles: ["Super Admin", "Marketing Director", "Marketing Manager"] },
  { id: "ai_tools", label: "AI Copywriter", icon: Sparkles, allowedRoles: ["Super Admin", "Marketing Director", "Marketing Manager", "Content Writer", "Social Media Manager", "Performance Marketer", "Designer"] },
  { id: "surveys", label: "Surveys & Events", icon: CheckSquare, allowedRoles: ["Super Admin", "Marketing Manager", "Social Media Manager"] },
  { id: "brand", label: "Assets & Brand", icon: ImageIcon, allowedRoles: ["Super Admin", "Designer", "Marketing Manager"] }
];

export default function MarketingHubPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState<Role>("Super Admin");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  
  // Tab-specific state management
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [newCampaign, setNewCampaign] = useState({
    name: "", objective: "Lead Generation", budget: "", spent: "0",
    audience: "", channels: [] as string[], status: "draft", start_date: "", end_date: "", roi: "0"
  });
  
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [marketingLeads, setMarketingLeads] = useState<any[]>([]);
  const [seoData, setSeoData] = useState<any>(null);
  const [adsData, setAdsData] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  
  // AI Generator state
  const [aiType, setAiType] = useState("blog");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Form builder simulator state
  const [formFields, setFormFields] = useState<any[]>([
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true }
  ]);
  const [formTitle, setFormTitle] = useState("");
  const [formWebhook, setFormWebhook] = useState("");

  // Automation workspace simulator state
  const [flowSteps, setFlowSteps] = useState<any[]>([
    { id: "1", type: "trigger", name: "Form Submitted", config: {} },
    { id: "2", type: "email", name: "Send Welcome Email", config: { template: "Welcome Drip" } },
    { id: "3", type: "delay", name: "Wait 2 Days", config: { days: 2 } },
    { id: "4", type: "crm_sync", name: "Create CRM Lead", config: { score: 50 } }
  ]);

  // Social scheduler state
  const [socialPostText, setSocialPostText] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("LinkedIn");
  const [socialScheduledTime, setSocialScheduledTime] = useState("");
  const [socialPosts, setSocialPosts] = useState<any[]>([
    { id: "1", platform: "LinkedIn", content: "Growth loops are the blueprint of successful tech companies. 🚀 #SaaS", status: "scheduled", scheduled_at: "2026-07-22T10:00:00Z" },
    { id: "2", platform: "Twitter/X", content: "Double your lead response time using phase 5 automation loops. 📈", status: "published", published_at: "2026-07-18T14:30:00Z" }
  ]);

  useEffect(() => {
    fetchDashboardStats();
    fetchCampaigns();
    fetchLandingPagesAndForms();
    fetchMarketingLeads();
    fetchSEOData();
    fetchAdsData();
    fetchWorkflows();
  }, []);

  // Ensure active tab is allowed for current role, default to first allowed tab
  useEffect(() => {
    const tabObj = TABS.find(t => t.id === activeTab);
    if (tabObj && !tabObj.allowedRoles.includes(selectedRole)) {
      const firstAllowed = TABS.find(t => t.allowedRoles.includes(selectedRole));
      if (firstAllowed) {
        setActiveTab(firstAllowed.id);
        toast.info(`Switched tab to ${firstAllowed.label} due to role restrictions.`);
      }
    }
  }, [selectedRole]);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch("/api/marketing/dashboard");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      toast.error("Failed to load dashboard metrics.");
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/marketing/campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (e) {
      toast.error("Failed to fetch campaigns.");
    }
  };

  const fetchLandingPagesAndForms = async () => {
    try {
      const resLp = await fetch("/api/marketing/landing-pages");
      const dataLp = await resLp.json();
      setLandingPages(dataLp.landingPages || []);

      const resForms = await fetch("/api/marketing/forms");
      const dataForms = await resForms.json();
      setForms(dataForms.forms || []);
    } catch (e) {
      toast.error("Failed to load pages/forms.");
    }
  };

  const fetchMarketingLeads = async () => {
    try {
      const res = await fetch("/api/marketing/leads");
      const data = await res.json();
      setMarketingLeads(data.leads || []);
    } catch (e) {
      toast.error("Failed to load marketing leads.");
    }
  };

  const fetchSEOData = async () => {
    try {
      const res = await fetch("/api/marketing/seo");
      const data = await res.json();
      setSeoData(data);
    } catch (e) {
      toast.error("Failed to load SEO analytics.");
    }
  };

  const fetchAdsData = async () => {
    try {
      const res = await fetch("/api/marketing/ads");
      const data = await res.json();
      setAdsData(data.adAccounts || []);
    } catch (e) {
      toast.error("Failed to load advertising metrics.");
    }
  };

  const fetchWorkflows = async () => {
    try {
      const res = await fetch("/api/marketing/automation");
      const data = await res.json();
      setWorkflows(data.workflows || []);
    } catch (e) {
      toast.error("Failed to load workflows.");
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name) return toast.error("Campaign Name is required");
    
    setLoading(true);
    try {
      const res = await fetch("/api/marketing/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Campaign created successfully!");
        fetchCampaigns();
        setNewCampaign({
          name: "", objective: "Lead Generation", budget: "", spent: "0",
          audience: "", channels: [], status: "draft", start_date: "", end_date: "", roi: "0"
        });
      }
    } catch (err) {
      toast.error("Error creating campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleForceSyncCRM = async (leadId: string) => {
    try {
      const res = await fetch("/api/marketing/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "force-sync", leadId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Lead qualified and synchronized to CRM system!");
        fetchMarketingLeads();
      } else {
        toast.error(data.error || "Sync failed");
      }
    } catch (e) {
      toast.error("Error synchronizing lead");
    }
  };

  const runAICopywriter = async () => {
    if (!aiPrompt) return toast.error("Please enter a prompt instruction.");
    setAiLoading(true);
    setAiOutput(null);
    try {
      const res = await fetch("/api/marketing/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: aiType, prompt: aiPrompt })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setAiOutput(data.result);
        toast.success("AI Generation Complete!");
      } else {
        toast.error("AI Generation failed. Using cached models.");
      }
    } catch (e) {
      toast.error("Failed to connect to AI engine.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddFormField = (type: string) => {
    const name = `field_${Date.now()}`;
    const newField = {
      name,
      label: type.charAt(0).toUpperCase() + type.slice(1) + " Field",
      type,
      required: false
    };
    setFormFields([...formFields, newField]);
    toast.success(`Added ${type} field to form`);
  };

  const handleSaveForm = async () => {
    if (!formTitle) return toast.error("Please provide a form title");
    try {
      const res = await fetch("/api/marketing/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          fields: formFields,
          webhook_url: formWebhook,
          validation_rules: {},
          conditional_logic: {},
          spam_protection: { turnstile: true }
        })
      });
      if (res.ok) {
        toast.success("Form template created successfully!");
        setFormTitle("");
        setFormWebhook("");
        fetchLandingPagesAndForms();
      }
    } catch (e) {
      toast.error("Failed to save form template.");
    }
  };

  const handleSaveWorkflow = async () => {
    try {
      const res = await fetch("/api/marketing/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Visual Automation Loop " + new Date().toLocaleDateString(),
          trigger_event: "FormSubmitted",
          steps: flowSteps,
          status: "active"
        })
      });
      if (res.ok) {
        toast.success("Marketing workflow saved and activated!");
        fetchWorkflows();
      }
    } catch (e) {
      toast.error("Failed to save workflow.");
    }
  };

  const handleScheduleSocialPost = () => {
    if (!socialPostText) return toast.error("Please enter social content.");
    const newPost = {
      id: Date.now().toString(),
      platform: socialPlatform,
      content: socialPostText,
      status: socialScheduledTime ? "scheduled" : "draft",
      scheduled_at: socialScheduledTime || null
    };
    setSocialPosts([newPost, ...socialPosts]);
    setSocialPostText("");
    toast.success(socialScheduledTime ? "Social post scheduled!" : "Social post saved as draft!");
  };

  // Filter tabs that are allowed for the current active role
  const allowedTabs = TABS.filter(t => t.allowedRoles.includes(selectedRole));

  return (
    <div className="space-y-10 text-white pb-20">
      
      {/* ═ HEADER & ROLE SWITCHER ═ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3.5 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Enterprise Marketing & Growth Hub
            </h1>
          </div>
          <p className="text-neutral-400 text-sm">
            Orchestrate campaigns, construct custom captures, scoring engines, automation drips, and handoff qualified leads to CRM.
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
              {(["Super Admin", "Marketing Director", "Marketing Manager", "Content Writer", "SEO Specialist", "Social Media Manager", "Performance Marketer", "Designer", "Viewer"] as Role[]).map((r) => (
                <option key={r} value={r} className="bg-neutral-950 text-white">{r}</option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={() => {
              fetchDashboardStats();
              fetchCampaigns();
              toast.success("Synchronized all marketing databases.");
            }}
            variant="outline"
            className="h-10 px-4 bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Sync Node
          </Button>
        </div>
      </div>

      {/* ═ CORE LAYOUT GRID ═ */}
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

              {/* ══ 1. OVERVIEW / DASHBOARD ══ */}
              {activeTab === "overview" && stats && (
                <div className="space-y-8">
                  {/* KPI Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    <Card className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400"><Users size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center"><ArrowUpRight size={12} className="mr-0.5" /> 8.4%</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Website Visitors</p>
                      <h3 className="text-3xl font-black text-white">{stats.visitors.toLocaleString()}</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400"><Target size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-blue-400 flex items-center"><ArrowUpRight size={12} className="mr-0.5" /> 14.1%</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">New Captured Leads</p>
                      <h3 className="text-3xl font-black text-white">{stats.newLeads.toLocaleString()}</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400"><CheckCircle size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-purple-400 flex items-center"><ArrowUpRight size={12} className="mr-0.5" /> 9.8%</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">MQLs (Score &gt;= 50)</p>
                      <h3 className="text-3xl font-black text-white">{stats.mql.toLocaleString()}</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400"><TrendingUp size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-amber-400 flex items-center"><ArrowUpRight size={12} className="mr-0.5" /> 18.2%</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">ROI / Conversion</p>
                      <h3 className="text-3xl font-black text-white">{stats.roi}% / {stats.conversionRate}%</h3>
                    </Card>
                  </div>

                  {/* Financial & Channel Efficiency Charts */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Funnel Efficiency */}
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Marketing Funnel & CAC Efficiency</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider text-neutral-400">
                            <span>1. Raw Traffic (45k)</span>
                            <span className="text-white">100%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: "100%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider text-neutral-400">
                            <span>2. Landing Page Captures (1.2k)</span>
                            <span className="text-white">2.74% Conversion</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/70" style={{ width: "65%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider text-neutral-400">
                            <span>3. Marketing Qualified Leads (342)</span>
                            <span className="text-white">27.5% of Captures</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400" style={{ width: "40%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider text-neutral-400">
                            <span>4. CRM Sales Qualified Handoff (128)</span>
                            <span className="text-white">37.4% of MQLs</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: "20%" }} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 border-t border-white/5 mt-6 pt-6 text-center">
                        <div>
                          <p className="text-[10px] font-black uppercase text-neutral-400">Cost Per Lead (CPL)</p>
                          <p className="text-lg font-extrabold text-emerald-400">${stats.cpl}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-neutral-400">Cust Acquisition (CAC)</p>
                          <p className="text-lg font-extrabold text-blue-400">${stats.cac}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-neutral-400">Email Open Rate</p>
                          <p className="text-lg font-extrabold text-purple-400">{stats.emailOpenRate}%</p>
                        </div>
                      </div>
                    </Card>

                    {/* Leads by Source Chart (Interactive Grid) */}
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Leads by Traffic Acquisition Channel</h3>
                      <div className="space-y-4">
                        {stats.leadsBySource.map((source: any, i: number) => {
                          const maxCount = 500;
                          const widthPct = Math.round((source.count / maxCount) * 100);
                          return (
                            <div key={i} className="flex items-center gap-4">
                              <span className="w-32 text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">{source.source}</span>
                              <div className="flex-1 h-3.5 bg-white/5 rounded-md overflow-hidden relative">
                                <div className="h-full rounded-md" style={{ width: `${widthPct}%`, backgroundColor: source.color }} />
                              </div>
                              <span className="w-10 text-right text-xs font-bold text-white">{source.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>

                  {/* Active Channels Grid */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Active Campaigns Revenue Performance</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-white/10 bg-white/5">
                          <tr>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Campaign</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Channel</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Clicks</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Leads</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Spent</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">ROI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-transparent">
                          {stats.campaignPerformance.map((camp: any, i: number) => (
                            <tr key={i} className="hover:bg-white/[0.01]">
                              <td className="px-5 py-4 font-bold text-white">{camp.name}</td>
                              <td className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400">{camp.channel}</td>
                              <td className="px-5 py-4 text-xs font-bold text-white">{camp.clicks.toLocaleString()}</td>
                              <td className="px-5 py-4 text-xs font-bold text-white">{camp.leads}</td>
                              <td className="px-5 py-4 text-xs font-bold text-neutral-400">${camp.spent.toLocaleString()}</td>
                              <td className="px-5 py-4"><span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-extrabold uppercase tracking-widest text-emerald-400">+{camp.roi}%</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 2. CAMPAIGNS TAB ══ */}
              {activeTab === "campaigns" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Create Campaign Panel */}
                  <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Launch New Campaign</h3>
                    <form onSubmit={handleCreateCampaign} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Campaign Name</label>
                        <Input
                          value={newCampaign.name}
                          onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                          placeholder="e.g. Inbound SaaS Drip Q3"
                          className="h-10 border-white/10 bg-white/5"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Objective</label>
                        <select
                          value={newCampaign.objective}
                          onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none"
                        >
                          <option value="Lead Generation" className="bg-neutral-950">Lead Generation</option>
                          <option value="Brand Awareness" className="bg-neutral-950">Brand Awareness</option>
                          <option value="Event Registrations" className="bg-neutral-950">Event Registrations</option>
                          <option value="Product Trial" className="bg-neutral-950">Product Trial</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Budget ($)</label>
                          <Input
                            type="number"
                            value={newCampaign.budget}
                            onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                            placeholder="5000"
                            className="h-10 border-white/10 bg-white/5"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">ROI Target (%)</label>
                          <Input
                            type="number"
                            value={newCampaign.roi}
                            onChange={(e) => setNewCampaign({ ...newCampaign, roi: e.target.value })}
                            placeholder="150"
                            className="h-10 border-white/10 bg-white/5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Audience Persona</label>
                        <Input
                          value={newCampaign.audience}
                          onChange={(e) => setNewCampaign({ ...newCampaign, audience: e.target.value })}
                          placeholder="e.g. Startup Founders, SMB CTOs"
                          className="h-10 border-white/10 bg-white/5"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 text-white hover:bg-emerald-600 h-10 rounded-md font-bold mt-4"
                      >
                        {loading ? "Processing..." : "Deploy Campaign Node"}
                      </Button>
                    </form>
                  </Card>

                  {/* Campaigns Table */}
                  <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Active Campaigns Registry</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-white/10 bg-white/5">
                          <tr>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Campaign</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Status</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Target</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Budget</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">ROI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-transparent">
                          {campaigns.map((camp) => (
                            <tr key={camp.id} className="hover:bg-white/[0.01]">
                              <td className="px-5 py-4 font-bold text-white">
                                {camp.name}
                                <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider mt-1">Audience: {camp.audience || "General"}</div>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  camp.status === "active"
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-neutral-500/10 border-white/10 text-neutral-400"
                                }`}>
                                  {camp.status}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-xs font-bold text-neutral-300">{camp.objective}</td>
                              <td className="px-5 py-4 text-xs font-bold text-white">${Number(camp.budget).toLocaleString()}</td>
                              <td className="px-5 py-4 text-xs font-black text-emerald-400">+{camp.roi}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 3. PAGES & FORMS TAB ══ */}
              {activeTab === "landing_pages" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Landing Pages Simulator */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-base font-bold text-white">Landing Pages Analytics</h3>
                      <Button onClick={() => toast.info("Use the AI Copywriter tab to generate landing page assets instantly.")} size="sm" className="bg-white/5 border border-white/10 text-neutral-300">
                        <Sparkles size={14} className="mr-1.5 text-emerald-400" /> Create Template
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {landingPages.map((page) => (
                        <div key={page.id} className="border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-2xl flex justify-between items-center transition-all">
                          <div>
                            <h4 className="font-bold text-white">{page.title}</h4>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1.5">Template: {page.template_type} · slug: /{page.slug}</p>
                          </div>
                          <div className="flex items-center gap-6 text-right">
                            <div>
                              <p className="text-[10px] font-black uppercase text-neutral-400">Views</p>
                              <p className="text-sm font-bold text-white">{page.analytics?.views || 0}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase text-neutral-400">Leads</p>
                              <p className="text-sm font-bold text-emerald-400">{page.analytics?.conversions || 0}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Form Builder Constructor */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Form Layout Builder Simulator</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Form Title</label>
                        <Input
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g. Newsletter Opt-in"
                          className="h-10 bg-white/5 border-white/10"
                        />
                      </div>

                      <div className="border border-white/5 p-4 rounded-xl space-y-2 bg-black/10">
                        <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500 mb-2">Fields Stack</p>
                        {formFields.map((field, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 p-2 rounded-lg text-xs">
                            <span className="font-bold">{field.label} ({field.type})</span>
                            <button
                              onClick={() => setFormFields(formFields.filter((_, idx) => idx !== i))}
                              className="text-red-400 hover:text-red-500 shrink-0 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2 block">Add Input Node</p>
                        <div className="flex gap-2 flex-wrap">
                          <Button onClick={() => handleAddFormField("text")} size="sm" variant="outline" className="h-8 border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-wider">Text</Button>
                          <Button onClick={() => handleAddFormField("email")} size="sm" variant="outline" className="h-8 border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-wider">Email</Button>
                          <Button onClick={() => handleAddFormField("tel")} size="sm" variant="outline" className="h-8 border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-wider">Phone</Button>
                          <Button onClick={() => handleAddFormField("select")} size="sm" variant="outline" className="h-8 border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-wider">Select Dropdown</Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Custom Webhook Integration (Optional)</label>
                        <Input
                          value={formWebhook}
                          onChange={(e) => setFormWebhook(e.target.value)}
                          placeholder="https://yourserver.com/hook"
                          className="h-10 bg-white/5 border-white/10"
                        />
                      </div>

                      <Button onClick={handleSaveForm} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 mt-4 rounded-md">
                        Deploy Form Template
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 4. EMAIL MARKETING TAB ══ */}
              {activeTab === "emails" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Email Sequences */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Inbound Drip Sequences</h3>
                    <div className="space-y-5">
                      <div className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white">SaaS Platform Welcome Drip</h4>
                            <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">Trigger: Lead score &gt;= 10</p>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="flex justify-between text-xs text-neutral-400 border-t border-white/5 pt-3">
                          <span>3 Emails Sequence</span>
                          <span>Open Rate: 24.8% · Click Rate: 4.2%</span>
                        </div>
                      </div>

                      <div className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white">Enterprise Consultation Retargeting</h4>
                            <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">Trigger: Visited Price Page &amp; Score &gt;= 30</p>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="flex justify-between text-xs text-neutral-400 border-t border-white/5 pt-3">
                          <span>5 Emails Sequence</span>
                          <span>Open Rate: 31.2% · Click Rate: 6.8%</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Send Email Template Campaign */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Launch Custom Newsletter</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Subject Line</label>
                        <Input placeholder="e.g. Why Automation matters to your sales conversions" className="h-10 bg-white/5 border-white/10" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Template Select</label>
                        <select className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none">
                          <option className="bg-neutral-950">Blank Template</option>
                          <option className="bg-neutral-950">Product Announcement (AI generated)</option>
                          <option className="bg-neutral-950">Monthly Newsletter Template</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Recipient Audience</label>
                        <select className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none">
                          <option className="bg-neutral-950">All Marketing Leads ({marketingLeads.length})</option>
                          <option className="bg-neutral-950">MQL Leads Only</option>
                        </select>
                      </div>
                      <Button onClick={() => toast.success("Newsletter campaign queued for delivery!")} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 mt-4 rounded-md">
                        Transmit Drip Campaign
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 5. SOCIAL MEDIA SCHEDULER TAB ══ */}
              {activeTab === "social" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Composer Panel */}
                  <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Schedule Social Post</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Select Platform</label>
                        <select
                          value={socialPlatform}
                          onChange={(e) => setSocialPlatform(e.target.value)}
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none"
                        >
                          <option value="LinkedIn" className="bg-neutral-950">LinkedIn</option>
                          <option value="Twitter/X" className="bg-neutral-950">Twitter/X</option>
                          <option value="Instagram" className="bg-neutral-950">Instagram</option>
                          <option value="Facebook" className="bg-neutral-950">Facebook</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Content Copy</label>
                        <textarea
                          value={socialPostText}
                          onChange={(e) => setSocialPostText(e.target.value)}
                          placeholder="Write social post content..."
                          className="w-full h-32 p-3 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Scheduled Release Date (Optional)</label>
                        <Input
                          type="datetime-local"
                          value={socialScheduledTime}
                          onChange={(e) => setSocialScheduledTime(e.target.value)}
                          className="h-10 bg-white/5 border-white/10"
                        />
                      </div>

                      <Button onClick={handleScheduleSocialPost} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 mt-4 rounded-md">
                        Deploy Scheduled Node
                      </Button>
                    </div>
                  </Card>

                  {/* Calendar / Pipeline */}
                  <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Social Pipeline & calendar</h3>
                    <div className="space-y-4">
                      {socialPosts.map((post) => (
                        <div key={post.id} className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl flex justify-between items-start gap-4">
                          <div className="space-y-2">
                            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[9px] font-black text-blue-400 uppercase tracking-wider">{post.platform}</span>
                            <p className="text-sm font-medium text-neutral-200">{post.content}</p>
                            {post.scheduled_at && (
                              <p className="text-[10px] text-neutral-500 font-bold flex items-center"><Clock size={12} className="mr-1" /> Scheduled for {new Date(post.scheduled_at).toLocaleString()}</p>
                            )}
                            {post.published_at && (
                              <p className="text-[10px] text-emerald-500 font-bold flex items-center"><Check size={12} className="mr-1" /> Published on {new Date(post.published_at).toLocaleString()}</p>
                            )}
                          </div>
                          <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-widest ${
                            post.status === "scheduled" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          }`}>{post.status}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 6. SEO & PAGESPEED TAB ══ */}
              {activeTab === "seo" && seoData && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Organic Keywords */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Ranked Organic Keywords</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-white/10 bg-white/5">
                          <tr>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Keyword</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Rank</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Volume</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Traffic</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-transparent">
                          {seoData.keywords.map((kw: any) => (
                            <tr key={kw.id} className="hover:bg-white/[0.01]">
                              <td className="px-5 py-4 font-bold text-white">{kw.keyword}</td>
                              <td className="px-5 py-4 text-xs font-black text-emerald-400">#{kw.position}</td>
                              <td className="px-5 py-4 text-xs font-bold text-white">{kw.search_volume.toLocaleString()}</td>
                              <td className="px-5 py-4 text-xs font-bold text-neutral-400">+{kw.organic_traffic} clicks/mo</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Technical Audit & Performance */}
                  <div className="space-y-8">
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Core Web Vitals & Page Speed</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-center">
                          <p className="text-[9px] font-black uppercase text-neutral-500 mb-1">Performance</p>
                          <p className={`text-2xl font-black ${seoData.report.page_speed.performance >= 90 ? "text-emerald-400" : "text-amber-400"}`}>{seoData.report.page_speed.performance}%</p>
                        </div>
                        <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-center">
                          <p className="text-[9px] font-black uppercase text-neutral-500 mb-1">Accessibility</p>
                          <p className="text-2xl font-black text-emerald-400">{seoData.report.page_speed.accessibility}%</p>
                        </div>
                        <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-center">
                          <p className="text-[9px] font-black uppercase text-neutral-500 mb-1">Best Practices</p>
                          <p className="text-2xl font-black text-emerald-400">{seoData.report.page_speed.best_practices}%</p>
                        </div>
                        <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-center">
                          <p className="text-[9px] font-black uppercase text-neutral-500 mb-1">SEO Score</p>
                          <p className="text-2xl font-black text-emerald-400">{seoData.report.page_speed.seo}%</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-white/5 pt-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-3">SEO Audit Recommendations</p>
                        {seoData.report.critical_issues.map((issue: string, i: number) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-amber-300 font-medium">
                            <AlertTriangle size={14} className="shrink-0 text-amber-400 mt-0.5" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* ══ 7. AUTOMATION WORKFLOWS CANVASES TAB ══ */}
              {activeTab === "automation" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Workflow step editor */}
                  <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Build Automation Sequence</h3>
                    <div className="space-y-4">
                      <div className="border border-white/5 bg-black/10 rounded-xl p-4 space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500">Flow Action Nodes</p>
                        
                        {flowSteps.map((step, idx) => (
                          <div key={step.id} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-lg text-xs relative">
                            <span className="h-5 w-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md flex items-center justify-center font-bold">{idx + 1}</span>
                            <div className="flex-1">
                              <p className="font-bold text-white">{step.name}</p>
                              <p className="text-[9px] text-neutral-400 mt-0.5 uppercase tracking-wide">Type: {step.type}</p>
                            </div>
                            <button
                              onClick={() => setFlowSteps(flowSteps.filter(s => s.id !== step.id))}
                              className="text-red-400 hover:text-red-500 shrink-0 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button onClick={() => setFlowSteps([...flowSteps, { id: Date.now().toString(), type: "email", name: "Send Ebook Followup", config: {} }])} size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-wider border-white/10 bg-white/5">+ Send Email</Button>
                        <Button onClick={() => setFlowSteps([...flowSteps, { id: Date.now().toString(), type: "delay", name: "Delay 3 Days", config: {} }])} size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-wider border-white/10 bg-white/5">+ Delay</Button>
                        <Button onClick={() => setFlowSteps([...flowSteps, { id: Date.now().toString(), type: "notify", name: "Slack Alert Sales", config: {} }])} size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-wider border-white/10 bg-white/5">+ Notify Sales</Button>
                      </div>

                      <Button onClick={handleSaveWorkflow} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 mt-4 rounded-md">
                        Deploy Growth Sequence
                      </Button>
                    </div>
                  </Card>

                  {/* Flow Canvas visualizer */}
                  <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10 relative overflow-hidden">
                    <h3 className="text-base font-bold text-white mb-6">Workflow Visualizer Canvas</h3>
                    
                    <div className="flex flex-col items-center gap-6 py-6 border border-white/5 rounded-2xl bg-black/20">
                      {flowSteps.map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center">
                          <div className="bg-[var(--surface-1)] border border-emerald-500/30 p-5 rounded-2xl w-64 text-center shadow-lg relative">
                            <span className="absolute top-2 left-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">Step {idx + 1}</span>
                            <h4 className="font-black text-white text-sm mt-3">{step.name}</h4>
                            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider mt-1">{step.type}</p>
                          </div>
                          
                          {idx < flowSteps.length - 1 && (
                            <div className="h-6 w-0.5 bg-emerald-500/20 border-dashed border-l relative my-1">
                              <span className="absolute -bottom-1 -left-1 text-emerald-500/20">&#8595;</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 8. AI COPYWRITER TAB ══ */}
              {activeTab === "ai_tools" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Prompt input */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">AI Copywriter Generator</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Content Format</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {[
                            { id: "blog", label: "Blog" },
                            { id: "social", label: "Social" },
                            { id: "email", label: "Email" },
                            { id: "ad", label: "Ad Copy" },
                            { id: "keywords", label: "SEO Plan" }
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
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Instructions for Gemini</label>
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g. Write a 300-word blog post for startup founders about reducing CAC using automated lead scoring."
                          className="w-full h-40 p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <Button
                        onClick={runAICopywriter}
                        disabled={aiLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 rounded-md"
                      >
                        {aiLoading ? (
                          <span className="flex items-center justify-center gap-2"><RefreshCw className="animate-spin h-4 w-4" /> Generating...</span>
                        ) : (
                          <span className="flex items-center justify-center gap-2"><Sparkles className="h-4 w-4" /> Run AI Assistant</span>
                        )}
                      </Button>
                    </div>
                  </Card>

                  {/* AI Output preview */}
                  <Card className="p-6 bg-white/[0.02] border-white/10 relative min-h-[400px]">
                    <h3 className="text-base font-bold text-white mb-6">AI Generation Output</h3>
                    
                    {aiOutput ? (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {aiType === "blog" && (
                          <div className="space-y-4">
                            <h4 className="text-lg font-black text-white">{aiOutput.title}</h4>
                            <div className="border border-white/5 bg-black/10 p-4 rounded-xl text-xs space-y-2 text-neutral-300 max-h-96 overflow-y-auto font-mono whitespace-pre-line">
                              {aiOutput.body}
                            </div>
                            <div className="flex gap-2">
                              {aiOutput.tags?.map((t: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-neutral-900 border border-white/10 rounded text-[9px] font-bold text-neutral-400">#{t}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiType === "social" && (
                          <div className="space-y-4">
                            {aiOutput.posts?.map((p: any, i: number) => (
                              <div key={i} className="border border-white/5 bg-black/10 p-4 rounded-xl space-y-2">
                                <span className="text-[10px] font-black uppercase text-blue-400">{p.platform} Copy</span>
                                <p className="text-xs text-neutral-200 font-medium">{p.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {aiType === "email" && (
                          <div className="space-y-3">
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl">
                              <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Subject</p>
                              <p className="text-xs font-bold text-white">{aiOutput.subject}</p>
                            </div>
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-xs text-neutral-300 whitespace-pre-line font-mono">
                              {aiOutput.body}
                            </div>
                          </div>
                        )}

                        {aiType === "ad" && (
                          <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase text-neutral-400">Headlines</span>
                            {aiOutput.headlines?.map((h: string, i: number) => (
                              <div key={i} className="bg-black/10 border border-white/5 p-3 rounded-lg text-xs font-bold text-white">{h}</div>
                            ))}
                            <span className="text-[10px] font-black uppercase text-neutral-400 mt-2 block">Descriptions</span>
                            {aiOutput.descriptions?.map((d: string, i: number) => (
                              <div key={i} className="bg-black/10 border border-white/5 p-3 rounded-lg text-xs text-neutral-300">{d}</div>
                            ))}
                          </div>
                        )}

                        {aiType === "keywords" && (
                          <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase text-neutral-400">SEO Keywords Planner</span>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="border-b border-white/10 bg-white/5">
                                  <tr>
                                    <th className="px-4 py-2 text-neutral-400 uppercase tracking-wider">Keyword</th>
                                    <th className="px-4 py-2 text-neutral-400 uppercase tracking-wider">Volume</th>
                                    <th className="px-4 py-2 text-neutral-400 uppercase tracking-wider">Difficulty</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {aiOutput.keywords?.map((k: any, i: number) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01]">
                                      <td className="px-4 py-3 font-bold text-white">{k.keyword}</td>
                                      <td className="px-4 py-3 text-neutral-300">{k.volume.toLocaleString()}</td>
                                      <td className="px-4 py-3 font-bold text-emerald-400">{k.difficulty}%</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 text-neutral-500">
                        <Sparkles size={28} className="text-neutral-600 mb-4" />
                        <p className="font-bold">Output Sandbox</p>
                        <p className="text-xs max-w-xs mt-1">Select a format, configure guidelines, and trigger the AI copywriter to write content.</p>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* ══ 9. WEB_EVENTS SURVEYS TAB ══ */}
              {activeTab === "surveys" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Webinars list */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Upcoming Webinars & Events</h3>
                    <div className="space-y-4">
                      <div className="border border-white/5 bg-white/[0.01] p-5 rounded-2xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-white">Scaling CRM Inbounds Webinar</h4>
                          <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">Type: Online · Date: 2026-08-15</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-neutral-400">Registrations</p>
                          <p className="text-sm font-bold text-emerald-400">340</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Feedback NPS/CSAT reports */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">NPS & Customer Satisfaction</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-black/10 border border-white/5 p-6 rounded-xl">
                        <p className="text-[10px] font-black uppercase text-neutral-500 mb-2">Net Promoter Score (NPS)</p>
                        <p className="text-4xl font-black text-emerald-400">+72</p>
                      </div>
                      <div className="bg-black/10 border border-white/5 p-6 rounded-xl">
                        <p className="text-[10px] font-black uppercase text-neutral-500 mb-2">Customer Satisfaction (CSAT)</p>
                        <p className="text-4xl font-black text-emerald-400">94%</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 10. MEDIA & BRAND ASSETS TAB ══ */}
              {activeTab === "brand" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Brand Guidelines */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Brand Design System Tokens</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 bg-emerald-500 rounded-xl text-xs font-bold text-black flex flex-col justify-between h-20 shadow-lg">
                          <span>Primary</span>
                          <span>#00A86B</span>
                        </div>
                        <div className="p-4 bg-neutral-900 border border-white/10 rounded-xl text-xs font-bold text-white flex flex-col justify-between h-20 shadow-lg">
                          <span>Background</span>
                          <span>#0B0B0C</span>
                        </div>
                        <div className="p-4 bg-[#1e1c19] border border-white/10 rounded-xl text-xs font-bold text-white flex flex-col justify-between h-20 shadow-lg">
                          <span>Surface 2</span>
                          <span>#1E1C19</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Media Library list */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Media Library Store</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: "growx_logo.png", size: "45 KB", type: "PNG Logo" },
                        { name: "saas_reels_mock.mp4", size: "12.4 MB", type: "MP4 Video" },
                        { name: "enterprise_ebook.pdf", size: "2.1 MB", type: "PDF E-book" }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-black/10 border border-white/5 p-3 rounded-xl text-center flex flex-col items-center justify-between h-28">
                          <ImageIcon size={22} className="text-neutral-500 mt-2" />
                          <div>
                            <p className="text-[10px] font-bold text-white truncate max-w-full">{item.name}</p>
                            <p className="text-[8px] text-neutral-500 font-medium uppercase mt-0.5">{item.size} · {item.type}</p>
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

      {/* ══ AUDIT LOG & LEADS TABLE (CRM Sync View) ══ */}
      <Card className="p-6 bg-white/[0.02] border-white/10 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Marketing Leads & Qualification Registry</h3>
            <p className="text-[10px] text-neutral-400 font-medium mt-1">Leads with score &gt;= 50 are automatically qualified as MQLs and synchronized directly to CRM.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Lead Contact</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Company</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Engagement Score</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Status</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">CRM Sync ID</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {marketingLeads.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-500 font-bold uppercase tracking-wider text-xs">No marketing leads found. Syncing databases...</td></tr>
              ) : marketingLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.01]">
                  <td className="px-5 py-4">
                    <span className="font-bold text-white block">{lead.name}</span>
                    <span className="text-[10px] font-medium text-neutral-400 mt-0.5 block">{lead.email} · {lead.phone || "No Phone"}</span>
                  </td>
                  <td className="px-5 py-4 text-xs font-bold text-neutral-300">{lead.business_name || "Individual"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-extrabold ${lead.score >= 50 ? "text-emerald-400" : "text-amber-400"}`}>{lead.score} pts</span>
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden shrink-0">
                        <div className={`h-full rounded-full ${lead.score >= 50 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${Math.min(lead.score, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-widest ${
                      lead.status === "MQL" || lead.status === "SQL"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    }`}>{lead.status}</span>
                  </td>
                  <td className="px-5 py-4 text-[10px] font-bold text-neutral-400 truncate max-w-xs">{lead.crm_lead_id || "Not Synced (Nurturing)"}</td>
                  <td className="px-5 py-4">
                    {!lead.crm_lead_id ? (
                      <Button
                        onClick={() => handleForceSyncCRM(lead.id)}
                        disabled={selectedRole === "Viewer"}
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-8 text-[9px] uppercase tracking-wider rounded px-3"
                      >
                        Force CRM Sync
                      </Button>
                    ) : (
                      <span className="text-[9px] font-extrabold uppercase text-emerald-400 flex items-center gap-1"><CheckCircle size={12} /> Handoff Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
    </div>
  );
}
