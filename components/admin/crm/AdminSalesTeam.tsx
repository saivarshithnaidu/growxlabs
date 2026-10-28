"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Alert, Badge, Button, Card, CardHeader, DataTable, DataTableColumn, Input, KPIItem, KPIStrip, Select, Tabs, TabsContent, TabsList, TabsTrigger, formatRelative,
} from "@/src/components/ui";
import { EmptyState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

const PERIODS = [{ value: "today", label: "Today" }, { value: "week", label: "This week" }, { value: "month", label: "This month" }];
const PRIORITIES = ["low", "medium", "high", "urgent"].map((p) => ({ value: p, label: p[0].toUpperCase() + p.slice(1) }));

export function AdminSalesTeam({ initial }: { initial: any }) {
  const breadcrumb = useAdminBreadcrumb();
  const [data, setData] = useState(initial), [tab, setTab] = useState("overview"), [selected, setSelected] = useState<string[]>([]), [employeeId, setEmployeeId] = useState(""), [priority, setPriority] = useState("medium"), [note, setNote] = useState(""), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  async function reload(period = "week") { const r = await fetch(`/api/admin/crm/team?period=${period}`, { cache: "no-store" }); if (r.ok) setData(await r.json()); }
  async function assign() { if (!selected.length || !employeeId) return; setBusy(true); const r = await fetch("/api/admin/crm/team/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadIds: selected, employeeId, priority, assignmentNote: note }) }), body = await r.json(); setBusy(false); if (!r.ok) { setMessage(body.error || "Assignment failed"); return; } setSelected([]); setNote(""); setMessage(`${body.assigned} prospect(s) assigned.`); await reload(); }
  async function review(handoffId: string, action: "accept" | "request_clarification", owner?: string) { const clarification = action === "request_clarification" ? window.prompt("Clarification needed from the BDE:") : undefined; if (action === "request_clarification" && !clarification) return; const r = await fetch(`/api/admin/crm/team/handoffs/${handoffId}/review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, internalOwnerEmployeeId: owner, message: clarification }) }), body = await r.json(); if (!r.ok) setMessage(body.error || "Review failed"); else { setMessage(action === "accept" ? "Handoff accepted." : "Clarification sent to Employee OS."); await reload(); } }
  async function reviewQualification(leadId: string, action: "approve" | "request_clarification") { const clarification = action === "request_clarification" ? window.prompt("What should the BDE clarify?") : undefined; if (action === "request_clarification" && !clarification) return; const r = await fetch(`/api/admin/crm/team/qualifications/${leadId}/review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, message: clarification }) }); if (!r.ok) setMessage((await r.json()).error || "Review failed"); else { setMessage(action === "approve" ? "Qualification approved." : "Clarification sent to Employee OS."); await reload(); } }
  const metrics = data.metrics || {};

  return (
    <div>
      <PageHeader
        title="Employee sales oversight"
        breadcrumb={breadcrumb}
        info="Assignment, execution quality, discovery and handoff governance."
        actions={<div className="w-36"><Select aria-label="Performance period" options={PERIODS} defaultValue="week" onValueChange={(v) => void reload(v)} /></div>}
      />
      {message && <Alert variant="info" className="mb-4">{message}</Alert>}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList aria-label="Sales team sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignment" count={(data.unassigned || []).length}>Assignment</TabsTrigger>
          <TabsTrigger value="pipeline" count={(data.leads || []).length}>Pipeline</TabsTrigger>
          <TabsTrigger value="meetings" count={(data.meetings || []).length}>Meetings</TabsTrigger>
          <TabsTrigger value="handoffs" count={(data.handoffs || []).length}>Handoffs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <KPIStrip>
            <KPIItem label="Assigned" value={metrics.assigned || 0} />
            <KPIItem label="Overdue follow-ups" value={metrics.overdue || 0} />
            <KPIItem label="Qualified" value={metrics.qualified || 0} />
            <KPIItem label="Discovery scheduled" value={metrics.discovery || 0} />
          </KPIStrip>
          <KPIStrip>
            <KPIItem label="New assignments" value={metrics.newAssignments || 0} />
            <KPIItem label="Untouched prospects" value={metrics.untouched || 0} />
            <KPIItem label="Handoffs" value={metrics.handoffs || 0} />
            <KPIItem label="Awaiting review" value={metrics.awaitingHandoff || 0} />
          </KPIStrip>
          <TeamTable items={data.employees || []} />
          <NeedsAttention items={(data.leads || []).filter((lead: any) => lead.staleReason)} />
        </TabsContent>

        <TabsContent value="assignment" className="flex flex-col gap-3">
          <Card padding="sm">
            <div className="grid items-center gap-3 lg:grid-cols-[auto_200px_140px_1fr_auto]">
              <p className="ds-t-body-strong ds-num text-[var(--text-primary)]">{selected.length} selected</p>
              <Select aria-label="BDE" placeholder="Choose BDE" value={employeeId || undefined} onValueChange={setEmployeeId} options={(data.employees || []).map((e: any) => ({ value: e.id, label: `${e.name} · ${e.assigned} assigned` }))} />
              <Select aria-label="Priority" value={priority} onValueChange={setPriority} options={PRIORITIES} />
              <Input aria-label="Assignment note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Assignment note" />
              <Button variant="primary" loading={busy} disabled={!selected.length || !employeeId} onClick={() => void assign()}>Assign</Button>
            </div>
          </Card>
          <CompactLeadTable items={data.unassigned || []} selected={selected} setSelected={setSelected} />
        </TabsContent>

        <TabsContent value="pipeline"><PipelineTable items={data.leads || []} review={reviewQualification} /></TabsContent>
        <TabsContent value="meetings"><MeetingTable items={data.meetings || []} /></TabsContent>
        <TabsContent value="handoffs"><HandoffTable items={data.handoffs || []} employees={data.employees || []} review={review} /></TabsContent>
      </Tabs>
    </div>
  );
}

