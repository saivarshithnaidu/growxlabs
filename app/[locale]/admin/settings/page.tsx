"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, ShieldAlert, Key, Users, Building2, Layers, Lock, Cpu, Globe, CheckCircle,
  AlertTriangle, RefreshCw, Terminal, Eye, Plus, Trash2, Download, Search, Settings,
  Sparkles, Check, Database, Server, Smartphone, Laptop, FileText, ArrowUpRight, UserCheck, HardDrive, Zap
} from "lucide-react";

type Role =
  | "Super Admin"
  | "Organization Admin"
  | "IT Administrator"
  | "Security Administrator"
  | "Compliance Officer"
  | "Department Admin"
  | "Manager"
  | "Employee"
  | "Client"
  | "Viewer";

interface TabItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: Role[];
}

const TABS: TabItem[] = [
  { id: "overview", label: "Governance Overview", icon: ShieldCheck, allowedRoles: ["Super Admin", "Organization Admin", "IT Administrator", "Security Administrator", "Compliance Officer", "Viewer"] },
  { id: "organization", label: "Organization & Structure", icon: Building2, allowedRoles: ["Super Admin", "Organization Admin", "Department Admin"] },
  { id: "users", label: "Users & Directory", icon: Users, allowedRoles: ["Super Admin", "Organization Admin", "IT Administrator", "Department Admin"] },
  { id: "rbac", label: "RBAC Matrix", icon: Lock, allowedRoles: ["Super Admin", "Organization Admin", "IT Administrator", "Security Administrator"] },
  { id: "auth_sso", label: "SSO & Authentication", icon: Key, allowedRoles: ["Super Admin", "IT Administrator", "Security Administrator"] },
  { id: "security", label: "Security & Threat Center", icon: ShieldAlert, allowedRoles: ["Super Admin", "Security Administrator", "IT Administrator"] },
  { id: "audit_logs", label: "Audit Logs & Compliance", icon: FileText, allowedRoles: ["Super Admin", "Security Administrator", "Compliance Officer", "Viewer"] },
  { id: "api_webhooks", label: "APIs & Webhooks", icon: Terminal, allowedRoles: ["Super Admin", "IT Administrator"] },
  { id: "integrations", label: "Integrations Hub", icon: Globe, allowedRoles: ["Super Admin", "IT Administrator", "Organization Admin"] },
  { id: "feature_flags", label: "Feature Flags", icon: Zap, allowedRoles: ["Super Admin", "IT Administrator"] },
  { id: "ai_admin", label: "AI Admin Assistant", icon: Sparkles, allowedRoles: ["Super Admin", "Organization Admin", "IT Administrator", "Security Administrator", "Compliance Officer"] }
];

