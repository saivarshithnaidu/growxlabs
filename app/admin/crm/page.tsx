"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Check, Download, ExternalLink, FileText, Mail, MoreHorizontal, Phone, Plus, RefreshCw, SlidersHorizontal, Sparkles, Trash2, Upload, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Avatar, Badge, Button, Card, CardHeader, DataTable, DataTableColumn, Drawer, DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, FilterChip, FilterSelect, IconButton, Input, KPIItem, KPIStrip, KeyValueList, Modal,
  RelativeTime, SearchInput, Select, StatusBadge, Textarea, Tooltip, toast, type BadgeVariant,
} from "@/src/components/ui";
import { EmptyState, FormField, ListPage, Toolbar } from "@/src/components/patterns";
import { FileUpload, LeadScore } from "@/src/components/business";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

const UNASSIGNED = "__unassigned";
const STATUSES = ["new", "contacted", "engaged", "qualified", "disqualified"] as const;
const SORT_OPTIONS = [
  { field: "created_at", label: "Date added" },
  { field: "score", label: "Lead score" },
  { field: "deal_value", label: "Deal value" },
  { field: "business_name", label: "Business name" },
];

interface Lead {
  id?: string;
  business_name: string;
  contact_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  business_type?: string;
  source?: string;
  source_tool?: string;
  source_url?: string;
  website_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  has_website?: boolean;
  score?: number;
  status: 'new' | 'contacted' | 'engaged' | 'qualified' | 'disqualified';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  assigned_employee_id?: string;
  assigned_at?: string;
  notes?: string;
  last_contacted_at?: string;
  next_followup_at?: string;
  deal_value?: number;
  tags?: string[];
  custom_fields?: any;
  created_at?: string;
  updated_at?: string;
  assigned_to_member?: {
    name: string;
  };
}

