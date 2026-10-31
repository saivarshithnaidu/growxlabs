"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, Plus } from "lucide-react";
import {
  Badge, Button, Card, CardHeader, DataTable, type DataTableColumn, Input, Modal, RelativeTime, toast, type BadgeVariant,
} from "@/src/components/ui";
import { EmptyState, ErrorState, FormField, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type Workspace = {
  id: string;
  project_id: string;
  status: string;
  health: string;
  summary: Record<string, unknown>;
  created_at: string;
  consulting_projects: { project_number: string } | null;
  companyName?: string | null;
};

type AvailableProject = {
  id: string;
  projectNumber: string;
  companyName: string | null;
};

type WorkspaceResponse = {
  workspaces: Workspace[];
  availableProjects?: AvailableProject[];
};

const STATUS: Record<string, BadgeVariant> = {
  planning: "neutral",
  active: "info",
  in_progress: "info",
  on_hold: "warning",
  blocked: "danger",
  completed: "success",
  closed: "success",
  cancelled: "danger",
};
const HEALTH: Record<string, BadgeVariant> = {
  on_track: "success",
  at_risk: "warning",
  off_track: "danger",
  blocked: "danger",
};
const humanize = (value?: string | null) => {
  const t = String(value || "").replaceAll("_", " ").trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
};

const fetchWorkspaces = async () => {
  const response = await fetch("/api/admin/delivery/workspaces", { cache: "no-store" });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Unable to load project workspaces.");
  return body as WorkspaceResponse;
};

export function ProjectWorkspaceList() {
  const qc = useQueryClient();
  const router = useRouter();
  const breadcrumb = useAdminBreadcrumb();
  const [projectId, setProjectId] = useState("");
  const [manualOpen, setManualOpen] = useState(false);

  const query = useQuery({
    queryKey: ["admin", "project-workspaces"],
    queryFn: fetchWorkspaces,
  });

  const activate = useMutation({
    mutationFn: async (targetId?: string) => {
      const idToActivate = targetId || projectId;
      const response = await fetch("/api/admin/delivery/workspaces", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId: idToActivate }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Workspace activation failed.");
      return body;
    },
    onSuccess: () => {
      setProjectId("");
      setManualOpen(false);
      toast({ title: "Workspace activated", variant: "success" });
      qc.invalidateQueries({ queryKey: ["admin", "project-workspaces"] });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "danger" }),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (projectId.trim()) activate.mutate(projectId.trim());
  };

  const availableProjects = query.data?.availableProjects || [];
  const pendingId = activate.isPending ? activate.variables : undefined;

  const columns: DataTableColumn<Workspace>[] = [
    {
      id: "project",
      header: "Project",
      width: "30%",
      sortValue: (w) => w.consulting_projects?.project_number || "",
      cell: (w) => <span className="ds-t-body-strong ds-num text-[var(--text-primary)]">{w.consulting_projects?.project_number || "Unnumbered"}</span>,
    },
    {
      id: "client",
      header: "Client",
      sortValue: (w) => w.companyName || "",
      cell: (w) => w.companyName ? <span className="truncate text-[var(--text-primary)]">{w.companyName}</span> : <span className="text-[var(--text-disabled)]">Not linked</span>,
    },
    { id: "status", header: "Status", sortValue: (w) => w.status, cell: (w) => <Badge variant={STATUS[w.status] || "neutral"}>{humanize(w.status)}</Badge> },
    { id: "health", header: "Health", sortValue: (w) => w.health, cell: (w) => w.health ? <Badge variant={HEALTH[w.health] || "neutral"}>{humanize(w.health)}</Badge> : null },
    { id: "created", header: "Activated", sortValue: (w) => new Date(w.created_at), cell: (w) => <RelativeTime value={w.created_at} className="text-[var(--text-muted)]" /> },
  ];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Project workspaces"
        breadcrumb={breadcrumb}
        info="Delivery workspaces open only after payment is verified and kickoff is complete."
        actions={<Button variant="secondary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setManualOpen(true)}>Activate by project ID</Button>}
      />

      {query.error ? (
        <ErrorState title="Couldn't load workspaces" description={query.error.message} onRetry={() => query.refetch()} />
      ) : (
        <div className="flex flex-col gap-6">
          {availableProjects.length > 0 && (
            <Card as="section" padding="none">
              <div className="px-5 pt-5">
                <CardHeader title="Ready to activate" description="Active consulting projects without a delivery workspace yet." />
              </div>
              <ul className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
                {availableProjects.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="ds-t-body-strong truncate text-[var(--text-primary)]">{p.companyName || "Client not linked"}</p>
                      <p className="ds-t-meta ds-num text-[var(--text-muted)]">{p.projectNumber}</p>
                    </div>
                    <Button
                      size={28}
                      variant="primary"
                      loading={pendingId === p.id}
                      disabled={activate.isPending && pendingId !== p.id}
                      onClick={() => activate.mutate(p.id)}
                    >
                      Activate workspace
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <DataTable
            label="Project workspaces"
            columns={columns}
            rows={query.data?.workspaces || []}
            getRowId={(w) => w.id}
            loading={query.isPending}
            skeletonRows={4}
            onRowClick={(w) => router.push(`/admin/projects/${w.id}`)}
            emptyState={
              <EmptyState
                icon={<FolderKanban size={24} strokeWidth={1.5} />}
                title="No workspaces yet"
                description="Activate one from a ready project, or by its project ID."
              />
            }
          />
        </div>
      )}

      <Modal
        open={manualOpen}
        onOpenChange={(open) => { setManualOpen(open); if (!open) setProjectId(""); }}
        title="Activate by project ID"
        description="For a consulting project that isn't listed as ready."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setManualOpen(false)}>Cancel</Button>
            <Button type="submit" form="activate-workspace-form" variant="primary" loading={activate.isPending} disabled={!projectId.trim()}>Activate workspace</Button>
          </>
        }
      >
        <form id="activate-workspace-form" onSubmit={submit}>
          <FormField label="Project number or ID" required hint="For example GXL-PRJ-2026-000001, or the project UUID.">
            {(f) => <Input {...f} required value={projectId} onChange={(event) => setProjectId(event.target.value)} placeholder="GXL-PRJ-2026-000001" />}
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
