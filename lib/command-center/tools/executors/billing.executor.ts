import "server-only";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createAdvanceInvoice, issueConsultingInvoice, verifyPayment } from "@/lib/finance/activation-workflow";
import { ToolExecutor } from "../registry/tool-types";

/*
 * Consulting billing tools. Reads run straight away; every write requires the user's approval
 * and then calls the same workflow functions the Consulting billing page uses, so the business
 * rules, receipts, client notifications and audit events are identical.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LIVE = ["cancelled", "void"];

const money = (value: unknown, currency = "INR") => {
  const n = Number(value || 0);
  const formatted = n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency === "INR" ? `₹${formatted}` : `${currency} ${formatted}`;
};
const human = (value: unknown) => {
  const t = String(value || "").replaceAll("_", " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const today = () => new Date().toISOString().slice(0, 10);

async function companyNames(ids: Array<string | null | undefined>) {
  const unique = [...new Set(ids.filter(Boolean))] as string[];
  if (!unique.length) return new Map<string, string>();
  const { data } = await supabaseAdmin.from("companies").select("id,name").in("id", unique);
  return new Map((data || []).map((c: { id: string; name: string }) => [c.id, c.name]));
}

async function findInvoice(reference: string) {
  const column = UUID.test(reference) ? "id" : "invoice_number";
  const { data, error } = await supabaseAdmin.from("consulting_advance_invoices").select("*").eq(column, reference.trim()).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`No consulting invoice found for "${reference}".`);
  return data;
}

async function findPayment(reference: string) {
  const column = UUID.test(reference) ? "id" : "payment_number";
  const { data, error } = await supabaseAdmin
    .from("consulting_payments")
    .select("*, consulting_advance_invoices(invoice_number,total,amount_paid,balance_due,currency)")
    .eq(column, reference.trim())
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`No payment found for "${reference}".`);
  return data;
}

async function findAgreement(reference: string) {
  const column = UUID.test(reference) ? "id" : "agreement_number";
  const { data, error } = await supabaseAdmin.from("master_service_agreements").select("id,agreement_number,status,company_id,client_id").eq(column, reference.trim()).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`No agreement found for "${reference}".`);
  return data;
}

// ── Reads ──────────────────────────────────────────────────────────────

const OverviewSchema = z.object({});

export const getBillingOverviewExecutor: ToolExecutor<z.infer<typeof OverviewSchema>, unknown> = {
  name: "get_billing_overview",
  description: "Consulting billing at a glance: totals invoiced, received and outstanding; overdue invoices; payments waiting for verification; signed agreements not yet invoiced.",
  inputSchema: OverviewSchema,
  riskLevel: "low",
  requiredPermissions: ["invoices:read"],
  async execute() {
    const [invoices, payments, agreements] = await Promise.all([
      supabaseAdmin.from("consulting_advance_invoices").select("id,invoice_number,status,currency,total,amount_paid,balance_due,due_date,agreement_id,company_id"),
      supabaseAdmin.from("consulting_payments").select("id,status"),
      supabaseAdmin.from("master_service_agreements").select("id,agreement_number,status,company_id").in("status", ["signed", "active"]),
    ]);
    if (invoices.error) throw new Error(invoices.error.message);
    if (payments.error) throw new Error(payments.error.message);
    if (agreements.error) throw new Error(agreements.error.message);

    const live = (invoices.data || []).filter((i) => !LIVE.includes(i.status));
    const currency = live[0]?.currency || "INR";
    const sum = (key: "total" | "amount_paid" | "balance_due") => live.reduce((s, i) => s + Number(i[key] || 0), 0);
    const overdue = live.filter((i) => Number(i.balance_due) > 0 && i.due_date && i.due_date < today());
    const invoicedAgreements = new Set(live.map((i) => i.agreement_id));
    const awaiting = (agreements.data || []).filter((a) => !invoicedAgreements.has(a.id));
    const names = await companyNames([...overdue.map((i) => i.company_id), ...awaiting.map((a) => a.company_id)]);

    return {
      invoiced: money(sum("total"), currency),
      received: money(sum("amount_paid"), currency),
      outstanding: money(sum("balance_due"), currency),
      invoiceCount: live.length,
      overdue: overdue.map((i) => ({ invoice: i.invoice_number, client: names.get(i.company_id) || null, balance: money(i.balance_due, i.currency), dueDate: i.due_date })),
      paymentsToVerify: (payments.data || []).filter((p) => p.status === "verification_required").length,
      agreementsAwaitingInvoice: awaiting.map((a) => ({ agreement: a.agreement_number, client: names.get(a.company_id) || null })),
    };
  },
};

const ListInvoicesSchema = z.object({
  status: z.string().optional(),
  unpaidOnly: z.boolean().optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export const listConsultingInvoicesExecutor: ToolExecutor<z.infer<typeof ListInvoicesSchema>, unknown> = {
  name: "list_consulting_invoices",
  description: "List consulting milestone invoices with totals, amount paid, balance and dates. Filter by status (draft, sent, partially_paid, paid, overdue), unpaid only, or search an invoice number or client name.",
  inputSchema: ListInvoicesSchema,
  riskLevel: "low",
  requiredPermissions: ["invoices:read"],
  async execute(input) {
    let query = supabaseAdmin
      .from("consulting_advance_invoices")
      .select("id,invoice_number,status,currency,total,amount_paid,balance_due,due_date,issued_at,company_id,payment_instructions")
      .order("created_at", { ascending: false })
      .limit(input.limit || 20);
    if (input.status) query = query.eq("status", input.status);
    if (input.unpaidOnly) query = query.gt("balance_due", 0).not("status", "in", "(cancelled,void)");
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const names = await companyNames((data || []).map((i) => i.company_id));
    const rows = (data || []).map((i) => ({
      invoice: i.invoice_number,
      client: names.get(i.company_id) || null,
      milestone: i.payment_instructions?.milestoneDescription || null,
      status: human(i.status),
      total: money(i.total, i.currency),
      paid: money(i.amount_paid, i.currency),
      balance: money(i.balance_due, i.currency),
      issued: i.issued_at ? String(i.issued_at).slice(0, 10) : null,
      due: i.due_date,
      overdue: Number(i.balance_due) > 0 && !!i.due_date && i.due_date < today(),
    }));
    const term = input.search?.trim().toLowerCase();
    return term ? rows.filter((r) => r.invoice.toLowerCase().includes(term) || (r.client || "").toLowerCase().includes(term)) : rows;
  },
};

const ListPaymentsSchema = z.object({
  status: z.enum(["verification_required", "verified", "failed", "all"]).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export const listConsultingPaymentsExecutor: ToolExecutor<z.infer<typeof ListPaymentsSchema>, unknown> = {
  name: "list_consulting_payments",
  description: "List client payment submissions. Defaults to payments waiting for verification. Includes amount, method, transaction reference, proof and receipt number.",
  inputSchema: ListPaymentsSchema,
  riskLevel: "low",
  requiredPermissions: ["invoices:read"],
  async execute(input) {
    const status = input.status || "verification_required";
    let query = supabaseAdmin
      .from("consulting_payments")
      .select("payment_number,amount,currency,method,transaction_reference,proof_path,status,submitted_at,consulting_advance_invoices(invoice_number),consulting_payment_receipts(receipt_number)")
      .order("submitted_at", { ascending: false })
      .limit(input.limit || 20);
    if (status !== "all") query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map((p: any) => ({
      payment: p.payment_number,
      invoice: p.consulting_advance_invoices?.invoice_number || null,
      amount: money(p.amount, p.currency),
      method: p.method,
      status: human(p.status),
      transactionReference: p.transaction_reference || null,
      proofAttached: Boolean(p.proof_path),
      submitted: p.submitted_at ? String(p.submitted_at).slice(0, 10) : null,
      receipt: (Array.isArray(p.consulting_payment_receipts) ? p.consulting_payment_receipts[0] : p.consulting_payment_receipts)?.receipt_number || null,
    }));
  },
};

// ── Writes (approval required) ─────────────────────────────────────────

const IssueSchema = z.object({ invoice: z.string().min(3) });

export const issueConsultingInvoiceExecutor: ToolExecutor<z.infer<typeof IssueSchema>, unknown> = {
  name: "issue_consulting_invoice",
  description: "Issue a consulting invoice to the client (by invoice number such as GXL-INV-2026-000001). Requires the user's approval; tell them to approve the card.",
  inputSchema: IssueSchema,
  riskLevel: "high",
  requiredPermissions: ["invoices:write"],
  requiresApproval: true,
  async preview(input) {
    const invoice = await findInvoice(input.invoice);
    if (["cancelled", "void", "paid", "sent"].includes(invoice.status)) throw new Error(`${invoice.invoice_number} is ${human(invoice.status).toLowerCase()} and can't be issued.`);
    const names = await companyNames([invoice.company_id]);
    return {
      summary: `Issue ${invoice.invoice_number} to the client`,
      details: [
        { label: "Client", value: names.get(invoice.company_id) || "Not linked" },
        { label: "Amount", value: money(invoice.total, invoice.currency) },
        { label: "Due", value: invoice.due_date || "Not set" },
      ],
    };
  },
  async execute(input, context) {
    const invoice = await findInvoice(input.invoice);
    const issued = await issueConsultingInvoice(invoice.id, context.commandContext.userId);
    return { invoice: invoice.invoice_number, status: human((issued as any)?.status || "sent") };
  },
};

const VerifySchema = z.object({
  payment: z.string().min(3),
  decision: z.enum(["verify", "reject"]),
});

export const decideConsultingPaymentExecutor: ToolExecutor<z.infer<typeof VerifySchema>, unknown> = {
  name: "decide_consulting_payment",
  description: "Verify or reject a client payment waiting for verification (by payment number such as GXL-PAY-2026-000003). Verifying updates the invoice balance, issues a receipt and notifies the client. Requires the user's approval; tell them to approve the card.",
  inputSchema: VerifySchema,
  riskLevel: "high",
  requiredPermissions: ["invoices:write"],
  requiresApproval: true,
  async preview(input) {
    const payment = await findPayment(input.payment);
    if (payment.status !== "verification_required") throw new Error(`${payment.payment_number} is already ${human(payment.status).toLowerCase()}.`);
    const invoice = payment.consulting_advance_invoices || {};
    const verb = input.decision === "verify" ? "Verify" : "Reject";
    return {
      summary: `${verb} ${money(payment.amount, payment.currency)} ${String(payment.method || "").toUpperCase()} payment ${payment.payment_number}`,
      details: [
        { label: "Invoice", value: invoice.invoice_number || "Unknown" },
        { label: "Transaction", value: payment.transaction_reference || "Not supplied" },
        { label: "Proof", value: payment.proof_path ? "Attached" : "None" },
        ...(input.decision === "verify" ? [{ label: "Balance after", value: money(Math.max(0, Number(invoice.balance_due || 0) - Number(payment.amount || 0)), invoice.currency) }] : []),
      ],
    };
  },
  async execute(input, context) {
    const payment = await findPayment(input.payment);
    const result: any = await verifyPayment(payment.id, context.commandContext.userId, input.decision === "verify");
    return {
      payment: payment.payment_number,
      status: human(result?.status),
      invoiceStatus: result?.invoiceStatus ? human(result.invoiceStatus) : undefined,
      balance: result?.balance !== undefined ? money(result.balance, payment.currency) : undefined,
      receipt: result?.receipt?.receiptNumber,
      onboarding: result?.onboarding?.onboardingNumber,
    };
  },
};

const CreateInvoiceSchema = z.object({
  agreement: z.string().min(3),
  milestoneIndex: z.number().int().min(0).optional(),
  triggerConfirmed: z.boolean().optional(),
});

export const createMilestoneInvoiceExecutor: ToolExecutor<z.infer<typeof CreateInvoiceSchema>, unknown> = {
  name: "create_milestone_invoice",
  description: "Create the milestone invoice for a signed agreement (by agreement number). milestoneIndex 0 is the first (advance) milestone; later milestones need triggerConfirmed=true, only when the user has said the milestone's trigger was reached. Requires the user's approval; tell them to approve the card.",
  inputSchema: CreateInvoiceSchema,
  riskLevel: "high",
  requiredPermissions: ["invoices:write"],
  requiresApproval: true,
  async preview(input) {
    const agreement = await findAgreement(input.agreement);
    if (!["signed", "active"].includes(agreement.status)) throw new Error(`${agreement.agreement_number} is ${human(agreement.status).toLowerCase()}; it must be signed before invoicing.`);
    const milestone = input.milestoneIndex || 0;
    if (milestone > 0 && !input.triggerConfirmed) throw new Error("Later milestones need confirmation that their trigger was reached. Ask the user first.");
    const names = await companyNames([agreement.company_id]);
    return {
      summary: `Create milestone ${milestone + 1} invoice for ${agreement.agreement_number}`,
      details: [
        { label: "Client", value: names.get(agreement.company_id) || "Not linked" },
        { label: "Milestone", value: milestone === 0 ? "1 (advance)" : String(milestone + 1) },
      ],
    };
  },
  async execute(input, context) {
    const agreement = await findAgreement(input.agreement);
    const invoice: any = await createAdvanceInvoice(agreement.id, context.commandContext.userId, input.milestoneIndex || 0, input.triggerConfirmed === true);
    return { invoice: invoice?.invoice_number, status: human(invoice?.status), total: money(invoice?.total, invoice?.currency), nextStep: "Issue it to the client when ready." };
  },
};

export const BILLING_TOOL_NAMES = [
  "get_billing_overview",
  "list_consulting_invoices",
  "list_consulting_payments",
  "issue_consulting_invoice",
  "decide_consulting_payment",
  "create_milestone_invoice",
];
