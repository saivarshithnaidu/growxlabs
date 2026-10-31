"use client";

import React, { useState, useEffect } from "react";
import { WorkloadBalancer, type TeamWorkload } from "@/components/admin/pm/WorkloadBalancer";
import { Alert, KPIItem, KPIStrip } from "@/src/components/ui";
import { ErrorState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

export default function WorkloadPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [workloads, setWorkloads] = useState<TeamWorkload[]>([]);
  const [unassigned, setUnassigned] = useState(0);
  const [unmatched, setUnmatched] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const fetchWorkloads = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/pm/workload");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load workload.");
      setWorkloads(data.members || []);
      setUnassigned(data.unassignedOpen || 0);
      setUnmatched(data.unmatchedOpen || 0);
    } catch (e: any) {
      setError(e.message || "Failed to load workload.");
    } finally {
      setLoading(false);
    }
  };

  const openTasks = workloads.reduce((s, w) => s + w.open_tasks, 0);
  const blocked = workloads.reduce((s, w) => s + w.blocked, 0);
  const withoutWork = workloads.filter((w) => w.open_tasks === 0).length;

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader
        title="Workload"
        breadcrumb={breadcrumb}
        info="Open tasks and story points assigned to each active team member across delivery projects."
      />

      {error ? (
        <ErrorState title="Couldn't load workload" description={error} onRetry={fetchWorkloads} />
      ) : (
        <div className="flex flex-col gap-6">
          <KPIStrip>
            <KPIItem label="Assigned open tasks" loading={loading} value={<span className="ds-num">{openTasks}</span>} />
            <KPIItem label="Unassigned open tasks" loading={loading} value={<span className="ds-num">{unassigned}</span>} />
            <KPIItem label="Blocked" loading={loading} value={<span className="ds-num">{blocked}</span>} />
            <KPIItem label="Members with no open tasks" loading={loading} value={<span className="ds-num">{withoutWork} of {workloads.length}</span>} />
          </KPIStrip>

          {!loading && unmatched > 0 && (
            <Alert variant="warning" title={`${unmatched} open ${unmatched === 1 ? "task is" : "tasks are"} assigned to someone not on the team`}>
              The assignee name doesn&apos;t match an active team member, so those tasks aren&apos;t counted below.
            </Alert>
          )}

          <WorkloadBalancer workloads={workloads} loading={loading} />

          <p className="ds-t-meta text-[var(--text-muted)]">
            Hours and capacity aren&apos;t tracked yet, so this page shows assigned work only.
          </p>
        </div>
      )}
    </div>
  );
}
