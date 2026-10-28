"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import { Alert, Button, DataTable, DataTableColumn, RelativeTime, StatusBadge } from "@/src/components/ui";
import { EmptyState, ListPage } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type ImportBatch = {
  id: string;
  batch_reference: string;
  source: string;
  source_job_id: string;
  received_count: number;
  valid_count: number;
  duplicate_count: number;
  needs_review_count: number;
  imported_count: number;
  rejected_count?: number | null;
  status: string;
  created_at: string;
};

const columns: DataTableColumn<ImportBatch>[] = [
  {
    id: "source",
    header: "Source",
    sortValue: (b) => b.batch_reference,
    cell: (b) => (
      <span className="flex min-w-0 flex-col">
        <Link href={`/admin/leads/imports/${b.id}`} className="ds-focus ds-t-body-strong truncate rounded-[var(--radius-xs)] text-[var(--text-primary)] hover:text-[var(--accent)]">{b.batch_reference}</Link>
        <span className="ds-t-meta truncate text-[var(--text-muted)]">{b.source}</span>
      </span>
    ),
  },
  { id: "source_job_id", header: "Segment / Job" },
  { id: "received_count", header: "Received", numeric: true, sortValue: (b) => b.received_count },
  { id: "valid_count", header: "Ready", numeric: true, sortValue: (b) => b.valid_count },
  { id: "duplicate_count", header: "Duplicates", numeric: true, sortValue: (b) => b.duplicate_count },
  { id: "needs_review_count", header: "Review", numeric: true, sortValue: (b) => b.needs_review_count },
  { id: "imported_count", header: "Imported", numeric: true, sortValue: (b) => b.imported_count },
  { id: "rejected_count", header: "Rejected", numeric: true, sortValue: (b) => b.rejected_count || 0, cell: (b) => b.rejected_count || 0 },
  { id: "status", header: "Status", sortValue: (b) => b.status, cell: (b) => <StatusBadge domain="import" status={b.status} /> },
  { id: "created_at", header: "Created", sortValue: (b) => b.created_at, cell: (b) => <RelativeTime value={b.created_at} className="ds-t-meta text-[var(--text-muted)]" /> },
];

export default function LeadImportsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [message] = useState("");
  useEffect(() => {
    fetch("/api/admin/leads/imports")
      .then((r) => r.json())
      .then((b) => setBatches(b.batches || []))
      .finally(() => setLoading(false));
  }, []);
  const importAction = <Button asChild variant="primary"><Link href="/admin/leads">Import leads</Link></Button>;
  return (
    <ListPage
      header={{
        title: "Lead Imports",
        breadcrumb,
        info: "Review GrowX Crawl prospects before they enter the canonical Lead Pool.",
        actions: (
          <>
            <Button asChild><Link href="/admin/leads"><Upload size={16} strokeWidth={1.5} />Upload CSV</Link></Button>
            {importAction}
          </>
        ),
      }}
    >
      {message && <Alert variant="success" className="mb-4">{message}</Alert>}
      <DataTable
        label="Lead import batches"
        columns={columns}
        rows={batches}
        getRowId={(b) => b.id}
        loading={loading}
        emptyState={<EmptyState title="No imports yet" description="Imported prospects appear here for review." action={importAction} />}
      />
    </ListPage>
  );
}