const leadName = (l: any) => <span className="ds-t-body-strong text-[var(--text-primary)]">{l.business_name || l.name}</span>;
const shortDate = (v?: string | null) => (v ? new Date(v).toLocaleDateString() : "—");

function TeamTable({ items }: { items: any[] }) {
  const n = (id: string, header: string): DataTableColumn<any> => ({ id, header, numeric: true, sortValue: (e) => e[id] });
  const columns: DataTableColumn<any>[] = [
    { id: "name", header: "Employee", sortValue: (e) => e.name, cell: (e) => <span className="ds-t-body-strong text-[var(--text-primary)]">{e.name}</span> },
    n("assigned", "Assigned"), n("contacted", "Contacted"), n("qualifying", "Qualifying"), n("qualified", "Qualified"),
    n("discovery", "Discovery"), n("handoffs", "Handoffs"), n("overdue", "Overdue"),
    { id: "avg", header: "Avg first action", numeric: true, sortValue: (e) => e.averageFirstActionHours, cell: (e) => (e.averageFirstActionHours === null ? "—" : `${e.averageFirstActionHours}h`) },
  ];
  return (
    <section className="flex flex-col gap-2">
      <h2 className="ds-t-title-sm text-[var(--text-primary)]">BDE workload and performance</h2>
      <DataTable label="BDE workload" columns={columns} rows={items} getRowId={(e) => e.id} emptyState={<EmptyState title="No BDEs yet" />} />
    </section>
  );
}

function NeedsAttention({ items }: { items: any[] }) {
  const columns: DataTableColumn<any>[] = [
    { id: "lead", header: "Prospect", cell: (l) => <Link href={`/admin/leads/${l.id}`} className="ds-focus ds-t-body-strong rounded-[var(--radius-xs)] text-[var(--text-primary)] hover:text-[var(--accent)]">{l.business_name || l.name}</Link> },
    { id: "employeeName", header: "BDE" },
    { id: "staleReason", header: "Reason", cell: (l) => <Badge variant="warning">{l.staleReason}</Badge> },
  ];
  return (
    <section className="flex flex-col gap-2">
      <h2 className="ds-t-title-sm text-[var(--text-primary)]">Needs attention</h2>
      <DataTable label="Needs attention" columns={columns} rows={items.slice(0, 20)} getRowId={(l) => l.id} emptyState={<EmptyState title="All clear" description="No deterministic exceptions in this period." />} />
    </section>
  );
}

function CompactLeadTable({ items, selected, setSelected }: { items: any[]; selected: string[]; setSelected: (v: string[]) => void }) {
  const columns: DataTableColumn<any>[] = [
    { id: "prospect", header: "Prospect", sortValue: (l) => l.business_name || l.name, cell: leadName },
    { id: "contact", header: "Contact", cell: (l) => l.email || l.phone || "Missing contact" },
    { id: "status", header: "Status", sortValue: (l) => l.status, cell: (l) => <Badge variant="neutral">{l.status}</Badge> },
    { id: "priority", header: "Priority", sortValue: (l) => l.priority, cell: (l) => <span className="capitalize">{l.priority}</span> },
    { id: "created_at", header: "Created", sortValue: (l) => l.created_at, cell: (l) => shortDate(l.created_at) },
  ];
  return <DataTable label="Unassigned prospects" columns={columns} rows={items} getRowId={(l) => l.id} selectable selectedIds={selected} onSelectionChange={setSelected} maxHeight={520} emptyState={<EmptyState title="Nothing to assign" description="Every prospect has an owner." />} />;
}