export default function AdminGovernancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState<Role>("Super Admin");
  const [loading, setLoading] = useState(false);
  const [govMetrics, setGovMetrics] = useState<any>(null);

  // Users State
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Employee", department: "Engineering", user_type: "Employee" });

  // RBAC Matrix State
  const [rbacData, setRbacData] = useState<any>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  // Security & Audit State
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // API & Integrations State
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [newApiKeyName, setNewApiKeyName] = useState("");

  // AI Admin Assistant State
  const [aiType, setAiType] = useState("analyze-threats");
  const [aiInputText, setAiInputText] = useState("");
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchGovernanceMetrics();
    fetchUsers();
    fetchRBAC();
    fetchSecurityData();
    fetchIntegrationsData();
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

  const fetchGovernanceMetrics = async () => {
    try {
      const res = await fetch("/api/admin-setup/dashboard");
      const data = await res.json();
      setGovMetrics(data);
    } catch (e) {
      toast.error("Failed to load governance metrics.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin-setup/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      toast.error("Failed to load user directory.");
    }
  };

  const fetchRBAC = async () => {
    try {
      const res = await fetch("/api/admin-setup/rbac");
      const data = await res.json();
      setRbacData(data);
    } catch (e) {
      toast.error("Failed to load RBAC matrix.");
    }
  };

  const fetchSecurityData = async () => {
    try {
      const res = await fetch("/api/admin-setup/security");
      const data = await res.json();
      setSecurityEvents(data.events || []);
      setAuditLogs(data.logs || []);
    } catch (e) {
      toast.error("Failed to load security & audit logs.");
    }
  };

  const fetchIntegrationsData = async () => {
    try {
      const res = await fetch("/api/admin-setup/integrations");
      const data = await res.json();
      setApiKeys(data.apiKeys || []);
      setFeatureFlags(data.featureFlags || []);
      setIntegrations(data.integrations || []);
    } catch (e) {
      toast.error("Failed to load integrations data.");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return toast.error("Name and Email required");

    setLoading(true);
    try {
      const res = await fetch("/api/admin-setup/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`User ${newUser.name} provisioned in directory!`);
        setNewUser({ name: "", email: "", role: "Employee", department: "Engineering", user_type: "Employee" });
        fetchUsers();
      }
    } catch (e) {
      toast.error("Failed to provision user.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return toast.error("Role Name is required");

    try {
      const res = await fetch("/api/admin-setup/rbac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_name: newRoleName, description: newRoleDesc })
      });
      if (res.ok) {
        toast.success(`Custom Role '${newRoleName}' added to RBAC matrix!`);
        setNewRoleName("");
        setNewRoleDesc("");
        fetchRBAC();
      }
    } catch (e) {
      toast.error("Failed to add role.");
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiKeyName) return toast.error("Key Name required");

    try {
      const res = await fetch("/api/admin-setup/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-api-key", key_name: newApiKeyName, scopes: ["all.read"] })
      });
      const data = await res.json();
      if (res.ok && data.apiKey) {
        toast.success(`Generated API Key: ${data.apiKey.key_prefix}`);
        setNewApiKeyName("");
        fetchIntegrationsData();
      }
    } catch (e) {
      toast.error("Failed to generate API Key.");
    }
  };

  const handleToggleFlag = async (flagKey: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin-setup/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-flag", flag_key: flagKey, is_enabled: !currentStatus })
      });
      if (res.ok) {
        toast.success(`Feature Flag '${flagKey}' updated!`);
        fetchIntegrationsData();
      }
    } catch (e) {
      toast.error("Failed to update feature flag.");
    }
  };

  const runAIAdminAnalysis = async () => {
    setAiLoading(true);
    setAiOutput(null);

    try {
      const res = await fetch("/api/admin-setup/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: aiType,
          inputData: { prompt: aiInputText || "Analyze current governance security status." }
        })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setAiOutput(data.result);
        toast.success("AI Admin Assistant Analysis Complete!");
      }
    } catch (e) {
      toast.error("AI Analysis error.");
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
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Enterprise Administration, Security &amp; Governance
            </h1>
          </div>
          <p className="text-neutral-400 text-sm">
            Centralized control plane managing organizations, RBAC permission matrices, SSO/MFA, audit logs, security threat analysis, &amp; compliance across all 7 platform modules.
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
                "Super Admin", "Organization Admin", "IT Administrator", "Security Administrator",
                "Compliance Officer", "Department Admin", "Manager", "Employee", "Client", "Viewer"
              ] as Role[]).map((r) => (
                <option key={r} value={r} className="bg-neutral-950 text-white">{r}</option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={() => {
              fetchGovernanceMetrics();
              fetchUsers();
              fetchRBAC();
              fetchSecurityData();
              fetchIntegrationsData();
              toast.success("Synchronized Administration Control Plane.");
            }}
            variant="outline"
            className="h-10 px-4 bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Control Plane
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

              {/* ══ 1. GOVERNANCE OVERVIEW ══ */}
              {activeTab === "overview" && govMetrics && (
                <div className="space-y-8">
                  {/* KPI Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    <Card className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400"><ShieldCheck size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center"><ArrowUpRight size={12} className="mr-0.5" /> High</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Platform Security Score</p>
                      <h3 className="text-3xl font-black text-white">{govMetrics.securityScore} / 100</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-blue-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400"><Users size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-blue-400">{govMetrics.licenseSeatsUsed} / {govMetrics.licenseSeatsTotal} Seats</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Provisioned Users</p>
                      <h3 className="text-3xl font-black text-white">{govMetrics.totalUsers}</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-purple-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400"><Laptop size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-purple-400">Authenticated</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Active Sessions</p>
                      <h3 className="text-3xl font-black text-white">{govMetrics.activeSessions} Sessions</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 hover:border-amber-500/30 transition-all p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400"><HardDrive size={18} /></span>
                        <span className="text-[10px] font-black uppercase text-amber-400">18% Limit</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Storage Utilized</p>
                      <h3 className="text-3xl font-black text-white">{govMetrics.storageUsedGB} GB</h3>
                    </Card>
                  </div>

                  {/* Compliance & Active Integrations */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Compliance Framework Statuses */}
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Compliance &amp; Governance Certification</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
                          <div>
                            <h4 className="font-bold text-white text-sm">GDPR (General Data Protection Regulation)</h4>
                            <p className="text-[10px] text-neutral-400">Right to be forgotten, Consent logs, Data Privacy</p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[9px] font-black uppercase">{govMetrics.complianceStatus.gdpr}</span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
                          <div>
                            <h4 className="font-bold text-white text-sm">SOC 2 Type II Certification</h4>
                            <p className="text-[10px] text-neutral-400">Security, Availability, Processing Integrity</p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[9px] font-black uppercase">{govMetrics.complianceStatus.soc2}</span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
                          <div>
                            <h4 className="font-bold text-white text-sm">ISO 27001 Information Security</h4>
                            <p className="text-[10px] text-neutral-400">ISMS Controls, Risk Management Policies</p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[9px] font-black uppercase">{govMetrics.complianceStatus.iso27001}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Integrated Platform Services */}
                    <Card className="p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Enterprise Integrated Services</h3>
                      <div className="space-y-3">
                        {govMetrics.activeIntegrations.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-3.5 bg-white/5 border border-white/5 rounded-xl">
                            <div>
                              <p className="font-bold text-white text-sm">{item.name}</p>
                              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{item.category}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[9px] font-black uppercase">{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* ══ 2. ORGANIZATION & STRUCTURE ══ */}
              {activeTab === "organization" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Organization Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Organization Legal Name</label>
                        <Input defaultValue="GrowXLabs Technologies Private Limited" className="h-10 bg-white/5 border-white/10 text-white font-bold" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">GST Number</label>
                          <Input defaultValue="27AABCU9603R1ZM" className="h-10 bg-white/5 border-white/10 text-white font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">PAN Number</label>
                          <Input defaultValue="AABCU9603R" className="h-10 bg-white/5 border-white/10 text-white font-bold" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Default Time Zone</label>
                          <Input defaultValue="Asia/Kolkata (GMT+5:30)" className="h-10 bg-white/5 border-white/10 text-white font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Default Currency</label>
                          <Input defaultValue="USD / INR" className="h-10 bg-white/5 border-white/10 text-white font-bold" />
                        </div>
                      </div>
                      <Button onClick={() => toast.success("Organization Profile Saved!")} className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 mt-4 rounded-md">
                        Save Organization Profile
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Departments &amp; Branches Hierarchy</h3>
                    <div className="space-y-3">
                      {[
                        { dept: "Executive & Platform Admin", code: "EXEC", head: "Alex Rivera" },
                        { dept: "IT & Infrastructure", code: "IT-OPS", head: "Elena Rostova" },
                        { dept: "Cybersecurity & Compliance", code: "SEC-COMP", head: "David Miller" },
                        { dept: "Engineering & Product", code: "ENG-PROD", head: "Marcus Vance" }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="text-[9px] font-black uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">{item.code}</span>
                            <h4 className="font-bold text-white mt-1">{item.dept}</h4>
                            <p className="text-xs text-neutral-400 mt-0.5">Head: {item.head}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 3. USERS & DIRECTORY ══ */}
              {activeTab === "users" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Create User */}
                  <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Provision New User</h3>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Full Name</label>
                        <Input
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          placeholder="e.g. Rachel Adams"
                          className="h-10 bg-white/5 border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Email Address</label>
                        <Input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="rachel@growxlabs.tech"
                          className="h-10 bg-white/5 border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Role Assignment</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none"
                        >
                          <option value="Super Admin" className="bg-neutral-950">Super Admin</option>
                          <option value="IT Administrator" className="bg-neutral-950">IT Administrator</option>
                          <option value="Security Administrator" className="bg-neutral-950">Security Administrator</option>
                          <option value="Employee" className="bg-neutral-950">Employee</option>
                          <option value="Client" className="bg-neutral-950">Client</option>
                        </select>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 mt-2 rounded-md">
                        {loading ? "Provisioning..." : "Provision User Account"}
                      </Button>
                    </form>
                  </Card>

                  {/* Users Directory */}
                  <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">User Directory &amp; Activation Status</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b border-white/10 bg-white/5">
                          <tr>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">User Identity</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Role</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">Status</th>
                            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">MFA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-transparent">
                          {users.map((u) => (
                            <tr key={u.id} className="hover:bg-white/[0.01]">
                              <td className="px-5 py-4">
                                <span className="font-bold text-white block">{u.name}</span>
                                <span className="text-[10px] text-neutral-400">{u.email}</span>
                              </td>
                              <td className="px-5 py-4 text-xs font-bold text-neutral-200">{u.role}</td>
                              <td className="px-5 py-4">
                                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase">{u.status}</span>
                              </td>
                              <td className="px-5 py-4">
                                {u.mfa_enabled ? (
                                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><ShieldCheck size={14} /> Enabled</span>
                                ) : (
                                  <span className="text-xs font-bold text-neutral-500">Disabled</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 4. RBAC PERMISSION MATRIX ══ */}
              {activeTab === "rbac" && rbacData && (
                <div className="space-y-8">
                  {/* Roles & Custom Role Creator */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Create Custom Role</h3>
                      <form onSubmit={handleCreateRole} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Role Title</label>
                          <Input
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="e.g. Audit Inspector"
                            className="h-10 bg-white/5 border-white/10"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Description</label>
                          <Input
                            value={newRoleDesc}
                            onChange={(e) => setNewRoleDesc(e.target.value)}
                            placeholder="Read-only access to audit logs and security metrics..."
                            className="h-10 bg-white/5 border-white/10"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 mt-2 rounded-md">
                          Add Role to Matrix
                        </Button>
                      </form>
                    </Card>

                    {/* Roles Matrix Grid */}
                    <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10">
                      <h3 className="text-base font-bold text-white mb-6">Cross-Module RBAC Permission Matrix</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                          <thead className="border-b border-white/10 bg-white/5">
                            <tr>
                              <th className="px-4 py-3 text-neutral-400 uppercase">Module</th>
                              <th className="px-4 py-3 text-neutral-400 uppercase text-center">Create</th>
                              <th className="px-4 py-3 text-neutral-400 uppercase text-center">Read</th>
                              <th className="px-4 py-3 text-neutral-400 uppercase text-center">Update</th>
                              <th className="px-4 py-3 text-neutral-400 uppercase text-center">Delete</th>
                              <th className="px-4 py-3 text-neutral-400 uppercase text-center">Export</th>
                              <th className="px-4 py-3 text-neutral-400 uppercase text-center">Approve</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {rbacData.modules.map((mod: string) => (
                              <tr key={mod} className="hover:bg-white/[0.01]">
                                <td className="px-4 py-3 font-bold text-white">{mod} Module</td>
                                <td className="px-4 py-3 text-center"><CheckCircle size={14} className="mx-auto text-emerald-400" /></td>
                                <td className="px-4 py-3 text-center"><CheckCircle size={14} className="mx-auto text-emerald-400" /></td>
                                <td className="px-4 py-3 text-center"><CheckCircle size={14} className="mx-auto text-emerald-400" /></td>
                                <td className="px-4 py-3 text-center"><CheckCircle size={14} className="mx-auto text-emerald-400" /></td>
                                <td className="px-4 py-3 text-center"><CheckCircle size={14} className="mx-auto text-emerald-400" /></td>
                                <td className="px-4 py-3 text-center"><CheckCircle size={14} className="mx-auto text-emerald-400" /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* ══ 5. SSO & AUTHENTICATION TAB ══ */}
              {activeTab === "auth_sso" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">SSO &amp; OAuth 2.0 Client Setup</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-white text-sm">Google Workspace OAuth</h4>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">Active</span>
                        </div>
                        <p className="text-xs text-neutral-400">Client ID: 48592019482-growx.apps.googleusercontent.com</p>
                      </div>

                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-white text-sm">Microsoft Entra ID (Azure AD) SAML 2.0</h4>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">Active</span>
                        </div>
                        <p className="text-xs text-neutral-400">Entity ID: https://login.microsoftonline.com/growxlabs-tenant</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Security &amp; Password Policies</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3.5 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-xs font-bold text-neutral-300">Min Password Length</span>
                        <span className="text-xs font-extrabold text-white">12 Characters</span>
                      </div>
                      <div className="flex justify-between items-center p-3.5 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-xs font-bold text-neutral-300">Mandatory MFA Enforced</span>
                        <span className="text-xs font-extrabold text-emerald-400">All Admins</span>
                      </div>
                      <div className="flex justify-between items-center p-3.5 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-xs font-bold text-neutral-300">Session Inactivity Timeout</span>
                        <span className="text-xs font-extrabold text-white">30 Minutes</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 6. SECURITY & THREAT CENTER TAB ══ */}
              {activeTab === "security" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Security Threat Alerts */}
                  <Card className="xl:col-span-2 p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Security Threat Detection Feed</h3>
                    <div className="space-y-4">
                      {securityEvents.map((evt) => (
                        <div key={evt.id} className={`p-5 rounded-2xl border ${evt.is_resolved ? "bg-white/[0.01] border-white/5" : "bg-amber-500/5 border-amber-500/20"}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-widest ${
                                evt.severity === "High" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              }`}>{evt.event_type}</span>
                              <h4 className="font-bold text-white text-sm mt-2">{evt.description}</h4>
                            </div>
                            <span className="text-xs text-neutral-500">{new Date(evt.created_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Active Sessions Inspector */}
                  <Card className="xl:col-span-1 p-6 bg-white/[0.02] border-white/10 h-fit">
                    <h3 className="text-base font-bold text-white mb-6">Active Session Inspector</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-white">Current Admin Session</span>
                          <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">THIS DEVICE</span>
                        </div>
                        <p className="text-[10px] text-neutral-400">IP: 127.0.0.1 · Chrome on Windows</p>
                      </div>
                      <Button onClick={() => toast.success("Revoked all secondary active sessions!")} variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 h-9 text-xs">
                        Revoke All Other Sessions
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 7. AUDIT LOGS TAB ══ */}
              {activeTab === "audit_logs" && (
                <Card className="p-6 bg-white/[0.02] border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-white">Immutable Platform Audit Trail</h3>
                    <Button onClick={() => toast.success("Audit log CSV export started...")} size="sm" className="bg-white/5 border border-white/10 text-neutral-300">
                      <Download size={14} className="mr-1.5" /> Export Audit Log
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="border-b border-white/10 bg-white/5">
                        <tr>
                          <th className="px-4 py-3 text-neutral-400 uppercase">Timestamp</th>
                          <th className="px-4 py-3 text-neutral-400 uppercase">User Email</th>
                          <th className="px-4 py-3 text-neutral-400 uppercase">Action</th>
                          <th className="px-4 py-3 text-neutral-400 uppercase">Module</th>
                          <th className="px-4 py-3 text-neutral-400 uppercase">Entity Target</th>
                          <th className="px-4 py-3 text-neutral-400 uppercase">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-white/[0.01]">
                            <td className="px-4 py-3 text-neutral-400">{new Date(log.created_at).toLocaleString()}</td>
                            <td className="px-4 py-3 font-bold text-white">{log.user_email}</td>
                            <td className="px-4 py-3 font-extrabold text-blue-400">{log.action}</td>
                            <td className="px-4 py-3 font-bold text-neutral-300">{log.module}</td>
                            <td className="px-4 py-3 text-neutral-300">{log.entity_name}</td>
                            <td className="px-4 py-3 text-neutral-500">{log.ip_address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* ══ 8. APIS & WEBHOOKS TAB ══ */}
              {activeTab === "api_webhooks" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* API Keys Manager */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">API Keys Management</h3>
                    <form onSubmit={handleCreateApiKey} className="flex gap-2 mb-6">
                      <Input
                        value={newApiKeyName}
                        onChange={(e) => setNewApiKeyName(e.target.value)}
                        placeholder="Key Name e.g. Production Webhook"
                        className="h-10 bg-white/5 border-white/10"
                      />
                      <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 px-5 shrink-0">
                        Generate Key
                      </Button>
                    </form>

                    <div className="space-y-3">
                      {apiKeys.map((k) => (
                        <div key={k.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-white text-sm">{k.key_name}</h4>
                            <p className="text-xs font-mono text-neutral-400 mt-0.5">{k.key_prefix}</p>
                          </div>
                          <span className="text-xs font-bold text-emerald-400">Active</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Webhooks Config */}
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Subscribed Webhooks</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                        <h4 className="font-bold text-white text-sm">CRM Lead Qualification Event Webhook</h4>
                        <p className="text-xs text-neutral-400 mt-1">URL: https://growxlabs.tech/api/webhooks/crm-lead</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ 9. INTEGRATIONS HUB TAB ══ */}
              {activeTab === "integrations" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {integrations.map((item) => (
                    <Card key={item.id} className="p-5 bg-white/[0.02] border-white/10 flex flex-col justify-between">
                      <div>
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase">{item.category}</span>
                        <h4 className="font-bold text-white text-base mt-2">{item.provider_name}</h4>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
                        <span className="text-xs font-bold text-emerald-400">{item.status}</span>
                        <Button size="sm" variant="outline" className="h-8 border-white/10 text-xs">Configure</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* ══ 10. FEATURE FLAGS TAB ══ */}
              {activeTab === "feature_flags" && (
                <Card className="p-6 bg-white/[0.02] border-white/10">
                  <h3 className="text-base font-bold text-white mb-6">Platform Feature Flags &amp; Environment Toggles</h3>
                  <div className="space-y-4">
                    {featureFlags.map((flag) => (
                      <div key={flag.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-blue-400">{flag.flag_key}</span>
                            <span className="px-2 py-0.5 bg-neutral-900 border border-white/10 text-[9px] font-bold text-neutral-400 uppercase">{flag.environment}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">{flag.description}</p>
                        </div>
                        
                        <button
                          onClick={() => handleToggleFlag(flag.flag_key, flag.is_enabled)}
                          className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${flag.is_enabled ? "bg-emerald-500" : "bg-neutral-800"}`}
                        >
                          <div className={`h-4 w-4 rounded-full bg-white transition-transform ${flag.is_enabled ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ══ 11. AI ADMIN ASSISTANT TAB ══ */}
              {activeTab === "ai_admin" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="p-6 bg-white/[0.02] border-white/10">
                    <h3 className="text-base font-bold text-white mb-6">Gemini Governance &amp; Threat Intelligence</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">AI Admin Task</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "analyze-threats", label: "Analyze Threat Logs" },
                            { id: "audit-anomaly", label: "Audit Anomalies" },
                            { id: "recommend-permissions", label: "RBAC Generator" },
                            { id: "system-health", label: "System Health AI" }
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
                        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">Custom Governance Prompt</label>
                        <textarea
                          value={aiInputText}
                          onChange={(e) => setAiInputText(e.target.value)}
                          placeholder="Instructions or log data for AI inspection..."
                          className="w-full h-32 p-3 bg-white/5 border border-white/10 rounded-md text-sm text-white focus:outline-none"
                        />
                      </div>

                      <Button
                        onClick={runAIAdminAnalysis}
                        disabled={aiLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 rounded-md"
                      >
                        {aiLoading ? "Executing AI Inspection..." : "Run AI Governance Copilot"}
                      </Button>
                    </div>
                  </Card>

                  {/* AI Results */}
                  <Card className="p-6 bg-white/[0.02] border-white/10 min-h-[400px]">
                    <h3 className="text-base font-bold text-white mb-6">AI Threat Intelligence Output</h3>
                    
                    {aiOutput ? (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {aiType === "analyze-threats" && (
                          <div className="space-y-3">
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl">
                              <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Threat Level &amp; Risk Score</p>
                              <span className="text-base font-black text-amber-400">{aiOutput.threatLevel} (Risk Score: {aiOutput.riskScore})</span>
                            </div>
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-xs space-y-2">
                              <p className="font-bold text-white">Findings:</p>
                              {aiOutput.findings?.map((f: string, i: number) => (
                                <p key={i} className="text-neutral-300">• {f}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiType === "audit-anomaly" && (
                          <div className="space-y-3">
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-xs">
                              <p className="font-bold text-white mb-1">Detected Policy Breaches:</p>
                              {aiOutput.policyBreaches?.map((b: string, i: number) => (
                                <p key={i} className="text-amber-300">• {b}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiType === "recommend-permissions" && (
                          <div className="space-y-3">
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl text-xs">
                              <p className="font-bold text-white mb-2">Recommended RBAC Permissions for {aiOutput.recommendedRoleName}:</p>
                              {aiOutput.permissionsMatrix?.map((pm: any, i: number) => (
                                <p key={i} className="text-neutral-300">• {pm.module} Module ({pm.action}): {pm.granted ? "GRANTED" : "DENIED"}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiType === "system-health" && (
                          <div className="space-y-3">
                            <div className="bg-black/10 border border-white/5 p-4 rounded-xl">
                              <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">System Health Rating</p>
                              <p className="text-2xl font-black text-emerald-400">{aiOutput.overallHealthScore}% ({aiOutput.performanceRating})</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 text-neutral-500">
                        <Sparkles size={28} className="text-neutral-600 mb-4" />
                        <p className="font-bold">AI Threat Intelligence Standby</p>
                        <p className="text-xs max-w-xs mt-1">Run threat inspection, audit log anomaly scans, or RBAC generation.</p>
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
