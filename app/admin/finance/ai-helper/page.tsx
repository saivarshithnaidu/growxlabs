"use client";

import React, { useState } from "react";
import { Alert, Button, Card, CardHeader, KeyValueList, Textarea, formatCurrency, toast } from "@/src/components/ui";
import { PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { Table } from "@/components/admin/command-center/StructuredResponseFormatter";

/*
 * Two AI helpers. The receipt reader suggests a ledger account for pasted receipt text; the
 * cash forecast projects from the real cash movements in the journal (debits and credits on
 * cash and bank accounts), never from sample data.
 */

type Receipt = { category_code?: string; category_name?: string; confidence?: number; extracted_amount?: number; detected_vendor?: string };
type Forecast = { month: string; inflow: number; outflow: number; net: number };

async function postAi(body: Record<string, unknown>) {
  const res = await fetch("/api/finance/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "The AI helper couldn't complete that.");
  return data;
}

/** Cash in and out from the journal: debits to cash or bank accounts are inflows, credits outflows. */
async function cashMovements() {
  const res = await fetch("/api/finance/accounts");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Couldn't load the ledger.");
  const cashIds = new Set(
    (data.accounts || [])
      .filter((a: any) => String(a.type).toUpperCase() === "ASSET" && (String(a.code).startsWith("10") || /cash|bank/i.test(a.name)))
      .map((a: any) => a.id)
  );
  const dateOf = new Map((data.entries || []).map((e: any) => [e.id, e.entry_date]));
  return (data.items || [])
    .filter((i: any) => cashIds.has(i.account_id))
    .map((i: any) => {
      const amount = (Number(i.debit) || 0) - (Number(i.credit) || 0);
      return { date: dateOf.get(i.entry_id) || String(i.created_at).slice(0, 10), amount, type: amount >= 0 ? "inflow" : "outflow" };
    })
    .filter((t: any) => t.amount !== 0);
}

export default function AiHelperPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [receiptText, setReceiptText] = useState("");
  const [reading, setReading] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const [forecasting, setForecasting] = useState(false);
  const [forecast, setForecast] = useState<Forecast[] | null>(null);
  const [basis, setBasis] = useState(0);
  const [noData, setNoData] = useState(false);

  const handleScanReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptText.trim()) return;
    setReading(true);
    setReceipt(null);
    try {
      setReceipt((await postAi({ action: "categorize_receipt", receiptText })).category || null);
    } catch (err: any) {
      toast({ title: err.message, variant: "danger" });
    } finally {
      setReading(false);
    }
  };

  const handleForecastCash = async () => {
    setForecasting(true);
    setForecast(null);
    setNoData(false);
    try {
      const transactions = await cashMovements();
      setBasis(transactions.length);
      if (!transactions.length) {
        setNoData(true);
        return;
      }
      setForecast((await postAi({ action: "predict_cashflow", transactions })).prediction?.forecasts || []);
    } catch (err: any) {
      toast({ title: err.message, variant: "danger" });
    } finally {
      setForecasting(false);
    }
  };

  const shortfall = forecast?.find((f) => Number(f.net) < 0);

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="AI helper" breadcrumb={breadcrumb} info="Suggestions only: check them before posting anything to the ledger." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card as="section">
          <CardHeader title="Read a receipt" description="Paste the text of a bill or receipt to get the vendor, amount and a suggested expense account." />
          <form onSubmit={handleScanReceipt} className="flex flex-col gap-3">
            <Textarea
              aria-label="Receipt text"
              required
              rows={6}
              value={receiptText}
              onChange={(e) => setReceiptText(e.target.value)}
              placeholder="Vendor, invoice number, amount and tax lines from the receipt"
            />
            <div>
              <Button type="submit" variant="primary" loading={reading} disabled={!receiptText.trim()}>Read receipt</Button>
            </div>
          </form>
          {receipt && (
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <KeyValueList items={[
                { label: "Vendor", value: receipt.detected_vendor || "Not found" },
                { label: "Amount", value: receipt.extracted_amount != null ? formatCurrency(Number(receipt.extracted_amount)) : "Not found" },
                { label: "Suggested account", value: receipt.category_name ? `${receipt.category_code ? `${receipt.category_code} ` : ""}${receipt.category_name}` : "None" },
                ...(receipt.confidence != null ? [{ label: "Confidence", value: `${receipt.confidence}%` }] : []),
              ]} />
            </div>
          )}
        </Card>

        <Card as="section">
          <CardHeader title="Cash forecast" description="Projects the next months from the cash movements recorded in your journal." />
          <Button variant="primary" loading={forecasting} onClick={handleForecastCash}>Forecast cash</Button>

          {noData && (
            <div className="mt-5">
              <Alert variant="info" title="Nothing to forecast from">There are no cash or bank movements in the journal yet.</Alert>
            </div>
          )}

          {forecast && (
            <div className="mt-5 flex flex-col gap-3">
              {forecast.length > 0 ? (
                <Table
                  header={["Month", "In", "Out", "Net"]}
                  rows={forecast.map((f) => [f.month, formatCurrency(Number(f.inflow)), formatCurrency(Number(f.outflow)), formatCurrency(Number(f.net))])}
                />
              ) : (
                <p className="ds-t-body text-[var(--text-muted)]">The model returned no forecast.</p>
              )}
              {shortfall && <Alert variant="warning" title={`Shortfall projected in ${shortfall.month}`}>Outflows are forecast to exceed inflows by {formatCurrency(Math.abs(Number(shortfall.net)))}.</Alert>}
              <p className="ds-t-meta text-[var(--text-muted)]">Based on {basis} cash {basis === 1 ? "movement" : "movements"} from the journal. A forecast, not a guarantee.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
