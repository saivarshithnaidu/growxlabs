"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, FileText, ArrowLeft, Send, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InvoiceBuilder } from "@/components/admin/finance/InvoiceBuilder";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);

  // Payment Recording State
  const [payInvoiceId, setPayInvoiceId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("UPI");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoicesData();
  }, []);

  const fetchInvoicesData = async () => {
    try {
      setLoading(true);
      const [invRes, prodRes, compRes] = await Promise.all([
        fetch("/api/finance/invoices"),
        fetch("/api/products"),
        fetch("/api/companies")
      ]);

      const invData = await invRes.json();
      const prodData = await prodRes.json();
      const compData = await compRes.json();

      setInvoices(invData.invoices || []);
      setProducts(prodData.products || []);
      setCompanies(compData.companies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async (formData: any) => {
    try {
      const res = await fetch("/api/finance/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowCreator(false);
        fetchInvoicesData();
      } else {
        throw new Error("Failed to compile invoice");
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payInvoiceId || !payAmount) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/finance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: payInvoiceId,
          amount: payAmount,
          payment_method: payMethod
        })
      });
      if (res.ok) {
        setPayInvoiceId(null);
        setPayAmount("");
        fetchInvoicesData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (showCreator) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setShowCreator(false)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-450 hover:text-neutral-900 bg-transparent outline-none cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Listings
        </button>
        <InvoiceBuilder 
          products={products}
          companies={companies}
          onGenerateInvoice={handleGenerateInvoice}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Invoices Registry</h1>
          <p className="text-neutral-500 text-xs">Configure sales billing accounts, tracking balances, and payouts.</p>
        </div>
        <Button 
          onClick={() => setShowCreator(true)}
          className="bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[10px] px-6 h-10 rounded-md"
        >
          <Plus size={14} className="mr-1" /> Compile Invoice
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-6 w-6" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#e6e6e6] rounded-md bg-white text-center p-6">
          <FileText className="w-10 h-10 text-neutral-300 mb-2" />
          <h4 className="text-sm font-bold text-neutral-850">No sales invoices drafted</h4>
          <p className="text-xs text-neutral-400 max-w-xs mt-1">Compile client billings to log receivables and balance sheet assets.</p>
        </div>
      ) : (
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto text-xs text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                  <th className="py-2.5 pl-2">Invoice Number</th>
                  <th className="py-2.5">Client Company</th>
                  <th className="py-2.5">Due Date</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Grand Total</th>
                  <th className="py-2.5 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#e6e6e6]/60 hover:bg-[#f6f5f4]/30 font-medium">
                    <td className="py-3 pl-2 text-neutral-900 font-bold">{inv.invoice_number}</td>
                    <td className="py-3 text-neutral-500 font-bold">{inv.company?.name}</td>
                    <td className="py-3 text-neutral-500 font-mono">{inv.due_date}</td>
                    <td className="py-3">
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                        inv.status === "PAID" ? "bg-green-500/5 text-green-600 border-green-200" : "bg-amber-500/5 text-amber-600 border-amber-200"
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-neutral-950 font-bold font-mono">₹{Number(inv.grand_total).toLocaleString()}</td>
                    <td className="py-3 pr-2 text-right">
                      {inv.status !== "PAID" && (
                        <Button 
                          onClick={() => { setPayInvoiceId(inv.id); setPayAmount(inv.grand_total); }}
                          className="h-7 text-[8px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-[#0075de] hover:bg-neutral-50 px-2 rounded-md"
                        >
                          Record Payment
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Record Payment Modal */}
      {payInvoiceId && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white border border-[#e6e6e6] w-full max-w-sm p-6 shadow-xl rounded-lg space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Record Cash Payment</h3>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Payment Amount (₹)</span>
                  <Input type="number" required value={payAmount} onChange={e => setPayAmount(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Payment Method</span>
                  <select
                    value={payMethod}
                    onChange={e => setPayMethod(e.target.value)}
                    className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2 text-xs text-neutral-805"
                  >
                    <option value="UPI">UPI (Unified Payments Interface)</option>
                    <option value="BANK_TRANSFER">Bank Transfer IMPS/NEFT</option>
                    <option value="RAZORPAY">Razorpay Gateway</option>
                    <option value="CASH">Liquid Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-[#e6e6e6] pt-4">
                <Button type="button" onClick={() => setPayInvoiceId(null)} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-neutral-500 hover:bg-neutral-50 rounded-md px-4">Cancel</Button>
                <Button type="submit" disabled={submitting} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-[#0075de] text-white hover:bg-[#0075de]/90 rounded-md px-4">Record Payment</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
