"use client";

import { ReactNode } from "react";
import { RefreshCw, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  selectedRole?: string;
  onRoleChange?: (role: string) => void;
  onRefresh?: () => void;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  badge = "Live Platform",
  selectedRole,
  onRoleChange,
  onRefresh,
  actions
}: PageHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-8 text-white">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{title}</h1>
          {badge && (
            <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <p className="text-neutral-400 text-sm">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {selectedRole && onRoleChange && (
          <div className="flex items-center gap-2.5 bg-neutral-900 border border-white/10 rounded-xl px-4 py-2">
            <UserCheck className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Clearance:</span>
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="bg-transparent border-0 text-white font-extrabold text-[12px] uppercase tracking-wide focus:outline-none cursor-pointer"
            >
              {[
                "Super Admin", "Organization Admin", "IT Administrator", "Security Administrator",
                "Compliance Officer", "Department Admin", "Manager", "Employee", "Client", "Viewer"
              ].map((r) => (
                <option key={r} value={r} className="bg-neutral-950 text-white">{r}</option>
              ))}
            </select>
          </div>
        )}

        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            className="h-10 px-4 bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Sync Module
          </Button>
        )}

        {actions}
      </div>
    </div>
  );
}
