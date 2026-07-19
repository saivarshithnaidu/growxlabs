"use client";

import React, { useState } from "react";
import { Plus, Trash2, Check, FileText } from "lucide-react";
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
  const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.unit_price || 0)), 0);
  const taxTotal = items.reduce((acc, item) => {
    const itemTotal = Number(item.quantity || 0) * Number(item.unit_price || 0);
    return acc + (itemTotal * ((item.tax_percentage || 0) / 100));
  }, 0);
  const grandTotal = Math.max(0, subtotal + taxTotal - Number(discount || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return alert("Please select a target company.");

    setSubmitting(true);
    try {
      await onGenerate({
        deal_id: dealId || null,
        company_id: companyId,
        discount_amount: Number(discount || 0),
        items
      });
      alert("Quotation generated successfully!");
      // Reset form
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
    <Card className="p-6 border border-[var(--border-subtle)] bg-[var(--card)] text-[var(--text-primary)] rounded-xl shadow-sm space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card Header */}
        <div className="flex items-center gap-2.5 border-b border-[var(--border-subtle)] pb-4">
          <div className="p-2 bg-[#0075de]/10 rounded-lg text-[#0075de]">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Create Quotation Document
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Fill in customer details, add products, set discounts &amp; taxes.
            </p>
          </div>
        </div>

        {/* Account & Deal Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)]">
              Target Account <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full h-10 bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-lg px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#0075de] transition-colors cursor-pointer"
            >
              <option value="">Select Company...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id} className="bg-[var(--card)] text-[var(--text-primary)]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)]">
              Related Deal <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
            </label>
            <select
              value={dealId}
              onChange={(e) => setDealId(e.target.value)}
              className="w-full h-10 bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-lg px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#0075de] transition-colors cursor-pointer"
            >
              <option value="">Select Deal...</option>
              {deals.map(d => (
                <option key={d.id} value={d.id} className="bg-[var(--card)] text-[var(--text-primary)]">
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Line Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Quotation Line Items
            </h4>
            <Button
              type="button"
              onClick={handleAddItem}
              variant="outline"
              size="sm"
              className="h-8 text-xs font-bold text-[#0075de] border-[#0075de]/30 hover:bg-[#0075de]/10"
            >
              <Plus size={14} className="mr-1" /> Add Product
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-12 gap-3 items-end bg-[var(--surface-1)] p-4 rounded-xl border border-[var(--border-subtle)]"
              >
                {/* Product Select */}
                <div className="col-span-12 sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Product</label>
                  <select
                    value={item.product_id}
                    onChange={(e) => handleProductChange(idx, e.target.value)}
                    className="w-full h-9 bg-[var(--card)] border border-[var(--border-subtle)] rounded-md px-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#0075de] transition-colors cursor-pointer"
                  >
                    <option value="">Choose item...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id} className="bg-[var(--card)] text-[var(--text-primary)]">
                        {p.name} (₹{Number(p.price).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="col-span-4 sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Qty</label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleFieldChange(idx, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Unit Price */}
                <div className="col-span-4 sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Unit Price (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    value={item.unit_price}
                    onChange={(e) => handleFieldChange(idx, "unit_price", Math.max(0, parseFloat(e.target.value) || 0))}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                {/* Tax % */}
                <div className="col-span-3 sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)]">Tax (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.tax_percentage}
                    onChange={(e) => handleFieldChange(idx, "tax_percentage", Math.max(0, parseFloat(e.target.value) || 0))}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                {/* Action Delete */}
                <div className="col-span-1 flex justify-end pb-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Remove Line Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-subtle)] items-start">
          <div className="space-y-1.5 max-w-xs">
            <label className="text-xs font-bold text-[var(--text-primary)]">
              Special Discount (₹)
            </label>
            <Input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0"
              className="h-10 text-xs font-mono"
            />
          </div>

          <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-[var(--text-primary)]">₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
              <span>Tax (GST):</span>
              <span className="font-mono font-bold text-[var(--text-primary)]">+ ₹{taxTotal.toLocaleString()}</span>
            </div>

            {Number(discount) > 0 && (
              <div className="flex justify-between items-center text-xs text-red-500">
                <span>Discount Applied:</span>
                <span className="font-mono font-bold">- ₹{Number(discount).toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-[var(--border-subtle)] text-[var(--text-primary)]">
              <span>Total Price:</span>
              <span className="font-mono text-base text-[#0075de]">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            isLoading={submitting}
            className="w-full h-11 bg-[#0075de] hover:bg-[#005bab] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            <Check size={16} className="mr-2" /> Generate &amp; Send Quotation
          </Button>
        </div>

      </form>
    </Card>
  );
}
