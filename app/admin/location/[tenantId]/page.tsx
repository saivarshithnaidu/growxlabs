"use client";

import { use, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Pencil, Plus, RotateCw, XCircle } from "lucide-react";
import {
  Alert, Badge, Button, ChartCard, DataTable, type DataTableColumn, IconButton, Input, KeyValueList, Modal,
  RelativeTime, Select, Timeline, toast, TrendChart,
} from "@/src/components/ui";
import { DetailPage, EmptyState, ErrorState, FormField, LoadingState } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import {
  AUDIT_ACTION_LABEL, auditTone, describeAudit, formatCount, type IssuedKey, KEY_STATE_BADGE, keyState, locationApi, type LocationApiKey,
  type LocationAuditEntry, type LocationTenant, type LocationUsage, PERMISSIONS, TENANT_STATUS_BADGE, type TenantStatus,
} from "@/components/admin/location/api";
import { ConfirmModal, CreateKeyModal, type CreateKeyInput, IssuedKeyModal, RotateKeyModal } from "@/components/admin/location/KeyDialogs";
import { LocationMockBanner } from "@/components/admin/location/MockBanner";

type Tab = "keys" | "usage" | "activity";

const PERMISSION_LABEL = Object.fromEntries(PERMISSIONS.map((p) => [p.value, p.label]));

