"use client";

import React, { useState, useEffect } from "react";
import { Building2, Plus } from "lucide-react";
import { Button, CurrencyAmount, DataTable, DataTableColumn, Input, Modal, SearchInput } from "@/src/components/ui";
import { EmptyState, FormField, ListPage, Toolbar } from "@/src/components/patterns";
import { Customer360 } from "@/components/admin/Customer360";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

const columns: DataTableColumn<any>[] = [
  {
    id: "name",
    header: "Account",
    sortValue: (c) => c.name,
    cell: (c) => (
      <span className="flex min-w-0 flex-col">
        <span className="ds-t-body-strong truncate text-[var(--text-primary)]">{c.name}</span>
        <span className="ds-t-meta truncate text-[var(--text-muted)]">{c.industry || "General Industry"}</span>
      </span>
    ),
  },
  { id: "owner", header: "Owner", sortValue: (c) => c.owner?.name || "", cell: (c) => c.owner?.name || "Unassigned" },
  { id: "employees_count", header: "Employees", numeric: true, sortValue: (c) => c.employees_count ?? null, cell: (c) => c.employees_count || "Unknown" },
  { id: "annual_revenue", header: "Revenue", numeric: true, sortValue: (c) => c.annual_revenue ?? null, cell: (c) => <CurrencyAmount value={c.annual_revenue} /> },
];

export default function CompaniesPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    website: "",
    gst: "",
    pan: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    employees_count: 10,
    annual_revenue: 100000
  });

  useEffect(() => {
    fetchCompanies();
  }, [search]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/companies?search=${search}`);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = async (id: string) => {
    try {
      setLoading(true);
      setSelectedCompanyId(id);
      // Details come from the loaded list; there is no /api/companies/[id] endpoint yet.
      const companyDetails = companies.find(c => c.id === id);
      setSelectedCompany(companyDetails);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewCompany({
          name: "",
          industry: "",
          website: "",
          gst: "",
          pan: "",
          address: "",
          city: "",
          state: "",
          country: "India",
          employees_count: 10,
          annual_revenue: 100000
        });
        fetchCompanies();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (selectedCompanyId && selectedCompany) {
    return (
      <Customer360
        company={selectedCompany}
        timelineActivities={[]}
        breadcrumb={breadcrumb}
        onBack={() => { setSelectedCompanyId(null); setSelectedCompany(null); }}
      />
    );
  }

  const set = (patch: Partial<typeof newCompany>) => setNewCompany({ ...newCompany, ...patch });

  return (
    <ListPage
      header={{
        title: "Company Directory",
        breadcrumb,
        info: "Manage your enterprise accounts and customer profiles.",
        actions: <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowAddModal(true)}>Add account</Button>,
      }}
      toolbar={<Toolbar search={<SearchInput value={search} onValueChange={setSearch} placeholder="Search accounts" />} />}
    >
      <DataTable
        label="Companies"
        columns={columns}
        rows={companies}
        getRowId={(c) => c.id}
        loading={loading}
        onRowClick={(c) => selectCompany(c.id)}
        emptyState={<EmptyState icon={<Building2 size={24} strokeWidth={1.5} />} title="No accounts found" description="Get started by creating your first company account profile." action={<Button variant="primary" onClick={() => setShowAddModal(true)}>Add account</Button>} />}
      />

      <Modal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="Create company profile"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" form="company-form" variant="primary">Create account</Button>
          </>
        }
      >
        <form id="company-form" onSubmit={handleCreateCompany} className="grid grid-cols-2 gap-4">
          <FormField label="Company name" required>
            {(f) => <Input {...f} required placeholder="Acme Corp" value={newCompany.name} onChange={e => set({ name: e.target.value })} />}
          </FormField>
          <FormField label="Industry">
            {(f) => <Input {...f} placeholder="Tech, Retail…" value={newCompany.industry} onChange={e => set({ industry: e.target.value })} />}
          </FormField>
          <FormField label="Website">
            {(f) => <Input {...f} placeholder="acme.com" value={newCompany.website} onChange={e => set({ website: e.target.value })} />}
          </FormField>
          <FormField label="GST number">
            {(f) => <Input {...f} placeholder="GSTIN…" value={newCompany.gst} onChange={e => set({ gst: e.target.value })} />}
          </FormField>
          <FormField label="PAN number">
            {(f) => <Input {...f} placeholder="PAN…" value={newCompany.pan} onChange={e => set({ pan: e.target.value })} />}
          </FormField>
          <FormField label="Employees">
            {(f) => <Input {...f} type="number" value={newCompany.employees_count} onChange={e => set({ employees_count: Number(e.target.value) })} />}
          </FormField>
          <div className="col-span-2">
            <FormField label="Address">
              {(f) => <Input {...f} placeholder="123 Main St…" value={newCompany.address} onChange={e => set({ address: e.target.value })} />}
            </FormField>
          </div>
        </form>
      </Modal>
    </ListPage>
  );
}
