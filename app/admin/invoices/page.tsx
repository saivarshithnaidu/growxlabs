"use client";

import { useEffect, useState, useMemo } from "react";
import { Check, Copy, Eye, FileText, Plus, Printer, Send, Trash2, X } from "lucide-react";
import {
  Badge, Button, Checkbox, DataTable, type DataTableColumn, IconButton, Input, KPIItem, KPIStrip, Modal, SearchInput, Select,
  Tabs, TabsList, TabsTrigger, Textarea, Tooltip, formatCurrency, toast, type BadgeVariant,
} from "@/src/components/ui";
import { EmptyState, FormField, PageHeader, Toolbar } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

// --- Official GrowX Entity Details ---
const COMPANY = {
  name: "GrowXLabsTech",
  website: "growxlabs.tech",
  email: "hello@growxlabs.tech",
  address: "Guntur, Andhra Pradesh, India",
  msme: "UDYAM-AP-22-0063260",
  upi: "growxlabs@upi"
};

type LineItem = {
  id: string;
  description: string;
  qty: number;
  rate: number;
};

type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled";

const CURRENCIES = [
  { label: "₹ INR", value: "INR", symbol: "₹" },
  { label: "$ USD", value: "USD", symbol: "$" },
  { label: "€ EUR", value: "EUR", symbol: "€" }
];

const STATUS: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: "Pending", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  overdue: { label: "Overdue", variant: "danger" },
  cancelled: { label: "Cancelled", variant: "neutral" },
};

