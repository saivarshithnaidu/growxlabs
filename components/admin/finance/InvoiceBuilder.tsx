"use client";

import React, { useState } from "react";
import { Plus, Trash2, Calculator, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface InvoiceItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

interface InvoiceBuilderProps {
  products: Product[];
  companies: any[];
  onGenerateInvoice: (data: any) => Promise<void>;
}

export function InvoiceBuilder({ products, companies, onGenerateInvoice }: InvoiceBuilderProps) {
  const [companyId, setCompanyId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [discount, setDiscount] = useState(0);
  const [taxSplit, setTaxSplit] = useState<"GST" | "IGST">("GST"); // default local splits
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { product_id: "", quantity: 1, unit_price: 0, tax_rate: 18 }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { product_id: "", quantity: 1, unit_price: 0, tax_rate: 18 }]);
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
      unit_price: Number(prod.price)
    } : item));
  };

  const handleFieldChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unit_price)), 0);
  const totalTax = items.reduce((acc, item) => {
    const itemTotal = Number(item.quantity) * Number(item.unit_price);
    return acc + (itemTotal * (item.tax_rate / 100));
  }, 0);

  const grandTotal = subtotal + totalTax - Number(discount);

  // Tax splits display details
  const cgstAmount = taxSplit === "GST" ? totalTax / 2 : 0;
  const sgstAmount = taxSplit === "GST" ? totalTax / 2 : 0;
  const igstAmount = taxSplit === "IGST" ? totalTax : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !dueDate) return alert("Select company and due date.");

    setSubmitting(true);
    try {
      await onGenerateInvoice({
        company_id: companyId,
        due_date: dueDate,
        discount_amount: discount,
        items
      });
      alert("Invoice drafted and journalized successfully!");
      setCompanyId("");
      setDueDate("");
      setDiscount(0);
      setItems([{ product_id: "", quantity: 1, unit_price: 0, tax_rate: 18 }]);
    } catch (err) {
      console.error(err);
      alert("Failed to compile invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5 flex items-center gap-2">
          <FileText size={16} className="text-[#0075de]" /> Create Sales Invoice
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase text-neutral-450">Billed Account</span>
            <select
              required
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full h-10 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-3 text-xs text-neutral-805 outline-none focus:bg-white focus:border-[#0075de]"
            >
              <option value="">Choose Company...</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase text-neutral-450">Due Date</span>
            <Input
              type="date"
              required
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="h-10 text-xs"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase text-neutral-450">GST Tax Category</span>
            <select
              value={taxSplit}
              onChange={e => setTaxSplit(e.target.value as any)}
              className="w-full h-10 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-3 text-xs text-neutral-805 outline-none"
            >
              <option value="GST">Local State CGST (9%) + SGST (9%)</option>
              <option value="IGST">Interstate IGST (18%)</option>
            </select>
          </div>
        </div>

        {/* Invoice items */}
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-[#e6e6e6] pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Invoice Items List</span>
            <Button
              type="button"
              onClick={handleAddItem}
              className="h-7 text-[8px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-[#0075de] hover:bg-neutral-50 px-3 rounded-md"
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-end bg-[#f6f5f4]/40 p-3.5 rounded border border-[#e6e6e6]/60">
                <div className="col-span-4 space-y-1">
                  <span className="text-[8px] font-bold uppercase text-neutral-400">Product/Service</span>
                  <select
                    required
                    value={item.product_id}
                    onChange={(e) => handleProductChange(idx, e.target.value)}
                    className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-805"
                  >
                    <option value="">Select item...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>)}
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-[8px] font-bold uppercase text-neutral-400">Quantity</span>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={item.quantity}
                    onChange={e => handleFieldChange(idx, "quantity", Number(e.target.value))}
                    className="h-9 text-xs text-center bg-white border-[#e6e6e6]"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-[8px] font-bold uppercase text-neutral-400">Unit Price</span>
                  <Input
                    type="number"
                    required
                    value={item.unit_price}
                    onChange={e => handleFieldChange(idx, "unit_price", Number(e.target.value))}
                    className="h-9 text-xs bg-white border-[#e6e6e6]"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-[8px] font-bold uppercase text-neutral-400">Tax (%)</span>
                  <Input
                    type="number"
                    required
                    value={item.tax_rate}
                    onChange={e => handleFieldChange(idx, "tax_rate", Number(e.target.value))}
                    className="h-9 text-xs text-center bg-white border-[#e6e6e6]"
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

        {/* Totals Summary */}
        <div className="border-t border-[#e6e6e6] pt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Invoice Discount (₹)</span>
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
            {taxSplit === "GST" ? (
              <>
                <div className="flex justify-between">
                  <span>CGST (9%):</span>
                  <span className="text-neutral-900 font-mono">+ ₹{cgstAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (9%):</span>
                  <span className="text-neutral-900 font-mono">+ ₹{sgstAmount.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span>IGST (18%):</span>
                <span className="text-neutral-900 font-mono">+ ₹{igstAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Discount Applied:</span>
              <span className="text-red-500 font-mono">- ₹{discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-[#e6e6e6] pt-2 text-sm font-black text-neutral-950">
              <span>Grand Total:</span>
              <span className="text-[#0075de] font-mono">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#0075de] text-white hover:bg-[#0075de]/90 font-bold uppercase tracking-widest text-[10px] h-11 rounded-md"
        >
          {submitting ? "Compiling invoice..." : "Create Sales Invoice"}
        </Button>
      </form>
    </Card>
  );
}
