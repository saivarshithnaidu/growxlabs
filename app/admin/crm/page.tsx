"use client";

import { useState, useEffect } from "react";
import { AlertCircle, ArrowUpRight, Check, Download, FileText, Mail, MessageSquare, MoreHorizontal, Phone, Plus, RefreshCw, Rows3, Sparkles, Trash2, Upload, UserPlus, Users, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Avatar, Badge, Button, Card, CardHeader, DataTable, DataTableColumn, Drawer, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DueChip, FilterChip, FilterSelect, IconButton, Input, Kbd, KeyValueList, Modal, Monogram,
  RelativeTime, SearchInput, Select, StageBar, StatusBadge, Tabs, TabsList, TabsTrigger, Textarea, Tooltip, CurrencyAmount, formatCurrency, toast, useMediaQuery, type BadgeVariant,
} from "@/src/components/ui";
import { EmptyState, FormField, PageHeader, Toolbar } from "@/src/components/patterns";
import { FileUpload, LeadScore } from "@/src/components/business";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

const UNASSIGNED = "__unassigned";
const STATUSES = ["new", "contacted", "engaged", "qualified", "disqualified"] as const;
const STATUS_META: Record<string, { label: string; color: string; variant: BadgeVariant }> = {
  new: { label: "New", color: "var(--chart-1)", variant: "info" },
  contacted: { label: "Contacted", color: "var(--chart-3)", variant: "info" },
  engaged: { label: "Engaged", color: "var(--chart-2)", variant: "info" },
  qualified: { label: "Qualified", color: "var(--chart-4)", variant: "success" },
  disqualified: { label: "Lost", color: "var(--danger)", variant: "danger" },
};
const STATUS_BADGE_MAP = Object.fromEntries(Object.entries(STATUS_META).map(([k, v]) => [k, v.variant]));
const OPEN_STATUSES = ["new", "contacted", "engaged"];
const DAY_MS = 86_400_000;

