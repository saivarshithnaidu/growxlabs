"use client";

import { useState } from "react";
import { ExternalLink, Plus, MapPin, Mail, Globe, Search } from "lucide-react";
import { Button, DataTable, DataTableColumn, Input, Modal, type NavIcon } from "@/src/components/ui";
import { FormField, ListPage } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type Tool = { name: string; type: string; free: string; bestFor: string; link: string; howTo?: string; icon: NavIcon };

const INITIAL_TOOLS: Tool[] = [
  { name: "Apollo.io", type: "Email and contact finder", free: "50 credits/month", bestFor: "Finding business owner emails", link: "https://apollo.io", howTo: "Search by title and city", icon: Mail },
  { name: "Google Maps", type: "Local business finder", free: "Unlimited manual search", bestFor: "Finding local businesses", link: "https://maps.google.com", howTo: "Search 'restaurant [city]'", icon: MapPin },
  { name: "Hunter.io", type: "Email finder", free: "25 searches/month", bestFor: "Finding emails from domain", link: "https://hunter.io", icon: Mail },
  { name: "LinkedIn Sales Nav", type: "B2B lead finder", free: "Trial available", bestFor: "Finding decision makers", link: "https://linkedin.com/sales", icon: Globe },
  { name: "JustDial", type: "Indian business directory", free: "Unlimited", bestFor: "Local Indian businesses", link: "https://justdial.com", howTo: "Search by category and city", icon: Globe },
  { name: "Lusha", type: "Contact data enrichment", free: "5 credits/month", bestFor: "Finding mobile numbers", link: "https://lusha.com", icon: Search },
  { name: "Apify", type: "Automated web scraping", free: "$5 credit", bestFor: "Bulk Google Maps scraping", link: "https://apify.com", icon: Globe },
  { name: "IndiaMART", type: "Indian B2B marketplace", free: "Unlimited browsing", bestFor: "Manufacturing and trade leads", link: "https://indiamart.com", icon: Globe },
  { name: "Sulekha", type: "Indian service directory", free: "Unlimited", bestFor: "Salons, clinics, services", link: "https://sulekha.com", icon: Globe },
  { name: "Skrapp.io", type: "LinkedIn email finder", free: "100 emails/month", bestFor: "LinkedIn profile email extraction", link: "https://skrapp.io", icon: Mail },
  { name: "Snov.io", type: "Email finder and verifier", free: "50 credits/month", bestFor: "Email verification before sending", link: "https://snov.io", icon: Mail },
  { name: "D7 Lead Finder", type: "Automated lead database", free: "Trial", bestFor: "Bulk local business leads", link: "https://d7leadfinder.com", icon: Search },
];

const columns: DataTableColumn<Tool>[] = [
  {
    id: "name",
    header: "Tool",
    sortValue: (t) => t.name,
    cell: (t) => {
      const Icon = t.icon;
      return (
        <span className="flex min-w-0 items-center gap-2.5">
          <Icon size={16} strokeWidth={1.5} className="shrink-0 text-[var(--text-muted)]" />
          <span className="flex min-w-0 flex-col">
            <span className="ds-t-body-strong truncate text-[var(--text-primary)]">{t.name}</span>
            <span className="ds-t-meta truncate text-[var(--text-muted)]">{t.type}</span>
          </span>
        </span>
      );
    },
  },
  { id: "free", header: "Free tier", sortValue: (t) => t.free },
  { id: "bestFor", header: "Best for", wrap: true },
  { id: "howTo", header: "How to use", wrap: true, cell: (t) => t.howTo || "—" },
  {
    id: "link",
    header: "Open",
    cell: (t) => (
      <Button asChild iconOnly variant="ghost">
        <a href={t.link} target="_blank" rel="noreferrer" aria-label={`Open ${t.name}`} title={`Open ${t.name}`}><ExternalLink size={16} strokeWidth={1.5} /></a>
      </Button>
    ),
  },
];

export default function LeadSourcesPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [tools] = useState(INITIAL_TOOLS);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <ListPage
      header={{
        title: "Lead Sources & Tools",
        breadcrumb,
        info: "Reference guide for agents to find and extract leads.",
        actions: <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowAddModal(true)}>Add custom tool</Button>,
      }}
    >
      <DataTable label="Lead sources" columns={columns} rows={tools} getRowId={(t) => t.name} />

      <Modal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="Add custom tool"
        description="Add a new lead generation source to the library."
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary">Save tool</Button>
          </>
        }
      >
        <form className="flex flex-col gap-4">
          <FormField label="Tool name">{(f) => <Input {...f} />}</FormField>
          <FormField label="Category / type">{(f) => <Input {...f} />}</FormField>
          <FormField label="Website URL">{(f) => <Input {...f} />}</FormField>
          <FormField label="Free tier details">{(f) => <Input {...f} />}</FormField>
          <FormField label="How to use" hint="Optional.">{(f) => <Input {...f} />}</FormField>
        </form>
      </Modal>
    </ListPage>
  );
}
