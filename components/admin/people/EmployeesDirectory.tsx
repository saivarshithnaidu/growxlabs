"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import {
  Avatar, Badge, Button, DataTable, Drawer, Input, KeyValueList, Modal, SearchInput, Select, toast, type DataTableColumn,
} from "@/src/components/ui";
import { EmptyState, ErrorState, FormField, ListPage, Toolbar } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import {
  fetchJson, formatDate, sendJson, statusLabel, STATUS_BADGE, STATUS_OPTIONS, typeLabel, TYPE_OPTIONS,
  type Department, type Designation, type Employee,
} from "./people-data";

const BLANK = { employee_id: "", full_name: "", email: "", phone: "", joining_date: "", department_id: "", designation_id: "", employment_type: "FULL_TIME", work_location: "" };
const NONE = "none";
const ALL = "all";

/* The employee directory: one list, one profile drawer. Everything shown comes from the employees table. */
export default function EmployeesDirectory() {
  const breadcrumb = useAdminBreadcrumb();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Employee>>({});
  const [draftError, setDraftError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [e, d, g] = await Promise.all([
        fetchJson<{ employees: Employee[] }>("/api/hrms/employees"),
        fetchJson<{ items: Department[] }>("/api/hrms/departments"),
        fetchJson<{ items: Designation[] }>("/api/hrms/designations"),
      ]);
      setEmployees(e.employees || []);
      setDepartments(d.items || []);
      setDesignations(g.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Employees could not be loaded.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const byId = useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);
  const open = openId ? byId.get(openId) ?? null : null;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter((e) => {
      if (departmentFilter !== ALL && e.department_id !== departmentFilter) return false;
      if (statusFilter !== ALL && e.status !== statusFilter) return false;
      return !q || [e.full_name, e.employee_id, e.email].some((v) => v?.toLowerCase().includes(q));
    });
  }, [employees, search, departmentFilter, statusFilter]);

  const departmentOptions = departments.map((d) => ({ value: d.id, label: d.name }));
  const designationOptions = designations.map((d) => ({ value: d.id, label: d.title }));
  const withNone = (options: { value: string; label: string }[]) => [{ value: NONE, label: "Not set" }, ...options];

  function openProfile(e: Employee) {
    setOpenId(e.id);
    setDraftError("");
    setDraft({
      department_id: e.department_id, designation_id: e.designation_id, reporting_manager_id: e.reporting_manager_id,
      employment_type: e.employment_type, status: e.status, work_location: e.work_location, phone: e.phone,
    });
  }

  async function addEmployee(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await sendJson("/api/hrms/employees", "POST", { ...form, status: "ACTIVE" });
      setAdding(false);
      setForm(BLANK);
      toast({ title: "Employee added", variant: "success" });
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't add the employee.");
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile() {
    if (!open) return;
    setSaving(true);
    setDraftError("");
    try {
      const { employee } = await sendJson<{ employee: Employee }>(`/api/hrms/employees/${open.id}`, "PATCH", draft);
      setEmployees((list) => list.map((e) => (e.id === employee.id ? employee : e)));
      setOpenId(null);
      toast({ title: "Saved", variant: "success" });
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setSaving(false);
    }
  }

  const columns: DataTableColumn<Employee>[] = [
    {
      id: "name",
      header: "Employee",
      width: "30%",
      sortValue: (e) => e.full_name,
      cell: (e) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <Avatar name={e.full_name} size={28} />
          <span className="min-w-0">
            <span className="ds-t-body-strong block truncate text-[var(--text-primary)]">{e.full_name}</span>
            <span className="ds-t-meta block truncate text-[var(--text-muted)]">{e.email || e.employee_id}</span>
          </span>
        </span>
      ),
    },
    { id: "department", header: "Department", sortValue: (e) => e.department?.name || "", cell: (e) => e.department?.name || <Unset /> },
    { id: "designation", header: "Designation", sortValue: (e) => e.designation?.title || "", cell: (e) => e.designation?.title || <Unset /> },
    { id: "manager", header: "Manager", sortValue: (e) => byId.get(e.reporting_manager_id || "")?.full_name || "", cell: (e) => byId.get(e.reporting_manager_id || "")?.full_name || <Unset /> },
    { id: "joined", header: "Joined", sortValue: (e) => e.joining_date || "", cell: (e) => (e.joining_date ? <span className="ds-num">{formatDate(e.joining_date)}</span> : <Unset />) },
    { id: "status", header: "Status", sortValue: (e) => e.status || "", cell: (e) => <Badge variant={STATUS_BADGE[e.status || ""] || "neutral"}>{statusLabel(e.status)}</Badge> },
  ];

  const filtered = Boolean(search.trim()) || departmentFilter !== ALL || statusFilter !== ALL;

  return (
    <ListPage
      header={{
        title: "Employees",
        breadcrumb,
        actions: <Button variant="primary" iconLeft={<Plus size={14} />} onClick={() => { setFormError(""); setAdding(true); }}>Add employee</Button>,
      }}
      toolbar={
        !error && employees.length > 0 ? (
          <Toolbar
            search={<SearchInput value={search} onValueChange={setSearch} placeholder="Search name, ID or email" aria-label="Search employees" />}
            filters={
              <>
                <Select aria-label="Department" className="w-44" value={departmentFilter} onValueChange={setDepartmentFilter} options={[{ value: ALL, label: "All departments" }, ...departmentOptions]} />
                <Select aria-label="Status" className="w-36" value={statusFilter} onValueChange={setStatusFilter} options={[{ value: ALL, label: "All statuses" }, ...STATUS_OPTIONS]} />
              </>
            }
          />
        ) : undefined
      }
    >
      {error ? (
        <ErrorState title="Employees couldn't load" description={error} onRetry={load} />
      ) : (
        <DataTable
          label="Employees"
          columns={columns}
          rows={rows}
          getRowId={(e) => e.id}
          loading={loading}
          hideToolbar
          onRowClick={openProfile}
          activeRowId={openId}
          emptyState={
            filtered
              ? <EmptyState title="No one matches" description="Try a different search or filter." />
              : <EmptyState icon={<Users size={20} />} title="No employees yet" action={<Button variant="primary" onClick={() => setAdding(true)}>Add employee</Button>} />
          }
        />
      )}

      <Modal
        open={adding}
        onOpenChange={setAdding}
        title="Add employee"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAdding(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="add-employee" loading={saving}>Add employee</Button>
          </>
        }
      >
        <form id="add-employee" onSubmit={addEmployee} className="grid gap-4 sm:grid-cols-2">
          <Text label="Full name" required value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
          <Text label="Employee ID" required value={form.employee_id} onChange={(v) => setForm({ ...form, employee_id: v })} />
          <Text label="Work email" required type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Text label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Choice label="Department" value={form.department_id} options={departmentOptions} onChange={(v) => setForm({ ...form, department_id: v })} />
          <Choice label="Designation" value={form.designation_id} options={designationOptions} onChange={(v) => setForm({ ...form, designation_id: v })} />
          <Text label="Joining date" type="date" value={form.joining_date} onChange={(v) => setForm({ ...form, joining_date: v })} />
          <Choice label="Employment type" value={form.employment_type} options={TYPE_OPTIONS} onChange={(v) => setForm({ ...form, employment_type: v })} />
          {formError && <p role="alert" className="ds-t-meta text-[var(--danger)] sm:col-span-2">{formError}</p>}
        </form>
      </Modal>

      <Drawer
        open={Boolean(open)}
        onOpenChange={(value) => { if (!value) setOpenId(null); }}
        title={open?.full_name}
        description={open ? [open.designation?.title, open.employee_id].filter(Boolean).join(" · ") : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpenId(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveProfile} loading={saving}>Save</Button>
          </>
        }
      >
        {open && (
          <div className="flex flex-col gap-5">
            <KeyValueList
              items={[
                { label: "Email", value: open.email || <Unset /> },
                { label: "Joined", value: formatDate(open.joining_date) || <Unset /> },
                { label: "Employment", value: typeLabel(open.employment_type) || <Unset /> },
              ]}
            />
            <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-5">
              <Choice label="Status" value={draft.status || ""} options={STATUS_OPTIONS} onChange={(v) => setDraft({ ...draft, status: v })} />
              <Choice label="Department" value={draft.department_id || NONE} options={withNone(departmentOptions)} onChange={(v) => setDraft({ ...draft, department_id: v === NONE ? null : v })} />
              <Choice label="Designation" value={draft.designation_id || NONE} options={withNone(designationOptions)} onChange={(v) => setDraft({ ...draft, designation_id: v === NONE ? null : v })} />
              <Choice
                label="Manager"
                value={draft.reporting_manager_id || NONE}
                options={withNone(employees.filter((e) => e.id !== open.id).map((e) => ({ value: e.id, label: e.full_name })))}
                onChange={(v) => setDraft({ ...draft, reporting_manager_id: v === NONE ? null : v })}
              />
              <Choice label="Employment type" value={draft.employment_type || ""} options={TYPE_OPTIONS} onChange={(v) => setDraft({ ...draft, employment_type: v })} />
              <Text label="Phone" value={draft.phone || ""} onChange={(v) => setDraft({ ...draft, phone: v })} />
              <Text label="Work location" value={draft.work_location || ""} onChange={(v) => setDraft({ ...draft, work_location: v })} />
              {draftError && <p role="alert" className="ds-t-meta text-[var(--danger)]">{draftError}</p>}
            </div>
          </div>
        )}
      </Drawer>
    </ListPage>
  );
}

function Unset() {
  return <span className="text-[var(--text-disabled)]">Not set</span>;
}

function Text({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) {
  return (
    <FormField label={label} required={required}>
      {(field) => <Input {...field} type={type} value={value} onChange={(e) => onChange(e.target.value)} />}
    </FormField>
  );
}

function Choice({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return (
    <FormField label={label}>
      {(field) => <Select {...field} value={value} onValueChange={onChange} options={options} placeholder="Choose" />}
    </FormField>
  );
}
