"use client";
import { FormEvent, useMemo, useState } from "react";
import { Download, Mail, Pencil, Plus, Upload } from "lucide-react";
import {
  Avatar, AvatarGroup, Badge, Button, Card, CardHeader, Checkbox, DataTable, FilterChip, IconButton, Input, KPIItem, KPIStrip,
  KeyValueList, SearchInput, Select, StatusBadge, Switch, Textarea, Timeline, toast,
} from "@/src/components/ui";
import {
  DashboardGrid, DashboardGridItem, DetailPage, EmptyState, ErrorState, FormField, FormPage, FormSection, KanbanBoard, KanbanCard,
  KanbanColumn, ListPage, PageHeader, SettingsLayout, Toolbar,
} from "@/src/components/patterns";
import { Row, Section } from "./Specimen";
import { LEAD_COLUMNS, LeadRowActions } from "./DataShell";
import { SAMPLE_LEADS, SAMPLE_PEOPLE, inr, relative } from "./sample";

const crumb = [{ label: "Customer & Sales", href: "/admin/design#patterns" }];

// Each example sits in a framed canvas so it reads as a page.
function Frame({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-canvas)] p-6">{children}</div>;
}

export function PatternsSection() {
  return (
    <Section id="patterns" title="Page patterns">
      <Row label="PageHeader" stack>
        <Frame>
          <PageHeader title="Lead Imports" breadcrumb={crumb} info="Review GrowX Crawl prospects before they enter the canonical Lead Pool." actions={<><Button iconLeft={<Upload size={16} strokeWidth={1.5} />}>Upload CSV</Button><Button variant="primary">Import leads</Button></>} />
          <PageHeader title="No breadcrumb, no actions" />
        </Frame>
      </Row>
      <Row label="ListPage" stack><Frame><ListPageDemo /></Frame></Row>
      <Row label="DetailPage" stack><Frame><DetailPageDemo /></Frame></Row>
      <Row label="FormPage" stack><div className="h-[620px] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-canvas)] px-6 pt-6"><FormPageDemo /></div></Row>
      <Row label="DashboardGrid" stack><Frame><DashboardDemo /></Frame></Row>
      <Row label="KanbanBoard" stack><Frame><KanbanDemo /></Frame></Row>
      <Row label="SettingsLayout" stack><Frame><SettingsDemo /></Frame></Row>
      <Row label="EmptyState / ErrorState" stack>
        <div className="grid gap-4 md:grid-cols-2">
          <Card padding="none"><EmptyState title="No leads match these filters" description="Try removing a filter or widening the date range." action={<Button>Clear filters</Button>} /></Card>
          <Card padding="none"><ErrorState onRetry={() => {}} /></Card>
          <Card padding="none" className="md:col-span-2"><EmptyState size="page" title="Start your pipeline" description="Import leads from a CSV or add one by hand." action={<Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />}>Add lead</Button>} /></Card>
        </div>
      </Row>
    </Section>
  );
}

function ListPageDemo() {
  const [q, setQ] = useState("");
  const [mine, setMine] = useState(false);
  const [page, setPage] = useState(1);
  const rows = useMemo(() => SAMPLE_LEADS.filter((l) => (!q || l.company.toLowerCase().includes(q.toLowerCase())) && (!mine || l.owner === "Priya Raman")), [q, mine]);
  return (
    <ListPage
      header={{ title: "Leads", breadcrumb: crumb, info: "Every prospect in the canonical Lead Pool.", actions: <><Button iconLeft={<Download size={16} strokeWidth={1.5} />}>Export</Button><Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />}>New lead</Button></> }}
      kpis={
        <KPIStrip>
          <KPIItem label="Open leads" value={rows.length} delta={{ value: "12%", direction: "up" }} />
          <KPIItem label="Qualified" value={rows.filter((r) => r.status === "qualified").length} />
          <KPIItem label="Pipeline value" value={inr(rows.reduce((s, r) => s + r.value, 0))} />
        </KPIStrip>
      }
      toolbar={<Toolbar search={<SearchInput value={q} onValueChange={(v) => { setQ(v); setPage(1); }} placeholder="Search companies" />} filters={<><FilterChip label="My leads" selected={mine} onClick={() => { setMine(!mine); setPage(1); }} /><FilterChip label="Stage" menu /><FilterChip label="Owner" menu /></>} />}
    >
      <DataTable
        label="Leads"
        columns={LEAD_COLUMNS}
        rows={rows.slice((page - 1) * 8, page * 8)}
        getRowId={(r) => r.id}
        selectable
        rowActions={() => <LeadRowActions />}
        bulkActions={() => <Button size={28}>Assign</Button>}
        emptyState={<EmptyState title="No leads match" description="Try another search." />}
        pagination={{ page, pageSize: 8, total: rows.length, onPageChange: setPage }}
      />
    </ListPage>
  );
}

