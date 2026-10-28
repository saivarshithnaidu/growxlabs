"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, LogOut, Mail, MoreHorizontal, Pencil, Settings, Target, Trash2, Upload, Users } from "lucide-react";
import {
  AppShell, Breadcrumb, Button, CommandPalette, DataTable, DataTableColumn, Density, IconButton, KPIItem, KPIStrip, KeyValueList,
  NavGroup, NavItem, NavRailItem, SectionPanel, StatusBadge, Timeline, UserMenu, Avatar,
} from "@/src/components/ui";
import { EmptyState, ErrorState, PageHeader } from "@/src/components/patterns";
import { Labeled, Row, Section } from "./Specimen";
import { SAMPLE_LEADS, SAMPLE_MODULES, SampleLead, inr, relative } from "./sample";

export const LEAD_COLUMNS: DataTableColumn<SampleLead>[] = [
  { id: "company", header: "Company", sortValue: (r) => r.company, cell: (r) => <span className="ds-t-body-strong text-[var(--text-primary)]">{r.company}</span> },
  { id: "contact", header: "Contact", sortValue: (r) => r.contact },
  { id: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge domain="lead" status={r.status} /> },
  { id: "owner", header: "Owner", cell: (r) => <span className="inline-flex items-center gap-2"><Avatar name={r.owner} size={20} />{r.owner}</span> },
  { id: "value", header: "Value", numeric: true, sortValue: (r) => r.value, cell: (r) => inr(r.value) },
  { id: "score", header: "Score", numeric: true, sortValue: (r) => r.score },
  { id: "created", header: "Created", sortValue: (r) => r.created, cell: (r) => <span className="ds-t-meta text-[var(--text-muted)]">{relative(r.created)}</span> },
];

export function LeadRowActions() {
  return (
    <>
      <IconButton size={28} label="Email" icon={<Mail size={16} strokeWidth={1.5} />} />
      <IconButton size={28} label="Edit" icon={<Pencil size={16} strokeWidth={1.5} />} />
      <IconButton size={28} label="More" icon={<MoreHorizontal size={16} strokeWidth={1.5} />} />
    </>
  );
}

export function DataSection() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>(["L-1041", "L-1043"]);
  const [density, setDensity] = useState<Density>("comfortable");
  const pageRows = useMemo(() => SAMPLE_LEADS.slice((page - 1) * 10, page * 10), [page]);
  return (
    <Section id="data" title="DataTable, KPIStrip, Timeline, KeyValueList">
      <Row label="Full table" stack>
        <p className="ds-t-meta text-[var(--text-muted)]">Sortable headers (click to cycle), right-aligned numbers, sticky header within 360px, hover actions, selection + bulk bar, density toggle, pagination.</p>
        <DataTable
          label="Leads"
          columns={LEAD_COLUMNS}
          rows={pageRows}
          getRowId={(r) => r.id}
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
          bulkActions={(ids) => (
            <>
              <Button size={28} iconLeft={<Users size={14} strokeWidth={1.5} />}>Assign {ids.length}</Button>
              <Button size={28} variant="danger" iconLeft={<Trash2 size={14} strokeWidth={1.5} />}>Delete</Button>
            </>
          )}
          rowActions={() => <LeadRowActions />}
          showDensityToggle
          density={density}
          onDensityChange={setDensity}
          maxHeight={360}
          pagination={{ page, pageSize: 10, total: SAMPLE_LEADS.length, onPageChange: setPage }}
        />
      </Row>
      <Row label="Density toggle" stack>
        <p className="ds-t-meta text-[var(--text-muted)]">Clear the selection above to see the density toggle (44 / 36px rows).</p>
      </Row>
      <Row label="Loading" stack>
        <DataTable label="Leads loading" columns={LEAD_COLUMNS} rows={[]} getRowId={(r) => r.id} loading skeletonRows={3} />
      </Row>
      <Row label="Empty" stack>
        <DataTable label="Lead imports" columns={LEAD_COLUMNS.slice(0, 4)} rows={[]} getRowId={(r) => r.id}
          emptyState={<EmptyState title="No imports yet" description="Imported prospects appear here for review." action={<Button variant="primary">Import leads</Button>} />} />
      </Row>
      <Row label="Error" stack>
        <DataTable label="Invoices" columns={LEAD_COLUMNS.slice(0, 4)} rows={[]} getRowId={(r) => r.id} emptyState={<ErrorState description="Invoices couldn't be loaded." onRetry={() => {}} />} />
      </Row>
      <Row label="KPIStrip" stack>
        <KPIStrip>
          <KPIItem label="Open leads" value="128" delta={{ value: "12%", direction: "up" }} hint="vs last 30 days" />
          <KPIItem label="Pipeline value" value="₹48.2L" delta={{ value: "4%", direction: "down" }} />
          <KPIItem label="Avg. response" value="3.4h" delta={{ value: "18%", direction: "down", good: true }} hint="Lower is better" />
          <KPIItem label="Win rate" value="24%" />
        </KPIStrip>
        <KPIStrip>
          <KPIItem label="Loading" value="" loading />
          <KPIItem label="Loading" value="" loading />
          <KPIItem label="Loading" value="" loading />
        </KPIStrip>
      </Row>
      <Row label="Timeline" stack>
        <div className="max-w-xl">
          <Timeline items={[
            { id: "1", title: "Moved to Qualified", meta: "by Priya Raman", time: "2h ago", tone: "success" },
            { id: "2", title: "Email sent: Proposal follow-up", time: "Yesterday", icon: <Mail size={12} strokeWidth={1.5} />, body: "Shared the revised scope and pricing for phase 1." },
            { id: "3", title: "Imported from CSV", meta: "Batch IMP-2026-104", time: "Oct 21", icon: <Upload size={12} strokeWidth={1.5} /> },
            { id: "4", title: "Bounce detected", time: "Oct 20", tone: "danger" },
          ]} />
        </div>
      </Row>
      <Row label="KeyValueList" stack>
        <KeyValueList columns={2} items={[
          { label: "Company", value: "Northwind Traders" }, { label: "Owner", value: "Priya Raman" },
          { label: "Status", value: <StatusBadge domain="lead" status="qualified" /> }, { label: "Value", value: inr(420000) },
          { label: "Source", value: "GrowX Crawl" }, { label: "Website", value: null },
        ]} />
      </Row>
    </Section>
  );
}

