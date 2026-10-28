"use client";
import { useState } from "react";
import { Alert, Button, CopyButton, CurrencyAmount, FilterSelect, RelativeTime } from "@/src/components/ui";
import { LoadingState } from "@/src/components/patterns";
import { ActivityTimeline, FileUpload, LeadScore, LineItemsEditor, StageStepper, TotalsSummary, type LineItem, type LineItemField } from "@/src/components/business";
import { Labeled, Row, Section } from "./Specimen";

const PRODUCTS = [
  { value: "p1", label: "AI Ops Assessment (₹1,20,000)", price: 120000 },
  { value: "p2", label: "Automation Sprint (₹2,50,000)", price: 250000 },
  { value: "p3", label: "Support Retainer (₹40,000)", price: 40000 },
];
const STAGES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "engaged", label: "Engaged" },
  { key: "qualified", label: "Qualified" },
  { key: "disqualified", label: "Disqualified" },
] as const;

export function FeedbackSection() {
  const [city, setCity] = useState<string | null>("Hyderabad");
  return (
    <Section id="feedback" title="Alert, CopyButton, FilterSelect, formatting, LoadingState">
      <Row label="Alert" stack>
        <Alert variant="info">Changes are preserved in this browser until you save.</Alert>
        <Alert variant="success" title="Proposal updated">Version 3 is ready for internal review.</Alert>
        <Alert variant="warning">Two milestones add up to 90%. Payment percentages must total 100%.</Alert>
        <Alert variant="danger" title="Import could not be loaded" action={<Button size={28} variant="ghost">Retry</Button>}>The batch was not found.</Alert>
      </Row>
      <Row label="CopyButton">
        <span className="ds-t-body inline-flex items-center gap-1 text-[var(--text-secondary)]">priya@northwind.in <CopyButton value="priya@northwind.in" label="Copy email" /></span>
      </Row>
      <Row label="FilterSelect">
        <FilterSelect label="Location" value={city} onChange={setCity} options={["Hyderabad", "Bengaluru", "Pune"].map((c) => ({ value: c, label: c }))} />
        <FilterSelect label="Status" value={null} onChange={() => {}} options={[{ value: "new", label: "New" }]} />
      </Row>
      <Row label="Format">
        <Labeled label="CurrencyAmount"><CurrencyAmount value={420000} /></Labeled>
        <Labeled label="compact"><CurrencyAmount value={4820000} compact /></Labeled>
        <Labeled label="signed negative"><CurrencyAmount value={-12500} signed /></Labeled>
        <Labeled label="RelativeTime"><RelativeTime value={new Date(Date.now() - 3 * 3600_000).toISOString()} /></Labeled>
        <Labeled label="empty"><RelativeTime value={null} /></Labeled>
      </Row>
      <Row label="LoadingState" stack>
        <div className="max-w-xl"><LoadingState /></div>
      </Row>
    </Section>
  );
}

export function BusinessSection() {
  const [items, setItems] = useState<LineItem[]>([{ product_id: "p1", quantity: 1, unit_price: 120000, tax_percentage: 18 }, { product_id: "", quantity: 1, unit_price: 0, tax_percentage: 18 }]);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<string>("engaged");
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const tax = items.reduce((s, i) => s + i.quantity * i.unit_price * (i.tax_percentage / 100), 0);
  const onField = (idx: number, field: LineItemField, raw: string) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: field === "quantity" ? Math.max(1, parseInt(raw) || 1) : Math.max(0, parseFloat(raw) || 0) } : it)));

  return (
    <Section id="business" title="Business components">
      <Row label="ActivityTimeline" stack>
        <div className="max-w-xl">
          <ActivityTimeline activities={[
            { id: "1", type: "CALL", title: "Discovery call with COO", description: "Agreed to share current ops metrics by Friday.", created_at: new Date(Date.now() - 2 * 3600_000).toISOString(), performed_by_name: "Priya Raman" },
            { id: "2", type: "EMAIL", title: "Proposal follow-up sent", created_at: new Date(Date.now() - 26 * 3600_000).toISOString(), performed_by_name: "Arjun Mehta" },
            { id: "3", type: "MEETING", title: "Scoping workshop booked", created_at: new Date(Date.now() - 5 * 86400_000).toISOString() },
          ]} />
        </div>
      </Row>
      <Row label="empty" stack>
        <div className="max-w-xl rounded-[var(--radius-md)] border border-[var(--border)]"><ActivityTimeline activities={[]} /></div>
      </Row>
      <Row label="LineItemsEditor" stack>
        <LineItemsEditor
          items={items}
          productOptions={PRODUCTS}
          onProductChange={(idx, id) => { const p = PRODUCTS.find((x) => x.value === id); if (p) setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, product_id: id, unit_price: p.price } : it))); }}
          onFieldChange={onField}
          onAdd={() => setItems((prev) => [...prev, { product_id: "", quantity: 1, unit_price: 0, tax_percentage: 18 }])}
          onRemove={(idx) => setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))}
        />
        <TotalsSummary total={subtotal + tax - 5000} rows={[{ label: "Subtotal", value: subtotal }, { label: "Tax (GST)", value: tax, sign: "+" }, { label: "Discount", value: 5000, sign: "-" }]} />
      </Row>
      <Row label="FileUpload">
        <div className="w-80"><Labeled label="live"><FileUpload file={file} onFileChange={setFile} accept=".csv" label="Select CSV file" hint="Maximum file size 5MB" /></Labeled></div>
        <div className="w-80"><Labeled label="disabled"><FileUpload file={null} onFileChange={() => {}} disabled /></Labeled></div>
      </Row>
      <Row label="LeadScore">
        <Labeled label="bars · heat"><LeadScore score={8.4} /></Labeled>
        <Labeled label="bars · 5.2"><LeadScore score={5.2} /></Labeled>
        <Labeled label="bars · 1.0"><LeadScore score={1} /></Labeled>
        <div className="w-64"><Labeled label="meter · quality"><LeadScore score={7.6} variant="meter" tone="quality" /></Labeled></div>
      </Row>
      <Row label="StageStepper" stack>
        <StageStepper stages={[...STAGES]} current={stage} onSelect={setStage} />
        <StageStepper stages={[...STAGES]} current="contacted" disabled />
      </Row>
    </Section>
  );
}