function PipelineTable({ items, review }: { items: any[]; review: (id: string, a: "approve" | "request_clarification") => void }) {
  const columns: DataTableColumn<any>[] = [
    { id: "prospect", header: "Prospect", sortValue: (i) => i.business_name || i.name, cell: leadName },
    { id: "employeeName", header: "BDE", sortValue: (i) => i.employeeName },
    { id: "stage", header: "Stage", cell: (i) => <Badge variant="neutral">{i.opportunity?.stage || i.qualification?.state || i.status}</Badge> },
    {
      id: "context",
      header: "Qualification context",
      wrap: true,
      cell: (i) => (
        <span className="flex max-w-72 flex-col">
          <span>{i.qualification?.problem_summary || "Problem not recorded"}</span>
          <span className="ds-t-meta text-[var(--text-muted)]">Next: {i.qualification?.next_step || "—"} · Stakeholders: {i.qualification?.stakeholders || "—"}</span>
        </span>
      ),
    },
    { id: "age", header: "Age", numeric: true, sortValue: (i) => Date.parse(i.updated_at), cell: (i) => `${Math.max(0, Math.floor((Date.now() - Date.parse(i.updated_at)) / 86400000))}d` },
    { id: "lastActivity", header: "Last activity", sortValue: (i) => i.lastActivity, cell: (i) => shortDate(i.lastActivity) },
    { id: "nextFollowup", header: "Next follow-up", sortValue: (i) => i.nextFollowup, cell: (i) => (i.nextFollowup ? new Date(i.nextFollowup).toLocaleString() : "—") },
    {
      id: "review",
      header: "Review",
      cell: (i) =>
        i.qualification && (
          <span className="flex gap-1">
            <Button size={28} onClick={() => void review(i.id, "approve")}>Approve</Button>
            <Button size={28} variant="ghost" onClick={() => void review(i.id, "request_clarification")}>Clarify</Button>
          </span>
        ),
    },
  ];
  return <DataTable label="Qualification pipeline" columns={columns} rows={items} getRowId={(i) => i.id} emptyState={<EmptyState title="No leads in pipeline" />} />;
}

function MeetingTable({ items }: { items: any[] }) {
  const columns: DataTableColumn<any>[] = [
    {
      id: "meeting",
      header: "Meeting",
      wrap: true,
      cell: (m) => (
        <span className="flex max-w-96 flex-col">
          <span className="ds-t-body-strong text-[var(--text-primary)]">{m.opportunity?.name || "Discovery"}</span>
          {m.qualification_summary && <span className="ds-t-meta text-[var(--text-muted)]">{m.qualification_summary}</span>}
        </span>
      ),
    },
    { id: "employeeName", header: "BDE" },
    { id: "scheduled_start", header: "Scheduled", sortValue: (m) => m.scheduled_start, cell: (m) => <time dateTime={m.scheduled_start}>{new Date(m.scheduled_start).toLocaleString()}</time> },
    { id: "prepared", header: "Brief", cell: (m) => (m.prepared_at ? <Badge variant="success">Brief ready</Badge> : <Badge variant="warning">Preparation pending</Badge>) },
  ];
  return <DataTable label="Discovery meetings" columns={columns} rows={items} getRowId={(m) => m.id} emptyState={<EmptyState title="No meetings scheduled" />} />;
}

function HandoffTable({ items, employees, review }: { items: any[]; employees: any[]; review: (id: string, a: "accept" | "request_clarification", owner?: string) => void }) {
  const [owners, setOwners] = useState<Record<string, string>>({});
  if (!items.length) return <Card padding="none"><EmptyState title="No handoffs" description="Accepted qualifications appear here for review." /></Card>;
  return (
    <div className="flex flex-col gap-3">
      {items.map((h) => {
        const owner = owners[h.id] || h.internal_owner_employee_id;
        return (
          <Card key={h.id}>
            <CardHeader
              title={h.lead?.business_name || h.opportunity?.name}
              description={`${h.employeeName} · handed off ${formatRelative(h.handed_off_at)}`}
              actions={<Badge variant={h.review_status === "accepted" ? "success" : "neutral"}>{h.review_status.replaceAll("_", " ")}</Badge>}
            />
            {h.qualification_summary && <p className="ds-t-body mb-3 text-[var(--text-secondary)]">{h.qualification_summary}</p>}
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-56"><Select aria-label="Internal owner" placeholder="Internal owner" value={owner || undefined} onValueChange={(v) => setOwners({ ...owners, [h.id]: v })} options={employees.map((e) => ({ value: e.id, label: e.name }))} /></div>
              <Button variant="primary" disabled={h.review_status === "accepted" || !owner} onClick={() => void review(h.id, "accept", owner)}>Accept</Button>
              <Button onClick={() => void review(h.id, "request_clarification")}>Clarify</Button>
              {h.review_status === "accepted" && (
                <div className="ml-auto flex flex-wrap gap-1">
                  <Button asChild size={28} variant="ghost"><Link href="/admin/proposals">Create proposal</Link></Button>
                  <Button asChild size={28} variant="ghost"><Link href="/admin/quotations">Create quotation</Link></Button>
                  <Button asChild size={28} variant="ghost"><Link href="/admin/agreements">Start agreement</Link></Button>
                  <Button asChild size={28} variant="ghost"><Link href="/admin/onboarding">Client onboarding</Link></Button>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
