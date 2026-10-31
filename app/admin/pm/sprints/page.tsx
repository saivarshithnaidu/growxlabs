"use client";

import React, { useState, useEffect } from "react";
import { SprintManager } from "@/components/admin/pm/SprintManager";
import { Skeleton, toast } from "@/src/components/ui";
import { ErrorState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

export default function SprintsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/pm/sprints");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load sprints.");
      setSprints(data.sprints || []);
    } catch (e: any) {
      setError(e.message || "Failed to load sprints.");
    } finally {
      setLoading(false);
    }
  };

  const updateSprint = async (sprintId: string, action: "start" | "complete") => {
    setBusyId(sprintId);
    try {
      const res = await fetch("/api/pm/sprints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sprintId, action })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed to ${action} sprint.`);
      toast({ title: action === "start" ? "Sprint started" : "Sprint completed", variant: "success" });
      await fetchSprints();
    } catch (e: any) {
      toast({ title: e.message, variant: "danger" });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader title="Sprints" breadcrumb={breadcrumb} info="The active sprint's progress, upcoming sprints to start, and what past sprints delivered." />

      {error ? (
        <ErrorState title="Couldn't load sprints" description={error} onRetry={fetchSprints} />
      ) : loading ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" aria-busy="true">
          <Skeleton height={280} radius="md" />
          <Skeleton height={200} radius="md" />
        </div>
      ) : (
        <SprintManager
          sprints={sprints}
          busyId={busyId}
          onStartSprint={(id) => updateSprint(id, "start")}
          onCompleteSprint={(id) => updateSprint(id, "complete")}
        />
      )}
    </div>
  );
}
