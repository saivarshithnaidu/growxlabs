"use client";

import { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { Avatar, Badge, DataTable, Drawer, KeyValueList, SearchInput, Select, type DataTableColumn } from "@/src/components/ui";
import { EmptyState, ErrorState, ListPage, Toolbar } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { fetchJson, formatDate, statusLabel, STATUS_BADGE, STATUS_OPTIONS, typeLabel, type Department, type Employee } from "./people-data";

const ALL = "all";

/* The employee directory. New employees arrive through hiring (Convert to employee). */
export default function EmployeesDirectory() {
  const breadcrumb = useAdminBreadcrumb();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchJson<{ employees: Employee[]; departments: Department[] }>("/api/hrms/directory");
      setEmployees(data.employees || []);
      setDepartments(data.departments || []);
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

  const managerName = (e: Employee) => byId.get(e.reporting_manager_id || "")?.full_name;
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
    { id: "manager", header: "Manager", sortValue: (e) => managerName(e) || "", cell: (e) => managerName(e) || <Unset /> },
    { id: "joined", header: "Joined", sortValue: (e) => e.joining_date || "", cell: (e) => (e.joining_date ? <span className="ds-num">{formatDate(e.joining_date)}</span> : <Unset />) },
    { id: "status", header: "Status", sortValue: (e) => e.status || "", cell: (e) => <Badge variant={STATUS_BADGE[e.status || ""] || "neutral"}>{statusLabel(e.status)}</Badge> },
  ];

  const filtered = Boolean(search.trim()) || departmentFilter !== ALL || statusFilter !== ALL;

  return (
    <ListPage
      header={{ title: "Employees", breadcrumb }}
      toolbar={
        !error && employees.length > 0 ? (
          <Toolbar
            search={<SearchInput value={search} onValueChange={setSearch} placeholder="Search name, ID or email" aria-label="Search employees" />}
            filters={
              <>
                <Select aria-label="Department" className="w-44" value={departmentFilter} onValueChange={setDepartmentFilter} options={[{ value: ALL, label: "All departments" }, ...departments.map((d) => ({ value: d.id, label: d.name }))]} />
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
          onRowClick={(e) => setOpenId(e.id)}
          activeRowId={openId}
          emptyState={filtered ? <EmptyState title="No one matches" description="Try a different search or filter." /> : <EmptyState icon={<Users size={20} />} title="No employees yet" />}
        />
      )}

      <Drawer
        open={Boolean(open)}
        onOpenChange={(value) => { if (!value) setOpenId(null); }}
        title={open?.full_name}
        description={open ? [open.designation?.title, open.employee_id].filter(Boolean).join(" · ") : undefined}
      >
        {open && (
          <KeyValueList
            items={[
              { label: "Email", value: open.email || <Unset /> },
              { label: "Status", value: statusLabel(open.status) },
              { label: "Department", value: open.department?.name || <Unset /> },
              { label: "Manager", value: managerName(open) || <Unset /> },
              { label: "Joined", value: formatDate(open.joining_date) || <Unset /> },
              { label: "Employment", value: typeLabel(open.employment_type) || <Unset /> },
              { label: "Location", value: open.work_location || <Unset /> },
            ]}
          />
        )}
      </Drawer>
    </ListPage>
  );
}

function Unset() {
  return <span className="text-[var(--text-disabled)]">Not set</span>;
}
