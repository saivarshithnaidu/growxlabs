"use client";

import Link from "next/link";
import { Card, CardHeader, ChartCard, KPIItem, KPIStrip, TrendChart, formatCurrency } from "@/src/components/ui";

/*
 * Financial overview, computed only from the ledger: account balances for the position,
 * dated journal lines for the monthly profit and loss, expense accounts for the breakdown.
 * Nothing is estimated; an empty ledger shows zeros and says so.
 */

type Account = { id: string; code: string; name: string; type: string; balance: number | string | null };
type Entry = { id: string; entry_date: string };
type Item = { entry_id: string; account_id: string; debit: number | string | null; credit: number | string | null };

export interface LedgerSummary {
  cash: number;
  receivable: number;
  payable: number;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number | null;
  months: Array<{ month: string; revenue: number; expenses: number }>;
  expenseAccounts: Array<{ name: string; value: number }>;
  accountCount: number;
  entryCount: number;
}

const num = (v: unknown) => Number(v) || 0;
const sumBy = (accounts: Account[], match: (a: Account) => boolean) => accounts.filter(match).reduce((s, a) => s + num(a.balance), 0);
const MONTHS = 6;

export function summarizeLedger(accounts: Account[], entries: Entry[], items: Item[]): LedgerSummary {
  const isType = (t: string) => (a: Account) => String(a.type).toUpperCase() === t;
  const cash = sumBy(accounts, (a) => isType("ASSET")(a) && (a.code.startsWith("10") || /cash|bank/i.test(a.name)));
  const receivable = sumBy(accounts, (a) => isType("ASSET")(a) && (a.code.startsWith("12") || /receivable/i.test(a.name)));
  const payable = sumBy(accounts, (a) => isType("LIABILITY")(a) && (a.code.startsWith("20") || /payable/i.test(a.name)));
  const revenue = sumBy(accounts, isType("INCOME"));
  const expenses = sumBy(accounts, isType("EXPENSE"));
  const profit = revenue - expenses;

  // Monthly P&L from dated journal lines: income is credit minus debit, expense is debit minus credit.
  const accountType = new Map(accounts.map((a) => [a.id, String(a.type).toUpperCase()]));
  const entryMonth = new Map(entries.map((e) => [e.id, String(e.entry_date || "").slice(0, 7)]));
  const byMonth = new Map<string, { revenue: number; expenses: number }>();
  for (const item of items) {
    const month = entryMonth.get(item.entry_id);
    const type = accountType.get(item.account_id);
    if (!month || (type !== "INCOME" && type !== "EXPENSE")) continue;
    const row = byMonth.get(month) || { revenue: 0, expenses: 0 };
    if (type === "INCOME") row.revenue += num(item.credit) - num(item.debit);
    else row.expenses += num(item.debit) - num(item.credit);
    byMonth.set(month, row);
  }
  const months = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-MONTHS)
    .map(([key, v]) => ({
      month: new Date(`${key}-01T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      revenue: Math.round(v.revenue),
      expenses: Math.round(v.expenses),
    }));

  const expenseAccounts = accounts
    .filter((a) => isType("EXPENSE")(a) && num(a.balance) > 0)
    .map((a) => ({ name: a.name, value: num(a.balance) }))
    .sort((a, b) => b.value - a.value);

  return {
    cash, receivable, payable, revenue, expenses, profit,
    margin: revenue > 0 ? Math.round((profit / revenue) * 100) : null,
    months, expenseAccounts,
    accountCount: accounts.length,
    entryCount: entries.length,
  };
}

const money = (v: number) => formatCurrency(v);

export function FinanceDashboard({ summary }: { summary: LedgerSummary }) {
  const s = summary;
  const totalExpense = s.expenseAccounts.reduce((t, a) => t + a.value, 0);

  return (
    <div className="flex flex-col gap-6">
      <KPIStrip>
        <KPIItem label="Cash and bank" value={<span className="ds-num">{money(s.cash)}</span>} />
        <KPIItem label="Receivable" value={<span className="ds-num">{money(s.receivable)}</span>} hint="Owed to you" />
        <KPIItem label="Payable" value={<span className="ds-num">{money(s.payable)}</span>} hint="You owe" />
        <KPIItem
          label="Net profit"
          value={<span className={`ds-num ${s.profit < 0 ? "text-[var(--danger)]" : ""}`}>{money(s.profit)}</span>}
          hint={s.margin === null ? "No revenue recorded" : `${s.margin}% margin on ${money(s.revenue)} revenue`}
        />
      </KPIStrip>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card as="section">
          <ChartCard
            title="Revenue and expenses by month"
            legend={[
              { label: "Revenue", color: "var(--chart-1)" },
              { label: "Expenses", color: "var(--danger)" },
            ]}
          >
            {s.months.length > 0 ? (
              <TrendChart
                label="Monthly revenue and expenses from the journal"
                data={s.months}
                xKey="month"
                valueFormat="inr-compact"
                series={[
                  { key: "revenue", label: "Revenue", color: "var(--chart-1)", area: true },
                  { key: "expenses", label: "Expenses", color: "var(--danger)" },
                ]}
              />
            ) : (
              <p className="ds-t-body py-16 text-center text-[var(--text-muted)]">
                No income or expense entries in the journal yet.
              </p>
            )}
          </ChartCard>
        </Card>

        <Card as="section">
          <CardHeader title="Expenses by account" description={totalExpense > 0 ? `${money(totalExpense)} in total` : undefined} />
          {s.expenseAccounts.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {s.expenseAccounts.map((a) => {
                const share = totalExpense > 0 ? a.value / totalExpense : 0;
                return (
                  <li key={a.name} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="ds-t-body min-w-0 truncate text-[var(--text-primary)]">{a.name}</span>
                      <span className="ds-t-meta ds-num shrink-0 text-[var(--text-muted)]">{money(a.value)} ({Math.round(share * 100)}%)</span>
                    </div>
                    <span className="h-1.5 overflow-hidden rounded-[var(--radius-full)] bg-[var(--bg-active)]" aria-hidden>
                      <span className="block h-full origin-left bg-[var(--danger)]" style={{ transform: `scaleX(${share})` }} />
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="ds-t-body text-[var(--text-muted)]">No expenses recorded.</p>
          )}
        </Card>
      </div>

      <p className="ds-t-meta text-[var(--text-muted)]">
        From {s.accountCount} ledger {s.accountCount === 1 ? "account" : "accounts"} and {s.entryCount} journal {s.entryCount === 1 ? "entry" : "entries"}.{" "}
        <Link href="/admin/finance/accounts" className="ds-focus rounded-[var(--radius-xs)] text-[var(--accent)] hover:underline focus-visible:shadow-[var(--focus-ring)]">Open the ledger</Link>
      </p>
    </div>
  );
}
