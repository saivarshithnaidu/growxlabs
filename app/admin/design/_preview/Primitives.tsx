"use client";
import { useState } from "react";
import Link from "next/link";
import { Copy, Download, Filter, Mail, MoreHorizontal, Pencil, Plus, Search, Settings, Trash2, Upload } from "lucide-react";
import {
  Avatar, AvatarGroup, Badge, Button, ButtonSize, ButtonVariant, Card, CardHeader, Checkbox, Combobox, Divider,
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  Drawer, FilterChip, IconButton, Input, Kbd, Modal, Pagination, RadioGroup, SearchInput, Select, Skeleton, SkeletonText,
  StatusBadge, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, Toast, Tooltip, toast,
} from "@/src/components/ui";
import { Labeled, Row, Section } from "./Specimen";
import { SAMPLE_PEOPLE } from "./sample";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "danger"];
const SIZES: ButtonSize[] = [28, 32, 36];
const OWNERS = [
  { value: "priya", label: "Priya Raman", hint: "Sales" },
  { value: "arjun", label: "Arjun Mehta", hint: "Sales" },
  { value: "sara", label: "Sara Lopez", hint: "Consulting" },
  { value: "daniel", label: "Daniel Kim", hint: "Finance", disabled: true },
];
const STAGES = [
  { value: "new", label: "New" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
];

export function TokensSection() {
  const colors = ["--bg-surface", "--bg-canvas", "--bg-hover", "--bg-active", "--border", "--border-strong", "--text-primary", "--text-secondary", "--text-muted", "--text-disabled", "--accent", "--accent-active", "--accent-tint", "--success", "--warning", "--danger"];
  const type = [
    ["ds-t-title", "Title 20/28 600"], ["ds-t-title-md", "Title md 16/24 600"], ["ds-t-title-sm", "Title sm 14/20 600"], ["ds-t-kpi", "KPI 24/32 600"],
    ["ds-t-body", "Body 13/20 400"], ["ds-t-body-strong", "Body strong 13/20 500"], ["ds-t-body-bold", "Body bold 13/20 600"],
    ["ds-t-meta", "Meta 12/16 400"], ["ds-t-meta-strong", "Meta strong 12/16 500"], ["ds-t-label", "Label 11/16 500 caps"], ["ds-t-mono", "Mono 11/16"],
  ];
  return (
    <Section id="tokens" title="Tokens">
      <Row label="Color">
        {colors.map((c) => (
          <Labeled key={c} label={c}>
            <span className="block h-10 w-20 rounded-[var(--radius-md)] border border-[var(--border)]" style={{ background: `var(${c})` }} />
          </Labeled>
        ))}
      </Row>
      <Row label="Type" stack>
        {type.map(([cls, label]) => <p key={cls} className={`${cls} text-[var(--text-primary)]`}>{label}</p>)}
      </Row>
      <Row label="Radius">
        {["xs", "sm", "md", "lg", "full"].map((r) => (
          <Labeled key={r} label={`--radius-${r}`}>
            <span className="block h-10 w-10 border border-[var(--border-strong)] bg-[var(--bg-canvas)]" style={{ borderRadius: `var(--radius-${r})` }} />
          </Labeled>
        ))}
      </Row>
      <Row label="Elevation">
        <Labeled label="--shadow-flyout"><span className="block h-12 w-24 rounded-[var(--radius-md)] bg-[var(--bg-surface)] shadow-[var(--shadow-flyout)]" /></Labeled>
        <Labeled label="--shadow-modal"><span className="block h-12 w-24 rounded-[var(--radius-md)] bg-[var(--bg-surface)] shadow-[var(--shadow-modal)]" /></Labeled>
        <Labeled label="--focus-ring"><span className="block h-12 w-24 rounded-[var(--radius-md)] bg-[var(--bg-surface)] shadow-[var(--focus-ring)]" /></Labeled>
      </Row>
    </Section>
  );
}

export function ButtonsSection() {
  return (
    <Section id="button" title="Button & IconButton">
      {VARIANTS.map((v) => (
        <Row key={v} label={v}>
          <Labeled label="default"><Button variant={v}>Save lead</Button></Labeled>
          <Labeled label="hover"><Button variant={v} data-force="hover">Save lead</Button></Labeled>
          <Labeled label="focus"><Button variant={v} data-force="focus">Save lead</Button></Labeled>
          <Labeled label="disabled"><Button variant={v} disabled>Save lead</Button></Labeled>
          <Labeled label="loading"><Button variant={v} loading>Saving</Button></Labeled>
          <Labeled label="with icon"><Button variant={v} iconLeft={<Plus size={16} strokeWidth={1.5} />}>New lead</Button></Labeled>
        </Row>
      ))}
      <Row label="Sizes">
        {SIZES.map((s) => <Labeled key={s} label={`${s}px`}><Button variant="secondary" size={s} iconLeft={<Upload size={s === 28 ? 14 : 16} strokeWidth={1.5} />}>Upload CSV</Button></Labeled>)}
        <Labeled label="asChild (Link)"><Button asChild variant="primary"><Link href="/admin/design#button">Import leads</Link></Button></Labeled>
      </Row>
      <Row label="IconButton">
        {SIZES.map((s) => <Labeled key={s} label={`ghost ${s}`}><IconButton size={s} label="More actions" icon={<MoreHorizontal size={16} strokeWidth={1.5} />} /></Labeled>)}
        <Labeled label="secondary"><IconButton variant="secondary" label="Edit" icon={<Pencil size={16} strokeWidth={1.5} />} /></Labeled>
        <Labeled label="hover"><IconButton label="Copy" icon={<Copy size={16} strokeWidth={1.5} />} data-force="hover" /></Labeled>
        <Labeled label="focus"><IconButton label="Copy" icon={<Copy size={16} strokeWidth={1.5} />} data-force="focus" /></Labeled>
        <Labeled label="danger"><IconButton variant="danger" label="Delete" icon={<Trash2 size={16} strokeWidth={1.5} />} /></Labeled>
        <Labeled label="disabled"><IconButton label="Download" icon={<Download size={16} strokeWidth={1.5} />} disabled /></Labeled>
        <Labeled label="loading"><IconButton variant="secondary" label="Download" icon={<Download size={16} strokeWidth={1.5} />} loading /></Labeled>
      </Row>
    </Section>
  );
}

export function InputsSection() {
  const [search, setSearch] = useState("");
  const [owner, setOwner] = useState<string | null>("priya");
  const [stage, setStage] = useState("qualified");
  const [radio, setRadio] = useState("weekly");
  const [on, setOn] = useState(true);
  return (
    <Section id="inputs" title="Inputs">
      <Row label="Input">
        <Labeled label="default"><Input aria-label="Company" placeholder="Company name" /></Labeled>
        <Labeled label="hover"><Input aria-label="Company" placeholder="Company name" data-force="hover" /></Labeled>
        <Labeled label="focus"><Input aria-label="Company" defaultValue="Acme Robotics" data-force="focus" /></Labeled>
        <Labeled label="disabled"><Input aria-label="Company" defaultValue="Acme Robotics" disabled /></Labeled>
        <Labeled label="error"><Input aria-label="Email" defaultValue="priya@" invalid /></Labeled>
        <Labeled label="leading icon"><Input aria-label="Email" placeholder="name@company.com" leading={<Mail size={16} strokeWidth={1.5} />} /></Labeled>
      </Row>
      <Row label="Sizes">
        {([28, 32, 36] as const).map((s) => <Labeled key={s} label={`${s}px`}><Input size={s} aria-label={`Size ${s}`} placeholder={`${s}px field`} /></Labeled>)}
      </Row>
      <Row label="Textarea">
        <div className="w-80"><Labeled label="default"><Textarea aria-label="Notes" placeholder="Add a note…" /></Labeled></div>
        <div className="w-80"><Labeled label="error"><Textarea aria-label="Notes" defaultValue="Too short" invalid /></Labeled></div>
        <div className="w-80"><Labeled label="disabled"><Textarea aria-label="Notes" defaultValue="Read-only note" disabled /></Labeled></div>
      </Row>
      <Row label="SearchInput">
        <div className="w-64"><Labeled label="live (Esc clears)"><SearchInput value={search} onValueChange={setSearch} placeholder="Search leads" shortcut="/" /></Labeled></div>
        <div className="w-64"><Labeled label="with value"><SearchInput value="acme" onValueChange={() => {}} placeholder="Search leads" /></Labeled></div>
      </Row>
      <Row label="Select">
        <div className="w-48"><Labeled label="default"><Select aria-label="Stage" options={STAGES} value={stage} onValueChange={setStage} /></Labeled></div>
        <div className="w-48"><Labeled label="placeholder"><Select aria-label="Stage" options={STAGES} placeholder="Choose stage" /></Labeled></div>
        <div className="w-48"><Labeled label="focus"><Select aria-label="Stage" options={STAGES} defaultValue="won" data-force="focus" /></Labeled></div>
        <div className="w-48"><Labeled label="error"><Select aria-label="Stage" options={STAGES} invalid placeholder="Required" /></Labeled></div>
        <div className="w-48"><Labeled label="disabled"><Select aria-label="Stage" options={STAGES} defaultValue="new" disabled /></Labeled></div>
      </Row>
      <Row label="Combobox">
        <div className="w-56"><Labeled label="searchable"><Combobox aria-label="Owner" options={OWNERS} value={owner} onValueChange={setOwner} /></Labeled></div>
        <div className="w-56"><Labeled label="empty / error"><Combobox aria-label="Owner" options={OWNERS} value={null} onValueChange={() => {}} invalid placeholder="Assign owner" /></Labeled></div>
        <div className="w-56"><Labeled label="disabled"><Combobox aria-label="Owner" options={OWNERS} value="sara" onValueChange={() => {}} disabled /></Labeled></div>
      </Row>
      <Row label="Checkbox">
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" checked="indeterminate" />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Error" invalid description="Accept terms to continue" />
      </Row>
      <Row label="Switch">
        <Switch label="Email alerts" checked={on} onCheckedChange={setOn} />
        <Switch label="Off" />
        <Switch label="Disabled on" defaultChecked disabled />
        <Switch label="With description" description="Notify owner on stage change" />
      </Row>
      <Row label="RadioGroup">
        <RadioGroup label="Digest" value={radio} onValueChange={setRadio} options={[{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "never", label: "Never", disabled: true }]} orientation="horizontal" />
        <RadioGroup label="Priority" options={[{ value: "high", label: "High", description: "Reply within 4h" }, { value: "normal", label: "Normal", description: "Reply within 24h" }]} invalid />
      </Row>
    </Section>
  );
}

export function ChipsBadgesSection() {
  const [chips, setChips] = useState({ mine: true, stage: "Qualified, Proposal" as string | undefined });
  return (
    <Section id="badges" title="FilterChip, Badge, StatusBadge, Avatar, Kbd">
      <Row label="FilterChip">
        <Labeled label="default"><FilterChip label="Owner" menu /></Labeled>
        <Labeled label="hover"><FilterChip label="Owner" menu data-force="hover" /></Labeled>
        <Labeled label="focus"><FilterChip label="Owner" menu data-force="focus" /></Labeled>
        <Labeled label="toggle"><FilterChip label="My leads" selected={chips.mine} onClick={() => setChips((c) => ({ ...c, mine: !c.mine }))} /></Labeled>
        <Labeled label="applied + clear"><FilterChip label="Stage" value={chips.stage} menu onRemove={chips.stage ? () => setChips((c) => ({ ...c, stage: undefined })) : undefined} /></Labeled>
        <Labeled label="count + icon"><FilterChip label="Filters" icon={<Filter size={14} strokeWidth={1.5} />} count={3} /></Labeled>
        <Labeled label="disabled"><FilterChip label="Region" disabled /></Labeled>
      </Row>
      <Row label="Badge">
        <Badge variant="info">Info</Badge>
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="neutral" noDot>No dot</Badge>
      </Row>
      <Row label="StatusBadge">
        {["new", "contacted", "qualified", "negotiation", "won", "lost"].map((s) => <StatusBadge key={s} domain="lead" status={s} />)}
      </Row>
      <Row label="deal / invoice">
        {["open", "on_hold", "closed_won", "closed_lost"].map((s) => <StatusBadge key={s} domain="deal" status={s} />)}
        <Divider orientation="vertical" />
        {["draft", "sent", "partially_paid", "paid", "overdue", "void"].map((s) => <StatusBadge key={s} domain="invoice" status={s} />)}
        <StatusBadge domain="invoice" status="mystery" />
      </Row>
      <Row label="Avatar">
        {([20, 24, 28, 32, 40] as const).map((s) => <Labeled key={s} label={`${s}px`}><Avatar name="Priya Raman" size={s} /></Labeled>)}
        <Labeled label="broken image → initials"><Avatar name="Arjun Mehta" src="/__missing.png" size={32} /></Labeled>
      </Row>
      <Row label="AvatarGroup">
        <AvatarGroup people={SAMPLE_PEOPLE.slice(0, 3)} />
        <AvatarGroup people={SAMPLE_PEOPLE} max={4} size={28} />
      </Row>
      <Row label="Kbd">
        <Kbd>⌘K</Kbd><Kbd>/</Kbd><Kbd>[</Kbd><Kbd>esc</Kbd>
      </Row>
    </Section>
  );
}

export function OverlaysSection() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [cols, setCols] = useState({ owner: true, value: true, score: false });
  const [page, setPage] = useState(3);
  return (
    <Section id="overlays" title="Tooltip, DropdownMenu, Tabs, Modal, Drawer, Toast, Pagination">
      <Row label="Tooltip">
        <Tooltip content="Hover or focus me"><Button variant="secondary">Hover (300ms)</Button></Tooltip>
        <div className="pb-8"><Tooltip content="Pinned open" side="bottom" open><Button variant="ghost">Open state</Button></Tooltip></div>
      </Row>
      <Row label="DropdownMenu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="secondary" iconRight={<MoreHorizontal size={16} strokeWidth={1.5} />}>Actions</Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem icon={<Pencil size={16} strokeWidth={1.5} />} shortcut="E">Edit</DropdownMenuItem>
            <DropdownMenuItem icon={<Copy size={16} strokeWidth={1.5} />} shortcut="⌘D">Duplicate</DropdownMenuItem>
            <DropdownMenuItem icon={<Download size={16} strokeWidth={1.5} />} disabled>Export (disabled)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={cols.owner} onCheckedChange={(v) => setCols((c) => ({ ...c, owner: v }))}>Owner</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={cols.value} onCheckedChange={(v) => setCols((c) => ({ ...c, value: v }))}>Value</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={cols.score} onCheckedChange={(v) => setCols((c) => ({ ...c, score: v }))}>Score</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<Trash2 size={16} strokeWidth={1.5} />} danger>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>
      <Row label="Tabs" stack>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Lead sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity" count={12}>Activity</TabsTrigger>
            <TabsTrigger value="files" count={3}>Files</TabsTrigger>
            <TabsTrigger value="locked" disabled>Disabled</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><p className="ds-t-body text-[var(--text-secondary)]">Overview panel.</p></TabsContent>
          <TabsContent value="activity"><p className="ds-t-body text-[var(--text-secondary)]">Activity panel.</p></TabsContent>
          <TabsContent value="files"><p className="ds-t-body text-[var(--text-secondary)]">Files panel.</p></TabsContent>
        </Tabs>
      </Row>
      <Row label="Modal / Drawer">
        <Button onClick={() => setModal(true)}>Open modal</Button>
        <Button onClick={() => setDrawer(true)}>Open drawer</Button>
        <Modal open={modal} onOpenChange={setModal} title="Archive lead?" description="Northwind Traders · L-1040" size="sm" footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button variant="danger" onClick={() => setModal(false)}>Archive</Button></>}>
          Archived leads leave the pipeline but keep their history.
        </Modal>
        <Drawer open={drawer} onOpenChange={setDrawer} title="Northwind Traders" description="Lead L-1040" footer={<><Button variant="ghost" onClick={() => setDrawer(false)}>Close</Button><Button variant="primary" onClick={() => setDrawer(false)}>Save</Button></>}>
          <div className="flex flex-col gap-3"><SkeletonText lines={4} /></div>
        </Drawer>
      </Row>
      <Row label="Toast">
        <Toast title="Lead imported" meta="Northwind Traders · just now" variant="success" onClose={() => {}} />
        <Toast title="Sync delayed" meta="Retrying in 30s" variant="warning" onClose={() => {}} />
        <Toast title="Import failed" meta="Row 42: invalid email address in the contact column" variant="danger" onClose={() => {}} action={{ label: "View", onClick: () => {} }} />
        <Toast title="3 leads assigned" variant="info" onClose={() => {}} />
      </Row>
      <Row label="toast()">
        <Button variant="secondary" onClick={() => toast({ title: "Lead saved", meta: "Acme Robotics · moved to Qualified", variant: "success" })}>Fire toast (5s, pauses on hover)</Button>
        <Button variant="ghost" onClick={() => toast({ title: "Import failed", meta: "Network error", variant: "danger" })}>Fire error</Button>
      </Row>
      <Row label="Pagination">
        <div className="w-full max-w-xl"><Pagination page={page} pageSize={25} total={240} onPageChange={setPage} /></div>
        <div className="w-full max-w-xl"><Pagination page={1} pageSize={25} total={18} onPageChange={() => {}} /></div>
      </Row>
    </Section>
  );
}

