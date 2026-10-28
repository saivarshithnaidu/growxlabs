"use client";

import React, { useState } from "react";
import { ArrowLeft, FileText, MapPin, Plus } from "lucide-react";
import { Badge, Button, Card, CardHeader, CurrencyAmount, DataTable, DataTableColumn, KPIItem, KPIStrip, KeyValueList } from "@/src/components/ui";
import { DetailPage, EmptyState } from "@/src/components/patterns";
import { ActivityTimeline } from "@/src/components/business";
import type { BreadcrumbItem } from "@/src/components/ui";

interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  gst?: string;
  pan?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  employees_count?: number;
  annual_revenue?: number;
  status?: string;
  notes?: string;
  owner?: { name: string };
  contacts?: any[];
  deals?: any[];
  documents?: any[];
}

interface Customer360Props {
  company: Company;
  timelineActivities: any[];
  breadcrumb?: BreadcrumbItem[];
  onBack?: () => void;
  onAddContact?: () => void;
  onAddDeal?: () => void;
}

const contactColumns: DataTableColumn<any>[] = [
  { id: "name", header: "Name", cell: (c) => <span className="ds-t-body-strong text-[var(--text-primary)]">{c.first_name} {c.last_name}</span> },
  { id: "job_title", header: "Job title", cell: (c) => c.job_title || "General Staff" },
  { id: "email", header: "Email", cell: (c) => c.email || "—" },
  { id: "phone", header: "Phone", cell: (c) => c.phone || "Not set" },
  { id: "dm", header: "Decision maker", cell: (c) => c.is_decision_maker ? <Badge variant="success">Yes</Badge> : <Badge variant="neutral" noDot>No</Badge> },
];

const dealColumns: DataTableColumn<any>[] = [
  { id: "name", header: "Deal", cell: (d) => <span className="ds-t-body-strong text-[var(--text-primary)]">{d.name}</span> },
  { id: "stage", header: "Stage", cell: (d) => d.stage?.name || "New stage" },
  { id: "close", header: "Expected close", cell: (d) => d.expected_close_date || "No expected close" },
  { id: "value", header: "Value", numeric: true, cell: (d) => <CurrencyAmount value={d.value} /> },
];

export function Customer360({ company, timelineActivities, breadcrumb, onBack, onAddContact, onAddDeal }: Customer360Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "deals" | "timeline" | "documents">("overview");

  const totalDealsValue = company.deals?.reduce((acc, curr) => acc + Number(curr.value || 0), 0) || 0;
  const activeDealsCount = company.deals?.filter(d => d.status !== "WON" && d.status !== "LOST").length || 0;

  return (
    <DetailPage
      header={{
        title: company.name,
        breadcrumb,
        info: [company.industry || "General Industry", `${company.city || "Unknown City"}, ${company.country || "Global"}`].join(" · "),
        actions: (
          <>
            <Badge variant={company.status === "active" ? "success" : "neutral"}>{company.status || "prospect"}</Badge>
            {onBack && <Button variant="ghost" iconLeft={<ArrowLeft size={16} strokeWidth={1.5} />} onClick={onBack}>Back to directory</Button>}
          </>
        ),
      }}
      tabs={[
        { value: "overview", label: "Overview" },
        { value: "contacts", label: "Contacts", count: company.contacts?.length || 0 },
        { value: "deals", label: "Deals", count: company.deals?.length || 0 },
        { value: "timeline", label: "Timeline", count: timelineActivities.length },
        { value: "documents", label: "Documents", count: company.documents?.length || 0 },
      ]}
      activeTab={activeTab}
      onTabChange={(v) => setActiveTab(v as typeof activeTab)}
      side={
        activeTab === "overview" ? (
          <Card>
            <CardHeader title="AI lead details" />
            <KeyValueList items={[
              { label: "Employees", value: company.employees_count || "Unknown" },
              { label: "Annual revenue", value: <CurrencyAmount value={company.annual_revenue || 0} /> },
            ]} />
            <p className="ds-t-meta mt-4 mb-1 text-[var(--text-muted)]">Internal notes</p>
            <p className="ds-t-body whitespace-pre-wrap rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] p-3 text-[var(--text-secondary)]">{company.notes || "No summary logged."}</p>
          </Card>
        ) : undefined
      }
    >
      {activeTab === "overview" && (
        <div className="flex flex-col gap-4">
          <KPIStrip>
            <KPIItem label="Total pipeline" value={<CurrencyAmount value={totalDealsValue} />} />
            <KPIItem label="Active deals" value={activeDealsCount} />
          </KPIStrip>
          <Card>
            <CardHeader title="Account profile" />
            <KeyValueList columns={2} items={[
              { label: "Website", value: company.website ? <a href={company.website} target="_blank" rel="noopener noreferrer" className="ds-focus rounded-[var(--radius-xs)] text-[var(--accent)] hover:text-[var(--accent-active)]">{company.website}</a> : "Not configured" },
              { label: "Account owner", value: company.owner?.name || "Unassigned" },
              { label: "GST", value: <span className="ds-t-mono">{company.gst || "Not set"}</span> },
              { label: "PAN", value: <span className="ds-t-mono">{company.pan || "Not set"}</span> },
              { label: "Address", value: <span className="inline-flex items-center gap-1"><MapPin size={14} strokeWidth={1.5} className="text-[var(--text-muted)]" />{company.address ? `${company.address}, ${company.city}, ${company.state}, ${company.country}` : "No address logged"}</span> },
            ]} />
          </Card>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="flex flex-col gap-3">
          {onAddContact && <div className="flex justify-end"><Button iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={onAddContact}>Add contact</Button></div>}
          <DataTable label="Key contacts" columns={contactColumns} rows={company.contacts || []} getRowId={(c) => c.id} emptyState={<EmptyState title="No contacts" description="No contacts assigned to this company." />} />
        </div>
      )}

      {activeTab === "deals" && (
        <div className="flex flex-col gap-3">
          {onAddDeal && <div className="flex justify-end"><Button iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={onAddDeal}>New deal</Button></div>}
          <DataTable label="Active deals" columns={dealColumns} rows={company.deals || []} getRowId={(d) => d.id} emptyState={<EmptyState title="No deals" description="No deals associated with this account." />} />
        </div>
      )}

      {activeTab === "timeline" && (
        <Card><ActivityTimeline activities={timelineActivities} /></Card>
      )}

      {activeTab === "documents" && (
        !company.documents || company.documents.length === 0 ? (
          <Card padding="none"><EmptyState icon={<FileText size={24} strokeWidth={1.5} />} title="No documents" description="No documents uploaded for this company." /></Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {company.documents.map((doc) => (
              <Card key={doc.id} padding="sm" className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] text-[var(--text-muted)]"><FileText size={16} strokeWidth={1.5} /></span>
                <span className="min-w-0">
                  <span className="ds-t-body-strong block truncate text-[var(--text-primary)]">{doc.title}</span>
                  <span className="ds-t-meta block text-[var(--text-muted)]">Version {doc.version} · {doc.file_type}</span>
                </span>
              </Card>
            ))}
          </div>
        )
      )}
    </DetailPage>
  );
}
