"use client";

import React, { useState } from "react";
import { Plus, List, Database, ArrowLeftRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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

interface GeneralLedgerProps {
  accounts: Account[];
  items: JournalItem[];
  onPostVoucher: (data: any) => Promise<void>;
}

export function GeneralLedger({ accounts, items, onPostVoucher }: GeneralLedgerProps) {
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState([
    { account_code: "", debit: 0, credit: 0 },
    { account_code: "", debit: 0, credit: 0 }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (index: number, field: "account_code" | "debit" | "credit", value: any) => {
    setLines(prev => prev.map((l, idx) => {
      if (idx !== index) return l;
      if (field === "debit") return { ...l, debit: Number(value), credit: 0 };
      if (field === "credit") return { ...l, credit: Number(value), debit: 0 };
      return { ...l, [field]: value };
    }));
  };

  const handleAddLine = () => {
    setLines([...lines, { account_code: "", debit: 0, credit: 0 }]);
  };

  const totalDebits = lines.reduce((acc, l) => acc + l.debit, 0);
  const totalCredits = lines.reduce((acc, l) => acc + l.credit, 0);

  const handlePostEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalDebits !== totalCredits) return alert("Voucher out of balance! Debits must equal Credits.");

    setSubmitting(true);
    try {
      await onPostVoucher({
        entry_date: entryDate,
        reference,
        description,
        items: lines.filter(l => l.account_code)
      });
      alert("Journal voucher posted successfully!");
      setShowVoucherModal(false);
      setDescription("");
      setReference("");
      setLines([
        { account_code: "", debit: 0, credit: 0 },
        { account_code: "", debit: 0, credit: 0 }
      ]);
    } catch (e) {
      console.error(e);
      alert("Failed to post journal entry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Chart accounts balances */}
      <div className="md:col-span-1">
        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-4 flex items-center gap-2">
            <Database size={14} className="text-[#0075de]" /> Chart of Accounts
          </h3>
          <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1.5 no-scrollbar">
            {accounts.map(acc => (
              <div key={acc.id} className="flex justify-between items-center text-xs border-b border-[#e6e6e6]/60 pb-2">
                <div>
                  <span className="font-mono font-bold text-neutral-450 mr-2">{acc.code}</span>
                  <span className="text-neutral-900 font-bold">{acc.name}</span>
                  <span className="text-[9px] text-neutral-400 block mt-0.5">{acc.type}</span>
                </div>
                <span className="font-mono font-bold text-neutral-800">₹{Number(acc.balance).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Ledger transactions logs */}
      <div className="md:col-span-2 space-y-6">
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center border-b border-[#e6e6e6] pb-3 mb-4">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
              <ArrowLeftRight size={14} className="text-[#0075de]" /> Double-Entry General Ledger
            </h3>
            <Button 
              onClick={() => setShowVoucherModal(true)}
              className="h-8 text-[9px] font-bold uppercase tracking-widest bg-[#0075de] hover:bg-[#0075de]/90 text-white rounded-md px-3.5"
            >
              <Plus size={12} className="mr-1" /> New Journal entry
            </Button>
          </div>

          <div className="overflow-x-auto text-xs text-left max-h-[50vh] overflow-y-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                  <th className="py-2.5 pl-2">Account</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5 text-right">Debit (Dr)</th>
                  <th className="py-2.5 pr-2 text-right">Credit (Cr)</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-[#e6e6e6]/60 hover:bg-[#f6f5f4]/30 font-medium">
                    <td className="py-3 pl-2">
                      <span className="font-mono text-neutral-450 mr-2">[{item.account?.code}]</span>
                      <span className="text-neutral-900 font-bold">{item.account?.name}</span>
                    </td>
                    <td className="py-3 text-neutral-600">{item.description}</td>
                    <td className="py-3 text-neutral-400 font-mono text-[10px]">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="py-3 text-right text-neutral-900 font-bold font-mono">
                      {Number(item.debit) > 0 ? `₹${Number(item.debit).toLocaleString()}` : "-"}
                    </td>
                    <td className="py-3 pr-2 text-right text-neutral-900 font-bold font-mono">
                      {Number(item.credit) > 0 ? `₹${Number(item.credit).toLocaleString()}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Manual Voucher Entry Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white border border-[#e6e6e6] w-full max-w-2xl p-6 shadow-xl rounded-lg space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Post Journal Voucher</h3>
            <form onSubmit={handlePostEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Entry Date</span>
                  <Input type="date" required value={entryDate} onChange={e => setEntryDate(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Reference / Invoice</span>
                  <Input placeholder="INV-001..." value={reference} onChange={e => setReference(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Description Summary</span>
                  <Input required placeholder="Paid Cloud infra bills" value={description} onChange={e => setDescription(e.target.value)} className="h-9 text-xs" />
                </div>
              </div>

              {/* Items Lines */}
              <div className="space-y-3.5 border-t border-[#e6e6e6] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Journal debits / credits splits</span>
                  <Button type="button" onClick={handleAddLine} className="h-7 text-[8px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-[#0075de] hover:bg-neutral-50 px-2 rounded-md">
                    Add Line
                  </Button>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pr-1">
                  {lines.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-6">
                        <select
                          required
                          value={line.account_code}
                          onChange={e => handleFieldChange(idx, "account_code", e.target.value)}
                          className="w-full h-9 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-805"
                        >
                          <option value="">Choose Account...</option>
                          {accounts.map(acc => <option key={acc.id} value={acc.code}>[{acc.code}] {acc.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder="Debit ₹"
                          value={line.debit || ""}
                          onChange={e => handleFieldChange(idx, "debit", e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder="Credit ₹"
                          value={line.credit || ""}
                          onChange={e => handleFieldChange(idx, "credit", e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="border-t border-[#e6e6e6] pt-4 flex justify-between items-center text-xs font-bold text-neutral-600 bg-[#f6f5f4] p-3.5 rounded-md border">
                <span>Voucher Balance check:</span>
                <span className="font-mono">
                  Dr: <span className="text-[#0075de]">₹{totalDebits.toLocaleString()}</span> / Cr: <span className="text-red-500">₹{totalCredits.toLocaleString()}</span>
                </span>
              </div>

              <div className="flex gap-3 justify-end border-t border-[#e6e6e6] pt-4">
                <Button type="button" onClick={() => setShowVoucherModal(false)} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-neutral-500 hover:bg-neutral-50 rounded-md px-4">Cancel</Button>
                <Button type="submit" disabled={submitting} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-[#0075de] text-white hover:bg-[#0075de]/90 rounded-md px-4">Post Voucher</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
