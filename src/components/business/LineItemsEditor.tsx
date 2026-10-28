"use client";
import { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, IconButton, Input, Select, CurrencyAmount, type SelectOption } from "../ui";

export interface LineItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  tax_percentage: number;
  description?: string;
}

export type LineItemField = "quantity" | "unit_price" | "tax_percentage";

export interface LineItemsEditorProps {
  items: LineItem[];
  productOptions: SelectOption[];
  /** Picking a product; the caller fills price/description. */
  onProductChange: (index: number, productId: string) => void;
  /** Raw input value; the caller parses and clamps. */
  onFieldChange: (index: number, field: LineItemField, raw: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  /** Keep at least this many rows (remove is disabled at the floor). */
  minItems?: number;
  currency?: string;
  label?: string;
}

/** Editable invoice/quote lines: product, qty, unit price, tax %, line amount. */
export function LineItemsEditor({ items, productOptions, onProductChange, onFieldChange, onAdd, onRemove, minItems = 1, currency = "INR", label = "Line items" }: LineItemsEditorProps) {
  return (
    <div className="flex flex-col gap-2" role="group" aria-label={label}>
      <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)]">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              {["Product", "Qty", "Unit price", "Tax %", "Amount", ""].map((h, i) => (
                <th key={i} scope="col" className={`ds-t-label h-9 border-b border-[var(--border)] bg-[var(--bg-canvas)] px-3 first:pl-4 last:pr-4 text-[var(--text-muted)] ${i >= 1 && i <= 4 ? "text-right" : ""}`}>
                  {h || <span className="sr-only">Actions</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-[var(--border)] last:border-b-0">
                <td className="py-2 pl-4 pr-3">
                  <Select aria-label={`Product, line ${i + 1}`} options={productOptions} value={item.product_id || undefined} onValueChange={(v) => onProductChange(i, v)} placeholder="Choose item…" />
                </td>
                <td className="w-20 px-3 py-2"><Input aria-label={`Quantity, line ${i + 1}`} type="number" min={1} value={item.quantity} onChange={(e) => onFieldChange(i, "quantity", e.target.value)} className="[&_input]:text-right" /></td>
                <td className="w-32 px-3 py-2"><Input aria-label={`Unit price, line ${i + 1}`} type="number" min={0} value={item.unit_price} onChange={(e) => onFieldChange(i, "unit_price", e.target.value)} className="[&_input]:text-right" /></td>
                <td className="w-20 px-3 py-2"><Input aria-label={`Tax percent, line ${i + 1}`} type="number" min={0} max={100} value={item.tax_percentage} onChange={(e) => onFieldChange(i, "tax_percentage", e.target.value)} className="[&_input]:text-right" /></td>
                <td className="ds-t-body w-32 px-3 py-2 text-right text-[var(--text-primary)]"><CurrencyAmount value={Number(item.quantity || 0) * Number(item.unit_price || 0)} currency={currency} /></td>
                <td className="w-px py-2 pl-1 pr-4">
                  <IconButton label={`Remove line ${i + 1}`} icon={<Trash2 size={16} strokeWidth={1.5} />} disabled={items.length <= minItems} onClick={() => onRemove(i)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div><Button size={28} variant="ghost" iconLeft={<Plus size={14} strokeWidth={1.5} />} onClick={onAdd}>Add line</Button></div>
    </div>
  );
}

export interface TotalsRow { label: ReactNode; value: number; sign?: "+" | "-" }

/** Right-aligned subtotal / tax / discount / total block. */
export function TotalsSummary({ rows, total, totalLabel = "Total", currency = "INR" }: { rows: TotalsRow[]; total: number; totalLabel?: ReactNode; currency?: string }) {
  return (
    <dl className="ml-auto flex w-full max-w-80 flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-canvas)] p-4">
      {rows.map((r, i) => (
        <div key={i} className="ds-t-body flex items-center justify-between text-[var(--text-secondary)]">
          <dt>{r.label}</dt>
          <dd className={r.sign === "-" ? "text-[var(--danger)]" : "text-[var(--text-primary)]"}>
            {r.sign ? `${r.sign} ` : ""}<CurrencyAmount value={r.value} currency={currency} />
          </dd>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-2">
        <dt className="ds-t-body-bold text-[var(--text-primary)]">{totalLabel}</dt>
        <dd className="ds-t-title-md text-[var(--text-primary)]"><CurrencyAmount value={total} currency={currency} /></dd>
      </div>
    </dl>
  );
}