function DetailPageDemo() {
  const [tab, setTab] = useState("overview");
  return (
    <DetailPage
      header={{ title: "Northwind Traders", breadcrumb: [...crumb, { label: "Leads", href: "/admin/design#patterns" }], actions: <><IconButton variant="secondary" label="Email" icon={<Mail size={16} strokeWidth={1.5} />} /><Button iconLeft={<Pencil size={16} strokeWidth={1.5} />}>Edit</Button><Button variant="primary">Convert to deal</Button></> }}
      tabs={[{ value: "overview", label: "Overview" }, { value: "activity", label: "Activity", count: 4 }, { value: "files", label: "Files", count: 2 }]}
      activeTab={tab}
      onTabChange={setTab}
      side={
        <>
          <Card><CardHeader title="Details" /><KeyValueList items={[{ label: "Status", value: <StatusBadge domain="lead" status="qualified" /> }, { label: "Value", value: inr(420000) }, { label: "Source", value: "GrowX Crawl" }, { label: "Created", value: "Oct 12, 2026" }]} /></Card>
          <Card><CardHeader title="Team" /><AvatarGroup people={SAMPLE_PEOPLE.slice(0, 5)} max={3} size={28} /></Card>
        </>
      }
    >
      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <KPIStrip><KPIItem label="Score" value="86" /><KPIItem label="Emails" value="14" /><KPIItem label="Meetings" value="2" /></KPIStrip>
          <Card><CardHeader title="Summary" /><p className="ds-t-body text-[var(--text-secondary)]">Mid-market distributor evaluating an AI ops assessment. Champion is the COO; budget confirmed for Q1.</p></Card>
        </div>
      )}
      {tab === "activity" && (
        <Card><Timeline items={[{ id: "a", title: "Moved to Qualified", meta: "by Priya Raman", time: "2h ago", tone: "success" }, { id: "b", title: "Discovery call", time: "Oct 24", tone: "accent" }, { id: "c", title: "Lead created", time: "Oct 12" }]} /></Card>
      )}
      {tab === "files" && <Card padding="none"><EmptyState title="No files yet" description="Proposals and contracts appear here." action={<Button iconLeft={<Upload size={16} strokeWidth={1.5} />}>Upload</Button>} /></Card>}
    </DetailPage>
  );
}

function FormPageDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("priya@");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const errors = { name: !name.trim() ? "Company name is required." : undefined, email: !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email address." : undefined };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.name || errors.email) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); toast({ title: "Lead saved", meta: name, variant: "success" }); }, 800);
  };
  return (
    <FormPage
      header={{ title: "New lead", breadcrumb: [...crumb, { label: "Leads", href: "/admin/design#patterns" }] }}
      onSubmit={onSubmit}
      footerNote={submitted && (errors.name || errors.email) ? "Fix the highlighted fields." : "Draft · not saved"}
      footer={<><Button variant="ghost">Cancel</Button><Button type="submit" variant="primary" loading={saving}>Save lead</Button></>}
    >
      <FormSection title="Company" description="Who this lead belongs to.">
        <FormField label="Company name" required error={submitted ? errors.name : undefined}>
          {(f) => <Input {...f} value={name} onChange={(e) => setName(e.target.value)} placeholder="Northwind Traders" />}
        </FormField>
        <FormField label="Stage" hint="Defaults to New for manual leads.">
          {(f) => <Select {...f} options={[{ value: "new", label: "New" }, { value: "qualified", label: "Qualified" }]} defaultValue="new" />}
        </FormField>
      </FormSection>
      <FormSection title="Contact">
        <FormField label="Email" required error={submitted ? errors.email : undefined} hint="We never email leads automatically.">
          {(f) => <Input {...f} type="email" value={email} onChange={(e) => setEmail(e.target.value)} leading={<Mail size={16} strokeWidth={1.5} />} />}
        </FormField>
        <FormField label="Notes">
          {(f) => <Textarea {...f} placeholder="Context from the first call…" />}
        </FormField>
        <Checkbox label="Add to weekly digest" defaultChecked />
      </FormSection>
    </FormPage>
  );
}

