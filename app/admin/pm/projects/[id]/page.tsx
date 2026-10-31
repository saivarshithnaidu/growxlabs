"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bug, CalendarDays, FileText, FolderKanban } from "lucide-react";
import { AgileKanban, type Task } from "@/components/admin/pm/AgileKanban";
import { ProgressMeter } from "@/components/admin/pm/ProgressMeter";
import {
  Badge, Button, Card, KPIItem, KPIStrip, Skeleton, Tabs, TabsList, TabsTrigger, Timeline, formatCurrency, type BadgeVariant,
} from "@/src/components/ui";
import { EmptyState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

interface PageProps {
  params: Promise<{ id: string }>;
}

type TabId = "board" | "milestones" | "bugs" | "documents" | "activity";
const TAB_IDS: TabId[] = ["board", "milestones", "bugs", "documents", "activity"];

const STATUS: Record<string, { label: string; variant: BadgeVariant }> = {
  ACTIVE: { label: "Active", variant: "info" },
  PLANNING: { label: "Planning", variant: "neutral" },
  COMPLETED: { label: "Completed", variant: "success" },
};
const HEALTH: Record<string, { label: string; variant: BadgeVariant }> = {
  ON_TRACK: { label: "On track", variant: "success" },
  AT_RISK: { label: "At risk", variant: "warning" },
  OFF_TRACK: { label: "Off track", variant: "danger" },
};

const humanize = (value?: string) => {
  if (!value) return "";
  const t = String(value).replaceAll("_", " ").toLowerCase().trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const formatDay = (value?: string) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

export default function ProjectDetailsPage({ params }: PageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const breadcrumb = useAdminBreadcrumb();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const tabParam = searchParams.get("tab") as TabId | null;
  const activeTab: TabId = tabParam && TAB_IDS.includes(tabParam) ? tabParam : "board";
  const setActiveTab = (tab: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (tab === "board") next.delete("tab"); else next.set("tab", tab);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pm/projects/${id}`);
      const resData = await res.json();
      setData(resData);
    } catch (e) {
      console.error("Failed to load project details:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/pm/tasks?id=${taskId}&project_id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const detailsRes = await fetch(`/api/pm/projects/${id}`);
        const detailsData = await detailsRes.json();
        setData(detailsData);
      }
    } catch (e) {
      console.error("Failed to move task:", e);
    }
  };

  const handleTaskCreate = async (newTask: any) => {
    try {
      const res = await fetch(`/api/pm/tasks?project_id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask,
          project_id: id
        })
      });
      if (res.ok) {
        const detailsRes = await fetch(`/api/pm/projects/${id}`);
        const detailsData = await detailsRes.json();
        setData(detailsData);
      }
    } catch (e) {
      console.error("Failed to create task:", e);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1600px]" aria-busy="true">
        <Skeleton width={200} height={12} />
        <Skeleton width={360} height={28} className="mt-3" />
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={76} radius="md" />)}
        </div>
        <Skeleton height={420} radius="md" className="mt-6" />
      </div>
    );
  }

  if (!data || !data.project) {
    return (
      <EmptyState
        size="page"
        icon={<FolderKanban size={24} strokeWidth={1.5} />}
        title="Project not found"
        description="It may have been removed, or the link is wrong."
        action={<Button asChild variant="primary"><Link href="/admin/pm/projects">Back to projects</Link></Button>}
      />
    );
  }

  const { project, milestones, tasks, bugs, documents, activityLogs } = data;
  const taskList: Task[] = tasks || [];
  const doneTasks = taskList.filter((t) => t.status === "DONE").length;
  const totalPoints = taskList.reduce((s, t) => s + (Number(t.story_points) || 0), 0);
  const donePoints = taskList.filter((t) => t.status === "DONE").reduce((s, t) => s + (Number(t.story_points) || 0), 0);
  const openBugs = (bugs || []).filter((b: any) => !["CLOSED", "RESOLVED", "DONE"].includes(String(b.status).toUpperCase())).length;
  const status = STATUS[project.status];
  const health = project.health ? HEALTH[project.health] : null;

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader title={project.name || project.title} breadcrumb={breadcrumb}>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="ds-t-body text-[var(--text-secondary)]">{project.company?.name || "No client"}</span>
          {status && <Badge variant={status.variant}>{status.label}</Badge>}
          {health && <Badge variant={health.variant}>{health.label}</Badge>}
        </div>
      </PageHeader>

      <KPIStrip>
        <KPIItem
          label="Progress"
          value={`${project.progress || 0}%`}
          hint={totalPoints > 0 ? `${donePoints} of ${totalPoints} story points done` : "No estimated tasks yet"}
        />
        <KPIItem label="Tasks done" value={<span className="ds-num">{doneTasks} / {taskList.length}</span>} />
        <KPIItem label="Open issues" value={<span className="ds-num">{openBugs}</span>} />
        <KPIItem label="Logged time" value={<span className="ds-num">{Number(project.actual_hours || 0).toFixed(1)} h</span>} />
        <KPIItem label="Budget" value={Number(project.budget) > 0 ? formatCurrency(project.budget, { compact: true }) : "Not set"} />
      </KPIStrip>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList aria-label="Project sections" className="mb-4">
          <TabsTrigger value="board" count={taskList.length}>Board</TabsTrigger>
          <TabsTrigger value="milestones" count={milestones?.length || 0}>Milestones</TabsTrigger>
          <TabsTrigger value="bugs" count={bugs?.length || 0}>Issues</TabsTrigger>
          <TabsTrigger value="documents" count={documents?.length || 0}>Documents</TabsTrigger>
          <TabsTrigger value="activity" count={activityLogs?.length || 0}>Activity</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "board" && (
        <AgileKanban
          initialTasks={taskList}
          onTaskMove={handleTaskMove}
          onTaskCreate={handleTaskCreate}
        />
      )}

      {activeTab === "milestones" && (
        <Card padding="none" as="section">
          {!milestones || milestones.length === 0 ? (
            <EmptyState icon={<CalendarDays size={24} strokeWidth={1.5} />} title="No milestones yet" description="Milestones set when the project was promoted appear here." />
          ) : (
            <ul className="divide-y divide-[var(--border-subtle)]">
              {milestones.map((m: any) => (
                <li key={m.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="ds-t-body-strong truncate text-[var(--text-primary)]">{m.title}</p>
                    <p className="ds-t-meta text-[var(--text-muted)]">{formatDay(m.due_date) ? `Target ${formatDay(m.due_date)}` : "No target date"}</p>
                  </div>
                  <ProgressMeter value={Number(m.completion_percentage) || 0} barClassName="w-32" />
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {activeTab === "bugs" && (
        <Card padding="none" as="section">
          {!bugs || bugs.length === 0 ? (
            <EmptyState icon={<Bug size={24} strokeWidth={1.5} />} title="No issues reported" description="Defects logged against this project appear here." />
          ) : (
            <ul className="divide-y divide-[var(--border-subtle)]">
              {bugs.map((b: any) => (
                <li key={b.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <p className="ds-t-body-strong min-w-0 flex-1 truncate text-[var(--text-primary)]">{b.title}</p>
                  {b.severity && <Badge variant={["CRITICAL", "HIGH"].includes(String(b.severity).toUpperCase()) ? "danger" : "neutral"}>{humanize(b.severity)}</Badge>}
                  {b.status && <Badge variant="neutral" noDot>{humanize(b.status)}</Badge>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {activeTab === "documents" && (
        <Card padding="none" as="section">
          {!documents || documents.length === 0 ? (
            <EmptyState icon={<FileText size={24} strokeWidth={1.5} />} title="No documents yet" description="Specifications and reference files for this project appear here." />
          ) : (
            <ul className="divide-y divide-[var(--border-subtle)]">
              {documents.map((doc: any) => (
                <li key={doc.id} className="flex items-center gap-3 px-5 py-3">
                  <FileText size={16} strokeWidth={1.5} className="shrink-0 text-[var(--text-muted)]" />
                  <p className="ds-t-body-strong min-w-0 flex-1 truncate text-[var(--text-primary)]">{doc.title}</p>
                  <span className="ds-t-meta shrink-0 text-[var(--text-muted)]">{humanize(doc.type || doc.category) || "File"}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {activeTab === "activity" && (
        <Card as="section">
          {!activityLogs || activityLogs.length === 0 ? (
            <p className="ds-t-body text-[var(--text-muted)]">No activity yet.</p>
          ) : (
            <Timeline
              label="Project activity"
              items={activityLogs.map((log: any) => ({
                id: log.id,
                title: log.title,
                body: log.description,
                tone: "accent" as const,
                time: new Date(log.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }),
              }))}
            />
          )}
        </Card>
      )}
    </div>
  );
}
