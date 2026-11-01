"use client";

import React, { useState, useEffect } from "react";
import { Plus, Wallet } from "lucide-react";
import {
  Button, DataTable, type DataTableColumn, Input, KPIItem, KPIStrip, Modal, Select, formatCurrency, toast,
} from "@/src/components/ui";
import { EmptyState, ErrorState, FormField, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type Expense = { id: string; category: string; amount: number | string; gst_paid: number | string; payment_method: string; log_date: string };

// Used only when the ledger has no expense accounts yet.
const DEFAULT_CATEGORIES = ["Cloud Infrastructure", "Employee Salaries", "Travel & Entertainment"];
const METHODS = [
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Card" },
  { value: "CASH", label: "Cash" },
];
const methodLabel = (m: string) => METHODS.find((x) => x.value === m)?.label || m.replaceAll("_", " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());
const blankExpense = () => ({ category: "", amount: "", gst_paid: "", payment_method: "BANK_TRANSFER", log_date: new Date().toISOString().split("T")[0], receipt_url: "" });

export default function ExpensesPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newExpense, setNewExpense] = useState(blankExpense);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const [res, accountsRes] = await Promise.all([fetch("/api/finance/expenses"), fetch("/api/finance/accounts")]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't load expenses.");
      setExpenses(data.expenses || []);
      if (accountsRes.ok) {
        const accounts = ((await accountsRes.json()).accounts || []) as Array<{ name: string; type: string }>;
        const names = accounts.filter((a) => String(a.type).toUpperCase() === "EXPENSE").map((a) => a.name);
        if (names.length) setCategories(names);
      }
    } catch (e: any) {
      setError(e.message || "Couldn't load expenses.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/finance/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newExpense, amount: Number(newExpense.amount), gst_paid: Number(newExpense.gst_paid) || 0 })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't log the expense.");
      toast({ title: "Expense logged", variant: "success" });
      setShowAddModal(false);
      setNewExpense(blankExpense());
      fetchExpenses();
    } catch (err: any) {
      toast({ title: err.message, variant: "danger" });
    } finally {
      setSaving(false);
    }
  };

  const total = expenses.reduce((s, x) => s + Number(x.amount || 0), 0);
  const gst = expenses.reduce((s, x) => s + Number(x.gst_paid || 0), 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthTotal = expenses.filter((x) => String(x.log_date).startsWith(thisMonth)).reduce((s, x) => s + Number(x.amount || 0), 0);

  const columns: DataTableColumn<Expense>[] = [
    { id: "date", header: "Date", sortValue: (x) => x.log_date, cell: (x) => <span className="ds-num text-[var(--text-secondary)]">{x.log_date}</span> },
    { id: "category", header: "Category", width: "34%", sortValue: (x) => x.category, cell: (x) => <span className="text-[var(--text-primary)]">{x.category}</span> },
    { id: "method", header: "Paid by", sortValue: (x) => x.payment_method, cell: (x) => methodLabel(x.payment_method) },
    { id: "gst", header: "GST", numeric: true, sortValue: (x) => Number(x.gst_paid), cell: (x) => formatCurrency(Number(x.gst_paid)) },
    { id: "amount", header: "Amount", numeric: true, sortValue: (x) => Number(x.amount), cell: (x) => <span className="text-[var(--text-primary)]">{formatCurrency(Number(x.amount))}</span> },
  ];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Expenses"
        breadcrumb={breadcrumb}
        info="What the company spent, with GST paid on each."
        actions={<Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowAddModal(true)}>Log expense</Button>}
      />

      {error ? (
        <ErrorState title="Couldn't load expenses" description={error} onRetry={fetchExpenses} />
      ) : (
        <div className="flex flex-col gap-6">
          <KPIStrip>
            <KPIItem label="This month" loading={loading} value={<span className="ds-num">{formatCurrency(monthTotal)}</span>} />
            <KPIItem label="All recorded" loading={loading} value={<span className="ds-num">{formatCurrency(total)}</span>} hint={`${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"}`} />
            <KPIItem label="GST paid" loading={loading} value={<span className="ds-num">{formatCurrency(gst)}</span>} />
          </KPIStrip>

          <DataTable
            label="Expenses"
            columns={columns}
            rows={[...expenses].sort((a, b) => String(b.log_date).localeCompare(String(a.log_date)))}
            getRowId={(x) => x.id}
            loading={loading}
            skeletonRows={5}
            emptyState={<EmptyState icon={<Wallet size={24} strokeWidth={1.5} />} title="No expenses recorded" description="Log what the company spends so profit and GST stay accurate." action={<Button variant="primary" onClick={() => setShowAddModal(true)}>Log expense</Button>} />}
          />
        </div>
      )}

      <Modal
        open={showAddModal}
        onOpenChange={(open) => { setShowAddModal(open); if (!open) setNewExpense(blankExpense()); }}
        title="Log expense"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" form="expense-form" variant="primary" loading={saving} disabled={!newExpense.category || !Number(newExpense.amount)}>Log expense</Button>
          </>
        }
      >
        <form id="expense-form" onSubmit={handleCreateExpense} className="flex flex-col gap-4">
          <FormField label="Category" required>
            {(f) => <Select {...f} required value={newExpense.category || undefined} placeholder="Choose a category" onValueChange={(v) => setNewExpense({ ...newExpense, category: v })} options={categories.map((c) => ({ value: c, label: c }))} />}
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Amount (₹)" required>
              {(f) => <Input {...f} type="number" min={0} step="0.01" required inputMode="decimal" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />}
            </FormField>
            <FormField label="GST included (₹)" hint="Leave empty if none">
              {(f) => <Input {...f} type="number" min={0} step="0.01" inputMode="decimal" value={newExpense.gst_paid} onChange={(e) => setNewExpense({ ...newExpense, gst_paid: e.target.value })} />}
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date" required>
              {(f) => <Input {...f} type="date" required value={newExpense.log_date} onChange={(e) => setNewExpense({ ...newExpense, log_date: e.target.value })} />}
            </FormField>
            <FormField label="Paid by">
              {(f) => <Select {...f} value={newExpense.payment_method} onValueChange={(v) => setNewExpense({ ...newExpense, payment_method: v })} options={METHODS} />}
            </FormField>
          </div>
        </form>
      </Modal>
    </div>
  );
}