export function NavigationSection() {
  const [palette, setPalette] = useState(false);
  const sales = SAMPLE_MODULES[1];
  return (
    <Section id="navigation" title="Navigation & shell">
      <Row label="NavRailItem">
        <div className="w-14 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] py-2">
          <NavRailItem label="Customer & Sales" icon={Users} href="/admin/design#navigation" active />
        </div>
        {(["default", "hover", "focus"] as const).map((s) => (
          <Labeled key={s} label={s}>
            <div className="w-14 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] py-2">
              <NavRailItem label="Projects" icon={Target} href="/admin/design#navigation" data-force={s === "default" ? undefined : s} />
            </div>
          </Labeled>
        ))}
        <span className="ds-t-meta text-[var(--text-muted)]">First: active (2×20 accent bar)</span>
      </Row>
      <Row label="NavItem">
        <div className="flex w-[232px] flex-col gap-0.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-2">
          <NavItem label="Leads" href="/admin/design#navigation" icon={Target} count={128} />
          <NavItem label="Hover" href="/admin/design#navigation" icon={Target} data-force="hover" />
          <NavItem label="Focus" href="/admin/design#navigation" icon={Target} data-force="focus" />
          <NavItem label="Lead Imports (active)" href="/admin/design#navigation" icon={Upload} count={3} active />
          <NavItem label="A very long label that truncates with an ellipsis" href="/admin/design#navigation" icon={CheckCircle2} />
        </div>
      </Row>
      <Row label="SectionPanel">
        <div className="h-80 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]">
          <SectionPanel title={sales.label} onCollapse={() => {}}>
            {sales.groups.map((g, gi) => (
              <NavGroup key={g.label} label={g.label} first={gi === 0}>
                {g.items.map((it) => <NavItem key={it.href} {...it} active={it.href === "/demo/leads/imports"} />)}
              </NavGroup>
            ))}
          </SectionPanel>
        </div>
      </Row>
      <Row label="Breadcrumb" stack>
        <Breadcrumb items={[{ label: "Customer & Sales", href: "/admin/design#navigation" }, { label: "Lead Imports" }]} />
        <Breadcrumb items={[{ label: "Customer & Sales", href: "/admin/design#navigation" }, { label: "Leads", href: "/admin/design#navigation" }, { label: "Northwind Traders" }]} />
      </Row>
      <Row label="UserMenu / palette">
        <UserMenu name="Priya Raman" role="Admin" items={[{ label: "Settings", icon: <Settings size={16} strokeWidth={1.5} />, href: "/admin/design#navigation" }, { label: "Sign out", icon: <LogOut size={16} strokeWidth={1.5} />, onSelect: () => {}, danger: true, separated: true }]} />
        <Button variant="secondary" onClick={() => setPalette(true)}>Open command palette</Button>
        <CommandPalette open={palette} onOpenChange={setPalette} items={SAMPLE_MODULES.flatMap((m) => m.groups.flatMap((g) => g.items.map((i) => ({ id: m.id + i.href, label: i.label, group: m.label, icon: i.icon, hint: g.label.toLowerCase(), onSelect: () => {} }))))} />
      </Row>
      <Row label="AppShell" stack>
        <p className="ds-t-meta text-[var(--text-muted)]">Embedded, with shortcuts off. Active item uses longest-match: /demo/leads/imports activates Lead Imports only, not Leads. Collapse the panel, then hover a rail icon to see the Flyout.</p>
        <div className="h-[560px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] [transform:translateZ(0)]">
          <AppShell
            embedded
            shortcuts={false}
            modules={SAMPLE_MODULES}
            pathname="/demo/leads/imports"
            exactHrefs={["/demo"]}
            logo={<span className="ds-t-body-bold flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--bg-inverse)] text-[var(--text-inverse)]">G</span>}
            user={{ name: "Priya Raman", role: "Admin", items: [{ label: "Sign out", icon: <LogOut size={16} strokeWidth={1.5} />, onSelect: () => {}, danger: true }] }}
          >
            <PageHeader title="Lead Imports" breadcrumb={[{ label: "Customer & Sales", href: "/admin/design#navigation" }]} info="Review crawl prospects before they enter the Lead Pool." actions={<><Button iconLeft={<Upload size={16} strokeWidth={1.5} />}>Upload CSV</Button><Button variant="primary">Import leads</Button></>} />
            <DataTable label="Imports" columns={LEAD_COLUMNS.slice(0, 4)} rows={[]} getRowId={(r) => r.id} emptyState={<EmptyState title="No imports yet" description="Imported prospects appear here for review." action={<Button variant="primary">Import leads</Button>} />} />
          </AppShell>
        </div>
      </Row>
    </Section>
  );
}
