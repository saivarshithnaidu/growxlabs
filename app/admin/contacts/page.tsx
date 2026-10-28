"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { Badge, Button, Checkbox, DataTable, DataTableColumn, Input, Modal, SearchInput, Select } from "@/src/components/ui";
import { EmptyState, FormField, ListPage, Toolbar } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type Contact = {
  id: string;
  first_name: string;
  last_name?: string | null;
  company?: { name?: string } | null;
  job_title?: string | null;
  department?: string | null;
  email?: string | null;
  phone?: string | null;
  is_decision_maker?: boolean;
};

const columns: DataTableColumn<Contact>[] = [
  { id: "name", header: "Name", sortValue: (c) => `${c.first_name} ${c.last_name || ""}`, cell: (c) => <span className="ds-t-body-strong text-[var(--text-primary)]">{c.first_name} {c.last_name || ""}</span> },
  { id: "company", header: "Company account", sortValue: (c) => c.company?.name || "", cell: (c) => c.company?.name || "Independent" },
  {
    id: "title",
    header: "Title & dept",
    cell: (c) => (
      <span className="flex min-w-0 flex-col">
        <span className="truncate">{c.job_title || "General Staff"}</span>
        {c.department && <span className="ds-t-meta truncate text-[var(--text-muted)]">{c.department}</span>}
      </span>
    ),
  },
  { id: "email", header: "Email", sortValue: (c) => c.email || "", cell: (c) => c.email ? <a href={`mailto:${c.email}`} className="ds-focus rounded-[var(--radius-xs)] text-[var(--accent)] hover:text-[var(--accent-active)]">{c.email}</a> : "—" },
  { id: "phone", header: "Phone", cell: (c) => c.phone || "Not configured" },
  { id: "decision", header: "Role", cell: (c) => c.is_decision_maker ? <Badge variant="success">Decision maker</Badge> : <Badge variant="neutral" noDot>Staff</Badge> },
];

export default function ContactsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [contacts, setContacts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newContact, setNewContact] = useState({
    company_id: "",
    first_name: "",
    last_name: "",
    job_title: "",
    department: "",
    email: "",
    phone: "",
    linkedin_url: "",
    is_decision_maker: false
  });

  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, [search]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contacts?search=${search}`);
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewContact({
          company_id: "",
          first_name: "",
          last_name: "",
          job_title: "",
          department: "",
          email: "",
          phone: "",
          linkedin_url: "",
          is_decision_maker: false
        });
        fetchContacts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const set = (patch: Partial<typeof newContact>) => setNewContact({ ...newContact, ...patch });

  return (
    <ListPage
      header={{
        title: "Contacts Directory",
        breadcrumb,
        info: "Manage individual lead contacts, decision makers, and emails.",
        actions: <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowAddModal(true)}>Add contact</Button>,
      }}
      toolbar={<Toolbar search={<SearchInput value={search} onValueChange={setSearch} placeholder="Search contacts" />} />}
    >
      <DataTable
        label="Contacts"
        columns={columns}
        rows={contacts}
        getRowId={(c) => c.id}
        loading={loading}
        emptyState={<EmptyState icon={<Users size={24} strokeWidth={1.5} />} title="No contacts found" description="Get started by creating your first business contact." action={<Button variant="primary" onClick={() => setShowAddModal(true)}>Add contact</Button>} />}
      />

      <Modal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="Create contact profile"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" form="contact-form" variant="primary">Create contact</Button>
          </>
        }
      >
        <form id="contact-form" onSubmit={handleCreateContact} className="grid grid-cols-2 gap-4">
          <FormField label="First name" required>
            {(f) => <Input {...f} required placeholder="John" value={newContact.first_name} onChange={e => set({ first_name: e.target.value })} />}
          </FormField>
          <FormField label="Last name">
            {(f) => <Input {...f} placeholder="Doe" value={newContact.last_name} onChange={e => set({ last_name: e.target.value })} />}
          </FormField>
          <div className="col-span-2">
            <FormField label="Associated company" required>
              {(f) => <Select {...f} required placeholder="Select account…" value={newContact.company_id || undefined} onValueChange={(company_id) => set({ company_id })} options={companies.map((c) => ({ value: c.id, label: c.name }))} />}
            </FormField>
          </div>
          <FormField label="Job title">
            {(f) => <Input {...f} placeholder="VP Operations" value={newContact.job_title} onChange={e => set({ job_title: e.target.value })} />}
          </FormField>
          <FormField label="Department">
            {(f) => <Input {...f} placeholder="Supply Chain" value={newContact.department} onChange={e => set({ department: e.target.value })} />}
          </FormField>
          <FormField label="Email address" required>
            {(f) => <Input {...f} required type="email" placeholder="john.doe@company.com" value={newContact.email} onChange={e => set({ email: e.target.value })} />}
          </FormField>
          <FormField label="Phone number">
            {(f) => <Input {...f} placeholder="+91…" value={newContact.phone} onChange={e => set({ phone: e.target.value })} />}
          </FormField>
          <div className="col-span-2">
            <Checkbox label="Mark as decision maker" checked={newContact.is_decision_maker} onCheckedChange={(is_decision_maker) => set({ is_decision_maker })} />
          </div>
        </form>
      </Modal>
    </ListPage>
  );
}
