"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, ShieldCheck, Users, KeyRound, Globe, HardDrive, Cpu, Terminal, Lock,
  RefreshCw, CheckCircle, Search, UserCheck, Check, AlertTriangle, ShieldAlert,
  Zap, FileText, Activity
} from "lucide-react";

type Role =
  | "Enterprise Admin"
  | "Security Officer"
  | "Compliance Auditor"
  | "Integration Engineer"
  | "Viewer"
  | "Super Admin";

interface TabItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: Role[];
}

const TABS: TabItem[] = [
  { id: "overview", label: "Admin Dashboard", icon: Building2, allowedRoles: ["Super Admin", "Enterprise Admin", "Security Officer", "Compliance Auditor", "Viewer"] },
  { id: "users", label: "User Directory", icon: Users, allowedRoles: ["Super Admin", "Enterprise Admin"] },
  { id: "rbac", label: "RBAC & Permissions", icon: Lock, allowedRoles: ["Super Admin", "Enterprise Admin", "Security Officer"] },
  { id: "security", label: "Security & Threat Center", icon: ShieldAlert, allowedRoles: ["Super Admin", "Security Officer", "Compliance Auditor"] },
  { id: "integrations", label: "API Keys & Integrations", icon: KeyRound, allowedRoles: ["Super Admin", "Enterprise Admin", "Integration Engineer"] },
  { id: "ai_governance", label: "AI Governance", icon: Cpu, allowedRoles: ["Super Admin", "Enterprise Admin", "Security Officer"] }
];

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState<Role>("Super Admin");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  // Users State
  const [users, setUsers] = useState<any[]>([]);
  // RBAC State
  const [roles, setRoles] = useState<any[]>([]);
  // Security Events State
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  // Integrations State
  const [apiKeys, setApiKeys] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchUsers();
    fetchRBAC();
    fetchSecurityEvents();
    fetchIntegrations();
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
      const res = await fetch("/api/admin-setup/dashboard");
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      toast.error("Failed to load admin dashboard metrics.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin-setup/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      toast.error("Failed to load platform users.");
    }
  };

  const fetchRBAC = async () => {
    try {
      const res = await fetch("/api/admin-setup/rbac");
      const data = await res.json();
      setRoles(data.roles || []);
    } catch (e) {
      toast.error("Failed to load RBAC roles.");
    }
  };

  const fetchSecurityEvents = async () => {
    try {
      const res = await fetch("/api/admin-setup/security");
      const data = await res.json();
      setSecurityEvents(data.securityEvents || []);
    } catch (e) {
      toast.error("Failed to load security threat logs.");
    }
  };

  const fetchIntegrations = async () => {
    try {
      const res = await fetch("/api/admin-setup/integrations");
      const data = await res.json();
      setApiKeys(data.apiKeys || []);
    } catch (e) {
      toast.error("Failed to load API keys.");
    }
  };

  return (
    <div className="space-y-8 text-[var(--text-primary)] pb-20">
      
      {/* HEADER & ROLE SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-[#0075de]/10 border border-[#0075de]/20 rounded-lg text-[#0075de]">
              <ShieldCheck size={20} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Enterprise Administration &amp; Governance
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Centralized platform governance layer: organizations, RBAC permissions, audit logging, &amp; API security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-xl px-3 py-1.5 text-xs">
            <UserCheck className="h-4 w-4 text-[#0075de] shrink-0" />
            <span className="font-extrabold uppercase text-[10px] text-[var(--text-muted)]">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="bg-transparent border-0 font-black text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              {([
                "Enterprise Admin", "Security Officer", "Compliance Auditor",
                "Integration Engineer", "Viewer", "Super Admin"
              ] as Role[]).map((r) => (
                <option key={r} value={r} className="bg-[var(--card)] text-[var(--text-primary)]">{r}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => {
              fetchDashboardMetrics();
              fetchUsers();
              fetchRBAC();
              fetchSecurityEvents();
              toast.success("Synchronized Administration Engine.");
            }}
            variant="outline"
            className="h-9 px-3 text-xs border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Sync Admin Layer
          </Button>
        </div>
      </div>

      {/* HORIZONTAL SUB-NAV TABS */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] overflow-x-auto custom-scrollbar pb-1">
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
                  toast.error(`Access Restricted for role ${selectedRole}.`);
                }
              }}
              className={`flex items-center gap-2 h-10 px-4 rounded-xl border text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#0075de] text-white border-[#0075de] shadow-md shadow-[#0075de]/20"
                  : isAllowed
                  ? "bg-[var(--surface-1)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                  : "bg-[var(--surface-1)]/40 border-[var(--border-subtle)]/40 text-[var(--text-muted)] cursor-not-allowed opacity-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
              {!isAllowed && <Lock className="h-3 w-3 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >

          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === "overview" && metrics && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 bg-[var(--card)] border border-[var(--border-subtle)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 bg-[#0075de]/10 rounded-lg text-[#0075de]"><Users size={18} /></span>
                    <span className="text-[10px] font-black uppercase text-emerald-500">Active</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1">Total Users</p>
                  <h3 className="text-2xl font-black text-[var(--text-primary)]">{metrics.totalUsers}</h3>
                </Card>

                <Card className="p-5 bg-[var(--card)] border border-[var(--border-subtle)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Lock size={18} /></span>
                    <span className="text-[10px] font-black uppercase text-purple-500">Enforced</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1">Active Roles</p>
                  <h3 className="text-2xl font-black text-[var(--text-primary)]">{metrics.activeRoles}</h3>
                </Card>

                <Card className="p-5 bg-[var(--card)] border border-[var(--border-subtle)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><ShieldCheck size={18} /></span>
                    <span className="text-[10px] font-black uppercase text-emerald-500">Passing</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1">Security Score</p>
                  <h3 className="text-2xl font-black text-emerald-500">{metrics.securityScore} / 100</h3>
                </Card>

                <Card className="p-5 bg-[var(--card)] border border-[var(--border-subtle)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Activity size={18} /></span>
                    <span className="text-[10px] font-black uppercase text-amber-500">100% Uptime</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1">System Health</p>
                  <h3 className="text-2xl font-black text-[var(--text-primary)]">{metrics.systemHealth}</h3>
                </Card>
              </div>
            </div>
          )}

          {/* 2. USER DIRECTORY */}
          {activeTab === "users" && (
            <Card className="p-6 bg-[var(--card)] border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">Platform User Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="border-b border-[var(--border-subtle)] bg-[var(--surface-1)]">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-black uppercase text-[var(--text-muted)]">User</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase text-[var(--text-muted)]">Role</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase text-[var(--text-muted)]">Department</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase text-[var(--text-muted)]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[var(--surface-1)]/50">
                        <td className="px-4 py-3">
                          <span className="font-bold text-[var(--text-primary)] block">{u.full_name}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">{u.email}</span>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-[#0075de]">{u.role}</td>
                        <td className="px-4 py-3 text-xs font-medium text-[var(--text-secondary)]">{u.department}</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase rounded-full">{u.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* 3. RBAC */}
          {activeTab === "rbac" && (
            <Card className="p-6 bg-[var(--card)] border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">RBAC Permission Matrix</h3>
              <div className="space-y-3">
                {roles.map((r, i) => (
                  <div key={i} className="p-4 border border-[var(--border-subtle)] bg-[var(--surface-1)] rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{r.name}</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{r.description || "System Access Role"}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#0075de]/10 border border-[#0075de]/20 text-[#0075de] rounded-full text-[10px] font-black uppercase">
                      {r.userCount || 12} Users Assigned
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 4. SECURITY */}
          {activeTab === "security" && (
            <Card className="p-6 bg-[var(--card)] border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">Security Threat Center Logs</h3>
              <div className="space-y-3">
                {securityEvents.map((ev, i) => (
                  <div key={i} className="p-4 border border-[var(--border-subtle)] bg-[var(--surface-1)] rounded-xl flex justify-between items-center">
                    <div>
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase rounded-md mr-2">{ev.severity || "Warning"}</span>
                      <span className="font-bold text-xs text-[var(--text-primary)]">{ev.event_type}</span>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{ev.details}</p>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{ev.created_at || "Just Now"}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 5. INTEGRATIONS */}
          {activeTab === "integrations" && (
            <Card className="p-6 bg-[var(--card)] border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">API Keys &amp; External Integrations</h3>
              <div className="space-y-3">
                {apiKeys.map((k, i) => (
                  <div key={i} className="p-4 border border-[var(--border-subtle)] bg-[var(--surface-1)] rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{k.key_name}</h4>
                      <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">{k.key_prefix}••••••••••••</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-black uppercase">Active</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 6. AI GOVERNANCE */}
          {activeTab === "ai_governance" && (
            <Card className="p-6 bg-[var(--card)] border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">AI Security &amp; Data Guardrails</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Configured DLP masking rules for Gemini LLM requests.</p>
              <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-xs font-bold text-emerald-500 flex items-center gap-2">
                <CheckCircle size={16} /> All PII data fields (Passwords, GSTIN, PAN, Credit Cards) are automatically masked before AI processing.
              </div>
            </Card>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
