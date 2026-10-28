"use client";
import { useEffect, useState } from "react";
import { Alert, Badge, Button, DataTable, DataTableColumn, KPIItem, KPIStrip, StatusBadge } from "@/src/components/ui";
import { DetailPage, LoadingState } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type Candidate = {
  id: string;
  match_status: string;
  review_status: string;
  promoted_lead_id?: string | null;
  payload_snapshot: {
    company_name?: string;
    city?: string;
    state?: string;
    phone?: string;
    email?: string;
    score?: number | null;
    priority?: string | null;
    contact?: { name?: string; role?: string; phone?: string; email?: string };
  };
};

export default function ImportDetailPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const breadcrumb = useAdminBreadcrumb();
  const [, setId] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    params.then(({ batchId }) => {
      setId(batchId);
      fetch(`/api/admin/leads/imports/${batchId}`)
        .then(async (r) => {
          const b = await r.json();
          if (!r.ok) throw new Error(b.error || "Import could not be loaded");
          setData(b);
        })
        .catch((e) => setError(e.message));
    });
  }, [params]);
  async function approve(candidateId: string) {
    const r = await fetch("/api/admin/leads/imports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId }),
    });
    const b = await r.json();
    if (!r.ok) return setError(b.error || "Candidate could not be approved");
    setData((current: any) => ({
      ...current,
      candidates: current.candidates.map((c: any) =>
        c.id === candidateId
          ? { ...c, review_status: "imported", promoted_lead_id: b.leadId }
          : c,
      ),
    }));
  }

  const columns: DataTableColumn<Candidate>[] = [
    { id: "company", header: "Company", sortValue: (c) => c.payload_snapshot.company_name, cell: (c) => <span className="ds-t-body-strong text-[var(--text-primary)]">{c.payload_snapshot.company_name}</span> },
    { id: "location", header: "Location", cell: (c) => [c.payload_snapshot.city, c.payload_snapshot.state].filter(Boolean).join(", ") || "—" },
    { id: "phone", header: "Phone", cell: (c) => c.payload_snapshot.contact?.phone || c.payload_snapshot.phone || "—" },
    { id: "email", header: "Email", cell: (c) => c.payload_snapshot.contact?.email || c.payload_snapshot.email || "—" },
    { id: "decision_maker", header: "Decision maker", cell: (c) => [c.payload_snapshot.contact?.name, c.payload_snapshot.contact?.role].filter(Boolean).join(" · ") || "—" },
    { id: "match_status", header: "Match", sortValue: (c) => c.match_status, cell: (c) => <Badge variant={c.match_status === "no_match" ? "neutral" : "warning"}>{c.match_status.replaceAll("_", " ")}</Badge> },
    { id: "review_status", header: "Status", sortValue: (c) => c.review_status, cell: (c) => <StatusBadge domain="import" status={c.review_status} /> },
    { id: "score", header: "Lead score", numeric: true, sortValue: (c) => c.payload_snapshot.score ?? null, cell: (c) => c.payload_snapshot.score ?? "—" },
    { id: "priority", header: "Priority", cell: (c) => c.payload_snapshot.priority || "—" },
    {
      id: "action",
      header: "Action",
      cell: (c) =>
        c.review_status === "pending" && c.match_status === "no_match" ? (
          <Button size={28} variant="primary" onClick={() => void approve(c.id)}>Approve</Button>
        ) : c.promoted_lead_id ? (
          <Badge variant="success">Imported</Badge>
        ) : (
          <Badge variant="warning">Review required</Badge>
        ),
    },
  ];

  if (error)
    return <Alert variant="danger" title="Import could not be loaded">{error}</Alert>;
  if (!data) return <LoadingState label="Loading import…" />;

  const b = data.batch;
  return (
    <DetailPage
      header={{
        title: b.batch_reference,
        breadcrumb,
        info: `${b.source} · Job / segment: ${b.source_job_id}`,
        actions: <StatusBadge domain="import" status={b.status} />,
      }}
    >
      <div className="flex flex-col gap-4">
        <KPIStrip>
          <KPIItem label="Received" value={b.received_count} />
          <KPIItem label="Ready" value={b.valid_count} />
          <KPIItem label="Duplicates" value={b.duplicate_count} />
          <KPIItem label="Review" value={b.needs_review_count} />
          <KPIItem label="Imported" value={b.imported_count} />
          <KPIItem label="Rejected" value={b.rejected_count || 0} />
        </KPIStrip>
        <DataTable label="Import candidates" columns={columns} rows={data.candidates} getRowId={(c) => c.id} />
      </div>
    </DetailPage>
  );
}
