"use client";

import { useEffect, useState } from "react";
import { Network, Users } from "lucide-react";
import { Avatar, Badge, DataTable, type DataTableColumn } from "@/src/components/ui";
import { EmptyState, ErrorState, ListPage } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { fetchJson, statusLabel, STATUS_BADGE, type Employee } from "./people-data";

type Member = Employee & { depth: number };

/* The signed-in person's reports. Reporting lines come from each employee's manager field. */
export default function TeamWorkspace() {
  const breadcrumb = useAdminBreadcrumb();
  const [members, setMembers] = useState<Member[]>([]);
  const [linked, setLinked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchJson<{ linked: boolean; members: Member[] }>("/api/hrms/team");
      setLinked(data.linked);
      setMembers(data.members || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your team couldn't load.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const columns: DataTableColumn<Member>[] = [
    {
      id: "name",
      header: "Name",
      width: "40%",
      cell: (m) => (
        <span className="flex min-w-0 items-center gap-2.5" style={{ paddingLeft: (m.depth - 1) * 24 }}>
          <Avatar name={m.full_name} size={28} />
          <span className="ds-t-body-strong truncate text-[var(--text-primary)]">{m.full_name}</span>
        </span>
      ),
    },
    { id: "designation", header: "Designation", cell: (m) => m.designation?.title || <span className="text-[var(--text-disabled)]">Not set</span> },
    { id: "reports", header: "Reports", cell: (m) => (m.depth === 1 ? "Direct" : "Indirect") },
    { id: "status", header: "Status", cell: (m) => <Badge variant={STATUS_BADGE[m.status || ""] || "neutral"}>{statusLabel(m.status)}</Badge> },
  ];

  return (
    <ListPage header={{ title: "My team", breadcrumb }}>
      {error ? (
        <ErrorState title="Your team couldn't load" description={error} onRetry={load} />
      ) : !loading && !linked ? (
        <EmptyState icon={<Users size={20} />} title="Your login isn't linked to an employee" description="Add an employee with the same email as your login to see your team here." />
      ) : (
        <DataTable
          label="My team"
          columns={columns}
          rows={members}
          getRowId={(m) => m.id}
          loading={loading}
          hideToolbar
          emptyState={<EmptyState icon={<Network size={20} />} title="No one reports to you yet" description="Set a manager on an employee's profile to build reporting lines." />}
        />
      )}
    </ListPage>
  );
}
