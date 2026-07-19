"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, ShieldCheck, Users, KeyRound, Globe, HardDrive, Cpu, Terminal, Lock,
  RefreshCw, CheckCircle, Search, UserCheck, Check, AlertTriangle
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
  { id: "users", label: "User Management", icon: Users, allowedRoles: ["Super Admin", "Enterprise Admin"] },
  { id: "rbac", label: "RBAC & Permissions", icon: Lock, allowedRoles: ["Super Admin", "Enterprise Admin", "Security Officer"] },
  { id: "security", label: "Security & Threat Center", icon: ShieldCheck, allowedRoles: ["Super Admin", "Security Officer", "Compliance Auditor"] },
  { id: "integrations", label: "API Keys & Integrations", icon: KeyRound, allowedRoles: ["Super Admin", "Enterprise Admin", "Integration Engineer"] },
  { id: "ai_governance", label: "AI Security Governance", icon: Cpu, allowedRoles: ["Super Admin", "Enterprise Admin", "Security Officer"] }
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
            Centralized platform control layer: multi-tenant organizations, users, RBAC matrix, threat monitoring, API keys, &amp; compliance logs.
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
                "Enterprise Admin", "Security Officer", "Compliance Auditor",
                "Integration Engineer", "Viewer", "Super Admin"
              ] as Role[]).map((r) => (
                <option key={r} value={r} className="bg-neutral-950 text-white">{r}</option>
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
            className="h-10 px-4 bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Sync Admin Layer
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
                    <Card className="bg-white/[0.02] border-white/10 p-6">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Total Platform Users</p>
                      <h3 className="text-3xl font-black text-white">{metrics.totalUsers}</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 p-6">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Active RBAC Roles</p>
                      <h3 className="text-3xl font-black text-blue-400">{metrics.activeRoles}</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 p-6">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Security Score</p>
                      <h3 className="text-3xl font-black text-emerald-400">{metrics.securityScore} / 100</h3>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/10 p-6">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">System Health</p>
                      <h3 className="text-3xl font-black text-purple-400">{metrics.systemHealth}</h3>
                    </Card>
                  </div>
                </div>
              )}

              {/* ══ 2. USERS TAB ══ */}
              {activeTab === "users" && (
                <Card className="p-6 bg-white/[0.02] border-white/10">
                  <h3 className="text-base font-bold text-white mb-6">Registered Platform Users</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="border-b border-white/10 bg-white/5">
                        <tr>
                          <th className="px-5 py-3 text-[10px] font-black uppercase text-neutral-400">User</th>
                          <th className="px-5 py-3 text-[10px] font-black uppercase text-neutral-400">Role</th>
                          <th className="px-5 py-3 text-[10px] font-black uppercase text-neutral-400">Department</th>
                          <th className="px-5 py-3 text-[10px] font-black uppercase text-neutral-400">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-transparent">
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td className="px-5 py-4">
                              <span className="font-bold text-white block">{u.full_name}</span>
                              <span className="text-[10px] text-neutral-400">{u.email}</span>
                            </td>
                            <td className="px-5 py-4 text-xs font-bold text-blue-400">{u.role}</td>
                            <td className="px-5 py-4 text-xs font-bold text-neutral-300">{u.department}</td>
                            <td className="px-5 py-4">
                              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase rounded-full">{u.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
