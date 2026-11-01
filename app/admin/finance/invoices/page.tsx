"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus } from "lucide-react";
import {
  Badge, Button, DataTable, type DataTableColumn, Input, KPIItem, KPIStrip, Modal, Select, formatCurrency, toast, type BadgeVariant,
} from "@/src/components/ui";
import { EmptyState, ErrorState, FormField, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

/*
 * Sales invoices. New invoices are created from a quotation (the server copies its client,
 * amounts and tax), which is the only creation path the invoices API supports.
 */

type Invoice = { id: string; invoice_number: string; company?: { name?: string } | null; due_date: string | null; status: string; grand_total: number | string };
type Quotation = { id: string; status: string; grand_total: number | string; company?: { name?: string } | null; deal?: { name?: string } | null; created_at: string };

const STATUS: Record<string, BadgeVariant> = { DRAFT: "neutral", SENT: "info", PARTIALLY_PAID: "warning", PAID: "success", OVERDUE: "danger", CANCELLED: "neutral" };
const human = (v: string) => v.replaceAll("_", " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());
const METHODS = [
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "RAZORPAY", label: "Razorpay" },
  { value: "CASH", label: "Cash" },
];
const today = () => new Date().toISOString().slice(0, 10);

export default function InvoicesPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [quotationId, setQuotationId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [creating, setCreating] = useState(false);

  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("UPI");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoicesData();
  }, []);

  const fetchInvoicesData = async () => {
    try {
      setLoading(true);
      setError("");
      const [invRes, quoteRes] = await Promise.all([fetch("/api/finance/invoices"), fetch("/api/quotations")]);
      const invData = await invRes.json();
      if (!invRes.ok) throw new Error(invData.error || "Couldn't load invoices.");
      setInvoices(invData.invoices || []);
      if (quoteRes.ok) setQuotations((await quoteRes.json()).quotations || []);
    } catch (e: any) {
      setError(e.message || "Couldn't load invoices.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/finance/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotation_id: quotationId, due_date: dueDate })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't create the invoice.");
      toast({ title: `Invoice ${data.invoice?.invoice_number || ""} created`, variant: "success" });
      setShowCreate(false);
      setQuotationId("");
      setDueDate("");
      fetchInvoicesData();
    } catch (err: any) {
      toast({ title: err.message, variant: "danger" });
    } finally {
      setCreating(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payInvoice || !payAmount) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/finance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: payInvoice.id, amount: payAmount, payment_method: payMethod })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't record the payment.");
      toast({ title: "Payment recorded", variant: "success" });
      setPayInvoice(null);
      setPayAmount("");
      fetchInvoicesData();
    } catch (err: any) {
      toast({ title: err.message, variant: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const open = invoices.filter((i) => i.status !== "PAID" && i.status !== "CANCELLED");
  const outstanding = open.reduce((s, i) => s + Number(i.grand_total || 0), 0);
  const overdue = open.filter((i) => i.due_date && i.due_date < today());
  const quotationOptions = quotations.map((q) => ({
    value: q.id,
    label: `${q.company?.name || q.deal?.name || "Quotation"} (${formatCurrency(Number(q.grand_total))}, ${human(q.status)})`,
  }));

  const columns: DataTableColumn<Invoice>[] = [
    { id: "number", header: "Invoice", sortValue: (i) => i.invoice_number, cell: (i) => <span className="ds-t-body-strong ds-num text-[var(--text-primary)]">{i.invoice_number}</span> },
    { id: "client", header: "Client", width: "30%", sortValue: (i) => i.company?.name || "", cell: (i) => i.company?.name || <span className="text-[var(--text-disabled)]">No client</span> },
    {
      id: "due",
      header: "Due",
      sortValue: (i) => i.due_date || "",
      cell: (i) => {
        const late = i.due_date && i.due_date < today() && i.status !== "PAID";
        return <span className={`ds-num ${late ? "text-[var(--danger)]" : "text-[var(--text-secondary)]"}`}>{i.due_date || "No date"}</span>;
      },
    },
    { id: "status", header: "Status", sortValue: (i) => i.status, cell: (i) => <Badge variant={STATUS[i.status] || "neutral"}>{human(i.status)}</Badge> },
    { id: "total", header: "Total", numeric: true, sortValue: (i) => Number(i.grand_total), cell: (i) => <span className="text-[var(--text-primary)]">{formatCurrency(Number(i.grand_total))}</span> },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      cell: (i) => i.status !== "PAID" && i.status !== "CANCELLED"
        ? <span className="flex justify-end"><Button size={28} variant="secondary" onClick={() => { setPayInvoice(i); setPayAmount(String(i.grand_total)); }}>Record payment</Button></span>
        : null,
    },
  ];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Sales invoices"
        breadcrumb={breadcrumb}
        info="Invoices created from quotations, and the payments recorded against them."
        actions={<Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowCreate(true)}>New invoice</Button>}
      />

      {error ? (
        <ErrorState title="Couldn't load invoices" description={error} onRetry={fetchInvoicesData} />
      ) : (
        <div className="flex flex-col gap-6">
          <KPIStrip>
            <KPIItem label="Outstanding" loading={loading} value={<span className="ds-num">{formatCurrency(outstanding)}</span>} hint={`${open.length} unpaid`} />
            <KPIItem label="Overdue" loading={loading} value={<span className={`ds-num ${overdue.length ? "text-[var(--danger)]" : ""}`}>{overdue.length}</span>} />
            <KPIItem label="Invoices" loading={loading} value={<span className="ds-num">{invoices.length}</span>} />
          </KPIStrip>

          <DataTable
            label="Sales invoices"
            columns={columns}
            rows={invoices}
            getRowId={(i) => i.id}
            loading={loading}
            skeletonRows={5}
            emptyState={<EmptyState icon={<FileText size={24} strokeWidth={1.5} />} title="No sales invoices yet" description="Create one from an accepted quotation." action={<Button variant="primary" onClick={() => setShowCreate(true)}>New invoice</Button>} />}
          />
        </div>
      )}

      <Modal
        open={showCreate}
        onOpenChange={(o) => { setShowCreate(o); if (!o) { setQuotationId(""); setDueDate(""); } }}
        title="New invoice"
        description="The invoice copies the quotation's client, amounts and tax."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" form="invoice-form" variant="primary" loading={creating} disabled={!quotationId || !dueDate}>Create invoice</Button>
          </>
        }
      >
        <form id="invoice-form" onSubmit={handleCreate} className="flex flex-col gap-4">
          <FormField label="Quotation" required hint={quotations.length ? undefined : "No quotations yet. Create one in Quotations first."}>
            {(f) => <Select {...f} required disabled={!quotations.length} value={quotationId || undefined} placeholder="Choose a quotation" onValueChange={setQuotationId} options={quotationOptions} />}
          </FormField>
          <FormField label="Due date" required>
            {(f) => <Input {...f} type="date" required min={today()} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />}
          </FormField>
        </form>
      </Modal>

      <Modal
        open={!!payInvoice}
        onOpenChange={(o) => { if (!o) setPayInvoice(null); }}
        title="Record payment"
        description={payInvoice ? `${payInvoice.invoice_number}, ${formatCurrency(Number(payInvoice.grand_total))}` : undefined}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPayInvoice(null)}>Cancel</Button>
            <Button type="submit" form="payment-form" variant="primary" loading={submitting} disabled={!Number(payAmount)}>Record payment</Button>
          </>
        }
      >
        <form id="payment-form" onSubmit={handleRecordPayment} className="flex flex-col gap-4">
          <FormField label="Amount (₹)" required>
            {(f) => <Input {...f} type="number" min={0} step="0.01" required inputMode="decimal" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />}
          </FormField>
          <FormField label="Method">
            {(f) => <Select {...f} value={payMethod} onValueChange={setPayMethod} options={METHODS} />}
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
