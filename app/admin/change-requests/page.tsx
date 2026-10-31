"use client";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Badge, DataTable, type DataTableColumn, RelativeTime, type BadgeVariant } from "@/src/components/ui";
import { EmptyState, ErrorState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type ChangeRequest = { id: string; change_number: string | null; title: string; status: string; impact: string | null; created_at: string | null };

const STATUS: Record<string, BadgeVariant> = {
  draft: "neutral", submitted: "info", requested: "info", under_review: "info", in_review: "info",
  approved: "success", implemented: "success", completed: "success", rejected: "danger", cancelled: "neutral",
};
const humanize = (value?: string | null) => {
  const t = String(value || "").replaceAll("_", " ").trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
};

export default function ChangeRequestsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [changes, setChanges] = useState<ChangeRequest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    setError("");
    fetch("/api/admin/change-requests").then(async (r) => { const body = await r.json(); if (!r.ok) throw new Error(body.error || "Unable to load change requests"); setChanges(body.changes || []); }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const columns: DataTableColumn<ChangeRequest>[] = [
    { id: "request", header: "Request", width: "18%", sortValue: (c) => c.change_number || c.id, cell: (c) => <span className="ds-t-body-strong ds-num text-[var(--text-primary)]">{c.change_number || c.id}</span> },
    { id: "title", header: "Title", width: "34%", sortValue: (c) => c.title, cell: (c) => <span className="truncate text-[var(--text-primary)]" title={c.title}>{c.title}</span> },
    { id: "status", header: "Status", sortValue: (c) => c.status, cell: (c) => <Badge variant={STATUS[c.status] || "neutral"}>{humanize(c.status)}</Badge> },
    { id: "impact", header: "Impact", sortValue: (c) => c.impact || "", cell: (c) => c.impact ? <span className="text-[var(--text-secondary)]">{humanize(c.impact)}</span> : <span className="text-[var(--text-disabled)]">Not assessed</span> },
    { id: "created", header: "Created", sortValue: (c) => (c.created_at ? new Date(c.created_at) : null), cell: (c) => <RelativeTime value={c.created_at} className="text-[var(--text-muted)]" /> },
  ];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Change requests" breadcrumb={breadcrumb} info="Review client-requested scope and delivery changes." />
      {error ? (
        <ErrorState title="Couldn't load change requests" description={error} onRetry={load} />
      ) : (
        <DataTable
          label="Change requests"
          columns={columns}
          rows={changes}
          getRowId={(c) => c.id}
          loading={loading}
          skeletonRows={4}
          emptyState={
            <EmptyState
              icon={<FileText size={24} strokeWidth={1.5} />}
              title="No change requests"
              description="When a client asks to change scope or delivery, the request shows up here for review."
            />
          }
        />
      )}
    </div>
  );
}