export default function AdminCRMPage() {
  const breadcrumb = useAdminBreadcrumb();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const roleUpper = String(role || "").toUpperCase();
  const isAdminOrCoAdmin = roleUpper === "ADMIN" || roleUpper === "CO_ADMIN";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals & Panels
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Density
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  // Form States
  const [newLead, setNewLead] = useState({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    city: "",
    status: "new" as Lead['status'],
    assigned_to: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [noteInput, setNoteInput] = useState("");

  // Loaders & API Calls
  useEffect(() => {
    fetchLeads();
    fetchTeamMembers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast({ title: message, variant: type === "success" ? "success" : "danger" });
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/leads");
      if (!res.ok) throw new Error("Failed to fetch CRM leads");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch("/api/admin/team");
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.team || []);
      }
    } catch (e) {
      console.error("Error fetching team members:", e);
    }
  };

  // Phase 7: the API updates canonical public.leads only.
  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const resCrm = await fetch(`/api/crm/leads?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!resCrm.ok) {
        const errData = await resCrm.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update lead");
      }

      showToast("Lead updated successfully");
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
      fetchLeads();
    } catch (e: any) {
      showToast(e.message || "Failed to update lead", "error");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const res = await fetch(`/api/crm/leads?id=${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete lead");
      }

      showToast("Lead deleted successfully");
      if (activeLeadId === id) setActiveLeadId(null);
      setSelectedIds(curr => curr.filter(item => item !== id));
      fetchLeads();
    } catch (e: any) {
      showToast(e.message, "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedIds.length} selected leads?`)) return;

    setIsSubmitting(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const id of selectedIds) {
        const res = await fetch(`/api/crm/leads?id=${id}`, {
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

      setSelectedIds([]);
      setActiveLeadId(null);
      fetchLeads();
    } catch (e: any) {
      showToast(e.message || "Bulk delete failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkAssign = async (memberId: string) => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    let successCount = 0;
    
    try {
      for (const id of selectedIds) {
        const res = await fetch(`/api/crm/leads?id=${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assigned_to: memberId, assigned_employee_id: memberId })
        });
        if (res.ok) successCount++;
      }
      showToast(`Assigned ${successCount} leads successfully`);
      setSelectedIds([]);
      fetchLeads();
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead)
      });
      if (!res.ok) throw new Error("Failed to add lead");
      
      showToast("Lead added successfully");
      setShowAddLead(false);
      setNewLead({ business_name: "", contact_name: "", email: "", phone: "", city: "", status: "new", assigned_to: "" });
      fetchLeads();
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async (format: string) => {
    if (format === 'csv') {
      window.location.href = '/api/crm/export?format=csv'; 
    } else {
      alert(`${format.toUpperCase()} export functionality is building...`);
    }
    setShowExport(false);
  };

  const handleImportCSV = async () => {
    if (!selectedFile) return;

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
        const obj: any = {};
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
      setShowImport(false);
      setSelectedFile(null);
      fetchLeads();
    } catch (e: any) {
      showToast(`Import Failed: ${e.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = () => {
    if (!noteInput.trim() || !activeLeadId) return;
    const selectedLead = leads.find(l => l.id === activeLeadId);
    if (!selectedLead) return;

    const timestamp = new Date().toLocaleString();
    const newNotes = selectedLead.notes 
      ? `${selectedLead.notes}\n[${timestamp}] ${noteInput}`
      : `[${timestamp}] ${noteInput}`;

    handleUpdateLead(activeLeadId, { notes: newNotes });
    setNoteInput("");
  };

  // Filter & Sort Pipeline logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.contact_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.city || "").toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesOwner = !ownerFilter || lead.assigned_to === ownerFilter;

    return matchesSearch && matchesStatus && matchesOwner;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let valA = a[sortField as keyof Lead];
    let valB = b[sortField as keyof Lead];

    if (sortField === "assigned_to_member") {
      valA = a.assigned_to_member?.name || "";
      valB = b.assigned_to_member?.name || "";
    }

    if (valA === undefined || valA === null) return sortOrder === "asc" ? -1 : 1;
    if (valB === undefined || valB === null) return sortOrder === "asc" ? 1 : -1;

    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc" 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortOrder === "asc"
      ? (valA as any) - (valB as any)
      : (valB as any) - (valA as any);
  });

  // Calculate Paginated Leads
  const paginatedLeads = sortedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // KPI calculations
  const totalLeads = leads.length;
  const qualifiedCount = leads.filter(l => ['engaged', 'qualified'].includes(l.status)).length;
  const newCount = leads.filter(l => l.status === 'new').length;
  const closedWonCount = leads.filter(l => l.status === 'qualified').length;
  
  // Pipeline deal value sum (fallback to dummy defaults if null)
  const pipelineValue = leads.reduce((sum, lead) => sum + (Number(lead.deal_value) || 0), 0) || (leads.length * 6800);
  const conversionRate = totalLeads ? Math.round((closedWonCount / totalLeads) * 100) : 0;
  const followupsDue = leads.filter(l => l.status === 'new' || l.status === 'contacted').length;

    const selectedLead = leads.find(l => l.id === activeLeadId);

  // Generate structured AI intelligence values based on lead completeness
  const getAIAnalysis = (lead: Lead) => {
    const score = lead.score || 0;
    const completeness = [lead.email, lead.phone, lead.website_url, lead.city].filter(Boolean).length;

    let quality = "Low Profile Quality";
    let variant: BadgeVariant = "neutral";
    if (score >= 7 || completeness >= 3) {
      quality = "High Quality Account";
      variant = "success";
    } else if (score >= 4 || completeness >= 2) {
      quality = "Medium Quality Profile";
      variant = "warning";
    }

    const missingFields = [];
    if (!lead.email) missingFields.push("Email Address");
    if (!lead.phone) missingFields.push("Phone Number");
    if (!lead.website_url) missingFields.push("Website URL");
    if (!lead.city) missingFields.push("City Location");

    const risks = [];
    if (!lead.has_website && !lead.website_url) risks.push("No Active Domain");
    if (!lead.phone && !lead.email) risks.push("Zero Contact Access");
    if (Number(lead.deal_value) > 25000 && score < 5) risks.push("High Ticket Risk");

    const confidence = Math.min(60 + completeness * 10 + (lead.has_website ? 10 : 0), 99);

    return { quality, variant, missingFields, risks, confidence };
  };

  const scoreVariant = (score: number): BadgeVariant => (score >= 70 ? "success" : score >= 40 ? "warning" : "neutral");
  const sortLabel = SORT_OPTIONS.find((o) => o.field === sortField)?.label;

  const columns: DataTableColumn<Lead>[] = [
    {
      id: "business_name",
      header: "Company",
      width: 300,
      sortable: true,
      cell: (lead) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <Avatar name={lead.business_name || "?"} size={24} />
          <span className="flex min-w-0 flex-col">
            <span className="flex min-w-0 items-center gap-1">
              <span className="ds-t-body-strong truncate text-[var(--text-primary)]" title={lead.business_name}>{lead.business_name}</span>
              {lead.website_url && (
                <a href={lead.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} aria-label={`Open ${lead.business_name} website`} className="ds-focus shrink-0 rounded-[var(--radius-xs)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <ExternalLink size={12} strokeWidth={1.5} />
                </a>
              )}
            </span>
            <span className="ds-t-meta truncate text-[var(--text-muted)]">{lead.city || "—"}</span>
          </span>
        </span>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      cell: (lead) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[var(--text-primary)]" title={lead.contact_name || lead.name}>{lead.contact_name || lead.name || "—"}</span>
          <span className="ds-t-meta truncate text-[var(--text-muted)]" title={lead.email || lead.phone}>{lead.email || lead.phone || "—"}</span>
        </span>
      ),
    },
    {
      id: "score",
      header: "Score",
      numeric: true,
      sortable: true,
      cell: (lead) => { const score = Math.round((lead.score || 0) * 10); return <Badge variant={scoreVariant(score)} noDot>{score}</Badge>; },
    },
    { id: "status", header: "Status", sortable: true, cell: (lead) => <StatusBadge domain="lead" status={lead.status} map={{ engaged: "info", contacted: "info" }} /> },
    {
      id: "assigned_to_member",
      header: "Owner",
      sortable: true,
      cell: (lead) =>
        lead.assigned_to_member?.name ? (
          <span className="flex min-w-0 items-center gap-2"><Avatar name={lead.assigned_to_member.name} size={20} /><span className="truncate text-[var(--text-primary)]">{lead.assigned_to_member.name}</span></span>
        ) : <span className="text-[var(--text-disabled)]">Unassigned</span>,
    },
    { id: "last_contacted_at", header: "Last activity", sortable: true, cell: (lead) => <RelativeTime value={lead.last_contacted_at} className="text-[var(--text-muted)]" /> },
    { id: "next_followup_at", header: "Next follow-up", sortable: true, cell: (lead) => (lead.next_followup_at ? new Date(lead.next_followup_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "—") },
    { id: "source", header: "Source", sortable: true, cell: (lead) => <span className="capitalize" title={lead.source || "Organic"}>{lead.source || "Organic"}</span> },
  ];

  const rowActions = (lead: Lead) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton size={28} label={`Actions for ${lead.business_name}`} icon={<MoreHorizontal size={16} strokeWidth={1.5} />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setActiveLeadId(lead.id || null)}>View details</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => { window.location.href = `/admin/leads/${lead.id}`; }}>Edit</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleUpdateLead(lead.id!, { status: 'contacted' })}>Mark contacted</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleUpdateLead(lead.id!, { status: 'qualified' })}>Mark qualified</DropdownMenuItem>
        {isAdminOrCoAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem danger icon={<Trash2 size={16} strokeWidth={1.5} />} onSelect={() => handleDeleteLead(lead.id!)}>Delete</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const ownerOptions = [{ value: UNASSIGNED, label: "Unassigned" }, ...teamMembers.map((m) => ({ value: m.id, label: m.name }))];
  const ai = selectedLead ? getAIAnalysis(selectedLead) : null;

  return (
    <ListPage
      header={{
        title: "CRM Hub",
        breadcrumb,
        info: `${totalLeads} leads in the canonical pipeline.`,
        actions: (
          <>
            <Button variant="ghost" iconLeft={<Upload size={16} strokeWidth={1.5} />} onClick={() => setShowImport(true)}>Import</Button>
            {isAdminOrCoAdmin ? (
              <Button variant="ghost" iconLeft={<Download size={16} strokeWidth={1.5} />} onClick={() => setShowExport(true)}>Export</Button>
            ) : (
              <Tooltip content="Admin permissions required"><span tabIndex={0}><Button variant="ghost" disabled iconLeft={<Download size={16} strokeWidth={1.5} />}>Export</Button></span></Tooltip>
            )}
            <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowAddLead(true)}>New lead</Button>
          </>
        ),
      }}
      kpis={
        <KPIStrip>
          <KPIItem label="Total leads" value={String(totalLeads)} hint="All accounts in pipeline" loading={loading} />
          <KPIItem label="Qualified" value={String(qualifiedCount)} hint="Engaged + qualified" loading={loading} />
          <KPIItem label="Pipeline value" value={`₹${(pipelineValue / 100000).toFixed(1)}L`} hint="Forecasted revenue" loading={loading} />
          <KPIItem label="Conversion" value={`${conversionRate}%`} hint="Won vs. total" loading={loading} />
          <KPIItem label="Follow-ups due" value={String(followupsDue)} hint="Action required" loading={loading} />
        </KPIStrip>
      }
      toolbar={
        <Toolbar
          search={<SearchInput value={searchQuery} onValueChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search leads" />}
          filters={
            <>
              <FilterSelect label="Status" value={statusFilter} options={STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }} />
              {isAdminOrCoAdmin && (
                <FilterSelect label="Owner" allLabel="All owners" value={ownerFilter} options={teamMembers.map((m) => ({ value: m.id, label: m.name }))} onChange={(v) => { setOwnerFilter(v); setCurrentPage(1); }} />
              )}
              <FilterChip
                label="Sort"
                value={sortLabel ? `${sortLabel} ${sortOrder === "asc" ? "↑" : "↓"}` : undefined}
                icon={<SlidersHorizontal size={14} strokeWidth={1.5} />}
                menuContent={
                  <DropdownMenuContent align="start" minWidth={176}>
                    {SORT_OPTIONS.map((opt) => (
                      <DropdownMenuItem key={opt.field} onSelect={() => { setSortField(opt.field); setSortOrder(curr => curr === "asc" ? "desc" : "asc"); }} icon={<Check size={16} strokeWidth={1.5} className={sortField === opt.field ? "text-[var(--accent)]" : "opacity-0"} />}>{opt.label}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                }
              />
            </>
          }
          actions={<IconButton variant="secondary" label="Refresh" icon={<RefreshCw size={16} strokeWidth={1.5} className={loading ? "animate-spin" : undefined} />} onClick={fetchLeads} />}
        />
      }
    >
      <DataTable
        label="CRM leads"
        columns={columns}
        rows={paginatedLeads}
        getRowId={(l) => l.id || l.business_name}
        loading={loading}
        skeletonRows={8}
        onRowClick={(l) => setActiveLeadId(l.id || null)}
        rowActions={rowActions}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={() => isAdminOrCoAdmin && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size={28} loading={isSubmitting} iconLeft={<Users size={14} strokeWidth={1.5} />}>Assign owner</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {teamMembers.map((member) => <DropdownMenuItem key={member.id} onSelect={() => handleBulkAssign(member.id)}>{member.name}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size={28} variant="danger" iconLeft={<Trash2 size={14} strokeWidth={1.5} />} onClick={handleBulkDelete}>Delete</Button>
          </>
        )}
        sort={{ columnId: sortField, direction: sortOrder }}
        onSortChange={(s) => { setSortField(s?.columnId || "created_at"); setSortOrder(s?.direction || "desc"); }}
        density={density}
        onDensityChange={setDensity}
        showDensityToggle
        pagination={{ page: currentPage, pageSize: itemsPerPage, total: sortedLeads.length, onPageChange: setCurrentPage, pageSizeOptions: [25, 50, 100], onPageSizeChange: (n) => { setItemsPerPage(n); setCurrentPage(1); } }}
        emptyState={<EmptyState icon={<Users size={24} strokeWidth={1.5} />} title="No leads found" description="Try adjusting your filters or add a new lead." action={<Button variant="primary" onClick={() => setShowAddLead(true)}>New lead</Button>} />}
      />

      {/* Lead intelligence drawer */}
      <Drawer
        open={!!selectedLead}
        onOpenChange={(open) => { if (!open) setActiveLeadId(null); }}
        title={selectedLead?.business_name || "Lead"}
        description="Lead intelligence profile"
        footer={selectedLead && (
          <>
            <Button onClick={() => handleUpdateLead(selectedLead.id!, { status: 'disqualified' })}>Mark lost</Button>
            <Button variant="primary" onClick={() => handleUpdateLead(selectedLead.id!, { status: 'qualified' })}>Mark won</Button>
          </>
        )}
      >
        {selectedLead && ai && (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader title="Calculated quality" />
              <LeadScore score={selectedLead.score} variant="meter" tone="quality" />
            </Card>

            <Card>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Status">
                  {(f) => <Select {...f} value={selectedLead.status} onValueChange={(v) => handleUpdateLead(selectedLead.id!, { status: v as Lead["status"] })} options={STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} />}
                </FormField>
                <FormField label="Assigned owner">
                  {(f) => (
                    <Select
                      {...f}
                      value={selectedLead.assigned_employee_id || selectedLead.assigned_to || UNASSIGNED}
                      disabled={!isAdminOrCoAdmin && Boolean(role)}
                      onValueChange={(raw) => {
                        const val = raw === UNASSIGNED ? "" : raw;
                        handleUpdateLead(selectedLead.id!, {
                          assigned_to: val || undefined,
                          assigned_employee_id: val || undefined
                        } as any);
                      }}
                      options={ownerOptions}
                    />
                  )}
                </FormField>
              </div>
            </Card>

            <Card>
              <CardHeader title="Contact" />
              <KeyValueList items={[
                { label: "Contact person", value: selectedLead.contact_name || selectedLead.name || "—" },
                { label: "Phone", value: selectedLead.phone ? <a href={`tel:${selectedLead.phone}`} className="ds-focus inline-flex items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)]"><Phone size={14} strokeWidth={1.5} />{selectedLead.phone}</a> : "—" },
                { label: "Email", value: selectedLead.email ? <a href={`mailto:${selectedLead.email}`} className="ds-focus inline-flex items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)]"><Mail size={14} strokeWidth={1.5} />{selectedLead.email}</a> : "—" },
                { label: "Location", value: selectedLead.city || "—" },
                { label: "Source", value: <span className="capitalize">{selectedLead.source || "Organic"}</span> },
              ]} />
            </Card>

            <Card>
              <CardHeader title={<span className="inline-flex items-center gap-1.5"><Sparkles size={16} strokeWidth={1.5} className="text-[var(--accent)]" />AI account insights</span>} actions={<Badge variant={ai.variant}>{ai.quality}</Badge>} />
              <p className="ds-t-label mb-2 text-[var(--text-muted)]">Opportunity analysis</p>
              <ul className="ds-t-body mb-4 flex list-disc flex-col gap-1 pl-5 text-[var(--text-secondary)]">
                <li>Business profile calculated at {ai.confidence}% matching score index.</li>
                {selectedLead.has_website && <li>Valid website domain detected with organic leads presence.</li>}
                {selectedLead.deal_value && <li>Pipeline value is estimated at ₹{Number(selectedLead.deal_value).toLocaleString()}.</li>}
                <li>Recommended target outreach is via direct phone / LinkedIn.</li>
              </ul>
              {ai.missingFields.length > 0 && (
                <div className="mb-4">
                  <p className="ds-t-label mb-2 inline-flex items-center gap-1 text-[var(--warning)]"><AlertCircle size={14} strokeWidth={1.5} />Missing information</p>
                  <div className="flex flex-wrap gap-1">{ai.missingFields.map((f) => <Badge key={f} variant="neutral" noDot>{f}</Badge>)}</div>
                </div>
              )}
              {ai.risks.length > 0 && (
                <div>
                  <p className="ds-t-label mb-2 text-[var(--warning)]">Risk indicators</p>
                  <div className="flex flex-wrap gap-1">{ai.risks.map((r) => <Badge key={r} variant="danger">{r}</Badge>)}</div>
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Account notes" />
              <div className="flex flex-col gap-2">
                <Textarea aria-label="New timeline note" placeholder="Add a new timeline note…" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} rows={3} />
                <Button variant="primary" onClick={handleAddNote}>Save note entry</Button>
              </div>
              {selectedLead.notes && (
                <ul className="mt-3 flex max-h-40 flex-col gap-2 overflow-y-auto border-t border-[var(--border)] pt-3">
                  {selectedLead.notes.split("\n").filter(Boolean).reverse().map((note, idx) => (
                    <li key={idx} className="ds-t-body rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] p-2 text-[var(--text-primary)]">{note}</li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        )}
      </Drawer>

      {/* Export */}
      <Modal open={showExport} onOpenChange={setShowExport} title="Export lead profiles" description="Export all active pipeline records to your desktop." size="sm" footer={<Button variant="ghost" onClick={() => setShowExport(false)}>Cancel</Button>}>
        <button type="button" onClick={() => handleExport('csv')} className="ds-focus flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] p-3 text-left transition-colors hover:bg-[var(--bg-hover)]">
          <FileText size={16} strokeWidth={1.5} className="shrink-0 text-[var(--accent)]" />
          <span className="flex flex-col">
            <span className="ds-t-body-strong text-[var(--text-primary)]">Export as CSV</span>
            <span className="ds-t-meta text-[var(--text-muted)]">Open in Microsoft Excel or Google Sheets</span>
          </span>
        </button>
      </Modal>

      {/* Import */}
      <Modal
        open={showImport}
        onOpenChange={(open) => { setShowImport(open); if (!open) setSelectedFile(null); }}
        title="Import lead records"
        description="Select a CSV spreadsheet matching column headers."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowImport(false); setSelectedFile(null); }}>Cancel</Button>
            <Button variant="primary" onClick={handleImportCSV} disabled={!selectedFile} loading={isSubmitting}>Import spreadsheet</Button>
          </>
        }
      >
        <FileUpload file={selectedFile} onFileChange={setSelectedFile} accept=".csv" label="Click to select CSV file" hint="Maximum file size 5MB" />
      </Modal>

      {/* Add lead */}
      <Modal
        open={showAddLead}
        onOpenChange={setShowAddLead}
        title="Add manual lead"
        description="Enter profile fields to create a new pipeline account."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddLead(false)}>Cancel</Button>
            <Button type="submit" form="crm-lead-form" variant="primary" loading={isSubmitting}>Save profile</Button>
          </>
        }
      >
        <form id="crm-lead-form" onSubmit={handleAddLead} className="flex flex-col gap-4">
          <FormField label="Business name" required>
            {(f) => <Input {...f} required placeholder="Company name…" value={newLead.business_name} onChange={(e) => setNewLead({ ...newLead, business_name: e.target.value })} />}
          </FormField>
          <FormField label="Contact person" required>
            {(f) => <Input {...f} required placeholder="Contact name…" value={newLead.contact_name} onChange={(e) => setNewLead({ ...newLead, contact_name: e.target.value })} />}
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email">
              {(f) => <Input {...f} type="email" placeholder="email@example.com" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />}
            </FormField>
            <FormField label="Phone">
              {(f) => <Input {...f} placeholder="Contact number…" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />}
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="City">
              {(f) => <Input {...f} placeholder="City…" value={newLead.city} onChange={(e) => setNewLead({ ...newLead, city: e.target.value })} />}
            </FormField>
            <FormField label="Assigned owner">
              {(f) => <Select {...f} value={newLead.assigned_to || UNASSIGNED} onValueChange={(v) => setNewLead({ ...newLead, assigned_to: v === UNASSIGNED ? "" : v })} options={ownerOptions} />}
            </FormField>
          </div>
        </form>
      </Modal>
    </ListPage>
  );
}
