"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Zap } from "lucide-react";
import { SprintManager } from "@/components/admin/pm/SprintManager";

export default function SprintsPage() {
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pm/sprints");
      const data = await res.json();
      setSprints(data.sprints || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSprint = async (sprintId: string) => {
    try {
      // Simulate patch to start sprint
      alert("Sprint started!");
      fetchSprints();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none flex items-center gap-2">
          <Zap size={28} className="text-[#0075de]" /> Sprint Dashboard
        </h1>
        <p className="text-neutral-500 text-xs">Agile sprints trackers, velocity capacities, and team burn-downs.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <SprintManager 
          sprints={sprints}
          onStartSprint={handleStartSprint}
        />
      )}
    </div>
  );
}
