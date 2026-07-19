"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newExpense, setNewExpense] = useState({
    category: "Cloud Infrastructure",
    amount: 15000,
    gst_paid: 2700,
    payment_method: "BANK_TRANSFER",
    log_date: new Date().toISOString().split("T")[0],
    receipt_url: ""
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/finance/expenses");
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/finance/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewExpense({
          category: "Cloud Infrastructure",
          amount: 15000,
          gst_paid: 2700,
          payment_method: "BANK_TRANSFER",
          log_date: new Date().toISOString().split("T")[0],
          receipt_url: ""
        });
        fetchExpenses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none flex items-center gap-2">
            <Wallet size={28} className="text-[#0075de]" /> Expenses Registry
          </h1>
          <p className="text-neutral-500 text-xs">Verify employee expenditures, vendor invoices, and payouts.</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[10px] px-6 h-10 rounded-md"
        >
          <Plus size={14} className="mr-1" /> Log Expense
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-6 w-6" />
        </div>
      ) : expenses.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#e6e6e6] rounded-md bg-white text-center p-6">
          <Wallet className="w-10 h-10 text-neutral-300 mb-2" />
          <h4 className="text-sm font-bold text-neutral-850">No expenses recorded</h4>
          <p className="text-xs text-neutral-400 max-w-xs mt-1">Log corporate expenditures to balance income ledger accounts.</p>
        </div>
      ) : (
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto text-xs text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                  <th className="py-2.5 pl-2">Category</th>
                  <th className="py-2.5">Method</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5 text-right">Tax (GST) Paid</th>
                  <th className="py-2.5 pr-2 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b border-[#e6e6e6]/60 hover:bg-[#f6f5f4]/30 font-medium">
                    <td className="py-3 pl-2 text-neutral-900 font-bold">{exp.category}</td>
                    <td className="py-3 text-neutral-600 font-bold">{exp.payment_method}</td>
                    <td className="py-3 text-neutral-400 font-mono">{exp.log_date}</td>
                    <td className="py-3 text-right text-neutral-500 font-mono">₹{Number(exp.gst_paid).toLocaleString()}</td>
                    <td className="py-3 pr-2 text-right text-red-500 font-bold font-mono">₹{Number(exp.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white border border-[#e6e6e6] w-full max-w-md p-6 shadow-xl rounded-lg space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Log Corporate Expense</h3>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Expense Category</span>
                  <select
                    value={newExpense.category}
                    onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2 text-xs text-neutral-805"
                  >
                    <option value="Cloud Infrastructure">Cloud Infrastructure (5020)</option>
                    <option value="Employee Salaries">Employee Salaries (5010)</option>
                    <option value="Travel & Entertainment">Travel & Entertainment (5030)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-neutral-400">Expense Amount (₹)</span>
                    <Input type="number" required value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: Number(e.target.value) })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-neutral-400">GST Tax Portion (₹)</span>
                    <Input type="number" required value={newExpense.gst_paid} onChange={e => setNewExpense({ ...newExpense, gst_paid: Number(e.target.value) })} className="h-9 text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Expense Date</span>
                  <Input type="date" required value={newExpense.log_date} onChange={e => setNewExpense({ ...newExpense, log_date: e.target.value })} className="h-9 text-xs" />
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-[#e6e6e6] pt-4">
                <Button type="button" onClick={() => setShowAddModal(false)} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-neutral-500 hover:bg-neutral-50 rounded-md px-4">Cancel</Button>
                <Button type="submit" className="h-9 text-[10px] font-bold uppercase tracking-widest bg-[#0075de] text-white hover:bg-[#0075de]/90 rounded-md px-4">Log Claim</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
