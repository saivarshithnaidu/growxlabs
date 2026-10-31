"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus } from "lucide-react";
import {
  Alert, Badge, Button, DataTable, type DataTableColumn, FilterChip, Input, KPIItem, KPIStrip, Modal,
  RelativeTime, SearchInput, toast,
} from "@/src/components/ui";
import { EmptyState, ErrorState, FormField, ListPage, Toolbar } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import {
  formatCount, locationApi, type LocationOverview, type LocationTenant, TENANT_STATUS_BADGE, type TenantStatus,
} from "@/components/admin/location/api";
import { LocationMockBanner } from "@/components/admin/location/MockBanner";

const PAGE_SIZE = 50;
const STATUS_FILTERS: { value: TenantStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "archived", label: "Archived" },
];

const columns: DataTableColumn<LocationTenant>[] = [
  {
    id: "name",
    header: "Tenant",
    sortValue: (t) => t.name,
    cell: (t) => (
      <span className="flex min-w-0 flex-col">
        <span className="ds-t-body-strong truncate text-[var(--text-primary)]">{t.name}</span>
        <span className="ds-t-meta truncate text-[var(--text-muted)]">{t.slug}</span>
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    sortValue: (t) => t.status,
    cell: (t) => <Badge variant={TENANT_STATUS_BADGE[t.status].variant}>{TENANT_STATUS_BADGE[t.status].label}</Badge>,
  },
  { id: "keys", header: "Active keys", numeric: true, sortValue: (t) => t.activeKeyCount ?? 0, cell: (t) => formatCount(t.activeKeyCount) },
  { id: "created", header: "Created", sortValue: (t) => new Date(t.createdAt), cell: (t) => <RelativeTime value={t.createdAt} /> },
];

export default function LocationTenantsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<TenantStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const overview = useQuery({
    queryKey: ["admin", "location", "overview"],
    queryFn: () => locationApi<{ data: LocationOverview }>("overview").then((r) => r.data),
  });

  const tenants = useQuery({
    queryKey: ["admin", "location", "tenants", { q: debouncedSearch, status, page }],
    queryFn: () => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String((page - 1) * PAGE_SIZE) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (status !== "all") params.set("status", status);
      return locationApi<{ data: LocationTenant[]; total: number }>(`tenants?${params}`);
    },
    placeholderData: (previous) => previous,
  });

  const createTenant = useMutation({
    mutationFn: () => locationApi<{ data: LocationTenant }>("tenants", {
      method: "POST",
      body: { name: name.trim(), ...(slug.trim() ? { slug: slug.trim() } : {}) },
    }),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "location"] });
      toast({ title: "Tenant created", meta: data.name, variant: "success" });
      closeCreate();
      router.push(`/admin/location/${data.id}`);
    },
  });

  const closeCreate = () => {
    setCreateOpen(false);
    setName("");
    setSlug("");
    createTenant.reset();
  };

  const submitCreate = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim()) createTenant.mutate();
  };

  const o = overview.data;

  return (
    <ListPage
      header={{
        title: "Location tenants",
        breadcrumb,
        info: "Clients using the Growx Location API. Each tenant has its own API keys and data.",
        actions: (
          <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setCreateOpen(true)}>
            New tenant
          </Button>
        ),
      }}
      kpis={
        <KPIStrip>
          <KPIItem label="Active tenants" value={formatCount(o?.tenants.active)} hint={o ? `${formatCount(o.tenants.suspended)} suspended` : undefined} loading={overview.isPending} />
          <KPIItem label="Active API keys" value={formatCount(o?.activeApiKeys)} loading={overview.isPending} />
          <KPIItem label="Requests today" value={formatCount(o?.requestsToday)} hint="UTC day" loading={overview.isPending} />
          <KPIItem label="Requests, last 30 days" value={formatCount(o?.requestsLast30Days)} loading={overview.isPending} />
        </KPIStrip>
      }
      toolbar={
        <Toolbar
          search={<SearchInput value={search} onValueChange={setSearch} placeholder="Search name or slug" />}
          filters={STATUS_FILTERS.map((f) => (
            <FilterChip key={f.value} label={f.label} selected={status === f.value} onClick={() => { setStatus(f.value); setPage(1); }} />
          ))}
        />
      }
    >
      <LocationMockBanner />
      {tenants.error ? (
        <ErrorState description={tenants.error.message} onRetry={() => tenants.refetch()} />
      ) : (
        <DataTable
          label="Location tenants"
          columns={columns}
          rows={tenants.data?.data ?? []}
          getRowId={(t) => t.id}
          loading={tenants.isPending}
          onRowClick={(t) => router.push(`/admin/location/${t.id}`)}
          pagination={tenants.data && tenants.data.total > PAGE_SIZE ? { page, pageSize: PAGE_SIZE, total: tenants.data.total, onPageChange: setPage } : undefined}
          emptyState={
            <EmptyState
              icon={<MapPin size={24} strokeWidth={1.5} />}
              title={debouncedSearch || status !== "all" ? "No tenants match" : "No tenants yet"}
              description={debouncedSearch || status !== "all" ? "Try another search or filter." : "Create a tenant for each client that uses the Location API."}
              action={!debouncedSearch && status === "all" ? <Button variant="primary" onClick={() => setCreateOpen(true)}>New tenant</Button> : undefined}
            />
          }
        />
      )}

      <Modal
        open={createOpen}
        onOpenChange={(open) => (open ? setCreateOpen(true) : closeCreate())}
        title="New tenant"
        description="A tenant is one client or product. You can issue API keys after creating it."
        footer={
          <>
            <Button variant="secondary" onClick={closeCreate}>Cancel</Button>
            <Button variant="primary" type="submit" form="create-location-tenant" loading={createTenant.isPending} disabled={!name.trim()}>
              Create tenant
            </Button>
          </>
        }
      >
        <form id="create-location-tenant" onSubmit={submitCreate} className="flex flex-col gap-4">
          {createTenant.error && <Alert variant="danger">{createTenant.error.message}</Alert>}
          <FormField label="Name" required>
            {(field) => <Input {...field} value={name} maxLength={200} onChange={(e) => setName(e.target.value)} autoFocus />}
          </FormField>
          <FormField label="Slug" hint="Optional. Lowercase letters, numbers and hyphens. Generated from the name if empty.">
            {(field) => <Input {...field} value={slug} maxLength={100} placeholder="acme-motors" onChange={(e) => setSlug(e.target.value.toLowerCase())} />}
          </FormField>
        </form>
      </Modal>
    </ListPage>
  );
}
