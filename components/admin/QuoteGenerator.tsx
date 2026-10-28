"use client";

import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Button, Combobox, CurrencyAmount, Input } from "@/src/components/ui";
import { FormField, FormPage, FormSection, type PageHeaderProps } from "@/src/components/patterns";
import { LineItemsEditor, TotalsSummary, type LineItemField } from "@/src/components/business";

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
  /** Page header (breadcrumb, title); defaults to "Create quotation". */
  header?: Partial<PageHeaderProps>;
  onCancel?: () => void;
}

export function QuoteGenerator({ products, deals, companies, onGenerate, header, onCancel }: QuoteGeneratorProps) {
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

  // Same parsing/clamping as the original inputs.
  const handleRawFieldChange = (index: number, field: LineItemField, raw: string) => {
    if (field === "quantity") handleFieldChange(index, "quantity", Math.max(1, parseInt(raw) || 1));
    else handleFieldChange(index, field, Math.max(0, parseFloat(raw) || 0));
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
    <FormPage
      header={{ title: "Create quotation", info: "Fill in customer details, add products, set discounts and taxes.", ...header }}
      onSubmit={handleSubmit}
      footerNote={<>Total <CurrencyAmount value={grandTotal} className="ds-t-body-bold text-[var(--text-primary)]" /></>}
      footer={
        <>
          {onCancel && <Button variant="ghost" iconLeft={<ArrowLeft size={16} strokeWidth={1.5} />} onClick={onCancel}>Back to quotations</Button>}
          <Button type="submit" variant="primary" loading={submitting} iconLeft={<Check size={16} strokeWidth={1.5} />}>Generate &amp; send quotation</Button>
        </>
      }
    >
      <FormSection title="Customer" description="Who the quotation is for.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Target account" required>
            {(f) => <Combobox id={f.id} aria-label="Target account" invalid={f.invalid} value={companyId || null} onValueChange={(v) => setCompanyId(v || "")} placeholder="Select company…" options={companies.map(c => ({ value: c.id, label: c.name }))} />}
          </FormField>
          <FormField label="Related deal" hint="Optional.">
            {(f) => <Combobox id={f.id} aria-label="Related deal" value={dealId || null} onValueChange={(v) => setDealId(v || "")} placeholder="Select deal…" options={deals.map(d => ({ value: d.id, label: d.name }))} />}
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Line items" description="Products, quantities and GST per line.">
        <LineItemsEditor
          items={items}
          productOptions={products.map(p => ({ value: p.id, label: `${p.name} (₹${Number(p.price).toLocaleString()})` }))}
          onProductChange={handleProductChange}
          onFieldChange={handleRawFieldChange}
          onAdd={handleAddItem}
          onRemove={handleRemoveItem}
        />
      </FormSection>

      <FormSection title="Totals">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="w-full max-w-48">
            <FormField label="Special discount (₹)">
              {(f) => <Input {...f} type="number" min={0} value={discount} placeholder="0" onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))} />}
            </FormField>
          </div>
          <TotalsSummary
            total={grandTotal}
            totalLabel="Total price"
            rows={[
              { label: "Subtotal", value: subtotal },
              { label: "Tax (GST)", value: taxTotal, sign: "+" },
              ...(Number(discount) > 0 ? [{ label: "Discount", value: Number(discount), sign: "-" as const }] : []),
            ]}
          />
        </div>
      </FormSection>
    </FormPage>
  );
}
