"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, Building2, CheckCircle2, Globe, Mail, MoreHorizontal, Phone, Plus, Sparkles, Trash2, Upload,
} from "lucide-react";
import {
  Badge, Button, Card, CardHeader, DataTable, DataTableColumn, Drawer, DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, FilterSelect, IconButton, Input, KPIItem, KPIStrip, KeyValueList, Modal,
  SearchInput, StatusBadge, Timeline, toast,
} from "@/src/components/ui";
import { EmptyState, FormField, ListPage, Toolbar } from "@/src/components/patterns";
import { FileUpload, LeadScore } from "@/src/components/business";
import { Lead } from "@/types";
import { useSession } from "next-auth/react";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

const STATUS_OPTIONS = [
  { label: "New", value: "new" },
  { label: "Qualified", value: "qualified" },
  { label: "Outreach", value: "outreach" },
  { label: "Contacted", value: "contacted" },
  { label: "Client", value: "client" },
];
const INDUSTRY_OPTIONS = ["Retail", "Creative", "Technology", "Healthcare", "Hospitality", "Services"].map((v) => ({ label: v, value: v }));

function websiteHref(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

export default function LeadsAdminPage() {
  const breadcrumb = useAdminBreadcrumb();
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isAdminOrCoAdmin = role === "ADMIN" || role === "CO_ADMIN";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // AI Outreach state
  const [, setIsGenerating] = useState(false);
  const [, setGeneratedContent] = useState<{ whatsapp: string, email: string, call: string } | null>(null);

  const [invitation, setInvitation] = useState<{ status: "loading" | "not_invited" | "sent" | "accepted" | "expired" | "revoked"; email?: string | null; expiresAt?: string | null }>({ status: "not_invited" });
  const [inviting, setInviting] = useState(false);

  // New Lead / Import Modals State
  const [showAddLead, setShowAddLead] = useState(false);
  const [showImportLead, setShowImportLead] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLead, setNewLead] = useState({
    business_name: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    status: "new" as Lead['status']
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast({ title: message, variant: type === "success" ? "success" : "danger" });
  };

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leads/list?t=${Date.now()}`);
      const data = await res.json() as Lead[];
      const sortedData = (data || []).sort((a, b) => {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
      setLeads(sortedData);
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch leads", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (!activeLeadId) return;
    let cancelled = false;
    setInvitation({ status: "loading" });
    fetch(`/api/admin/leads/${activeLeadId}/invite-client`, { cache: "no-store" })
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error || "Unable to load invitation status"); return body; })
      .then((body) => { if (!cancelled) setInvitation(body); })
      .catch(() => { if (!cancelled) setInvitation({ status: "not_invited" }); });
    return () => { cancelled = true; };
  }, [activeLeadId]);

  const updateStatus = async (id: string | undefined, status: Lead['status'], extraData: Partial<Lead> = {}) => {
    if (!id) return;

    setUpdatingId(id);
    const previousLeads = [...leads];
    setLeads(current => current.map(l => l.id === id ? { ...l, status, ...extraData } : l));

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extraData })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      showToast("Lead updated successfully");
      await fetchLeads();
    } catch (e: unknown) {
      console.error(e);
      setLeads(previousLeads);
      showToast(e instanceof Error ? e.message : "Update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const inviteQualifiedClient = async (lead: Lead) => {
    if (!lead.id) return;
    setInviting(true);
    try {
      const response = await fetch(`/api/admin/leads/${lead.id}/invite-client`, { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to invite client");
      setInvitation(body);
      showToast(`Secure invitation sent to ${body.email}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Invitation failed", "error");
    } finally {
      setInviting(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete lead");
      }

      showToast("Lead deleted successfully");
      if (activeLeadId === id) setActiveLeadId(null);
      fetchLeads();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  };
  const handleDeleteSelectedLeads = async () => {
    if (selectedLeadIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedLeadIds.length} selected leads?`)) return;

    setIsSubmitting(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const id of selectedLeadIds) {
        const res = await fetch(`/api/leads/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      }

      if (failCount === 0) {
        showToast(`Successfully deleted ${successCount} leads`);
      } else {
        showToast(`Deleted ${successCount} leads (${failCount} failed)`, "error");
      }

      setSelectedLeadIds([]);
      setActiveLeadId(null);
      fetchLeads();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Bulk delete failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };


  const generateAIOutreach = async (lead: Lead, force = false) => {
    if (!lead.id) return;

    if (!force && lead.outreach_generated && lead.outreach_content) {
      setGeneratedContent(lead.outreach_content);
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/leads/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedContent(data);
      await fetchLeads();
      showToast("Strategy Generated ✨");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "AI Generation failed";
      showToast(message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create lead");

      showToast("Lead added successfully");
      setShowAddLead(false);
      setNewLead({ business_name: "", name: "", email: "", phone: "", city: "", status: "new" });
      fetchLeads();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Unable to create lead", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportCSV = async () => {
    if (!selectedFile) {
      showToast("Please select a file", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const text = await selectedFile.text();
      const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");
      if (rawLines.length < 2) throw new Error("File is empty or invalid");

      const parseCSVLine = (line: string) => {
        const result = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') inQuotes = !inQuotes;
          else if (char === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = "";
          } else cur += char;
        }
        result.push(cur.trim());
        return result;
      };

      const headers = parseCSVLine(rawLines[0]).map(h => h.toLowerCase().replace(/["']/g, ""));
      const data = rawLines.slice(1).map(line => {
        const values = parseCSVLine(line).map(v => v.replace(/["']/g, ""));
        const obj: Record<string, string | number | boolean> = {};
        headers.forEach((header, i) => {
          const val = values[i];
          if (!val) return;

          if (header.includes("business") || header.includes("company") || header.includes("organization")) obj.business_name = val;
          if (header.includes("contact") || header.includes("name") || header.includes("founder") || header.includes("person")) obj.name = val;
          if (header.includes("email") || header.includes("mail")) obj.email = val;
          if (header.includes("phone") || header.includes("mobile") || header.includes("contact number")) obj.phone = val;
          if (header.includes("city") || header.includes("location") || header.includes("address")) obj.city = val;
          if (header.includes("status")) obj.status = val;
        });
        return obj;
      });

      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: data })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Import failed");

      showToast(`Success: ${result.count} leads imported`);
      setShowImportLead(false);
      setSelectedFile(null);
      fetchLeads();
    } catch (e: unknown) {
      showToast(`Import Failed: ${e instanceof Error ? e.message : "Unknown error"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenOutreach = (lead: Lead) => {
    setActiveLeadId(lead.id || null);
    generateAIOutreach(lead);
  };

  // --- MOCK INDUSTRY DERIVATION ---
  const getMockIndustry = (businessName: string) => {
    const name = businessName.toLowerCase();
    if (name.includes("jewel") || name.includes("jwl") || name.includes("gold")) return "Retail";
    if (name.includes("studio") || name.includes("design") || name.includes("creative")) return "Creative";
    if (name.includes("tech") || name.includes("software") || name.includes("ai")) return "Technology";
    if (name.includes("clinic") || name.includes("dental") || name.includes("health")) return "Healthcare";
    if (name.includes("hotel") || name.includes("rest") || name.includes("cafe") || name.includes("cater")) return "Hospitality";
    return "Services";
  };

  // KPI Calculations
  const hotLeadsCount = leads.filter(l => (l.lead_score || 0) >= 7).length;
  const totalLeads = leads.length;
  const qualifiedCount = leads.filter(l => l.status === "qualified").length;
  const newCount = leads.filter(l => l.status === "new").length;
  const clientCount = leads.filter(l => l.status === "client").length;
  const conversionRate = totalLeads ? Math.round(((qualifiedCount + clientCount) / totalLeads) * 100) : 0;
  const revenueValue = clientCount * 25000 + qualifiedCount * 5000;

  // Filter implementation
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery ? (
      lead.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true;

    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    const matchesLocation = locationFilter ? lead.city === locationFilter : true;
    const matchesIndustry = industryFilter ? getMockIndustry(lead.business_name) === industryFilter : true;

    return matchesSearch && matchesStatus && matchesLocation && matchesIndustry;
  });

  const selectedLead = leads.find(l => l.id === activeLeadId) || null;

  const columns: DataTableColumn<Lead>[] = [
    {
      id: "company",
      header: "Company",
      width: 320,
      sortValue: (l) => l.business_name,
      cell: (lead) => (
        <span className="flex min-w-0 flex-col">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="ds-t-body-strong truncate text-[var(--text-primary)]" title={lead.business_name}>{lead.business_name}</span>
            {lead.source === "Book a Discovery Call" && <Badge variant="info" noDot>Discovery call</Badge>}
          </span>
          {lead.name && lead.name !== lead.business_name && <span className="ds-t-meta truncate text-[var(--text-muted)]">{lead.name}</span>}
        </span>
      ),
    },
    { id: "status", header: "Status", sortValue: (l) => l.status, cell: (l) => <StatusBadge domain="lead" status={l.status} /> },
    { id: "city", header: "Location", sortValue: (l) => l.city || "", cell: (l) => l.city || "—" },
    { id: "industry", header: "Industry", sortValue: (l) => getMockIndustry(l.business_name), cell: (l) => getMockIndustry(l.business_name) },
    {
      id: "website",
      header: "Website",
      cell: (l) =>
        l.website_url ? (
          <a href={websiteHref(l.website_url)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="ds-focus inline-flex max-w-36 items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)] hover:text-[var(--accent-active)]">
            <Globe size={14} strokeWidth={1.5} className="shrink-0" />
            <span className="truncate">{l.website_url.replace(/(https?:\/\/)?(www\.)?/, "")}</span>
          </a>
        ) : <span className="text-[var(--text-disabled)]">No website</span>,
    },
    { id: "email", header: "Email", sortValue: (l) => l.email || "", cell: (l) => l.email || "—" },
    { id: "phone", header: "Phone", cell: (l) => l.phone || "—" },
    { id: "score", header: "Lead score", sortValue: (l) => l.lead_score || 0, cell: (l) => <LeadScore score={l.lead_score} /> },
    { id: "assigned", header: "Assigned", sortValue: (l) => l.assigned_to_member?.name || "", cell: (l) => l.assigned_to_member?.name || "Unassigned" },
    { id: "created_at", header: "Date added", sortValue: (l) => l.created_at || "", cell: (l) => (l.created_at ? new Date(l.created_at).toLocaleDateString() : "—") },
  ];

  const rowActions = (lead: Lead) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton size={28} label={`Actions for ${lead.business_name}`} icon={<MoreHorizontal size={16} strokeWidth={1.5} />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setActiveLeadId(lead.id || null)}>View details</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleOpenOutreach(lead)}>Start outreach</DropdownMenuItem>
        {lead.status === "qualified"
          ? <DropdownMenuItem onSelect={() => inviteQualifiedClient(lead)}>Invite client</DropdownMenuItem>
          : <DropdownMenuItem onSelect={() => updateStatus(lead.id, 'qualified')}>Mark qualified</DropdownMenuItem>}
        {isAdminOrCoAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem danger icon={<Trash2 size={16} strokeWidth={1.5} />} onSelect={() => handleDeleteLead(lead.id!)}>Delete</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const invitationText = invitation.status === "loading" ? "Checking…" : invitation.status === "accepted" ? "Accepted" : invitation.status === "sent" ? `Sent${invitation.email ? ` to ${invitation.email}` : ""}${invitation.expiresAt ? ` · expires ${new Date(invitation.expiresAt).toLocaleString()}` : ""}` : invitation.status === "expired" ? "Expired — resend required" : invitation.status === "revoked" ? "Revoked" : "Not invited";

  return (
    <ListPage
      header={{
        title: "Leads",
        breadcrumb,
        info: "Sales pipeline & CRM hub. Click a row to open the lead profile.",
        actions: (
          <>
            <Button iconLeft={<Upload size={16} strokeWidth={1.5} />} onClick={() => setShowImportLead(true)}>Import CSV</Button>
            <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowAddLead(true)}>Add lead</Button>
          </>
        ),
      }}
      kpis={
        <KPIStrip>
          <KPIItem label="Total leads" value={totalLeads} loading={loading} />
          <KPIItem label="Qualified" value={qualifiedCount} loading={loading} />
          <KPIItem label="New" value={newCount} loading={loading} />
          <KPIItem label="Hot" value={hotLeadsCount} loading={loading} />
          <KPIItem label="Conversion" value={`${conversionRate}%`} loading={loading} />
          <KPIItem label="Revenue" value={`₹${(revenueValue / 100000).toFixed(1)}L`} loading={loading} />
        </KPIStrip>
      }
      toolbar={
        <Toolbar
          search={<SearchInput value={searchQuery} onValueChange={setSearchQuery} placeholder="Search leads" />}
          filters={
            <>
              <FilterSelect label="Status" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} />
              <FilterSelect label="Location" value={locationFilter} options={Array.from(new Set(leads.map(l => l.city).filter(Boolean))).map(city => ({ label: city!, value: city! }))} onChange={setLocationFilter} />
              <FilterSelect label="Industry" value={industryFilter} options={INDUSTRY_OPTIONS} onChange={setIndustryFilter} />
              {(statusFilter || locationFilter || industryFilter) && (
                <Button size={28} variant="ghost" onClick={() => { setStatusFilter(null); setLocationFilter(null); setIndustryFilter(null); }}>Clear filters</Button>
              )}
            </>
          }
        />
      }
    >
      <DataTable
        label="Leads"
        columns={columns}
        rows={filteredLeads}
        getRowId={(l) => l.id || l.business_name}
        loading={loading}
        onRowClick={(l) => setActiveLeadId(l.id || null)}
        rowActions={rowActions}
        selectable
        selectedIds={selectedLeadIds}
        onSelectionChange={setSelectedLeadIds}
        bulkActions={() => isAdminOrCoAdmin && (
          <Button size={28} variant="danger" loading={isSubmitting} iconLeft={<Trash2 size={14} strokeWidth={1.5} />} onClick={handleDeleteSelectedLeads}>Delete selected</Button>
        )}
        emptyState={<EmptyState icon={<Building2 size={24} strokeWidth={1.5} />} title="No leads matching criteria" description="Try adjusting your filters or search terms to locate leads." />}
      />

      {/* Lead profile drawer */}
      <Drawer
        open={!!selectedLead}
        onOpenChange={(open) => { if (!open) setActiveLeadId(null); }}
        title={selectedLead?.business_name || "Lead"}
        description={selectedLead?.source ? `Source: ${selectedLead.source}` : "Lead intelligence profile"}
        footer={selectedLead && (
          <div className="flex w-full flex-col gap-2">
            {selectedLead.status === "qualified" && <p className="ds-t-meta text-[var(--text-muted)]"><span className="ds-t-meta-strong text-[var(--text-primary)]">Client invitation: </span>{invitationText}</p>}
            <div className="flex flex-wrap justify-end gap-2">
              <Button onClick={() => alert("Proposal generator active for company.")}>Generate proposal</Button>
              <Button onClick={() => router.push(`/admin/leads/${selectedLead.id}`)}>Edit lead details</Button>
              {selectedLead.status === "qualified"
                ? <Button variant="primary" onClick={() => inviteQualifiedClient(selectedLead)} loading={inviting || invitation.status === "loading"} disabled={invitation.status === "accepted"}>{invitation.status === "accepted" ? "Invitation accepted" : invitation.status === "sent" ? "Resend invitation" : "Invite client"}</Button>
                : <Button onClick={() => updateStatus(selectedLead.id, 'qualified')} loading={updatingId === selectedLead.id}>Mark qualified</Button>}
              <Button variant="primary" onClick={() => { generateAIOutreach(selectedLead); showToast("Outreach generator active"); }}>Start outreach</Button>
            </div>
          </div>
        )}
      >
        {selectedLead && (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader title="Opportunity score" />
              <LeadScore score={selectedLead.lead_score} variant="meter" />
            </Card>

            <Card>
              <CardHeader title="Contact details" />
              <KeyValueList items={[
                { label: "Contact person", value: selectedLead.name || "—" },
                { label: "Phone", value: selectedLead.phone ? <a href={`tel:${selectedLead.phone}`} className="ds-focus inline-flex items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)]"><Phone size={14} strokeWidth={1.5} />{selectedLead.phone}</a> : "—" },
                { label: "Email", value: selectedLead.email ? <a href={`mailto:${selectedLead.email}`} className="ds-focus inline-flex items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)]"><Mail size={14} strokeWidth={1.5} />{selectedLead.email}</a> : "—" },
                { label: "Website", value: selectedLead.website_url ? <a href={websiteHref(selectedLead.website_url)} target="_blank" rel="noreferrer" className="ds-focus inline-flex items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)]"><Globe size={14} strokeWidth={1.5} />{selectedLead.website_url}</a> : "—" },
              ]} />
            </Card>

            <Card>
              <CardHeader title={<span className="inline-flex items-center gap-1.5"><Sparkles size={16} strokeWidth={1.5} className="text-[var(--accent)]" />AI analysis</span>} actions={<Badge variant="success">Verified</Badge>} />
              <p className="ds-t-label mb-2 text-[var(--text-muted)]">Critical issues</p>
              <ul className="ds-t-body mb-4 flex flex-col gap-1.5 text-[var(--text-secondary)]">
                {!selectedLead.has_website && <li className="flex items-start gap-2"><AlertTriangle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[var(--danger)]" />No operational website detected.</li>}
                {!selectedLead.google_rating && <li className="flex items-start gap-2"><AlertTriangle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[var(--danger)]" />No Google Business profile rating listed.</li>}
                {selectedLead.instagram_followers && selectedLead.instagram_followers < 500 ? <li className="flex items-start gap-2"><AlertTriangle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[var(--danger)]" />Weak online presence on Instagram ({selectedLead.instagram_followers} followers).</li> : null}
                {selectedLead.has_website && selectedLead.google_rating ? <li className="flex items-start gap-2"><CheckCircle2 size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[var(--success)]" />Digital channels verified and indexed.</li> : null}
              </ul>
              <p className="ds-t-label mb-2 text-[var(--text-muted)]">Recommended action</p>
              <ul className="ds-t-body flex list-disc flex-col gap-1.5 pl-5 text-[var(--text-secondary)] marker:text-[var(--accent)]">
                {!selectedLead.has_website ? (
                  <>
                    <li>Call founder and offer website build audit</li>
                    <li>Pitch custom landing page design</li>
                  </>
                ) : <li>Pitch localized SEO optimization campaign</li>}
                {!selectedLead.google_rating && <li>Offer Google Profile listing configuration</li>}
              </ul>
            </Card>

            <Card>
              <CardHeader title={selectedLead.source === "Book a Discovery Call" ? "Discovery call booking details" : "Notes & brief"} />
              <p className="ds-t-body whitespace-pre-line text-[var(--text-secondary)]">
                {(selectedLead.notes || selectedLead.message)
                  ? (selectedLead.notes || selectedLead.message)?.replace(/\[Source:.*\]/, "").replace(/\[Created By:.*\]/, "").trim()
                  : "No custom notes recorded for this pipeline lead."}
              </p>
            </Card>

            <Card>
              <CardHeader title="Timeline & logs" />
              <Timeline label="Lead timeline" items={[
                { id: "created", title: "Lead created", meta: "Pipeline registered", time: selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : "Recently", tone: "success" },
                ...(selectedLead.outreach_sent ? [{ id: "outreach", title: "Outreach delivered", meta: "Status switched to Contacted", time: "", tone: "accent" as const }] : []),
              ]} />
            </Card>
          </div>
        )}
      </Drawer>

      {/* Add lead */}
      <Modal
        open={showAddLead}
        onOpenChange={setShowAddLead}
        title="Add new lead"
        description="Manually register a business lead in the sales pipeline."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddLead(false)}>Cancel</Button>
            <Button type="submit" form="lead-form" variant="primary" loading={isSubmitting}>Save lead</Button>
          </>
        }
      >
        <form id="lead-form" onSubmit={handleAddLead} className="flex flex-col gap-4">
          <FormField label="Business name" required>
            {(f) => <Input {...f} required placeholder="Company name…" value={newLead.business_name} onChange={(e) => setNewLead({ ...newLead, business_name: e.target.value })} />}
          </FormField>
          <FormField label="Contact person">
            {(f) => <Input {...f} placeholder="Founder or manager name…" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />}
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email">
              {(f) => <Input {...f} type="email" placeholder="email@example.com" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />}
            </FormField>
            <FormField label="Phone">
              {(f) => <Input {...f} placeholder="+91 98…" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />}
            </FormField>
          </div>
        </form>
      </Modal>

      {/* Import CSV */}
      <Modal
        open={showImportLead}
        onOpenChange={(open) => { setShowImportLead(open); if (!open) setSelectedFile(null); }}
        title="Import leads"
        description="Bulk upload business leads from a CSV spreadsheet."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowImportLead(false); setSelectedFile(null); }}>Cancel</Button>
            <Button variant="primary" onClick={handleImportCSV} disabled={!selectedFile} loading={isSubmitting}>Process import</Button>
          </>
        }
      >
        <FileUpload file={selectedFile} onFileChange={setSelectedFile} accept=".csv" label="Select CSV file" hint="Maximum file size 5MB" />
      </Modal>
    </ListPage>
  );
}
