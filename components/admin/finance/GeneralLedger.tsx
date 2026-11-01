"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Button, DataTable, type DataTableColumn, IconButton, Input, Modal, Select, Tabs, TabsList, TabsTrigger, formatCurrency, toast,
} from "@/src/components/ui";
import { FormField } from "@/src/components/patterns";
import { cn } from "@/lib/utils";

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: number;
}

interface JournalItem {
  id: string;
  entry_id: string;
  debit: number;
  credit: number;
  description: string;
  created_at: string;
  account?: { name: string; code: string };
}

interface JournalEntry {
  id: string;
  entry_date: string;
  reference?: string | null;
  description?: string | null;
}

interface GeneralLedgerProps {
  accounts: Account[];
  items: JournalItem[];
  entries: JournalEntry[];
  onPostVoucher: (data: any) => Promise<void>;
  /** Controls the journal-entry form from the page header. */
  entryOpen: boolean;
  onEntryOpenChange: (open: boolean) => void;
}

const TYPE_ORDER = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];
const typeLabel = (t: string) => String(t).toLowerCase().replace(/^./, (c) => c.toUpperCase());
const money = (v: number) => formatCurrency(Number(v) || 0);
type Line = { account_code: string; debit: string; credit: string };
const blankLines = (): Line[] => [{ account_code: "", debit: "", credit: "" }, { account_code: "", debit: "", credit: "" }];

