"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Layers } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/src/components/ui";
import { EmptyState, ErrorState, ListPage } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { fetchJson, type Department, type Designation, type Employee } from "./people-data";

type Kind = "departments" | "designations";
type Row = { id: string; name: string; detail: string | null; extra: string | null; people: number };

/* Departments and designations share one screen: a list with real people counts. */
export default function StructureWorkspace({ kind }: { kind: Kind }) {
  const breadcrumb = useAdminBreadcrumb();
  const isDepartments = kind === "departments";
  const [data, setData] = useState<{ employees: Employee[]; departments: Department[]; designations: Designation[] }>({ employees: [], departments: [], designations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setData(await fetchJson("/api/hrms/directory"));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Couldn't load ${kind}.`);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const rows = useMemo<Row[]>(() => {
    const { employees, departments, designations } = data;
    return isDepartments
      ? departments.map((d) => ({ id: d.id, name: d.name, detail: d.description, extra: employees.find((e) => e.id === d.head_id)?.full_name ?? null, people: employees.filter((e) => e.department_id === d.id).length }))
      : designations.map((d) => ({ id: d.id, name: d.title, detail: d.level, extra: departments.find((x) => x.id === d.department_id)?.name ?? null, people: employees.filter((e) => e.designation_id === d.id).length }));
  }, [isDepartments, data]);

  const unset = <span className="text-[var(--text-disabled)]">Not set</span>;
  const columns: DataTableColumn<Row>[] = [
    { id: "name", header: isDepartments ? "Department" : "Designation", width: "40%", sortValue: (r) => r.name, cell: (r) => <span className="ds-t-body-strong text-[var(--text-primary)]">{r.name}</span> },
    isDepartments
      ? { id: "detail", header: "About", width: "34%", cell: (r) => <span className="block truncate text-[var(--text-secondary)]">{r.detail || unset}</span> }
      : { id: "detail", header: "Level", sortValue: (r) => r.detail || "", cell: (r) => r.detail || unset },
    { id: "extra", header: isDepartments ? "Head" : "Department", sortValue: (r) => r.extra || "", cell: (r) => r.extra || unset },
    { id: "people", header: "People", numeric: true, sortValue: (r) => r.people, cell: (r) => <span className="ds-num">{r.people}</span> },
  ];

  return (
    <ListPage header={{ title: isDepartments ? "Departments" : "Designations", breadcrumb }}>
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
          emptyState={<EmptyState icon={isDepartments ? <Building2 size={20} /> : <Layers size={20} />} title={`No ${kind} yet`} />}
        />
      )}
    </ListPage>
  );
}
