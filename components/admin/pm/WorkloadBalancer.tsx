"use client";

import React from "react";
import { Users } from "lucide-react";
import { Avatar, Badge, DataTable, type DataTableColumn } from "@/src/components/ui";
import { EmptyState } from "@/src/components/patterns";
import { ProgressMeter } from "./ProgressMeter";

export interface TeamWorkload {
  id: string;
  name: string;
  email: string;
  open_tasks: number;
  open_points: number;
  in_progress: number;
  blocked: number;
  done_tasks: number;
  projects: string[];
}

interface WorkloadBalancerProps {
  workloads: TeamWorkload[];
  loading?: boolean;
}

export function WorkloadBalancer({ workloads, loading }: WorkloadBalancerProps) {
  const teamPoints = workloads.reduce((s, w) => s + w.open_points, 0);

  const columns: DataTableColumn<TeamWorkload>[] = [
    {
      id: "member",
      header: "Team member",
      width: "26%",
      sortValue: (w) => w.name,
      cell: (w) => (
        <span className="flex min-w-0 items-center gap-3">
          <Avatar name={w.name} size={28} />
          <span className="flex min-w-0 flex-col">
            <span className="ds-t-body-strong truncate text-[var(--text-primary)]">{w.name}</span>
            <span className="ds-t-meta truncate text-[var(--text-muted)]">{w.email || "No email"}</span>
          </span>
        </span>
      ),
    },
    {
      id: "open_tasks",
      header: "Open tasks",
      numeric: true,
      sortValue: (w) => w.open_tasks,
      cell: (w) => w.open_tasks ? <span className="text-[var(--text-primary)]">{w.open_tasks}</span> : <Badge variant="neutral" noDot>No open tasks</Badge>,
    },
    { id: "open_points", header: "Open points", numeric: true, sortValue: (w) => w.open_points, cell: (w) => `${w.open_points} SP` },
    {
      id: "share",
      header: "Share of team points",
      sortValue: (w) => w.open_points,
      cell: (w) => <ProgressMeter value={teamPoints ? (w.open_points / teamPoints) * 100 : 0} barClassName="w-24" />,
    },
    { id: "in_progress", header: "In progress", numeric: true, sortValue: (w) => w.in_progress, cell: (w) => w.in_progress },
    {
      id: "blocked",
      header: "Blocked",
      numeric: true,
      sortValue: (w) => w.blocked,
      cell: (w) => w.blocked ? <span className="text-[var(--danger)]">{w.blocked}</span> : <span className="text-[var(--text-muted)]">0</span>,
    },
    {
      id: "projects",
      header: "Projects",
      sortValue: (w) => w.projects.length,
      cell: (w) => w.projects.length
        ? <span className="ds-t-meta truncate text-[var(--text-secondary)]" title={w.projects.join(", ")}>{w.projects.join(", ")}</span>
        : <span className="text-[var(--text-disabled)]">None</span>,
    },
  ];

  return (
    <DataTable
      label="Team workload"
      columns={columns}
      rows={workloads}
      getRowId={(w) => w.id}
      loading={loading}
      skeletonRows={5}
      emptyState={<EmptyState icon={<Users size={24} strokeWidth={1.5} />} title="No active team members" description="Active workspace employees appear here with the tasks assigned to them." />}
    />
  );
}