const isPastDue = (inv: any) => inv.status !== "paid" && inv.due_date && !isNaN(new Date(inv.due_date).getTime()) && new Date(inv.due_date).getTime() < Date.now();
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};
const blankLine = (): LineItem => ({ id: Math.random().toString(), description: "", qty: 1, rate: 0 });
const symbolFor = (code?: string) => (CURRENCIES.find((c) => c.value === code) || CURRENCIES[0]).symbol;
const amount = (v: unknown, code?: string) => `${symbolFor(code)}${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function InvoicesPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // --- Generator State ---
  const emptyForm = (number = "INV-2026-001") => ({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    businessName: "",
    projectName: "",
    invoiceNumber: number,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: inDays(7),
    currency: "INR",
    paymentType: "Full Payment",
    gstEnabled: false,
    amountPaid: 0,
    razorpayLink: "",
    notes: "Payment due within 7 days. Milestone releases proceed upon settlement.",
    lineItems: [blankLine()] as LineItem[],
    status: "pending" as InvoiceStatus
  });
  const [form, setForm] = useState(() => emptyForm());

  // --- Calculations ---
  const currency = CURRENCIES.find(c => c.value === form.currency) || CURRENCIES[0];
  const subtotal = useMemo(() => form.lineItems.reduce((acc, item) => acc + (Number(item.qty) * Number(item.rate)), 0), [form.lineItems]);
  const gstAmount = form.gstEnabled ? subtotal * 0.18 : 0;
  const total = subtotal + gstAmount;
  const balanceDue = Math.max(0, total - Number(form.amountPaid || 0));

  useEffect(() => {
    fetchData();
  }, []);

  const nextNumber = (count: number) => `INV-2026-${String(count + 1).padStart(3, "0")}`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/invoice/list");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setInvoices(list);
      if (list.length > 0) setForm(prev => ({ ...prev, invoiceNumber: nextNumber(list.length) }));
    } catch (e) {
      console.error("Failed to load invoices:", e);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const addLineItem = () => setForm(prev => ({ ...prev, lineItems: [...prev.lineItems, blankLine()] }));

  const removeLineItem = (id: string) => {
    if (form.lineItems.length > 1) setForm(prev => ({ ...prev, lineItems: prev.lineItems.filter(item => item.id !== id) }));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setForm(prev => ({ ...prev, lineItems: prev.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item) }));
  };

  const openNew = () => {
    setForm(emptyForm(nextNumber(invoices.length)));
    setShowGenerator(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.businessName && !form.clientName) {
      toast({ title: "Add a client or business name.", variant: "danger" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/invoice/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: form.clientName,
          client_email: form.clientEmail,
          client_phone: form.clientPhone,
          business_name: form.businessName,
          project_name: form.projectName,
          invoice_number: form.invoiceNumber,
          amount: total,
          subtotal: subtotal,
          currency: form.currency,
          due_date: form.dueDate,
          items: form.lineItems,
          notes: form.notes,
          payment_type: form.paymentType,
          razorpay_link: form.razorpayLink,
          balance_due: balanceDue,
          status: form.status
        })
      });
      if (res.ok) {
        toast({ title: `Invoice ${form.invoiceNumber} created`, variant: "success" });
        setShowGenerator(false);
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: err.error || "Couldn't create the invoice.", variant: "danger" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Couldn't create the invoice.", variant: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuplicate = (inv: any) => {
    setForm({
      ...emptyForm(nextNumber(invoices.length)),
      clientName: inv.client_name || "",
      clientEmail: inv.client_email || "",
      clientPhone: inv.client_phone || "",
      businessName: inv.business_name || "",
      projectName: inv.project_name || "",
      currency: inv.currency || "INR",
      lineItems: Array.isArray(inv.items) && inv.items.length > 0 ? inv.items : [{ id: "1", description: inv.project_name || "", qty: 1, rate: Number(inv.amount) || 0 }],
      notes: inv.notes || emptyForm().notes,
    });
    setShowGenerator(true);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/invoice/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
        toast({ title: newStatus === "paid" ? "Marked paid" : "Marked pending", variant: "success" });
      } else {
        toast({ title: "Couldn't update the status.", variant: "danger" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const sendInvoiceEmail = async (inv: any) => {
    setSendingId(inv.id);
    try {
      const res = await fetch("/api/invoice/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: inv.id, email: inv.client_email })
      });
      if (res.ok) {
        toast({ title: `Invoice sent to ${inv.client_email || "the client"}`, variant: "success" });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: err.error || "Couldn't send the invoice.", variant: "danger" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Couldn't send the invoice.", variant: "danger" });
    } finally {
      setSendingId(null);
    }
  };

  const copyInvoiceNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(num);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Metrics Aggregates ---
  const metrics = useMemo(() => {
    const totalBilled = invoices.reduce((acc, inv) => acc + (Number(inv.amount) || 0), 0);
    const totalPaid = invoices.filter(inv => inv.status === "paid").reduce((acc, inv) => acc + (Number(inv.amount) || 0), 0);
    const totalDue = invoices
      .filter(inv => inv.status !== "paid" && inv.status !== "cancelled")
      .reduce((acc, inv) => acc + (inv.balance_due != null ? Number(inv.balance_due) || 0 : Number(inv.amount) || 0), 0);
    const pendingCount = invoices.filter(inv => inv.status === "pending").length;
    const overdueCount = invoices.filter(isPastDue).length;
    return { totalBilled, totalPaid, totalDue, pendingCount, overdueCount };
  }, [invoices]);

  // --- Filtered Invoices ---
  const filteredInvoices = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return invoices.filter(inv => {
      const haystack = [inv.client_name, inv.business_name, inv.invoice_number, inv.project_name].map((v) => String(v || "").toLowerCase());
      const matchesSearch = !query || haystack.some((v) => v.includes(query));
      let matchesStatus = true;
      if (statusFilter === "pending") matchesStatus = inv.status === "pending";
      else if (statusFilter === "paid") matchesStatus = inv.status === "paid";
      else if (statusFilter === "overdue") matchesStatus = inv.status === "overdue" || isPastDue(inv);
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const columns: DataTableColumn<any>[] = [
    {
      id: "number",
      header: "Invoice",
      sortValue: (inv) => inv.invoice_number || "",
      cell: (inv) => {
        const num = inv.invoice_number || `INV-${String(inv.id).slice(0, 8).toUpperCase()}`;
        return (
          <span className="inline-flex items-center gap-1">
            <span className="ds-t-body-strong ds-num text-[var(--text-primary)]">{num}</span>
            <IconButton size={28} label={copiedId === num ? "Copied" : `Copy ${num}`} icon={copiedId === num ? <Check size={14} strokeWidth={1.5} className="text-[var(--success)]" /> : <Copy size={14} strokeWidth={1.5} />} onClick={() => copyInvoiceNumber(num)} />
          </span>
        );
      },
    },
    {
      id: "client",
      header: "Client",
      width: "26%",
      sortValue: (inv) => inv.business_name || inv.client_name || "",
      cell: (inv) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[var(--text-primary)]">{inv.business_name || inv.client_name || "No client"}</span>
          {inv.project_name && <span className="ds-t-meta truncate text-[var(--text-muted)]">{inv.project_name}</span>}
        </span>
      ),
    },
    { id: "issued", header: "Issued", sortValue: (inv) => inv.created_at || "", cell: (inv) => <span className="ds-num text-[var(--text-secondary)]">{inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-IN") : ""}</span> },
    { id: "due", header: "Due", sortValue: (inv) => inv.due_date || "", cell: (inv) => <span className={`ds-num ${isPastDue(inv) ? "text-[var(--danger)]" : "text-[var(--text-secondary)]"}`}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-IN") : "No date"}</span> },
    {
      id: "status",
      header: "Status",
      sortValue: (inv) => inv.status,
      cell: (inv) => {
        const s = isPastDue(inv) && inv.status === "pending" ? STATUS.overdue : STATUS[inv.status] || { label: inv.status, variant: "neutral" as BadgeVariant };
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    { id: "amount", header: "Amount", numeric: true, sortValue: (inv) => Number(inv.amount) || 0, cell: (inv) => <span className="text-[var(--text-primary)]">{amount(inv.amount, inv.currency)}</span> },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      cell: (inv) => (
        <span className="flex items-center justify-end gap-1">
          <IconButton size={28} label="Preview" icon={<Eye size={14} strokeWidth={1.5} />} onClick={() => setPreviewInvoice(inv)} />
          {inv.client_email && <IconButton size={28} label={`Email to ${inv.client_email}`} loading={sendingId === inv.id} icon={<Send size={14} strokeWidth={1.5} />} onClick={() => sendInvoiceEmail(inv)} />}
          <IconButton size={28} label="Duplicate" icon={<FileText size={14} strokeWidth={1.5} />} onClick={() => handleDuplicate(inv)} />
          <Button size={28} variant="secondary" loading={updatingId === inv.id} onClick={() => updateStatus(inv.id, inv.status === "paid" ? "pending" : "paid")}>
            {inv.status === "paid" ? "Mark pending" : "Mark paid"}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px]">
      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          nav, aside, .no-print, .admin-dock, header { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-container {
            border: none !important; box-shadow: none !important; margin: 0 !important;
            padding: 0 !important; width: 100% !important; position: absolute; top: 0; left: 0;
          }
        }
      `}</style>

      <div className="no-print">
        <PageHeader
          title="Invoices"
          breadcrumb={breadcrumb}
          info="Client invoices you write directly, with payment status, email and print."
          actions={<Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={openNew}>New invoice</Button>}
        />

        <div className="flex flex-col gap-6">
          <KPIStrip>
            <KPIItem label="Billed" loading={loading} value={<span className="ds-num">{formatCurrency(metrics.totalBilled)}</span>} hint={`${invoices.length} ${invoices.length === 1 ? "invoice" : "invoices"}`} />
            <KPIItem label="Received" loading={loading} value={<span className="ds-num">{formatCurrency(metrics.totalPaid)}</span>} />
            <KPIItem label="Outstanding" loading={loading} value={<span className="ds-num">{formatCurrency(metrics.totalDue)}</span>} hint={`${metrics.pendingCount} pending`} />
            <KPIItem label="Overdue" loading={loading} value={<span className={`ds-num ${metrics.overdueCount ? "text-[var(--danger)]" : ""}`}>{metrics.overdueCount}</span>} />
          </KPIStrip>

          <div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList aria-label="Status" className="mb-4">
                <TabsTrigger value="all" count={invoices.length}>All</TabsTrigger>
                <TabsTrigger value="pending" count={metrics.pendingCount}>Pending</TabsTrigger>
                <TabsTrigger value="overdue" count={metrics.overdueCount}>Overdue</TabsTrigger>
                <TabsTrigger value="paid" count={invoices.filter((i) => i.status === "paid").length}>Paid</TabsTrigger>
              </TabsList>
            </Tabs>
            <Toolbar search={<SearchInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search invoices" />} />
            <DataTable
              label="Invoices"
              columns={columns}
              rows={filteredInvoices}
              getRowId={(inv) => inv.id}
              loading={loading}
              skeletonRows={6}
              emptyState={<EmptyState icon={<FileText size={24} strokeWidth={1.5} />} title={invoices.length ? "No invoices match" : "No invoices yet"} description={invoices.length ? "Try another status or search." : "Write your first invoice."} action={invoices.length ? undefined : <Button variant="primary" onClick={openNew}>New invoice</Button>} />}
            />
          </div>
        </div>
      </div>

      {/* --- New invoice --- */}
      <Modal
        open={showGenerator}
        onOpenChange={setShowGenerator}
        title="New invoice"
        size="lg"
        footer={
          <>
            <span className="ds-t-meta ds-num mr-auto text-[var(--text-muted)]">
              Total {amount(total, form.currency)}, balance {amount(balanceDue, form.currency)}
            </span>
            <Button variant="ghost" onClick={() => setShowGenerator(false)}>Cancel</Button>
            <Button type="submit" form="legacy-invoice-form" variant="primary" loading={submitting} disabled={total <= 0}>Create invoice</Button>
          </>
        }
      >
        <form id="legacy-invoice-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
          <section className="flex flex-col gap-4">
            <h3 className="ds-t-body-strong text-[var(--text-primary)]">Client</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Business name">{(f) => <Input {...f} value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />}</FormField>
              <FormField label="Contact name">{(f) => <Input {...f} value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />}</FormField>
              <FormField label="Email">{(f) => <Input {...f} type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} />}</FormField>
              <FormField label="Phone">{(f) => <Input {...f} type="tel" value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} />}</FormField>
            </div>
            <FormField label="Project">{(f) => <Input {...f} value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} />}</FormField>
          </section>

          <section className="grid gap-4 sm:grid-cols-4">
            <FormField label="Invoice number" required>{(f) => <Input {...f} required value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} />}</FormField>
            <FormField label="Issued">{(f) => <Input {...f} type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />}</FormField>
            <FormField label="Due" required>{(f) => <Input {...f} type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />}</FormField>
            <FormField label="Currency">{(f) => <Select {...f} value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })} options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))} />}</FormField>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="ds-t-body-strong text-[var(--text-primary)]">Items</h3>
            <div className="grid grid-cols-[minmax(0,1fr)_72px_120px_120px_32px] gap-2">
              <span className="ds-t-meta-strong text-[var(--text-muted)]">Description</span>
              <span className="ds-t-meta-strong text-right text-[var(--text-muted)]">Qty</span>
              <span className="ds-t-meta-strong text-right text-[var(--text-muted)]">Rate</span>
              <span className="ds-t-meta-strong text-right text-[var(--text-muted)]">Amount</span>
              <span />
            </div>
            {form.lineItems.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_72px_120px_120px_32px] items-center gap-2">
                <Input aria-label={`Item ${idx + 1} description`} required value={item.description} onChange={(e) => updateLineItem(item.id, "description", e.target.value)} placeholder="What you delivered" />
                <Input aria-label={`Item ${idx + 1} quantity`} type="number" min={1} className="text-right" value={item.qty} onChange={(e) => updateLineItem(item.id, "qty", Number(e.target.value))} />
                <Input aria-label={`Item ${idx + 1} rate`} type="number" min={0} step="0.01" className="text-right" value={item.rate || ""} onChange={(e) => updateLineItem(item.id, "rate", Number(e.target.value))} />
                <span className="ds-t-body ds-num text-right text-[var(--text-primary)]">{amount(Number(item.qty) * Number(item.rate), form.currency)}</span>
                <IconButton size={28} label={`Remove item ${idx + 1}`} icon={<Trash2 size={14} strokeWidth={1.5} />} disabled={form.lineItems.length <= 1} onClick={() => removeLineItem(item.id)} />
              </div>
            ))}
            <div><Button size={28} variant="ghost" iconLeft={<Plus size={14} strokeWidth={1.5} />} onClick={addLineItem}>Add item</Button></div>
          </section>

          <section className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_260px]">
            <div className="flex flex-col gap-4">
              <Checkbox checked={form.gstEnabled} onCheckedChange={(v) => setForm({ ...form, gstEnabled: v })} label="Add GST (18%)" />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Already paid">{(f) => <Input {...f} type="number" min={0} step="0.01" value={form.amountPaid || ""} onChange={(e) => setForm({ ...form, amountPaid: Number(e.target.value) })} />}</FormField>
                <FormField label="Payment link" hint="Optional">{(f) => <Input {...f} type="url" value={form.razorpayLink} onChange={(e) => setForm({ ...form, razorpayLink: e.target.value })} />}</FormField>
              </div>
              <FormField label="Notes">{(f) => <Textarea {...f} rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />}</FormField>
            </div>
            <dl className="flex flex-col gap-2 self-start rounded-[var(--radius-md)] bg-[var(--bg-canvas)] p-4">
              <div className="flex justify-between"><dt className="ds-t-body text-[var(--text-muted)]">Subtotal</dt><dd className="ds-t-body ds-num text-[var(--text-primary)]">{amount(subtotal, form.currency)}</dd></div>
              {form.gstEnabled && <div className="flex justify-between"><dt className="ds-t-body text-[var(--text-muted)]">GST (18%)</dt><dd className="ds-t-body ds-num text-[var(--text-primary)]">{amount(gstAmount, form.currency)}</dd></div>}
              <div className="flex justify-between border-t border-[var(--border)] pt-2"><dt className="ds-t-body-strong text-[var(--text-primary)]">Total</dt><dd className="ds-t-body-strong ds-num text-[var(--text-primary)]">{amount(total, form.currency)}</dd></div>
              <div className="flex justify-between"><dt className="ds-t-body text-[var(--text-muted)]">Balance due</dt><dd className="ds-t-body ds-num text-[var(--text-primary)]">{amount(balanceDue, form.currency)}</dd></div>
            </dl>
          </section>
        </form>
      </Modal>

      {/* --- Printable invoice: a white paper document in every theme --- */}
      {previewInvoice && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewInvoice(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-[var(--overlay)] p-3 sm:p-6"
        >
          <div className="print-container custom-scrollbar relative max-h-[92vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-[var(--radius-lg)] bg-white p-6 text-[#18181b] shadow-[var(--shadow-modal)] sm:p-10" style={{ color: "#18181b" }}>
            <div className="no-print mb-6 flex items-center justify-between border-b border-[#e4e4e7] pb-4">
              <span className="text-[13px] text-[#71717a]">Invoice preview</span>
              <div className="flex items-center gap-2">
                <Button size={28} variant="primary" iconLeft={<Printer size={14} strokeWidth={1.5} />} onClick={() => window.print()}>Print or save PDF</Button>
                <Tooltip content="Close">
                  <button type="button" onClick={() => setPreviewInvoice(null)} aria-label="Close preview" className="ds-focus grid size-8 place-items-center rounded-[var(--radius-sm)] text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:shadow-[var(--focus-ring)]">
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-[22px] font-semibold" style={{ color: "#18181b" }}>{COMPANY.name}</h2>
                <p className="text-[12px] text-[#71717a]">{COMPANY.address}</p>
                <p className="text-[12px] text-[#71717a]">{COMPANY.email}, {COMPANY.website}</p>
                <p className="mt-1 text-[11px] text-[#a1a1aa]">MSME {COMPANY.msme}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-[#71717a]">Invoice</p>
                <p className="font-mono text-[17px] font-semibold">{previewInvoice.invoice_number || `INV-${String(previewInvoice.id).slice(0, 8).toUpperCase()}`}</p>
                <p className="mt-1 text-[12px] text-[#71717a]">Date {new Date(previewInvoice.created_at || Date.now()).toLocaleDateString("en-IN")}</p>
                {previewInvoice.due_date && <p className="text-[12px] text-[#71717a]">Due {new Date(previewInvoice.due_date).toLocaleDateString("en-IN")}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-6 rounded-[var(--radius-md)] border border-[#e4e4e7] bg-[#fafafa] p-4">
              <div>
                <p className="text-[11px] text-[#71717a]">Billed to</p>
                <p className="mt-0.5 text-[14px] font-semibold">{previewInvoice.business_name || previewInvoice.client_name || "Client"}</p>
                {previewInvoice.client_email && <p className="text-[12px] text-[#71717a]">{previewInvoice.client_email}</p>}
                {previewInvoice.client_phone && <p className="text-[12px] text-[#71717a]">{previewInvoice.client_phone}</p>}
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#71717a]">Status</p>
                <p className={`mt-1 text-[13px] font-semibold ${previewInvoice.status === "paid" ? "text-[#15803d]" : "text-[#b45309]"}`}>{previewInvoice.status === "paid" ? "Paid" : "Payment pending"}</p>
              </div>
            </div>

            <table className="mt-6 w-full text-left text-[13px]">
              <thead className="border-b-2 border-[#e4e4e7] text-[11px] text-[#71717a]">
                <tr>
                  <th className="py-2.5 font-medium">Description</th>
                  <th className="w-16 py-2.5 text-center font-medium">Qty</th>
                  <th className="w-28 py-2.5 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f5]">
                {Array.isArray(previewInvoice.items) && previewInvoice.items.length > 0 ? (
                  previewInvoice.items.map((it: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-3">{it.description || previewInvoice.project_name || "Service"}</td>
                      <td className="py-3 text-center text-[#71717a]">{it.qty || 1}</td>
                      <td className="py-3 text-right font-mono">{amount((it.qty || 1) * (it.rate || 0), previewInvoice.currency)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3">{previewInvoice.project_name || "Service"}</td>
                    <td className="py-3 text-center text-[#71717a]">1</td>
                    <td className="py-3 text-right font-mono">{amount(previewInvoice.amount, previewInvoice.currency)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-4 flex items-start justify-between gap-6 border-t border-[#e4e4e7] pt-4">
              <div className="max-w-xs text-[12px] text-[#71717a]">
                <p className="font-semibold text-[#3f3f46]">Pay by UPI</p>
                <p className="font-mono text-[#18181b]">{COMPANY.upi}</p>
                {previewInvoice.notes && <p className="mt-2">{previewInvoice.notes}</p>}
              </div>
              <div className="text-right">
                <p className="text-[12px] text-[#71717a]">Total</p>
                <p className="font-mono text-[24px] font-semibold">{amount(previewInvoice.amount, previewInvoice.currency)}</p>
                {previewInvoice.balance_due != null && <p className="text-[12px] text-[#71717a]">Balance {amount(previewInvoice.balance_due, previewInvoice.currency)}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
