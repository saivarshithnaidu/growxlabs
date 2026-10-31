/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Receipt } from "lucide-react";
import {
  Alert, Badge, Button, Card, CardHeader, DataTable, type DataTableColumn, KPIItem, KPIStrip, Tooltip, toast, type BadgeVariant,
} from "@/src/components/ui";
import { EmptyState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type Invoice = { id: string; invoice_number: string; status: string; currency: string; total: number; amount_paid: number; balance_due: number; due_date: string | null; issued_at: string | null; agreement_id: string | null; agreementReference: string | null; proposalReference: string | null; scopeReference: string | null; payment_instructions: Record<string, any>; activity: Array<{ event_type: string; created_at: string }> };
type Agreement = { id: string; agreementNumber: string; status: string; clientName: string | null; companyName: string | null };
type Payment = { id: string; payment_number: string; invoice_id: string; amount: number; currency: string; method: string; transaction_reference: string | null; proof_path: string | null; status: string; submitted_at: string; verified_at: string | null; consulting_advance_invoices: { invoice_number: string } | null; consulting_payment_receipts: { receipt_number: string; created_at: string } | null };
const money = (value: number, currency = "INR") => currency === "INR" ? `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${currency} ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const date = (value: string | null) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Not specified";
const display = (value: string) => {
  const t = value.replaceAll("_", " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const INVOICE_STATUS: Record<string, BadgeVariant> = {
  draft: "neutral", issued: "info", sent: "info", viewed: "info", partially_paid: "warning", paid: "success", overdue: "danger", cancelled: "neutral", void: "neutral",
};
const PAYMENT_STATUS: Record<string, BadgeVariant> = {
  verification_required: "warning", submitted: "info", verified: "success", rejected: "danger",
};

export default function ConsultingFinancePage() {
  const breadcrumb = useAdminBreadcrumb();
  const [invoices, setInvoices] = useState<Invoice[]>([]); const [agreements, setAgreements] = useState<Agreement[]>([]); const [payments, setPayments] = useState<Payment[]>([]); const [error, setError] = useState(""); const [busy, setBusy] = useState(""); const [loading, setLoading] = useState(true);
  const load = async () => { setError(""); const [invoiceResponse, agreementResponse, paymentResponse] = await Promise.all([fetch("/api/admin/consulting-invoices", { cache: "no-store" }), fetch("/api/admin/agreements", { cache: "no-store" }), fetch("/api/admin/consulting-payments", { cache: "no-store" })]); const invoiceJson = await invoiceResponse.json(); const agreementJson = await agreementResponse.json(); const paymentJson = await paymentResponse.json(); setLoading(false); if (!invoiceResponse.ok || !agreementResponse.ok || !paymentResponse.ok) { setError(invoiceJson.error || agreementJson.error || paymentJson.error || "Unable to load consulting finance."); return; } setInvoices(invoiceJson.invoices || []); setAgreements(agreementJson.agreements || []); setPayments(paymentJson.payments || []); };
  useEffect(() => { void load(); }, []);
  // busy holds "<action>:<id>" so only the clicked row shows a spinner.
  const action = async (payload: Record<string, string>) => { const key = `${payload.action || "update"}:${payload.agreementId || payload.invoiceId || payload.paymentId || ""}`; setBusy(key); setError(""); const isInvoiceAction = ["create", "issue"].includes(payload.action || ""); const response = await fetch(isInvoiceAction ? "/api/admin/consulting-invoices" : "/api/admin/consulting-payments", { method: isInvoiceAction ? "POST" : "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }); const body = await response.json(); setBusy(""); if (!response.ok) { toast({ title: body.error || "Finance update failed.", variant: "danger" }); return; } toast({ title: "Updated", variant: "success" }); await load(); };
  const signedAgreements = agreements.filter((agreement) => ["signed", "active"].includes(agreement.status));
  const awaitingInvoice = signedAgreements.filter((agreement) => !invoices.some((invoice) => invoice.agreement_id === agreement.id && !["cancelled", "void"].includes(invoice.status)));

  const liveInvoices = invoices.filter((i) => !["cancelled", "void"].includes(i.status));
  const currency = liveInvoices[0]?.currency || "INR";
  const totalInvoiced = liveInvoices.reduce((s, i) => s + Number(i.total || 0), 0);
  const totalPaid = liveInvoices.reduce((s, i) => s + Number(i.amount_paid || 0), 0);
  const totalDue = liveInvoices.reduce((s, i) => s + Number(i.balance_due || 0), 0);
  const toVerify = payments.filter((p) => p.status === "verification_required").length;

  const invoiceColumns: DataTableColumn<Invoice>[] = [
    {
      id: "invoice",
      header: "Invoice",
      width: "26%",
      sortValue: (i) => i.invoice_number,
      cell: (i) => (
        <span className="flex min-w-0 flex-col">
          <span className="ds-t-body-strong ds-num truncate text-[var(--text-primary)]">{i.invoice_number}</span>
          <span className="ds-t-meta truncate text-[var(--text-muted)]">
            {i.payment_instructions?.milestoneDescription || "Consulting milestone"}
            {i.payment_instructions?.milestonePercentage ? ` (${i.payment_instructions.milestonePercentage}%)` : ""}
          </span>
        </span>
      ),
    },
    {
      id: "refs",
      header: "References",
      cell: (i) => (
        <span className="ds-t-meta ds-num flex flex-col text-[var(--text-secondary)]">
          <span title="Agreement">{i.agreementReference || "No agreement"}</span>
          <span title="Proposal" className="text-[var(--text-muted)]">{i.proposalReference || "No proposal"}</span>
          <span title="Scope of work" className="text-[var(--text-muted)]">{i.scopeReference || "No scope"}</span>
        </span>
      ),
    },
    { id: "total", header: "Total", numeric: true, sortValue: (i) => Number(i.total), cell: (i) => <span className="text-[var(--text-primary)]">{money(i.total, i.currency)}</span> },
    { id: "paid", header: "Paid", numeric: true, sortValue: (i) => Number(i.amount_paid), cell: (i) => money(i.amount_paid, i.currency) },
    { id: "balance", header: "Balance", numeric: true, sortValue: (i) => Number(i.balance_due), cell: (i) => <span className={Number(i.balance_due) > 0 ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>{money(i.balance_due, i.currency)}</span> },
    {
      id: "status",
      header: "Status",
      sortValue: (i) => i.status,
      cell: (i) => (
        <span className="flex flex-col items-start gap-1">
          <Badge variant={INVOICE_STATUS[i.status] || "neutral"}>{display(i.status)}</Badge>
          <span className="ds-t-meta text-[var(--text-muted)]">{i.activity?.[0] ? `${display(i.activity[0].event_type)}, ${date(i.activity[0].created_at)}` : "No activity"}</span>
        </span>
      ),
    },
    {
      id: "dates",
      header: "Dates",
      sortValue: (i) => i.issued_at || "",
      cell: (i) => (
        <span className="ds-t-meta ds-num flex flex-col text-[var(--text-secondary)]">
          <span>Issued {date(i.issued_at)}</span>
          <span className="text-[var(--text-muted)]">Due {date(i.due_date)}</span>
        </span>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      cell: (i) => (
        <span className="flex items-center justify-end gap-2">
          {!["sent", "paid", "cancelled", "void"].includes(i.status) && (
            <Button size={28} variant="primary" loading={busy === `issue:${i.id}`} disabled={!!busy && busy !== `issue:${i.id}`} onClick={() => void action({ action: "issue", invoiceId: i.id })}>Issue to client</Button>
          )}
          <Tooltip content="Download PDF">
            <Button asChild iconOnly variant="ghost" size={28}>
              <a href={`/api/admin/consulting-invoices/${encodeURIComponent(i.id)}/pdf`} aria-label={`Download ${i.invoice_number} PDF`}><Download size={14} strokeWidth={1.5} /></a>
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];

  const paymentColumns: DataTableColumn<Payment>[] = [
    {
      id: "payment",
      header: "Payment",
      sortValue: (p) => p.payment_number,
      cell: (p) => (
        <span className="flex min-w-0 flex-col">
          <span className="ds-t-body-strong ds-num truncate text-[var(--text-primary)]">{p.payment_number}</span>
          <span className="ds-t-meta ds-num truncate text-[var(--text-muted)]">For {p.consulting_advance_invoices?.invoice_number || "an invoice"}</span>
        </span>
      ),
    },
    { id: "amount", header: "Amount", numeric: true, sortValue: (p) => Number(p.amount), cell: (p) => <span className="text-[var(--text-primary)]">{money(p.amount, p.currency)}</span> },
    { id: "method", header: "Method", sortValue: (p) => p.method, cell: (p) => p.method.length <= 4 ? p.method.toUpperCase() : display(p.method) },
    { id: "status", header: "Status", sortValue: (p) => p.status, cell: (p) => <Badge variant={PAYMENT_STATUS[p.status] || "neutral"}>{display(p.status)}</Badge> },
    {
      id: "evidence",
      header: "Transaction and proof",
      cell: (p) => (
        <span className="ds-t-meta flex flex-col text-[var(--text-secondary)]">
          <span className="ds-num">{p.transaction_reference || "No transaction ID"}</span>
          <span className="text-[var(--text-muted)]">{p.proof_path ? `Proof: ${display(p.proof_path)}` : "No proof attached"}</span>
        </span>
      ),
    },
    {
      id: "receipt",
      header: "Receipt",
      cell: (p) => p.consulting_payment_receipts?.receipt_number
        ? <span className="ds-t-meta ds-num inline-flex items-center gap-1 text-[var(--text-primary)]"><Receipt size={14} strokeWidth={1.5} className="text-[var(--success)]" />{p.consulting_payment_receipts.receipt_number}</span>
        : <span className="text-[var(--text-disabled)]">None yet</span>,
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      cell: (p) => p.status === "verification_required" ? (
        <span className="flex items-center justify-end gap-2">
          <Button size={28} variant="ghost" loading={busy === `reject:${p.id}`} disabled={!!busy} onClick={() => void action({ paymentId: p.id, action: "reject" })}>Reject</Button>
          <Button size={28} variant="primary" loading={busy === `verify:${p.id}`} disabled={!!busy} onClick={() => void action({ paymentId: p.id, action: "verify" })}>Verify</Button>
        </span>
      ) : null,
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader
        title="Consulting billing"
        breadcrumb={breadcrumb}
        info="Review canonical milestone invoices and verify client payments before onboarding-led project activation."
      />

      {error && <div className="mb-6"><Alert variant="danger" title="Couldn't load billing">{error}</Alert></div>}

      <KPIStrip>
        <KPIItem label="Invoiced" loading={loading} value={<span className="ds-num">{money(totalInvoiced, currency)}</span>} />
        <KPIItem label="Received" loading={loading} value={<span className="ds-num">{money(totalPaid, currency)}</span>} />
        <KPIItem label="Outstanding" loading={loading} value={<span className="ds-num">{money(totalDue, currency)}</span>} />
        <KPIItem label="Payments to verify" loading={loading} value={<span className="ds-num">{toVerify}</span>} />
      </KPIStrip>

      <div className="mt-6 flex flex-col gap-6">
        {!loading && awaitingInvoice.length > 0 && (
          <Card as="section" padding="none">
            <div className="px-5 pt-5">
              <CardHeader
                title="Signed agreements awaiting invoice"
                description="Create the first milestone invoice, then issue it to the client from the invoices table."
                actions={<Badge variant="info">{awaitingInvoice.length} pending</Badge>}
              />
            </div>
            <ul className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
              {awaitingInvoice.map((agreement) => (
                <li key={agreement.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="ds-t-body-strong truncate text-[var(--text-primary)]">{agreement.companyName || agreement.clientName || "Client"}</p>
                    <p className="ds-t-meta ds-num text-[var(--text-muted)]">{agreement.agreementNumber}, {display(agreement.status).toLowerCase()}</p>
                  </div>
                  <Button size={28} variant="primary" loading={busy === `create:${agreement.id}`} disabled={!!busy} onClick={() => void action({ action: "create", agreementId: agreement.id })}>
                    Create first milestone invoice
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {!loading && signedAgreements.length === 0 && (
          <Alert variant="info" title="Nothing to invoice yet">No signed agreement is available for invoicing yet. Complete both GrowxLabs and client signatures first.</Alert>
        )}

        <section>
          <h2 className="ds-t-title-sm mb-3 text-[var(--text-primary)]">Invoices</h2>
          <DataTable
            label="Consulting invoices"
            columns={invoiceColumns}
            rows={invoices}
            getRowId={(i) => i.id}
            loading={loading}
            skeletonRows={3}
            emptyState={<EmptyState icon={<FileText size={24} strokeWidth={1.5} />} title="No consulting invoices yet" description="Invoices appear here once a signed agreement is invoiced." />}
          />
        </section>

        <section>
          <h2 className="ds-t-title-sm mb-3 text-[var(--text-primary)]">Payments and receipts</h2>
          <DataTable
            label="Payment submissions"
            columns={paymentColumns}
            rows={payments}
            getRowId={(p) => p.id}
            loading={loading}
            skeletonRows={3}
            emptyState={<EmptyState icon={<Receipt size={24} strokeWidth={1.5} />} title="No submitted payments" description="Client payment submissions appear here for verification." />}
          />
        </section>
      </div>
    </div>
  );
}