export default function LocationTenantPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = use(params);
  const breadcrumb = useAdminBreadcrumb();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("keys");

  const tenantKey = ["admin", "location", "tenant", tenantId] as const;
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "location"] });

  const tenant = useQuery({
    queryKey: tenantKey,
    queryFn: () => locationApi<{ data: LocationTenant }>(`tenants/${tenantId}`).then((r) => r.data),
  });

  const keys = useQuery({
    queryKey: [...tenantKey, "keys"],
    queryFn: () => locationApi<{ data: LocationApiKey[] }>(`tenants/${tenantId}/keys`).then((r) => r.data),
  });

  /* ── Tenant status / rename ─────────────────────────────────────── */

  const [statusTarget, setStatusTarget] = useState<TenantStatus | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const updateTenant = useMutation({
    mutationFn: (body: { name?: string; status?: TenantStatus }) =>
      locationApi<{ data: LocationTenant }>(`tenants/${tenantId}`, { method: "PATCH", body }),
    onSuccess: ({ data }) => {
      refresh();
      toast({ title: "Tenant updated", meta: `${data.name} · ${TENANT_STATUS_BADGE[data.status].label}`, variant: "success" });
      setStatusTarget(null);
      setRenameOpen(false);
    },
  });

  /* ── Keys ───────────────────────────────────────────────────────── */

  const [createOpen, setCreateOpen] = useState(false);
  const [issued, setIssued] = useState<IssuedKey | null>(null);
  const [rotating, setRotating] = useState<LocationApiKey | null>(null);
  const [revoking, setRevoking] = useState<LocationApiKey | null>(null);

  const createKey = useMutation({
    mutationFn: (input: CreateKeyInput) => locationApi<{ data: IssuedKey }>(`tenants/${tenantId}/keys`, { method: "POST", body: input }),
    onSuccess: ({ data }) => {
      refresh();
      setCreateOpen(false);
      createKey.reset();
      setIssued(data);
    },
  });

  const rotateKey = useMutation({
    mutationFn: ({ keyId, graceHours }: { keyId: string; graceHours: number }) =>
      locationApi<{ data: IssuedKey }>(`keys/${keyId}/rotate`, { method: "POST", body: { graceHours } }),
    onSuccess: ({ data }) => {
      refresh();
      setRotating(null);
      rotateKey.reset();
      setIssued(data);
    },
  });

  const revokeKey = useMutation({
    mutationFn: (keyId: string) => locationApi<{ data: LocationApiKey }>(`keys/${keyId}/revoke`, { method: "POST" }),
    onSuccess: ({ data }) => {
      refresh();
      setRevoking(null);
      revokeKey.reset();
      toast({ title: "API key revoked", meta: `${data.name} · ${data.keyPrefix}…`, variant: "success" });
    },
  });

  const t = tenant.data;
  const isActive = t?.status === "active";

  const keyColumns: DataTableColumn<LocationApiKey>[] = [
    {
      id: "name",
      header: "Key",
      sortValue: (k) => k.name,
      cell: (k) => (
        <span className="flex min-w-0 flex-col">
          <span className="ds-t-body-strong truncate text-[var(--text-primary)]">{k.name}</span>
          <span className="ds-t-mono truncate text-[var(--text-muted)]">{k.keyPrefix}…</span>
        </span>
      ),
    },
    {
      id: "state",
      header: "Status",
      sortValue: (k) => keyState(k),
      cell: (k) => {
        const s = KEY_STATE_BADGE[keyState(k)];
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      id: "permissions",
      header: "Permissions",
      wrap: true,
      cell: (k) => <span className="ds-t-meta text-[var(--text-secondary)]">{k.permissions.map((p) => PERMISSION_LABEL[p] ?? p).join(", ")}</span>,
    },
    { id: "lastUsed", header: "Last used", sortValue: (k) => (k.lastUsedAt ? new Date(k.lastUsedAt) : null), cell: (k) => (k.lastUsedAt ? <RelativeTime value={k.lastUsedAt} /> : "Never") },
    { id: "expires", header: "Expires", sortValue: (k) => (k.expiresAt ? new Date(k.expiresAt) : null), cell: (k) => (k.expiresAt ? new Date(k.expiresAt).toLocaleString() : "Never") },
  ];

  if (tenant.isPending) return <LoadingState label="Loading tenant…" />;
  if (tenant.error || !t) {
    return <ErrorState size="page" title="Tenant could not be loaded" description={tenant.error?.message} onRetry={() => tenant.refetch()} />;
  }

  return (
    <DetailPage
      header={{
        title: t.name,
        breadcrumb,
        info: "API keys, usage and change history for this tenant.",
        actions: (
          <>
            <Button variant="ghost" iconLeft={<Pencil size={16} strokeWidth={1.5} />} onClick={() => { setNewName(t.name); setRenameOpen(true); }}>Rename</Button>
            {t.status === "active" ? (
              <Button variant="secondary" onClick={() => setStatusTarget("suspended")}>Suspend</Button>
            ) : (
              <Button variant="secondary" onClick={() => setStatusTarget("active")}>Reactivate</Button>
            )}
            {t.status !== "archived" && <Button variant="danger" onClick={() => setStatusTarget("archived")}>Archive</Button>}
          </>
        ),
      }}
      tabs={[
        { value: "keys", label: "API keys", count: keys.data?.length },
        { value: "usage", label: "Usage" },
        { value: "activity", label: "Activity" },
      ]}
      activeTab={tab}
      onTabChange={(v) => setTab(v as Tab)}
      side={
        <KeyValueList
          items={[
            { label: "Status", value: <Badge variant={TENANT_STATUS_BADGE[t.status].variant}>{TENANT_STATUS_BADGE[t.status].label}</Badge> },
            { label: "Slug", value: <span className="ds-t-mono">{t.slug}</span> },
            { label: "Tenant ID", value: <span className="ds-t-mono break-all">{t.id}</span> },
            { label: "Active keys", value: formatCount(t.activeKeyCount) },
            { label: "Requests, last 30 days", value: formatCount(t.requestsLast30Days) },
            { label: "Created", value: new Date(t.createdAt).toLocaleString() },
          ]}
        />
      }
    >
      <LocationMockBanner />
      {!isActive && (
        <Alert variant="warning" title={`This tenant is ${t.status}`} className="mb-4">
          All of its API keys are rejected until it is reactivated. New keys cannot be issued.
        </Alert>
      )}

      {tab === "keys" && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} disabled={!isActive} onClick={() => setCreateOpen(true)}>
              New API key
            </Button>
          </div>
          {keys.error ? (
            <ErrorState description={keys.error.message} onRetry={() => keys.refetch()} />
          ) : (
            <DataTable
              label="API keys"
              columns={keyColumns}
              rows={keys.data ?? []}
              getRowId={(k) => k.id}
              loading={keys.isPending}
              rowActions={(k) =>
                k.usable ? (
                  <div className="flex items-center gap-1">
                    <IconButton label={`Rotate ${k.name}`} size={28} icon={<RotateCw size={14} strokeWidth={1.5} />} disabled={!isActive} onClick={() => setRotating(k)} />
                    <IconButton label={`Revoke ${k.name}`} size={28} icon={<XCircle size={14} strokeWidth={1.5} />} onClick={() => setRevoking(k)} />
                  </div>
                ) : null
              }
              emptyState={
                <EmptyState
                  icon={<KeyRound size={24} strokeWidth={1.5} />}
                  title="No API keys yet"
                  description="Issue a key so this client can call the Location API from their server."
                  action={isActive ? <Button variant="primary" onClick={() => setCreateOpen(true)}>New API key</Button> : undefined}
                />
              }
            />
          )}
        </div>
      )}

      {tab === "usage" && <UsagePanel tenantId={tenantId} keys={keys.data ?? []} />}
      {tab === "activity" && <ActivityPanel tenantId={tenantId} />}

      <CreateKeyModal
        open={createOpen}
        onOpenChange={(open) => { setCreateOpen(open); if (!open) createKey.reset(); }}
        onSubmit={(input) => createKey.mutate(input)}
        submitting={createKey.isPending}
        error={createKey.error?.message}
      />

      <RotateKeyModal
        keyName={rotating?.name ?? ""}
        open={rotating !== null}
        onOpenChange={(open) => { if (!open) { setRotating(null); rotateKey.reset(); } }}
        onConfirm={(graceHours) => rotating && rotateKey.mutate({ keyId: rotating.id, graceHours })}
        submitting={rotateKey.isPending}
        error={rotateKey.error?.message}
      />

      <ConfirmModal
        open={revoking !== null}
        onOpenChange={(open) => { if (!open) { setRevoking(null); revokeKey.reset(); } }}
        title={`Revoke “${revoking?.name ?? ""}”?`}
        confirmLabel="Revoke key"
        destructive
        onConfirm={() => revoking && revokeKey.mutate(revoking.id)}
        submitting={revokeKey.isPending}
        error={revokeKey.error?.message}
      >
        Requests using <span className="ds-t-mono">{revoking?.keyPrefix}…</span> will be rejected immediately. This cannot be undone; issue a new key if the client still needs access.
      </ConfirmModal>

      <ConfirmModal
        open={statusTarget !== null}
        onOpenChange={(open) => { if (!open) { setStatusTarget(null); updateTenant.reset(); } }}
        title={statusTarget === "active" ? `Reactivate ${t.name}?` : statusTarget === "archived" ? `Archive ${t.name}?` : `Suspend ${t.name}?`}
        confirmLabel={statusTarget === "active" ? "Reactivate" : statusTarget === "archived" ? "Archive" : "Suspend"}
        destructive={statusTarget !== "active"}
        onConfirm={() => statusTarget && updateTenant.mutate({ status: statusTarget })}
        submitting={updateTenant.isPending}
        error={updateTenant.error?.message}
      >
        {statusTarget === "active"
          ? "Its active, unexpired API keys start working again immediately."
          : "Every API key for this tenant stops working immediately. Its data is kept, and you can reactivate it later."}
      </ConfirmModal>

      <Modal
        open={renameOpen}
        onOpenChange={(open) => { setRenameOpen(open); if (!open) updateTenant.reset(); }}
        size="sm"
        title="Rename tenant"
        description="The slug stays the same."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              loading={updateTenant.isPending}
              disabled={!newName.trim() || newName.trim() === t.name}
              onClick={() => updateTenant.mutate({ name: newName.trim() })}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          {updateTenant.error && <Alert variant="danger">{updateTenant.error.message}</Alert>}
          <FormField label="Name" required>
            {(field) => <Input {...field} value={newName} maxLength={200} onChange={(e) => setNewName(e.target.value)} autoFocus />}
          </FormField>
        </div>
      </Modal>

      <IssuedKeyModal issued={issued} onClose={() => setIssued(null)} />
    </DetailPage>
  );
}

