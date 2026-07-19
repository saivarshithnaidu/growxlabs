"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, FileText, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QuoteGenerator } from "@/components/admin/QuoteGenerator";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    fetchQuotationsData();
  }, []);

  const fetchQuotationsData = async () => {
    try {
      setLoading(true);
      const [qRes, pRes, dRes, cRes] = await Promise.all([
        fetch("/api/quotations"),
        fetch("/api/products"),
        fetch("/api/deals"),
        fetch("/api/companies")
      ]);

      const qData = await qRes.json();
      const pData = await pRes.json();
      const dData = await dRes.json();
      const cData = await cRes.json();

      setQuotations(qData.quotations || []);
      setProducts(pData.products || []);
      setDeals(dData.deals || []);
      setCompanies(cData.companies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuotation = async (formData: any) => {
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowCreator(false);
        fetchQuotationsData();
      } else {
        throw new Error("Failed to create quotation");
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  if (showCreator) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setShowCreator(false)}
          className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Quotations List
        </button>
        <QuoteGenerator 
          products={products}
          deals={deals}
          companies={companies}
          onGenerate={handleGenerateQuotation}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0075de]/10 border border-[#0075de]/20 rounded-lg text-[#0075de]">
              <FileText size={20} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Quotations &amp; Estimates
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Create price estimates, manage discounts &amp; GST tax line items.
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreator(true)}
          className="bg-[#0075de] hover:bg-[#005bab] text-white font-bold text-xs px-4 h-10 rounded-xl shadow-md transition-all"
        >
          <Plus size={16} className="mr-1.5" /> Create Quotation
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-6 w-6" />
        </div>
      ) : quotations.length === 0 ? (
        <Card className="h-64 flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] bg-[var(--card)] text-center p-6 rounded-xl">
          <FileText className="w-10 h-10 text-[var(--text-muted)] mb-3" />
          <h4 className="text-sm font-bold text-[var(--text-primary)]">No Quotations Found</h4>
          <p className="text-xs text-[var(--text-secondary)] max-w-xs mt-1">
            Generate your first quotation to estimate deals for your accounts.
          </p>
          <Button 
            onClick={() => setShowCreator(true)}
            size="sm"
            className="mt-4 bg-[#0075de] text-white text-xs font-bold"
          >
            <Plus size={14} className="mr-1" /> Create First Quotation
          </Button>
        </Card>
      ) : (
        <Card className="p-6 border border-[var(--border-subtle)] bg-[var(--card)] rounded-xl shadow-sm">
          <div className="overflow-x-auto text-xs text-left">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--surface-1)]">
                <tr className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-4">Account</th>
                  <th className="py-3 px-4">Related Deal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tax (GST)</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-[var(--surface-1)]/50 transition-colors">
                    <td className="py-3.5 px-4 text-[var(--text-primary)] font-bold">{q.company?.name || "N/A"}</td>
                    <td className="py-3.5 px-4 text-[var(--text-secondary)] font-medium">{q.deal?.name || "No linked deal"}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#0075de] bg-[#0075de]/10 border border-[#0075de]/20 px-2.5 py-0.5 rounded-full">
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-secondary)] font-mono">₹{Number(q.tax_amount || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-red-500 font-mono">- ₹{Number(q.discount_amount || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right text-[var(--text-primary)] font-black font-mono">₹{Number(q.grand_total || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