function DashboardDemo() {
  return (
    <>
      <PageHeader title="Overview" info="Snapshot of the workspace." actions={<Button>Customize</Button>} />
      <DashboardGrid>
        <DashboardGridItem span={12}>
          <KPIStrip>
            <KPIItem label="Open leads" value="128" delta={{ value: "12%", direction: "up" }} />
            <KPIItem label="Deals won" value="9" delta={{ value: "2", direction: "up" }} />
            <KPIItem label="Overdue invoices" value="3" delta={{ value: "1", direction: "up", good: false }} />
            <KPIItem label="Utilization" value="76%" />
          </KPIStrip>
        </DashboardGridItem>
        <DashboardGridItem span={8}>
          <Card padding="none">
            <div className="p-4 pb-0"><CardHeader title="Recent leads" actions={<Button size={28} variant="ghost">View all</Button>} /></div>
            <DataTable label="Recent leads" columns={LEAD_COLUMNS.slice(0, 3)} rows={SAMPLE_LEADS.slice(0, 4)} getRowId={(r) => r.id} />
          </Card>
        </DashboardGridItem>
        <DashboardGridItem span={4}>
          <Card className="h-full"><CardHeader title="Activity" /><Timeline items={[{ id: "1", title: "Invoice INV-204 paid", time: "1h", tone: "success" }, { id: "2", title: "New lead: Hooli Cloud", time: "3h", tone: "accent" }, { id: "3", title: "Proposal sent", time: "1d" }]} /></Card>
        </DashboardGridItem>
      </DashboardGrid>
    </>
  );
}

const KANBAN = [
  { stage: "qualified", title: "Qualified", tone: "accent" as const },
  { stage: "proposal", title: "Proposal", tone: "warning" as const },
  { stage: "won", title: "Won", tone: "success" as const },
  { stage: "lost", title: "Lost", tone: "danger" as const },
];

function KanbanDemo() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <KanbanBoard label="Deals by stage">
      {KANBAN.map((col) => {
        const cards = SAMPLE_LEADS.filter((l) => l.status === col.stage).slice(0, 3);
        return (
          <KanbanColumn key={col.stage} title={col.title} count={cards.length} meta={inr(cards.reduce((s, c) => s + c.value, 0))} tone={col.tone} footer={<Button size={28} variant="ghost" iconLeft={<Plus size={14} strokeWidth={1.5} />}>Add deal</Button>}>
            {cards.length === 0 && <li className="ds-t-meta px-2 py-4 text-center text-[var(--text-muted)]">No deals</li>}
            {cards.map((c) => (
              <KanbanCard key={c.id} title={c.company} meta={inr(c.value)} badges={<Badge variant="neutral" noDot>{c.id}</Badge>} footnote={relative(c.created)} assignee={<Avatar name={c.owner} size={20} />} selected={open === c.id} onOpen={() => setOpen(open === c.id ? null : c.id)} />
            ))}
          </KanbanColumn>
        );
      })}
    </KanbanBoard>
  );
}

function SettingsDemo() {
  const [active, setActive] = useState("notifications");
  return (
    <SettingsLayout
      header={{ title: "Settings", breadcrumb: [{ label: "Administration", href: "/admin/design#patterns" }] }}
      sections={[{ id: "profile", label: "Profile" }, { id: "notifications", label: "Notifications" }, { id: "security", label: "Security" }, { id: "billing", label: "Billing" }]}
      active={active}
      onSelect={setActive}
    >
      <Card>
        <CardHeader title={active[0].toUpperCase() + active.slice(1)} description="Changes save automatically." />
        <div className="flex flex-col gap-4">
          <Switch label="Lead assigned to me" description="Email + in-app" defaultChecked />
          <Switch label="Weekly pipeline digest" />
          <Switch label="Invoice overdue" description="Finance team only" disabled />
        </div>
      </Card>
    </SettingsLayout>
  );
}
