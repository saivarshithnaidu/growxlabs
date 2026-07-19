"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { WorkloadBalancer } from "@/components/admin/pm/WorkloadBalancer";

export default function WorkloadPage() {
  const [workloads, setWorkloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const fetchWorkloads = async () => {
    try {
      setLoading(true);
      // Simulate/aggregate team members capacity logs
      const membersRes = await fetch("/api/contacts"); // Use contacts or team endpoint
      const membersData = await membersRes.json();
      
      const mockWorkloads = (membersData.contacts || []).map((m: any, idx: number) => ({
        team_member_id: m.id,
        name: `${m.first_name} ${m.last_name || ""}`,
        email: m.email,
        assigned_hours: idx === 0 ? 48 : idx === 1 ? 0 : 35, // Simulate overload/idle/balanced states
        capacity_hours: 40,
        tasks_count: idx === 0 ? 8 : idx === 1 ? 0 : 5
      }));
      setWorkloads(mockWorkloads);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Workload Metrics</h1>
        <p className="text-neutral-500 text-xs">Verify resource workloads allocations, idle developers, and capacity thresholds.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <WorkloadBalancer workloads={workloads} />
      )}
    </div>
  );
}
