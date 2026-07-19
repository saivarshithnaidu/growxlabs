"use client";

import React from "react";
import { Users, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface TeamWorkload {
  team_member_id: string;
  name: string;
  email: string;
  assigned_hours: number;
  capacity_hours: number;
  tasks_count: number;
}

interface WorkloadBalancerProps {
  workloads: TeamWorkload[];
}

export function WorkloadBalancer({ workloads }: WorkloadBalancerProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3.5 mb-6 flex items-center gap-2">
          <Users size={16} className="text-[#0075de]" /> Team Resource Workload Balancing
        </h3>

        {workloads.length === 0 ? (
          <div className="text-center py-12 text-xs font-semibold text-neutral-400">No member allocations found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {workloads.map((member) => {
              const allocationPercent = Math.round((member.assigned_hours / member.capacity_hours) * 100);
              const isOverloaded = member.assigned_hours > member.capacity_hours;
              const isIdle = member.assigned_hours === 0;

              return (
                <div 
                  key={member.team_member_id} 
                  className={cn(
                    "border p-5 rounded-md flex flex-col justify-between gap-4 transition-all hover:shadow-md bg-white",
                    isOverloaded 
                      ? "border-red-200 bg-red-500/[0.01]" 
                      : isIdle 
                        ? "border-[#e6e6e6]/60 bg-neutral-50/[0.1]" 
                        : "border-[#e6e6e6] hover:border-[#0075de]/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-snug">{member.name}</h4>
                      <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">{member.email}</span>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                      {isOverloaded ? (
                        <span className="text-red-500 bg-red-500/5 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                          <AlertTriangle size={10} /> Overloaded
                        </span>
                      ) : isIdle ? (
                        <span className="text-neutral-450 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300 flex items-center gap-1">
                          <AlertCircle size={10} /> Idle
                        </span>
                      ) : (
                        <span className="text-green-600 bg-green-500/5 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                          <CheckCircle size={10} /> Balanced
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-neutral-400 uppercase tracking-wider">Capacity Allocations</span>
                      <span className="text-neutral-900 font-bold">{member.assigned_hours} hrs / {member.capacity_hours} hrs ({allocationPercent}%)</span>
                    </div>

                    <div className="h-2.5 w-full bg-[#f6f5f4] rounded-full overflow-hidden border border-[#e6e6e6]/50">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          isOverloaded ? "bg-red-500" : isIdle ? "bg-neutral-300" : "bg-[#0075de]"
                        )}
                        style={{ width: `${Math.min(100, allocationPercent)}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#e6e6e6]/60 pt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                    <span>Tasks Assigned:</span>
                    <span className="text-neutral-800 font-mono font-bold">{member.tasks_count} tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