// Imported names sometimes arrive in all caps; show them in title case.
const displayName = (value?: string) =>
  value && value.length > 3 && /[A-Z]/.test(value) && value === value.toUpperCase()
    ? value.toLowerCase().replace(/(^|[\s.'-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase())
    : value;

const OPTIONAL_COLUMNS = [
  { id: "score", label: "Score" },
  { id: "last_contacted_at", label: "Last activity" },
  { id: "source", label: "Source" },
];
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
  
  // Pipeline value counts only open leads with a real deal value.
  const openLeads = leads.filter(l => OPEN_STATUSES.includes(l.status));
  const valuedLeads = openLeads.filter(l => Number(l.deal_value) > 0);
  const pipelineValue = valuedLeads.reduce((sum, lead) => sum + Number(lead.deal_value), 0);
  const conversionRate = totalLeads ? Math.round((closedWonCount / totalLeads) * 100) : 0;
  const todayEnd = new Date().setHours(23, 59, 59, 999);
  const neverContacted = openLeads.filter(l => !l.last_contacted_at && !l.next_followup_at).length;
  const followupsDue = openLeads.filter(l => l.next_followup_at && new Date(l.next_followup_at).getTime() <= todayEnd).length;

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

    const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({ score: false, last_contacted_at: true, source: false });
  const wide = useMediaQuery("(min-width: 1280px)");

  // Keyboard: J / K move through the visible rows, Esc closes the detail pane.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable || t.closest("[role=dialog],[role=menu],[role=listbox]"))) return;
      const ids = paginatedLeads.map((l) => l.id).filter(Boolean) as string[];
      if (e.key === "Escape" && activeLeadId) { setActiveLeadId(null); return; }
      if (!ids.length || (e.key !== "j" && e.key !== "k")) return;
      e.preventDefault();
      const i = activeLeadId ? ids.indexOf(activeLeadId) : -1;
      const next = e.key === "j" ? Math.min(ids.length - 1, i + 1) : Math.max(0, i - 1);
      setActiveLeadId(ids[next]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const statusCounts = STATUSES.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s]: leads.filter((l) => l.status === s).length }), {});
  const isDefaultSort = sortField === "created_at" && sortOrder === "desc";
  const sortLabel = SORT_OPTIONS.find((o) => o.field === sortField)?.label;
  const pickStatus = (s: string | null) => { setStatusFilter(s); setCurrentPage(1); };
  const assignOwner = (lead: Lead, memberId: string) =>
    handleUpdateLead(lead.id!, { assigned_to: memberId || undefined, assigned_employee_id: memberId || undefined } as any);

  // A scheduled follow-up wins; otherwise say what the lead is actually waiting on.
  const nextStep = (lead: Lead) => {
    if (lead.next_followup_at) return <DueChip value={lead.next_followup_at} />;
    if (!OPEN_STATUSES.includes(lead.status)) return <span className="ds-t-meta text-[var(--text-disabled)]">Closed</span>;
    if (!lead.last_contacted_at) {
      const waiting = lead.created_at ? Math.max(0, Math.floor((Date.now() - new Date(lead.created_at).getTime()) / DAY_MS)) : null;
      return (
        <span className="ds-t-meta-strong ds-num inline-flex h-6 items-center whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--warning-tint)] px-2 text-[var(--warning)]">
          First contact{waiting ? ` · ${waiting}d` : ""}
        </span>
      );
    }
    return <span className="ds-t-meta text-[var(--text-muted)]">Set follow-up</span>;
  };

  const columns: DataTableColumn<Lead>[] = [
    {
      id: "business_name",
      header: "Company",
      width: "26%",
      sortable: true,
      cell: (lead) => (
        <span className="flex min-w-0 items-center gap-3">
          <Monogram name={lead.business_name || "?"} size={32} />
          <span className="flex min-w-0 flex-col">
            <span className="flex min-w-0 items-center gap-1">
              <span className="ds-t-body-strong truncate text-[var(--text-primary)]" title={lead.business_name}>{displayName(lead.business_name)}</span>
              {lead.website_url && (
                <a href={lead.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} aria-label={`Open ${lead.business_name} website`} className="ds-focus shrink-0 rounded-[var(--radius-xs)] text-[var(--text-muted)] opacity-0 transition-opacity hover:text-[var(--text-primary)] focus-visible:opacity-100 group-hover/row:opacity-100">
                  <ArrowUpRight size={14} strokeWidth={1.5} />
                </a>
              )}
            </span>
            <span className="ds-t-meta truncate text-[var(--text-muted)]">{lead.city || lead.source || "—"}</span>
          </span>
        </span>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      cell: (lead) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[var(--text-primary)]" title={lead.contact_name || lead.name}>{displayName(lead.contact_name || lead.name) || "—"}</span>
          <span className="ds-t-meta truncate text-[var(--text-muted)]" title={lead.email || lead.phone}>{lead.email || lead.phone || "—"}</span>
        </span>
      ),
    },
    { id: "status", header: "Stage", sortable: true, cell: (lead) => <StatusBadge domain="lead" status={lead.status} map={STATUS_BADGE_MAP} label={STATUS_META[lead.status]?.label} /> },
    {
      id: "assigned_to_member",
      header: "Owner",
      sortable: true,
      cell: (lead) =>
        lead.assigned_to_member?.name ? (
          <span className="flex min-w-0 items-center gap-2"><Avatar name={lead.assigned_to_member.name} size={24} /><span className="truncate text-[var(--text-primary)]">{lead.assigned_to_member.name}</span></span>
        ) : <span className="text-[var(--text-disabled)]">Unassigned</span>,
    },
    {
      id: "deal_value",
      header: "Value",
      numeric: true,
      sortable: true,
      cell: (lead) => Number(lead.deal_value) > 0
        ? <CurrencyAmount value={lead.deal_value} compact className="text-[var(--text-primary)]" />
        : <span className="text-[var(--text-disabled)]">—</span>,
    },
    { id: "next_followup_at", header: "Next step", sortable: true, cell: nextStep },
    ...(visibleCols.score ? [{ id: "score", header: "Score", numeric: true, sortable: true, cell: (lead: Lead) => <LeadScore score={lead.score} tone="quality" /> }] : []),
    ...(visibleCols.last_contacted_at ? [{
      id: "last_contacted_at",
      header: "Last activity",
      sortable: true,
      cell: (lead: Lead) => lead.last_contacted_at
        ? <RelativeTime value={lead.last_contacted_at} className="text-[var(--text-muted)]" />
        : <span className="text-[var(--text-disabled)]">Never</span>,
    }] : []),
    ...(visibleCols.source ? [{ id: "source", header: "Source", sortable: true, cell: (lead: Lead) => <span className="capitalize text-[var(--text-muted)]">{lead.source || "Organic"}</span> }] : []),
  ];

  const rowActions = (lead: Lead) => (
    <>
      {lead.phone && (
        <Tooltip content="Call"><Button asChild iconOnly variant="ghost" size={28}><a href={`tel:${lead.phone}`} aria-label={`Call ${lead.business_name}`}><Phone size={14} strokeWidth={1.5} /></a></Button></Tooltip>
      )}
      {lead.email && (
        <Tooltip content="Email"><Button asChild iconOnly variant="ghost" size={28}><a href={`mailto:${lead.email}`} aria-label={`Email ${lead.business_name}`}><Mail size={14} strokeWidth={1.5} /></a></Button></Tooltip>
      )}
      {isAdminOrCoAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><IconButton size={28} label={`Assign ${lead.business_name}`} icon={<UserPlus size={14} strokeWidth={1.5} />} /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Assign owner</DropdownMenuLabel>
            {teamMembers.map((m) => <DropdownMenuItem key={m.id} onSelect={() => assignOwner(lead, m.id)}>{m.name}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton size={28} label={`More actions for ${lead.business_name}`} icon={<MoreHorizontal size={14} strokeWidth={1.5} />} />
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
    </>
  );

  const ownerOptions = [{ value: UNASSIGNED, label: "Unassigned" }, ...teamMembers.map((m) => ({ value: m.id, label: m.name }))];
  const ai = selectedLead ? getAIAnalysis(selectedLead) : null;
  const paneOpen = !!selectedLead && wide;

  /* ── Detail panel parts (shared by the side pane and the narrow-screen drawer) ── */
  const panelActions = selectedLead && (
    <div className="flex flex-wrap gap-2">
      {selectedLead.phone && <Button asChild size={28}><a href={`tel:${selectedLead.phone}`}><Phone size={14} strokeWidth={1.5} />Call</a></Button>}
      {selectedLead.email && <Button asChild size={28}><a href={`mailto:${selectedLead.email}`}><Mail size={14} strokeWidth={1.5} />Email</a></Button>}
      {selectedLead.phone && <Button asChild size={28}><a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"><MessageSquare size={14} strokeWidth={1.5} />WhatsApp</a></Button>}
      <Button asChild size={28} variant="ghost"><Link href={`/admin/leads/${selectedLead.id}`}>Open record<ArrowUpRight size={14} strokeWidth={1.5} /></Link></Button>
    </div>
  );

  const panelBody = selectedLead && ai && (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader title="Calculated quality" actions={<Badge variant={ai.variant}>{ai.quality}</Badge>} />
        <LeadScore score={selectedLead.score} variant="meter" tone="quality" />
      </Card>

      <Card>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Stage">
            {(f) => <Select {...f} value={selectedLead.status} onValueChange={(v) => handleUpdateLead(selectedLead.id!, { status: v as Lead["status"] })} options={STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label }))} />}
          </FormField>
          <FormField label="Owner">
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
        <div className="mt-3 flex items-center justify-between">
          <span className="ds-t-meta text-[var(--text-muted)]">Next step</span>
          <DueChip value={selectedLead.next_followup_at} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Contact" />
        <KeyValueList items={[
          { label: "Person", value: displayName(selectedLead.contact_name || selectedLead.name) || "—" },
          { label: "Phone", value: selectedLead.phone ? <a href={`tel:${selectedLead.phone}`} className="ds-focus rounded-[var(--radius-xs)] text-[var(--accent)]">{selectedLead.phone}</a> : "—" },
          { label: "Email", value: selectedLead.email ? <a href={`mailto:${selectedLead.email}`} className="ds-focus break-all rounded-[var(--radius-xs)] text-[var(--accent)]">{selectedLead.email}</a> : "—" },
          { label: "Location", value: selectedLead.city || "—" },
          { label: "Source", value: <span className="capitalize">{selectedLead.source || "Organic"}</span> },
        ]} />
      </Card>

      <Card>
        <CardHeader title={<span className="inline-flex items-center gap-1.5"><Sparkles size={16} strokeWidth={1.5} className="text-[var(--accent)]" />AI insights</span>} actions={<span className="ds-t-meta ds-num text-[var(--text-muted)]">{ai.confidence}% match</span>} />
        <ul className="ds-t-body flex list-disc flex-col gap-1 pl-5 text-[var(--text-secondary)]">
          {selectedLead.has_website && <li>Valid website domain detected with organic leads presence.</li>}
          {selectedLead.deal_value && <li>Pipeline value is estimated at ₹{Number(selectedLead.deal_value).toLocaleString()}.</li>}
          <li>Recommended target outreach is via direct phone / LinkedIn.</li>
        </ul>
        {ai.missingFields.length > 0 && (
          <div className="mt-4">
            <p className="ds-t-meta-strong mb-2 inline-flex items-center gap-1 text-[var(--warning)]"><AlertCircle size={14} strokeWidth={1.5} />Missing</p>
            <div className="flex flex-wrap gap-1">{ai.missingFields.map((f) => <Badge key={f} variant="neutral" noDot>{f}</Badge>)}</div>
          </div>
        )}
        {ai.risks.length > 0 && (
          <div className="mt-3">
            <p className="ds-t-meta-strong mb-2 text-[var(--warning)]">Risks</p>
            <div className="flex flex-wrap gap-1">{ai.risks.map((r) => <Badge key={r} variant="danger">{r}</Badge>)}</div>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="Notes" />
        <div className="flex flex-col gap-2">
          <Textarea aria-label="New timeline note" placeholder="Add a note…" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} rows={3} />
          <div className="flex justify-end"><Button size={28} variant="primary" onClick={handleAddNote}>Save note</Button></div>
        </div>
        {selectedLead.notes && (
          <ul className="mt-3 flex max-h-48 flex-col gap-2 overflow-y-auto border-t border-[var(--border)] pt-3">
            {selectedLead.notes.split("\n").filter(Boolean).reverse().map((note, idx) => (
              <li key={idx} className="ds-t-body rounded-[var(--radius-sm)] bg-[var(--bg-surface)] p-2 text-[var(--text-primary)]">{note}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );

  const panelFooter = selectedLead && (
    <>
      <Button onClick={() => handleUpdateLead(selectedLead.id!, { status: 'disqualified' })}>Mark lost</Button>
      <Button variant="primary" onClick={() => handleUpdateLead(selectedLead.id!, { status: 'qualified' })}>Mark won</Button>
    </>
  );

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader
        title="CRM Hub"
        breadcrumb={breadcrumb}
        info="The canonical lead pipeline. Click a row (or press J / K) to open a lead beside the list."
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><IconButton variant="secondary" label="More actions" icon={<MoreHorizontal size={16} strokeWidth={1.5} />} /></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem icon={<Upload size={16} strokeWidth={1.5} />} onSelect={() => setShowImport(true)}>Import CSV</DropdownMenuItem>
                <DropdownMenuItem icon={<Download size={16} strokeWidth={1.5} />} disabled={!isAdminOrCoAdmin} onSelect={() => setShowExport(true)}>{isAdminOrCoAdmin ? "Export" : "Export (admins only)"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={<RefreshCw size={16} strokeWidth={1.5} />} onSelect={fetchLeads}>Refresh</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowAddLead(true)}>New lead</Button>
          </>
        }
      />

      {/* Pipeline hero */}
      <section aria-label="Pipeline summary" className="mb-8 mt-6 grid items-end gap-8 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div>
          <p className="ds-t-meta-strong text-[var(--text-muted)]">Pipeline value</p>
          <p className="ds-t-hero mt-1 text-[var(--text-primary)]">{loading || pipelineValue === 0 ? "—" : formatCurrency(pipelineValue, { compact: true })}</p>
          <p className="ds-t-meta ds-num mt-2 text-[var(--text-muted)]">
            {!loading && valuedLeads.length < openLeads.length && (
              <><span className="text-[var(--text-primary)]">{valuedLeads.length}</span> of {openLeads.length} open leads have a value · </>
            )}
            <span className="text-[var(--text-primary)]">{conversionRate}%</span> won
          </p>
          <p className="ds-t-meta ds-num mt-1 text-[var(--text-muted)]">
            <span className={neverContacted ? "text-[var(--warning)]" : "text-[var(--text-primary)]"}>{neverContacted}</span> never contacted · <span className={followupsDue ? "text-[var(--danger)]" : "text-[var(--text-primary)]"}>{followupsDue}</span> follow-ups due
          </p>
        </div>
        <StageBar
          label="Leads by stage"
          active={statusFilter}
          onSelect={(key) => pickStatus(statusFilter === key ? null : key)}
          stages={STATUSES.map((s) => ({ key: s, label: STATUS_META[s].label, count: statusCounts[s], color: STATUS_META[s].color }))}
        />
      </section>

      <div className={paneOpen ? "grid grid-cols-[minmax(0,1fr)_400px] gap-6" : undefined}>
        <div className="min-w-0">
          {/* Stage views */}
          <Tabs value={statusFilter ?? "all"} onValueChange={(v) => pickStatus(v === "all" ? null : v)}>
            <TabsList aria-label="Lead stages" className="mb-4">
              <TabsTrigger value="all" count={totalLeads}>All</TabsTrigger>
              {STATUSES.map((s) => <TabsTrigger key={s} value={s} count={statusCounts[s]}>{STATUS_META[s].label}</TabsTrigger>)}
            </TabsList>
          </Tabs>

          <Toolbar
            search={<SearchInput value={searchQuery} onValueChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search leads" shortcut="/" />}
            filters={isAdminOrCoAdmin ? <FilterSelect label="Owner" allLabel="All owners" value={ownerFilter} options={teamMembers.map((m) => ({ value: m.id, label: m.name }))} onChange={(v) => { setOwnerFilter(v); setCurrentPage(1); }} /> : undefined}
            actions={
              <>
                <FilterChip
                  label={isDefaultSort ? "Newest first" : "Sort"}
                  value={isDefaultSort ? undefined : `${sortLabel} ${sortOrder === "asc" ? "↑" : "↓"}`}
                  onRemove={isDefaultSort ? undefined : () => { setSortField("created_at"); setSortOrder("desc"); }}
                  menuContent={
                    <DropdownMenuContent align="end" minWidth={176}>
                      {SORT_OPTIONS.map((opt) => (
                        <DropdownMenuItem key={opt.field} onSelect={() => { setSortField(opt.field); setSortOrder(curr => curr === "asc" ? "desc" : "asc"); }} icon={<Check size={16} strokeWidth={1.5} className={sortField === opt.field ? "text-[var(--accent)]" : "opacity-0"} />}>{opt.label}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  }
                />
                <FilterChip
                  label="View"
                  icon={<Rows3 size={14} strokeWidth={1.5} />}
                  menuContent={
                    <DropdownMenuContent align="end" minWidth={192}>
                      <DropdownMenuLabel>Density</DropdownMenuLabel>
                      <DropdownMenuCheckboxItem checked={density === "comfortable"} onCheckedChange={() => setDensity("comfortable")}>Comfortable</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={density === "compact"} onCheckedChange={() => setDensity("compact")}>Compact</DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Columns</DropdownMenuLabel>
                      {OPTIONAL_COLUMNS.map((c) => (
                        <DropdownMenuCheckboxItem key={c.id} checked={!!visibleCols[c.id]} onCheckedChange={(v) => setVisibleCols((p) => ({ ...p, [c.id]: v }))}>{c.label}</DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  }
                />
              </>
            }
          />

          <DataTable
            label="CRM leads"
            columns={columns}
            rows={paginatedLeads}
            getRowId={(l) => l.id || l.business_name}
            loading={loading}
            skeletonRows={8}
            onRowClick={(l) => setActiveLeadId(activeLeadId === l.id ? null : l.id || null)}
            activeRowId={activeLeadId}
            rowActions={rowActions}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            bulkBarPlacement="floating"
            bulkActions={() => isAdminOrCoAdmin && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button size={28} loading={isSubmitting} iconLeft={<Users size={14} strokeWidth={1.5} />}>Assign</Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="center" side="top">
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
            pagination={{ page: currentPage, pageSize: itemsPerPage, total: sortedLeads.length, onPageChange: setCurrentPage, pageSizeOptions: [25, 50, 100], onPageSizeChange: (n) => { setItemsPerPage(n); setCurrentPage(1); } }}
            emptyState={<EmptyState icon={<Users size={24} strokeWidth={1.5} />} title="No leads here" description="Try another stage, owner or search." action={<Button variant="primary" onClick={() => setShowAddLead(true)}>New lead</Button>} />}
          />
        </div>

        {/* Side detail pane (wide screens) */}
        {paneOpen && selectedLead && (
          <aside
            key={selectedLead.id}
            aria-label={`${selectedLead.business_name} details`}
            className="ds-anim-pane sticky top-0 flex max-h-[calc(100vh-48px)] flex-col self-start overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-flyout),var(--edge)]"
          >
            <div className="flex items-start gap-3 border-b border-[var(--border)] p-4">
              <Monogram name={selectedLead.business_name || "?"} size={40} />
              <div className="min-w-0 flex-1">
                <h2 className="ds-t-title-md truncate text-[var(--text-primary)]">{selectedLead.business_name}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge domain="lead" status={selectedLead.status} map={STATUS_BADGE_MAP} label={STATUS_META[selectedLead.status]?.label} />
                  {selectedLead.city && <span className="ds-t-meta truncate text-[var(--text-muted)]">{selectedLead.city}</span>}
                </div>
              </div>
              <IconButton size={28} label="Close (Esc)" icon={<X size={16} strokeWidth={1.5} />} onClick={() => setActiveLeadId(null)} />
            </div>
            <div className="border-b border-[var(--border)] px-4 py-3">{panelActions}</div>
            <div className="flex-1 overflow-y-auto p-3">{panelBody}</div>
            <div className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-3">
              <span className="ds-t-meta mr-auto inline-flex items-center gap-1 text-[var(--text-muted)]"><Kbd>J</Kbd><Kbd>K</Kbd> to move</span>
              {panelFooter}
            </div>
          </aside>
        )}
      </div>

      {/* Narrow screens: same details in a drawer */}
      <Drawer
        open={!!selectedLead && !wide}
        onOpenChange={(open) => { if (!open) setActiveLeadId(null); }}
        title={selectedLead?.business_name || "Lead"}
        description={selectedLead?.city || "Lead details"}
        footer={panelFooter}
      >
        <div className="flex flex-col gap-3">{panelActions}{panelBody}</div>
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
    </div>
  );
}
