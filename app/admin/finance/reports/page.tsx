"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Alert, Card, Skeleton, Tabs, TabsList, TabsTrigger, formatCurrency } from "@/src/components/ui";
import { ErrorState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

/*
 * Financial statements built only from the chart of accounts: every line is a real ledger
 * account and its balance. Nothing is defaulted or estimated, and the balance sheet and
 * trial balance say plainly whether they balance.
 */

type Account = { id: string; code: string; name: string; type: string; balance: number | string | null; is_active?: boolean };
type ReportId = "pl" | "bs" | "tb" | "gst";
const REPORTS: { id: ReportId; label: string }[] = [
  { id: "pl", label: "Profit and loss" },
  { id: "bs", label: "Balance sheet" },
  { id: "tb", label: "Trial balance" },
  { id: "gst", label: "GST" },
];

const num = (v: unknown) => Number(v) || 0;
const money = (v: number) => formatCurrency(v);
const ofType = (accounts: Account[], type: string) => accounts.filter((a) => String(a.type).toUpperCase() === type);
const total = (accounts: Account[]) => accounts.reduce((s, a) => s + num(a.balance), 0);
const DEBIT_NORMAL = new Set(["ASSET", "EXPENSE"]);

function Lines({ title, accounts, totalLabel, extra }: { title: string; accounts: Account[]; totalLabel: string; extra?: Array<{ name: string; value: number }> }) {
  const rows = [...accounts.map((a) => ({ key: a.id, name: a.name, code: a.code, value: num(a.balance) })), ...(extra || []).map((e) => ({ key: e.name, name: e.name, code: "", value: e.value }))];
  const sum = rows.reduce((s, r) => s + r.value, 0);
  return (
    <section className="flex flex-col">
      <h3 className="ds-t-meta-strong border-b border-[var(--border)] pb-2 text-[var(--text-secondary)]">{title}</h3>
      {rows.length === 0 ? (
        <p className="ds-t-body py-2.5 text-[var(--text-muted)]">No accounts.</p>
      ) : (
        <ul className="divide-y divide-[var(--border-subtle)]">
          {rows.map((r) => (
            <li key={r.key} className="flex items-baseline justify-between gap-4 py-2.5">
              <span className="ds-t-body min-w-0 text-[var(--text-primary)]">
                {r.name}
                {r.code && <span className="ds-t-meta ds-num ml-2 text-[var(--text-disabled)]">{r.code}</span>}
              </span>
              <span className="ds-t-body ds-num shrink-0 text-[var(--text-primary)]">{money(r.value)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-baseline justify-between gap-4 border-t border-[var(--border-strong)] py-2.5">
        <span className="ds-t-body-strong text-[var(--text-primary)]">{totalLabel}</span>
        <span className="ds-t-body-strong ds-num text-[var(--text-primary)]">{money(sum)}</span>
      </div>
    </section>
  );
}

function ResultRow({ label, value, tone }: { label: string; value: number; tone?: "good" | "bad" }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 rounded-[var(--radius-md)] px-4 py-3", tone === "bad" ? "bg-[var(--danger-tint)]" : "bg-[var(--bg-active)]")}>
      <span className="ds-t-body-strong text-[var(--text-primary)]">{label}</span>
      <span className={cn("ds-num text-[17px] font-semibold", tone === "bad" ? "text-[var(--danger)]" : "text-[var(--text-primary)]")}>{money(value)}</span>
    </div>
  );
}

export default function ReportsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const param = searchParams.get("report") as ReportId | null;
  const report: ReportId = param && REPORTS.some((r) => r.id === param) ? param : "pl";
  const setReport = (id: string) => router.replace(id === "pl" ? pathname : `${pathname}?report=${id}`, { scroll: false });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/finance/accounts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't load the ledger.");
      setAccounts(data.accounts || []);
    } catch (e: any) {
      setError(e.message || "Couldn't load the ledger.");
    } finally {
      setLoading(false);
    }
  };

  const income = ofType(accounts, "INCOME");
  const expenses = ofType(accounts, "EXPENSE");
  const assets = ofType(accounts, "ASSET");
  const liabilities = ofType(accounts, "LIABILITY");
  const equity = ofType(accounts, "EQUITY");
  const profit = total(income) - total(expenses);
  const liabilitiesAndEquity = total(liabilities) + total(equity) + profit;
  const bsDifference = Math.round((total(assets) - liabilitiesAndEquity) * 100) / 100;

  const tbRows = accounts.map((a) => {
    const v = num(a.balance);
    const debitSide = DEBIT_NORMAL.has(String(a.type).toUpperCase());
    // A negative balance sits on the opposite side.
    return { ...a, debit: debitSide ? Math.max(v, 0) : Math.max(-v, 0), credit: debitSide ? Math.max(-v, 0) : Math.max(v, 0) };
  });
  const tbDebit = tbRows.reduce((s, r) => s + r.debit, 0);
  const tbCredit = tbRows.reduce((s, r) => s + r.credit, 0);
  const gstAccounts = accounts.filter((a) => /\b(gst|cgst|sgst|igst|tds)\b/i.test(a.name));

  const asOf = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Reports" breadcrumb={breadcrumb} info="Statements built from the current balances in the ledger." />

      <Tabs value={report} onValueChange={setReport}>
        <TabsList aria-label="Report" className="mb-6">
          {REPORTS.map((r) => <TabsTrigger key={r.id} value={r.id}>{r.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      {error ? (
        <ErrorState title="Couldn't load the ledger" description={error} onRetry={fetchAccounts} />
      ) : loading ? (
        <Skeleton height={420} radius="md" />
      ) : accounts.length === 0 ? (
        <Alert variant="info" title="No ledger accounts yet">Add accounts in Ledger accounts and post journal entries; the reports fill in from there.</Alert>
      ) : (
        <Card as="section" className="mx-auto w-full max-w-3xl">
          {report === "pl" && (
            <div className="flex flex-col gap-6">
              <header>
                <h2 className="ds-t-title-md text-[var(--text-primary)]">Profit and loss</h2>
                <p className="ds-t-meta text-[var(--text-muted)]">Ledger balances as of {asOf}</p>
              </header>
              <Lines title="Income" accounts={income} totalLabel="Total income" />
              <Lines title="Expenses" accounts={expenses} totalLabel="Total expenses" />
              <ResultRow label={profit < 0 ? "Net loss" : "Net profit"} value={profit} tone={profit < 0 ? "bad" : "good"} />
            </div>
          )}

          {report === "bs" && (
            <div className="flex flex-col gap-6">
              <header>
                <h2 className="ds-t-title-md text-[var(--text-primary)]">Balance sheet</h2>
                <p className="ds-t-meta text-[var(--text-muted)]">As of {asOf}</p>
              </header>
              <Lines title="Assets" accounts={assets} totalLabel="Total assets" />
              <Lines title="Liabilities" accounts={liabilities} totalLabel="Total liabilities" />
              <Lines title="Equity" accounts={equity} totalLabel="Total equity" extra={[{ name: "Current period profit", value: profit }]} />
              {bsDifference === 0 ? (
                <Alert variant="success" title="Balanced">Assets equal liabilities plus equity ({money(total(assets))}).</Alert>
              ) : (
                <Alert variant="warning" title="Doesn't balance">
                  Assets are {money(total(assets))}; liabilities plus equity are {money(liabilitiesAndEquity)}, a difference of {money(Math.abs(bsDifference))}. Check the journal for one-sided or missing entries.
                </Alert>
              )}
            </div>
          )}

          {report === "tb" && (
            <div className="flex flex-col gap-4">
              <header>
                <h2 className="ds-t-title-md text-[var(--text-primary)]">Trial balance</h2>
                <p className="ds-t-meta text-[var(--text-muted)]">As of {asOf}</p>
              </header>
              <div className="custom-scrollbar overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th scope="col" className="ds-t-meta-strong py-2 pr-3 text-[var(--text-muted)]">Code</th>
                      <th scope="col" className="ds-t-meta-strong py-2 pr-3 text-[var(--text-muted)]">Account</th>
                      <th scope="col" className="ds-t-meta-strong py-2 pr-3 text-right text-[var(--text-muted)]">Debit</th>
                      <th scope="col" className="ds-t-meta-strong py-2 text-right text-[var(--text-muted)]">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbRows.map((r) => (
                      <tr key={r.id} className="border-b border-[var(--border-subtle)]">
                        <td className="ds-t-meta ds-num py-2.5 pr-3 text-[var(--text-muted)]">{r.code}</td>
                        <td className="ds-t-body py-2.5 pr-3 text-[var(--text-primary)]">{r.name}</td>
                        <td className="ds-t-body ds-num py-2.5 pr-3 text-right text-[var(--text-primary)]">{r.debit ? money(r.debit) : ""}</td>
                        <td className="ds-t-body ds-num py-2.5 text-right text-[var(--text-primary)]">{r.credit ? money(r.credit) : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-[var(--border-strong)]">
                      <td />
                      <th scope="row" className="ds-t-body-strong py-2.5 pr-3 text-left text-[var(--text-primary)]">Total</th>
                      <td className="ds-t-body-strong ds-num py-2.5 pr-3 text-right text-[var(--text-primary)]">{money(tbDebit)}</td>
                      <td className="ds-t-body-strong ds-num py-2.5 text-right text-[var(--text-primary)]">{money(tbCredit)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {Math.round((tbDebit - tbCredit) * 100) === 0
                ? <Alert variant="success" title="Debits equal credits" />
                : <Alert variant="warning" title="Debits and credits differ">The difference is {money(Math.abs(tbDebit - tbCredit))}.</Alert>}
            </div>
          )}

          {report === "gst" && (
            <div className="flex flex-col gap-6">
              <header>
                <h2 className="ds-t-title-md text-[var(--text-primary)]">GST</h2>
                <p className="ds-t-meta text-[var(--text-muted)]">Balances of the tax accounts in the ledger, as of {asOf}</p>
              </header>
              {gstAccounts.length > 0 ? (
                <Lines title="Tax accounts" accounts={gstAccounts} totalLabel="Total" />
              ) : (
                <Alert variant="info" title="No GST accounts in the ledger">
                  Add GST accounts (for example "GST payable" or "Input GST") and post tax with each invoice and bill; this report then shows what you owe and can claim.
                </Alert>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