export function GeneralLedger({ accounts, items, entries, onPostVoucher, entryOpen, onEntryOpenChange }: GeneralLedgerProps) {
  const [view, setView] = useState<"accounts" | "journal">("accounts");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<Line[]>(blankLines);
  const [submitting, setSubmitting] = useState(false);

  const setLine = (index: number, patch: Partial<Line>) =>
    setLines((prev) => prev.map((l, i) => {
      if (i !== index) return l;
      // A line is either a debit or a credit, never both.
      if (patch.debit !== undefined && patch.debit !== "") return { ...l, ...patch, credit: "" };
      if (patch.credit !== undefined && patch.credit !== "") return { ...l, ...patch, debit: "" };
      return { ...l, ...patch };
    }));

  const usedLines = lines.filter((l) => l.account_code && (Number(l.debit) || Number(l.credit)));
  const totalDebits = usedLines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredits = usedLines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const balanced = usedLines.length >= 2 && Math.round(totalDebits * 100) === Math.round(totalCredits * 100) && totalDebits > 0;

  const reset = () => {
    setDescription("");
    setReference("");
    setLines(blankLines());
  };

  const handlePostEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanced) return;
    setSubmitting(true);
    try {
      await onPostVoucher({
        entry_date: entryDate,
        reference,
        description,
        items: usedLines.map((l) => ({ account_code: l.account_code, debit: Number(l.debit) || 0, credit: Number(l.credit) || 0 })),
      });
      toast({ title: "Journal entry posted", variant: "success" });
      onEntryOpenChange(false);
      reset();
    } catch (err: any) {
      toast({ title: err?.message || "Couldn't post the journal entry.", variant: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => TYPE_ORDER.indexOf(String(a.type).toUpperCase()) - TYPE_ORDER.indexOf(String(b.type).toUpperCase()) || a.code.localeCompare(b.code));
  const entryById = new Map(entries.map((e) => [e.id, e]));
  const journalRows = items
    .map((i) => ({ ...i, entry: entryById.get(i.entry_id) }))
    .sort((a, b) => String(b.entry?.entry_date || b.created_at).localeCompare(String(a.entry?.entry_date || a.created_at)));

  const accountColumns: DataTableColumn<Account>[] = [
    { id: "code", header: "Code", sortValue: (a) => a.code, cell: (a) => <span className="ds-num text-[var(--text-muted)]">{a.code}</span> },
    { id: "name", header: "Account", width: "44%", sortValue: (a) => a.name, cell: (a) => <span className="text-[var(--text-primary)]">{a.name}</span> },
    { id: "type", header: "Type", sortValue: (a) => TYPE_ORDER.indexOf(String(a.type).toUpperCase()), cell: (a) => typeLabel(a.type) },
    { id: "balance", header: "Balance", numeric: true, sortValue: (a) => Number(a.balance), cell: (a) => <span className={cn(Number(a.balance) < 0 ? "text-[var(--danger)]" : "text-[var(--text-primary)]")}>{money(a.balance)}</span> },
  ];

  const journalColumns: DataTableColumn<(typeof journalRows)[number]>[] = [
    { id: "date", header: "Date", sortValue: (r) => r.entry?.entry_date || r.created_at, cell: (r) => <span className="ds-num text-[var(--text-secondary)]">{(r.entry?.entry_date || r.created_at || "").slice(0, 10)}</span> },
    {
      id: "account",
      header: "Account",
      width: "30%",
      sortValue: (r) => r.account?.code || "",
      cell: (r) => <span className="text-[var(--text-primary)]">{r.account?.name || "Unknown account"}<span className="ds-t-meta ds-num ml-2 text-[var(--text-disabled)]">{r.account?.code}</span></span>,
    },
    { id: "description", header: "Description", cell: (r) => <span className="truncate text-[var(--text-secondary)]" title={r.description || r.entry?.description || ""}>{r.description || r.entry?.description || r.entry?.reference || ""}</span> },
    { id: "debit", header: "Debit", numeric: true, sortValue: (r) => Number(r.debit), cell: (r) => (Number(r.debit) > 0 ? money(r.debit) : "") },
    { id: "credit", header: "Credit", numeric: true, sortValue: (r) => Number(r.credit), cell: (r) => (Number(r.credit) > 0 ? money(r.credit) : "") },
  ];

  const accountOptions = sortedAccounts.map((a) => ({ value: a.code, label: `${a.code} ${a.name}` }));

  return (
    <>
      <Tabs value={view} onValueChange={(v) => setView(v as "accounts" | "journal")}>
        <TabsList aria-label="Ledger view" className="mb-4">
          <TabsTrigger value="accounts" count={accounts.length}>Accounts</TabsTrigger>
          <TabsTrigger value="journal" count={items.length}>Journal</TabsTrigger>
        </TabsList>
      </Tabs>

      {view === "accounts"
        ? <DataTable label="Chart of accounts" columns={accountColumns} rows={sortedAccounts} getRowId={(a) => a.id} />
        : <DataTable label="Journal lines" columns={journalColumns} rows={journalRows} getRowId={(r) => r.id} />}

      <Modal
        open={entryOpen}
        onOpenChange={(open) => { onEntryOpenChange(open); if (!open) reset(); }}
        title="New journal entry"
        description="Debits must equal credits."
        size="lg"
        footer={
          <>
            <span className={cn("ds-t-meta ds-num mr-auto", balanced ? "text-[var(--success)]" : "text-[var(--text-muted)]")}>
              Debit {money(totalDebits)}, credit {money(totalCredits)}
              {!balanced && totalDebits + totalCredits > 0 && `, difference ${money(Math.abs(totalDebits - totalCredits))}`}
            </span>
            <Button variant="ghost" onClick={() => onEntryOpenChange(false)}>Cancel</Button>
            <Button type="submit" form="journal-form" variant="primary" loading={submitting} disabled={!balanced || !description.trim()}>Post entry</Button>
          </>
        }
      >
        <form id="journal-form" onSubmit={handlePostEntry} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Date" required>
              {(f) => <Input {...f} type="date" required value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />}
            </FormField>
            <FormField label="Reference" hint="Invoice or receipt number, if any">
              {(f) => <Input {...f} value={reference} onChange={(e) => setReference(e.target.value)} />}
            </FormField>
          </div>
          <FormField label="Description" required>
            {(f) => <Input {...f} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this entry records" />}
          </FormField>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[minmax(0,1fr)_110px_110px_32px] gap-2">
              <span className="ds-t-meta-strong text-[var(--text-muted)]">Account</span>
              <span className="ds-t-meta-strong text-right text-[var(--text-muted)]">Debit</span>
              <span className="ds-t-meta-strong text-right text-[var(--text-muted)]">Credit</span>
              <span />
            </div>
            {lines.map((line, idx) => (
              <div key={idx} className="grid grid-cols-[minmax(0,1fr)_110px_110px_32px] items-center gap-2">
                <Select aria-label={`Line ${idx + 1} account`} value={line.account_code || undefined} placeholder="Choose an account" onValueChange={(v) => setLine(idx, { account_code: v })} options={accountOptions} />
                <Input aria-label={`Line ${idx + 1} debit`} type="number" min={0} step="0.01" inputMode="decimal" className="text-right" value={line.debit} onChange={(e) => setLine(idx, { debit: e.target.value })} />
                <Input aria-label={`Line ${idx + 1} credit`} type="number" min={0} step="0.01" inputMode="decimal" className="text-right" value={line.credit} onChange={(e) => setLine(idx, { credit: e.target.value })} />
                <IconButton size={28} label={`Remove line ${idx + 1}`} icon={<Trash2 size={14} strokeWidth={1.5} />} disabled={lines.length <= 2} onClick={() => setLines((prev) => prev.filter((_, i) => i !== idx))} />
              </div>
            ))}
            <div>
              <Button size={28} variant="ghost" iconLeft={<Plus size={14} strokeWidth={1.5} />} onClick={() => setLines((prev) => [...prev, { account_code: "", debit: "", credit: "" }])}>Add line</Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
