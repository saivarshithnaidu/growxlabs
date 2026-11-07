"use client";

import { useEffect, useMemo, useState } from "react";
import { ActionList, ChartCard, CompactFeed, KPIItem, KPIStrip } from "@/src/components/ui";
import { EmptyState, ErrorState, ListPage } from "@/src/components/patterns";
import { fetchJson, formatDate, type Department, type Employee } from "./people-data";

type Leave = { id: string; status?: string | null };

/* People Operations at a glance. Every number is counted from real records; nothing is estimated. */
export default function PeopleOverview() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [e, d, l] = await Promise.all([
        fetchJson<{ employees: Employee[] }>("/api/hrms/employees"),
        fetchJson<{ items: Department[] }>("/api/hrms/departments"),
        fetchJson<{ leaves: Leave[] }>("/api/hrms/leaves"),
      ]);
      setEmployees(e.employees || []);
      setDepartments(d.items || []);
      setLeaves(l.leaves || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The overview couldn't load.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const view = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    const current = employees.filter((e) => e.status !== "TERMINATED");
    const byDepartment = departments
      .map((d) => ({ id: d.id, name: d.name, count: current.filter((e) => e.department_id === d.id).length }))
      .sort((a, b) => b.count - a.count);
    return {
      current,
      active: current.filter((e) => e.status === "ACTIVE").length,
      joined: employees.filter((e) => e.joining_date?.startsWith(month)).length,
      pendingLeave: leaves.filter((l) => l.status?.toUpperCase() === "PENDING").length,
      noDepartment: current.filter((e) => !e.department_id).length,
      noDesignation: current.filter((e) => !e.designation_id).length,
      byDepartment,
      largest: Math.max(1, ...byDepartment.map((d) => d.count)),
      recent: [...employees].filter((e) => e.joining_date).sort((a, b) => (b.joining_date! > a.joining_date! ? 1 : -1)).slice(0, 5),
    };
  }, [employees, departments, leaves]);

  const needs = [
    view.pendingLeave > 0 && { id: "leave", label: "Leave requests to review", meta: String(view.pendingLeave), tone: "warning" as const, href: "/admin/hrms/leaves" },
    view.noDepartment > 0 && { id: "department", label: "Employees without a department", meta: String(view.noDepartment), tone: "warning" as const, href: "/admin/people" },
    view.noDesignation > 0 && { id: "designation", label: "Employees without a designation", meta: String(view.noDesignation), tone: "warning" as const, href: "/admin/people" },
  ].filter((item): item is Exclude<typeof item, false> => Boolean(item));

  if (error) {
    return (
      <ListPage header={{ title: "People overview" }}>
        <ErrorState title="The overview couldn't load" description={error} onRetry={load} />
      </ListPage>
    );
  }

  return (
    <ListPage
      header={{ title: "People overview" }}
      kpis={
        <KPIStrip>
          <KPIItem label="People" value={view.current.length} loading={loading} />
          <KPIItem label="Active" value={view.active} loading={loading} />
          <KPIItem label="Joined this month" value={view.joined} loading={loading} />
          <KPIItem label="Leave to review" value={view.pendingLeave} loading={loading} />
        </KPIStrip>
      }
    >
      {!loading && (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <ChartCard title="People by department">
            {view.byDepartment.length ? (
              <ul className="flex flex-col gap-3">
                {view.byDepartment.map((d) => (
                  <li key={d.id}>
                    <div className="ds-t-body mb-1 flex justify-between gap-3 text-[var(--text-primary)]">
                      <span className="truncate">{d.name}</span>
                      <span className="ds-num text-[var(--text-secondary)]">{d.count}</span>
                    </div>
                    <div className="h-1.5 rounded-[var(--radius-full)] bg-[var(--bg-canvas)]">
                      <div className="h-full rounded-[var(--radius-full)] bg-[var(--accent)]" style={{ width: `${(d.count / view.largest) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No departments yet" />
            )}
          </ChartCard>

          <div className="flex min-w-0 flex-col gap-8">
            <ChartCard title="Needs you">
              {needs.length ? <ActionList items={needs} label="Needs you" /> : <p className="ds-t-body text-[var(--text-muted)]">Nothing right now.</p>}
            </ChartCard>
            <ChartCard title="Recent joiners">
              {view.recent.length ? (
                <CompactFeed label="Recent joiners" items={view.recent.map((e) => ({ id: e.id, label: e.full_name, time: formatDate(e.joining_date) }))} />
              ) : (
                <p className="ds-t-body text-[var(--text-muted)]">No joining dates recorded.</p>
              )}
            </ChartCard>
          </div>
        </div>
      )}
    </ListPage>
  );
}