export function SurfacesSection() {
  return (
    <Section id="surfaces" title="Card, Divider, Skeleton">
      <Row label="Card">
        <Card className="w-72"><CardHeader title="Pipeline value" description="Open deals this quarter" actions={<IconButton size={28} label="Settings" icon={<Settings size={16} strokeWidth={1.5} />} />} /><p className="ds-t-kpi text-[var(--text-primary)]">₹48.2L</p></Card>
        <Card className="w-72" elevated><CardHeader title="Elevated card" /><p className="ds-t-body text-[var(--text-secondary)]">Uses --shadow-flyout.</p></Card>
        <Card className="w-72" padding="none"><div className="p-3"><p className="ds-t-body-strong">padding=&quot;none&quot;</p></div><Divider /><div className="p-3"><p className="ds-t-meta text-[var(--text-muted)]">Edge-to-edge content</p></div></Card>
      </Row>
      <Row label="Divider" stack>
        <Divider />
        <Divider label="or" />
      </Row>
      <Row label="Skeleton">
        <Skeleton width={160} />
        <Skeleton width={32} height={32} radius="full" />
        <div className="w-64"><SkeletonText lines={3} /></div>
      </Row>
      <Row label="Search icon">
        <span className="text-[var(--text-muted)]"><Search size={16} strokeWidth={1.5} /></span>
        <span className="ds-t-meta text-[var(--text-muted)]">Icons: 16px in content, 20px in the rail, stroke 1.5.</span>
      </Row>
    </Section>
  );
}