/* ── Usage ────────────────────────────────────────────────────────── */

const DAY_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

function UsagePanel({ tenantId, keys }: { tenantId: string; keys: LocationApiKey[] }) {
  const [days, setDays] = useState("30");

  const usage = useQuery({
    queryKey: ["admin", "location", "tenant", tenantId, "usage", days],
    queryFn: () => locationApi<{ data: LocationUsage }>(`tenants/${tenantId}/usage?days=${days}`).then((r) => r.data),
  });

  // Fill days with no traffic so the chart has a continuous x-axis.
  const series = useMemo(() => {
    const counts = new Map((usage.data?.daily ?? []).map((d) => [d.date, d.requests]));
    const out: { day: string; requests: number }[] = [];
    const n = Number(days);
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - i);
      const iso = date.toISOString().slice(0, 10);
      out.push({ day: iso.slice(5), requests: counts.get(iso) ?? 0 });
    }
    return out;
  }, [usage.data, days]);

  const keyName = new Map(keys.map((k) => [k.id, `${k.name} · ${k.keyPrefix}…`]));

  if (usage.error) return <ErrorState description={usage.error.message} onRetry={() => usage.refetch()} />;

  return (
    <div className="flex flex-col gap-4">
      <ChartCard
        title={`${formatCount(usage.data?.totalRequests)} requests`}
        action={<Select aria-label="Period" size={28} options={DAY_OPTIONS} value={days} onValueChange={setDays} />}
      >
        {usage.isPending ? (
          <LoadingState size="inline" label="Loading usage…" />
        ) : (
          <TrendChart
            label={`Daily API requests, last ${days} days`}
            data={series}
            xKey="day"
            series={[{ key: "requests", label: "Requests", color: "var(--accent)", area: true }]}
          />
        )}
      </ChartCard>

      <DataTable
        label="Requests by key"
        columns={[
          { id: "key", header: "Key", cell: (r: { keyId: string; requests: number }) => keyName.get(r.keyId) ?? r.keyId },
          { id: "requests", header: "Requests", numeric: true, sortValue: (r) => r.requests, cell: (r) => formatCount(r.requests) },
        ]}
        rows={usage.data?.byKey ?? []}
        getRowId={(r) => r.keyId}
        loading={usage.isPending}
        hideToolbar
        emptyState={<EmptyState title="No requests in this period" description="Usage appears here once the client calls the API with one of this tenant's keys." />}
      />
      <p className="ds-t-meta text-[var(--text-muted)]">Days are UTC. Counts include every authenticated request, including ones later rejected for missing permissions.</p>
    </div>
  );
}

/* ── Activity (audit log) ─────────────────────────────────────────── */

function ActivityPanel({ tenantId }: { tenantId: string }) {
  const audit = useQuery({
    queryKey: ["admin", "location", "tenant", tenantId, "audit"],
    queryFn: () => locationApi<{ data: LocationAuditEntry[] }>(`audit-logs?tenantId=${tenantId}&limit=100`).then((r) => r.data),
  });

  if (audit.isPending) return <LoadingState size="inline" label="Loading activity…" />;
  if (audit.error) return <ErrorState description={audit.error.message} onRetry={() => audit.refetch()} />;
  if (!audit.data?.length) return <EmptyState title="No activity yet" description="Changes made by staff to this tenant and its keys are listed here." />;

  return (
    <Timeline
      label="Tenant activity"
      items={audit.data.map((entry) => ({
        id: entry.id,
        title: AUDIT_ACTION_LABEL[entry.action] ?? entry.action,
        time: <RelativeTime value={entry.createdAt} />,
        meta: entry.actorEmail,
        body: describeAudit(entry),
        tone: auditTone(entry.action),
      }))}
    />
  );
}
