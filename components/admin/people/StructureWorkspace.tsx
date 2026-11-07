"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Building2, Layers, Plus } from "lucide-react";
import { Button, DataTable, Input, Modal, Select, Textarea, toast, type DataTableColumn } from "@/src/components/ui";
import { EmptyState, ErrorState, FormField, ListPage } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { fetchJson, sendJson, type Department, type Designation, type Employee } from "./people-data";

type Kind = "departments" | "designations";
type Row = { id: string; name: string; detail: string | null; extra: string | null; people: number };

const NONE = "none";
const BLANK = { id: "", name: "", detail: "", extra: NONE };

/* Departments and designations share one screen: a list with a people count and one add/edit dialog. */
export default function StructureWorkspace({ kind }: { kind: Kind }) {
  const breadcrumb = useAdminBreadcrumb();
  const isDepartments = kind === "departments";
  const singular = isDepartments ? "department" : "designation";
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [d, g, e] = await Promise.all([
        fetchJson<{ items: Department[] }>("/api/hrms/departments"),
        fetchJson<{ items: Designation[] }>("/api/hrms/designations"),
        fetchJson<{ employees: Employee[] }>("/api/hrms/employees"),
      ]);
      setDepartments(d.items || []);
      setDesignations(g.items || []);
      setEmployees(e.employees || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Couldn't load ${kind}.`);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const rows = useMemo<Row[]>(() => {
    const nameOf = (id: string | null) => employees.find((e) => e.id === id)?.full_name ?? null;
    const departmentOf = (id: string | null) => departments.find((d) => d.id === id)?.name ?? null;
    return isDepartments
      ? departments.map((d) => ({ id: d.id, name: d.name, detail: d.description, extra: nameOf(d.head_id), people: employees.filter((e) => e.department_id === d.id).length }))
      : designations.map((d) => ({ id: d.id, name: d.title, detail: d.level, extra: departmentOf(d.department_id), people: employees.filter((e) => e.designation_id === d.id).length }));
  }, [isDepartments, departments, designations, employees]);

  function edit(row: Row) {
    const source = isDepartments ? departments.find((d) => d.id === row.id)?.head_id : designations.find((d) => d.id === row.id)?.department_id;
    setForm({ id: row.id, name: row.name, detail: row.detail || "", extra: source || NONE });
    setFormError("");
    setOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const extra = form.extra === NONE ? null : form.extra;
    const body = isDepartments
      ? { name: form.name, description: form.detail, head_id: extra }
      : { title: form.name, level: form.detail, department_id: extra };
    try {
      await sendJson(`/api/hrms/${kind}`, form.id ? "PATCH" : "POST", form.id ? { ...body, id: form.id } : body);
      setOpen(false);
      toast({ title: form.id ? "Saved" : `${isDepartments ? "Department" : "Designation"} added`, variant: "success" });
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setSaving(false);
    }
  }

  const unset = <span className="text-[var(--text-disabled)]">Not set</span>;
  const columns: DataTableColumn<Row>[] = [
    {
      id: "name",
      header: isDepartments ? "Department" : "Designation",
      width: "40%",
      sortValue: (r) => r.name,
      cell: (r) => <span className="ds-t-body-strong text-[var(--text-primary)]">{r.name}</span>,
    },
    isDepartments
      ? { id: "detail", header: "About", width: "34%", cell: (r) => <span className="block truncate text-[var(--text-secondary)]">{r.detail || unset}</span> }
      : { id: "detail", header: "Level", sortValue: (r) => r.detail || "", cell: (r) => r.detail || unset },
    { id: "extra", header: isDepartments ? "Head" : "Department", sortValue: (r) => r.extra || "", cell: (r) => r.extra || unset },
    { id: "people", header: "People", numeric: true, sortValue: (r) => r.people, cell: (r) => <span className="ds-num">{r.people}</span> },
  ];

  const extraOptions = [
    { value: NONE, label: "Not set" },
    ...(isDepartments ? employees.map((e) => ({ value: e.id, label: e.full_name })) : departments.map((d) => ({ value: d.id, label: d.name }))),
  ];

  const startAdding = () => { setForm(BLANK); setFormError(""); setOpen(true); };

  return (
    <ListPage
      header={{
        title: isDepartments ? "Departments" : "Designations",
        breadcrumb,
        actions: <Button variant="primary" iconLeft={<Plus size={14} />} onClick={startAdding}>Add {singular}</Button>,
      }}
    >
      {error ? (
        <ErrorState title={`Couldn't load ${kind}`} description={error} onRetry={load} />
      ) : (
        <DataTable
          label={isDepartments ? "Departments" : "Designations"}
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          loading={loading}
          hideToolbar
          onRowClick={edit}
          emptyState={
            <EmptyState
              icon={isDepartments ? <Building2 size={20} /> : <Layers size={20} />}
              title={`No ${kind} yet`}
              action={<Button variant="primary" onClick={startAdding}>Add {singular}</Button>}
            />
          }
        />
      )}

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? form.name || `Edit ${singular}` : `Add ${singular}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="structure-form" loading={saving}>{form.id ? "Save" : `Add ${singular}`}</Button>
          </>
        }
      >
        <form id="structure-form" onSubmit={submit} className="flex flex-col gap-4">
          <FormField label={isDepartments ? "Name" : "Title"} required>
            {(field) => <Input {...field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          </FormField>
          <FormField label={isDepartments ? "About" : "Level"}>
            {(field) => isDepartments
              ? <Textarea id={field.id} aria-describedby={field["aria-describedby"]} rows={2} value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
              : <Input {...field} value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />}
          </FormField>
          <FormField label={isDepartments ? "Head" : "Department"}>
            {(field) => <Select {...field} value={form.extra} onValueChange={(v) => setForm({ ...form, extra: v })} options={extraOptions} />}
          </FormField>
          {formError && <p role="alert" className="ds-t-meta text-[var(--danger)]">{formError}</p>}
        </form>
      </Modal>
    </ListPage>
  );
}
