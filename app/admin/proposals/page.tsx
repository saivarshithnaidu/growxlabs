"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Plus, RefreshCw } from "lucide-react";
import { Alert, Button, Card, DataTable, DataTableColumn, FilterChip, RelativeTime, Select, StatusBadge } from "@/src/components/ui";
import { EmptyState, FormField, ListPage, Toolbar } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type Proposal = {
  id: string;
  proposal_number: string;
  status: string;
  version: number;
  client_id: string | null;
  deal_id: string | null;
  updated_at: string;
};

type Scope = {
  id: string;
  scope_number: string;
  status: string;
  version: number;
  client_id: string | null;
  deal_id: string | null;
  updated_at: string;
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  internal_review: "Internal review",
  changes_required: "Changes required",
  approved_internal: "Approved internally",
  ready_for_client: "Ready for client",
  sent: "Sent",
  viewed: "Viewed",
  negotiation: "Negotiation",
  client_changes_requested: "Client changes requested",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
  signed: "Signed",
  cancelled: "Cancelled",
  archived: "Archived",
};

function label(status: string) {
  return statusLabels[status] ?? status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const columns: DataTableColumn<Proposal>[] = [
  {
    id: "proposal_number",
    header: "Proposal",
    sortValue: (p) => p.proposal_number,
    cell: (p) => <Link href={`/admin/proposals/${p.id}`} className="ds-focus ds-t-body-strong rounded-[var(--radius-xs)] text-[var(--text-primary)] hover:text-[var(--accent)]">{p.proposal_number}</Link>,
  },
  { id: "status", header: "Status", sortValue: (p) => p.status, cell: (p) => <StatusBadge domain="proposal" status={p.status} label={label(p.status)} /> },
  { id: "version", header: "Version", numeric: true, sortValue: (p) => p.version, cell: (p) => `v${p.version}` },
  {
    id: "client",
    header: "Client / deal",
    cell: (p) => (
      <span className="flex flex-col">
        <span className="ds-t-meta truncate text-[var(--text-secondary)]">{p.client_id || "—"}</span>
        <span className="ds-t-meta truncate text-[var(--text-muted)]">{p.deal_id || "No linked deal"}</span>
      </span>
    ),
  },
  { id: "updated_at", header: "Last updated", sortValue: (p) => p.updated_at, cell: (p) => <RelativeTime value={p.updated_at} className="ds-t-meta text-[var(--text-muted)]" /> },
];

export default function AdminProposalsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [scopes, setScopes] = useState<Scope[]>([]);
  const [status, setStatus] = useState("all");
  // Deep links such as the "Proposal Approvals" menu item open with a status filter (?status=internal_review).
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("status");
    if (fromUrl && (fromUrl === "all" || fromUrl in statusLabels)) setStatus(fromUrl);
  }, []);
  const [scopeId, setScopeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [proposalResponse, scopeResponse] = await Promise.all([
        fetch("/api/admin/proposals", { cache: "no-store" }),
        fetch("/api/admin/scopes", { cache: "no-store" }),
      ]);
      const proposalData = await proposalResponse.json();
      const scopeData = await scopeResponse.json();
      if (!proposalResponse.ok) throw new Error(proposalData.error || "Unable to load proposals.");
      if (!scopeResponse.ok) throw new Error(scopeData.error || "Unable to load approved scopes.");
      setProposals(proposalData.proposals || []);
      setScopes(scopeData.scopes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load proposals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(
    () => status === "all" ? proposals : proposals.filter((proposal) => proposal.status === status),
    [proposals, status],
  );

  async function createProposal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!scopeId) return;
    setCreating(true);
    setError("");
    try {
      const response = await fetch("/api/admin/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scopeId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create proposal.");
      setShowCreate(false);
      setScopeId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create proposal.");
    } finally {
      setCreating(false);
    }
  }

  const statuses = Array.from(new Set(proposals.map((proposal) => proposal.status)));

  return (
    <ListPage
      header={{
        title: "Commercial proposals",
        breadcrumb,
        info: "Create and manage client-ready proposals generated from approved scopes of work.",
        actions: (
          <>
            <Button iconLeft={<RefreshCw size={16} strokeWidth={1.5} />} onClick={() => void load()}>Refresh</Button>
            <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} aria-expanded={showCreate} onClick={() => setShowCreate((value) => !value)}>New proposal</Button>
          </>
        ),
      }}
      toolbar={
        <Toolbar
          filters={
            <>
              <FilterChip label="All proposals" selected={status === "all"} onClick={() => setStatus("all")} />
              {statuses.map((value) => <FilterChip key={value} label={label(value)} selected={status === value} onClick={() => setStatus(value)} />)}
            </>
          }
        />
      }
    >
      {showCreate && (
        <Card as="section" className="mb-4">
          <form onSubmit={createProposal} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <FormField label="Approved scope of work" required hint="A proposal can only be created after its Scope of Work has reached an approved workflow status.">
                {(f) => (
                  <Select
                    {...f}
                    value={scopeId || undefined}
                    onValueChange={setScopeId}
                    placeholder="Select a scope…"
                    options={scopes.filter((scope) => scope.status !== "archived").map((scope) => ({ value: scope.id, label: `${scope.scope_number} · ${label(scope.status)}` }))}
                  />
                )}
              </FormField>
            </div>
            <Button type="submit" variant="primary" loading={creating} disabled={!scopeId} className="sm:mb-6">Create draft</Button>
          </form>
        </Card>
      )}

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <DataTable
        label="Commercial proposals"
        columns={columns}
        rows={filtered}
        getRowId={(p) => p.id}
        loading={loading}
        emptyState={<EmptyState icon={<FileText size={24} strokeWidth={1.5} />} title="No commercial proposals found" description="Create one from an approved Scope of Work." />}
      />
    </ListPage>
  );
}
