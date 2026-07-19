"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calculator, Check, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
}

interface QuoteItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  tax_percentage: number;
  description: string;
}

interface QuoteGeneratorProps {
  products: Product[];
  deals: any[];
  companies: any[];
  onGenerate: (data: any) => Promise<void>;
}

export function QuoteGenerator({ products, deals, companies, onGenerate }: QuoteGeneratorProps) {
  const [dealId, setDealId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<QuoteItem[]>([
    { product_id: "", quantity: 1, unit_price: 0, tax_percentage: 18, description: "" }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { product_id: "", quantity: 1, unit_price: 0, tax_percentage: 18, description: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    setItems(prev => prev.map((item, i) => i === index ? {
      ...item,
      product_id: productId,
      unit_price: Number(prod.price),
      description: prod.name
    } : item));
  };

  const handleFieldChange = (index: number, field: keyof QuoteItem, value: any) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unit_price)), 0);
  const taxTotal = items.reduce((acc, item) => {
    const itemTotal = Number(item.quantity) * Number(item.unit_price);
    return acc + (itemTotal * (item.tax_percentage / 100));
  }, 0);
  const grandTotal = subtotal + taxTotal - Number(discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return alert("Please select a target company.");

    setSubmitting(true);
    try {
      await onGenerate({
        deal_id: dealId || null,
        company_id: companyId,
        discount_amount: discount,
        items
      });
      alert("Quotation generated successfully!");
      // Reset
      setDealId("");
      setCompanyId("");
      setDiscount(0);
      setItems([{ product_id: "", quantity: 1, unit_price: 0, tax_percentage: 18, description: "" }]);
    } catch (err) {
      console.error(err);
      alert("Error generating quotation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5 flex items-center gap-2">
          <FileText size={16} className="text-[#0075de]" /> Generate Quotation Document
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Target Account</label>
            <select
              required
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full h-10 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-3.5 text-xs text-neutral-800 outline-none focus:border-[#0075de] focus:bg-white transition-all cursor-pointer"
            >
              <option value="">Select Company...</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Related Deal (Optional)</label>
            <select
              value={dealId}
              onChange={(e) => setDealId(e.target.value)}
              className="w-full h-10 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-3.5 text-xs text-neutral-800 outline-none focus:border-[#0075de] focus:bg-white transition-all cursor-pointer"
            >
              <option value="">Select Deal...</option>
              {deals.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Quotation Line Items</span>
            <Button
              type="button"
              onClick={handleAddItem}
              className="h-7 text-[9px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-[#0075de] hover:bg-neutral-50 px-3 rounded-md"
            >
              <Plus size={10} className="mr-1" /> Add Product
            </Button>
          </div>

          <div className="space-y-3.5">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-end bg-[#f6f5f4]/40 p-3 rounded border border-[#e6e6e6]/60">
                <div className="col-span-4 space-y-1">
                  <span className="text-[8px] font-bold uppercase text-neutral-400">Product</span>
                  <select
                    required
                    value={item.product_id}
                    onChange={(e) => handleProductChange(idx, e.target.value)}
                    className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-800 outline-none"
                  >
                    <option value="">Choose item...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>)}
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-[8px] font-bold uppercase text-neutral-400">Qty</span>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleFieldChange(idx, "quantity", Number(e.target.value))}
                    className="h-9 bg-white border-[#e6e6e6] text-xs text-center"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-[8px] font-bold uppercase text-neutral-400">Unit Price</span>
                  <Input
                    type="number"
                    required
                    value={item.unit_price}
                    onChange={(e) => handleFieldChange(idx, "unit_price", Number(e.target.value))}
                    className="h-9 bg-white border-[#e6e6e6] text-xs"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-[8px] font-bold uppercase text-neutral-400">Tax (%)</span>
                  <Input
                    type="number"
                    required
                    value={item.tax_percentage}
                    onChange={(e) => handleFieldChange(idx, "tax_percentage", Number(e.target.value))}
                    className="h-9 bg-white border-[#e6e6e6] text-xs text-center"
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length === 1}
                    className="h-9 bg-transparent border border-red-200/50 hover:bg-red-50 text-red-500 rounded-md px-3"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Summaries */}
        <div className="border-t border-[#e6e6e6] pt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Special Discount (₹)</span>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="h-8 w-28 bg-[#f6f5f4] border-[#e6e6e6] text-xs"
              />
            </div>
          </div>

          <div className="w-full md:w-80 bg-[#f6f5f4] p-4 rounded-md border border-[#e6e6e6] space-y-2.5 text-xs font-semibold text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-neutral-900 font-mono">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST):</span>
              <span className="text-neutral-900 font-mono">+ ₹{taxTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount Applied:</span>
              <span className="text-red-500 font-mono">- ₹{discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-[#e6e6e6] pt-2 text-sm font-black text-neutral-950">
              <span>Total Price:</span>
              <span className="text-[#0075de] font-mono">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#0075de] text-white hover:bg-[#0075de]/90 font-bold uppercase tracking-widest text-[10px] h-11 rounded-md"
        >
          {submitting ? "Processing..." : "Generate and Send Quotation"}
        </Button>
      </form>
    </Card>
  );
}
