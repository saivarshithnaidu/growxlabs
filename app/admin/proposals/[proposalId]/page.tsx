"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Eye, Pencil, Plus } from "lucide-react";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { Alert, Button, Card, CardHeader, CurrencyAmount, Input, KeyValueList, StatusBadge, Textarea, Timeline } from "@/src/components/ui";
import { DetailPage, ErrorState, FormField, FormSection, LoadingState } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
const split = (v: any) =>
  Array.isArray(v)
    ? v.map((x) => (typeof x === "string" ? x : x?.content || x?.title || x?.name || "")).join("\n")
    : v?.content || v || "";
const list = (v: string) =>
  v
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
const previewCommercials = (form: any) => {
  const pricing = form.pricing.map((line: any) => {
    const quantity = Number(line.quantity || 0), unitPrice = Number(line.unitPrice || 0), discount = Number(line.discount || 0), gross = quantity * unitPrice;
    return { description: line.description, quantity, unit: line.unit, unit_price: unitPrice, discount, subtotal: Math.max(0, gross - discount) };
  });
  const subtotal = pricing.reduce((sum: number, line: any) => sum + line.quantity * line.unit_price, 0), discount = pricing.reduce((sum: number, line: any) => sum + line.discount, 0), taxable = Math.max(0, subtotal - discount), taxAmount = taxable * Number(form.taxRate || 0) / 100;
  return { pricing, totals: { currency: form.currency, subtotal, discount, taxable_subtotal: taxable, tax_type: form.taxType, tax_rate: Number(form.taxRate || 0), tax_amount: taxAmount, grand_total: taxable + taxAmount } };
};
const normalizeLegacyDraft = (draft: any) => ({
  ...draft,
  pricing: (draft.pricing || []).map((line: any) => {
    const gross = Number(line.quantity || 0) * Number(line.unitPrice || 0);
    return { ...line, discount: gross > 0 && Number(line.discount) === gross ? 0 : Number(line.discount || 0) };
  }),
  paymentMilestones: (draft.paymentMilestones || []).map((item: any, index: number) => {
    const namedPercentage = Number(String(item.name || "").replace("%", ""));
    if (Number(item.percentage) > 100 && namedPercentage > 0 && namedPercentage <= 100) return { ...item, name: ["Initial Payment", "Implementation Milestone", "Final Payment"][index] || `Payment ${index + 1}`, percentage: namedPercentage };
    return item;
  }),
});
export default function AdminProposalWorkspace() {
  const breadcrumb = useAdminBreadcrumb();
  const { proposalId } = useParams<{ proposalId: string }>(), router = useRouter(),
    q = useQuery({
      queryKey: ["admin", "proposal", proposalId],
      queryFn: async () => {
        const r = await fetch(`/api/admin/proposals/${proposalId}`, {
            cache: "no-store",
          }),
          b = await r.json();
        if (!r.ok) throw new Error(b.error);
        return b;
      },
    }),
    [form, setForm] = useState<any>(null),
    [preview, setPreview] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    draftKey = `growxlabs:proposal-draft:${proposalId}`;
  useEffect(() => {
    const p = q.data?.proposal;
    if (p && !form) {
      const serverForm = {
        executiveSummary: split(p.client_content?.executiveSummary),
        scope: split(p.client_content?.scope),
        deliverables: split(p.client_content?.deliverables),
        timeline: split(p.client_content?.timeline),
        assumptions: split(p.client_content?.assumptions),
        exclusions: split(p.client_content?.exclusions),
        terms: split(p.client_content?.terms),
        nextSteps: split(p.client_content?.nextSteps),
        pricing: (p.pricing || []).map((x: any) => ({
          description: x.description,
          quantity: x.quantity,
          unit: x.unit,
          unitPrice: x.unit_price,
          discount: x.discount,
        })),
        paymentMilestones: p.payment_schedule || [],
        currency: p.commercial_totals?.currency || "INR",
        taxType: p.commercial_totals?.tax_type || "GST",
        taxRate: p.commercial_totals?.tax_rate || 0,
        validUntil: p.valid_until || "",
        internalNotes: p.internal_notes || "",
      };
      try { const recovered = localStorage.getItem(draftKey); setForm(normalizeLegacyDraft(recovered ? { ...serverForm, ...JSON.parse(recovered) } : serverForm)); }
      catch { setForm(normalizeLegacyDraft(serverForm)); }
    }
  }, [q.data, form, draftKey]);
  useEffect(() => { if (form) localStorage.setItem(draftKey, JSON.stringify(form)); }, [form, draftKey]);
  async function action(action: string, extra: any = {}) {
    setBusy(true);
    setMessage("");
    const proposal =
      action === "save"
        ? {
            clientContent: {
              executiveSummary: form.executiveSummary,
              scope: list(form.scope),
              deliverables: list(form.deliverables),
              timeline: list(form.timeline),
              milestones: list(form.timeline),
              assumptions: list(form.assumptions),
              exclusions: list(form.exclusions),
              terms: list(form.terms),
              nextSteps: list(form.nextSteps),
            },
            pricing: form.pricing,
            tax: { type: form.taxType, rate: Number(form.taxRate) },
            currency: form.currency,
            paymentMilestones: form.paymentMilestones,
            validUntil: form.validUntil,
            internalNotes: form.internalNotes,
          }
        : undefined;
    const r = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, proposal, ...extra }),
      }),
      b = await r.json();
    setBusy(false);
    if (!r.ok) return setMessage(b.error || "Action failed.");
    setMessage("Proposal updated.");
    localStorage.removeItem(draftKey);
    setForm(null);
    await q.refetch();
  }
  async function compileAgreement() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/agreements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ proposalId }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to compile Service Agreement.");
      router.push(`/admin/agreements/${body.agreement.id}`);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Unable to compile Service Agreement.");
    } finally { setBusy(false); }
  }
    if (q.isPending || !form) return <LoadingState label="Loading proposal workspace…" />;
  if (q.error) return <ErrorState size="page" description={q.error.message} onRetry={() => void q.refetch()} />;
  const liveCommercials = previewCommercials(form),
    p = q.data.proposal,
    refs = q.data.references || {},
    editable = ["draft", "changes_required"].includes(p.status),
    snapshot = {
      proposal: {
        id: p.id,
        number: p.proposal_number,
        version: p.version,
        issuedAt: p.sent_at || new Date().toISOString(),
      },
      preparedFor: { name: refs.client, company: refs.company },
      clientContent: {
        executiveSummary: form.executiveSummary,
        scope: list(form.scope),
        deliverables: list(form.deliverables),
        timeline: list(form.timeline),
        assumptions: list(form.assumptions),
        exclusions: list(form.exclusions),
        terms: list(form.terms),
        nextSteps: list(form.nextSteps),
      },
      pricing: liveCommercials.pricing,
      commercialTotals: liveCommercials.totals,
      paymentSchedule: form.paymentMilestones,
      validUntil: form.validUntil,
    };
  const setPricing = (i: number, patch: any) => { const a = [...form.pricing]; a[i] = { ...form.pricing[i], ...patch }; setForm({ ...form, pricing: a }); };
  const setMilestone = (i: number, patch: any) => { const a = [...form.paymentMilestones]; a[i] = { ...form.paymentMilestones[i], ...patch }; setForm({ ...form, paymentMilestones: a }); };
  return (
    <DetailPage
      header={{
        title: p.proposal_number,
        breadcrumb,
        info: `Commercial proposal · Version ${p.version}`,
        actions: (
          <>
            <StatusBadge domain="proposal" status={p.status} />
            <Button iconLeft={preview ? <Pencil size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />} onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview as client"}
            </Button>
            {p.status === "draft" && (
              <Button variant="primary" disabled={busy} onClick={() => action("submit_review")}>Submit for internal review</Button>
            )}
            {p.status === "internal_review" && (
              <>
                <Button disabled={busy} onClick={() => action("return", { comment: prompt("Required return reason") || "" })}>Return for changes</Button>
                <Button variant="primary" disabled={busy} onClick={() => action("approve")}>Approve</Button>
              </>
            )}
            {p.status === "ready_for_client" && (
              <Button variant="primary" disabled={busy} onClick={() => confirm(`Send ${p.proposal_number} to the linked client?`) && action("send")}>Send proposal</Button>
            )}
            {p.status === "request_changes" && (
              <Button variant="primary" disabled={busy} onClick={() => action("create_revision")}>Create revision</Button>
            )}
          </>
        ),
      }}
      side={
        <>
          {p.status === "accepted" && (
            <Card>
              <CardHeader title="Service Agreement stage ready" description={`Compile a draft from the accepted Version ${p.version} snapshot and linked Scope of Work. It stays in the Admin Suite for internal review.`} />
              <Button variant="primary" loading={busy} onClick={() => void compileAgreement()}>Generate Service Agreement draft</Button>
            </Card>
          )}
          <Card>
            <CardHeader title="References" />
            <KeyValueList items={[
              { label: "Client", value: refs.client },
              { label: "Company", value: refs.company },
              { label: "Assessment", value: refs.assessment },
              { label: "Deal", value: refs.deal },
              { label: "Architecture", value: refs.architecture },
              { label: "Scope of work", value: refs.scope },
              { label: "Created", value: new Date(p.created_at).toLocaleString() },
              { label: "Last updated", value: new Date(p.updated_at).toLocaleString() },
            ]} />
          </Card>
          {q.data.changeRequests?.length > 0 && (
            <Card>
              <CardHeader title="Client feedback" />
              <Timeline label="Client feedback" items={q.data.changeRequests.map((x: any) => ({ id: x.id, title: `${x.category} · Version reference`, body: x.feedback, meta: x.requested_by_name, time: new Date(x.requested_at).toLocaleString(), tone: "warning" as const }))} />
            </Card>
          )}
          <Card>
            <CardHeader title="Activity" />
            <Timeline label="Proposal activity" items={q.data.activity.map((x: any) => ({ id: x.id, title: x.event_type.replaceAll("_", " "), meta: `${x.actor_type} · Version ${x.proposal_version_id ? "recorded" : "working"}`, time: new Date(x.created_at).toLocaleString() }))} />
          </Card>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {message && <Alert variant={message === "Proposal updated." ? "success" : "danger"}>{message}</Alert>}
        {editable && !preview && <Alert variant="info">Changes are automatically preserved in this browser. Use Save draft to validate and save them permanently.</Alert>}
        {preview ? (
          <ProposalDocument snapshot={snapshot} status={p.status} />
        ) : (
          <>
            <FormSection title="Client content">
              {[
                ["01 Executive Summary", "executiveSummary"],
                ["02 Scope", "scope"],
                ["03 Deliverables", "deliverables"],
                ["04 Timeline & Milestones", "timeline"],
                ["05 Assumptions", "assumptions"],
                ["06 Exclusions", "exclusions"],
                ["10 Terms & Conditions", "terms"],
                ["12 Client Notes / Next Steps", "nextSteps"],
              ].map(([label, key]) => (
                <FormField key={key} label={label} hint={key === "executiveSummary" ? undefined : "One item per line."}>
                  {(f) => <Textarea {...f} disabled={!editable} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={4} />}
                </FormField>
              ))}
            </FormSection>

            <FormSection title="07 Commercial pricing" description="Enter the agreed price. Discount is a currency amount, not the final total.">
              {form.pricing.map((x: any, i: number) => (
                <div key={i} className="grid gap-3 border-b border-[var(--border)] pb-4 last:border-b-0 md:grid-cols-6">
                  <div className="md:col-span-2"><FormField label="Description">{(f) => <Input {...f} disabled={!editable} value={x.description} onChange={(e) => setPricing(i, { description: e.target.value })} />}</FormField></div>
                  <FormField label="Quantity">{(f) => <Input {...f} type="number" disabled={!editable} value={x.quantity} onChange={(e) => setPricing(i, { quantity: Number(e.target.value) })} />}</FormField>
                  <FormField label="Unit">{(f) => <Input {...f} disabled={!editable} value={x.unit} onChange={(e) => setPricing(i, { unit: e.target.value })} />}</FormField>
                  <FormField label="Unit price">{(f) => <Input {...f} type="number" disabled={!editable} value={x.unitPrice} onChange={(e) => setPricing(i, { unitPrice: Number(e.target.value) })} />}</FormField>
                  <FormField label="Discount (₹)">{(f) => <Input {...f} type="number" disabled={!editable} value={x.discount} onChange={(e) => setPricing(i, { discount: Number(e.target.value) })} />}</FormField>
                  <p className="ds-t-meta text-[var(--text-muted)] md:col-span-6">
                    Subtotal <CurrencyAmount value={Number(x.quantity || 0) * Number(x.unitPrice || 0) - Number(x.discount || 0)} decimals={2} className="ds-t-body-strong text-[var(--text-primary)]" />
                  </p>
                </div>
              ))}
              {editable && (
                <div>
                  <Button size={28} variant="ghost" iconLeft={<Plus size={14} strokeWidth={1.5} />} onClick={() => setForm({ ...form, pricing: [...form.pricing, { description: "", quantity: 1, unit: "item", unitPrice: 0, discount: 0 }] })}>Add pricing item</Button>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-4">
                <FormField label="Currency">{(f) => <Input {...f} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />}</FormField>
                <FormField label="Tax type">{(f) => <Input {...f} value={form.taxType} onChange={(e) => setForm({ ...form, taxType: e.target.value })} />}</FormField>
                <FormField label="Tax rate %">{(f) => <Input {...f} type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })} />}</FormField>
                <FormField label="11 Valid until">{(f) => <Input {...f} type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />}</FormField>
              </div>
            </FormSection>

            <FormSection title="09 Payment schedule" description="Use percentages only; all payment percentages must total 100%. Payment amounts are calculated from the grand total.">
              {form.paymentMilestones.map((x: any, i: number) => (
                <div key={i} className="grid gap-3 md:grid-cols-3">
                  <FormField label="Milestone name">{(f) => <Input {...f} value={x.name} onChange={(e) => setMilestone(i, { name: e.target.value })} />}</FormField>
                  <FormField label="Percentage">{(f) => <Input {...f} type="number" value={x.percentage} onChange={(e) => setMilestone(i, { percentage: Number(e.target.value) })} />}</FormField>
                  <FormField label="Payment trigger">{(f) => <Input {...f} value={x.trigger} onChange={(e) => setMilestone(i, { trigger: e.target.value })} />}</FormField>
                </div>
              ))}
              {editable && (
                <div>
                  <Button size={28} variant="ghost" iconLeft={<Plus size={14} strokeWidth={1.5} />} onClick={() => setForm({ ...form, paymentMilestones: [...form.paymentMilestones, { name: "", percentage: 0, trigger: "" }] })}>Add payment milestone</Button>
                </div>
              )}
            </FormSection>

            <FormSection title="Internal notes" description="Never visible to the client.">
              <FormField label="Internal notes">
                {(f) => <Textarea {...f} disabled={!editable} value={form.internalNotes} onChange={(e) => setForm({ ...form, internalNotes: e.target.value })} rows={4} />}
              </FormField>
            </FormSection>

            {editable && (
              <div className="flex justify-end">
                <Button variant="primary" loading={busy} onClick={() => action("save")}>{busy ? "Saving draft…" : "Save draft"}</Button>
              </div>
            )}
          </>
        )}
      </div>
    </DetailPage>
  );
}
