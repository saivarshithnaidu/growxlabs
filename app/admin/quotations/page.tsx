"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, FileText, ArrowLeft, Send, Check } from "lucide-react";
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
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-450 hover:text-neutral-900 bg-transparent outline-none cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Listings
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Quotations Panel</h1>
          <p className="text-neutral-500 text-xs">Configure quotations, apply discounts/taxes, and download PDFs.</p>
        </div>
        <Button 
          onClick={() => setShowCreator(true)}
          className="bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[10px] px-6 h-10 rounded-md"
        >
          <Plus size={14} className="mr-1" /> Create Quotation
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-6 w-6" />
        </div>
      ) : quotations.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#e6e6e6] rounded-md bg-white text-center p-6">
          <FileText className="w-10 h-10 text-neutral-300 mb-2" />
          <h4 className="text-sm font-bold text-neutral-850">No quotations generated</h4>
          <p className="text-xs text-neutral-400 max-w-xs mt-1">Generate your first quotation to estimate deals for your accounts.</p>
        </div>
      ) : (
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto text-xs text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                  <th className="py-2.5 pl-2">Account</th>
                  <th className="py-2.5">Related Deal</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Tax (GST)</th>
                  <th className="py-2.5">Discount</th>
                  <th className="py-2.5 pr-2 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((q) => (
                  <tr key={q.id} className="border-b border-[#e6e6e6]/60 hover:bg-[#f6f5f4]/30 font-medium">
                    <td className="py-3 pl-2 text-neutral-900 font-bold">{q.company?.name}</td>
                    <td className="py-3 text-neutral-500 font-bold">{q.deal?.name || "No linked deal"}</td>
                    <td className="py-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#0075de] bg-[#0075de]/5 px-2 py-0.5 rounded border border-[#0075de]/10">
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 text-neutral-500 font-mono">₹{Number(q.tax_amount).toLocaleString()}</td>
                    <td className="py-3 text-red-500 font-mono">- ₹{Number(q.discount_amount).toLocaleString()}</td>
                    <td className="py-3 pr-2 text-right text-neutral-950 font-bold font-mono">₹{Number(q.grand_total).toLocaleString()}</td>
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
