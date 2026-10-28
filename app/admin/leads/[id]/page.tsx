"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, CheckCircle2, Edit3, Globe, Mail, MapPin, Phone, RefreshCw, Save, Send, Shield, Star, User } from "lucide-react";
import { Badge, Button, Card, CardHeader, CopyButton, Input, KeyValueList, Modal, Select, Tabs, TabsList, TabsTrigger, Textarea, Timeline } from "@/src/components/ui";
import { DetailPage, ErrorState, FormField, LoadingState } from "@/src/components/patterns";
import { LeadScore, StageStepper } from "@/src/components/business";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { Lead } from "@/types";
import { AdminLeadAssignment } from "@/components/admin/crm/AdminLeadAssignment";
import { AdminLeadSalesContext } from "@/components/admin/crm/AdminLeadSalesContext";

const PIPELINE_STAGES: { key: Lead["status"]; label: string }[] = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "engaged", label: "Engaged" },
  { key: "qualified", label: "Qualified" },
  { key: "disqualified", label: "Disqualified" },
];

export default function LeadDetailsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState<Partial<Lead>>({});
  const [error, setError] = useState<string | null>(null);
  const [activeOutreachTab, setActiveOutreachTab] = useState<"email" | "whatsapp" | "call">("email");

  // Dynamic Email Outreach States
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [senderName, setSenderName] = useState("GrowX Labs");
  const [senderEmail, setSenderEmail] = useState("hello@growxlabs.tech");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  const fetchLead = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/leads/${id}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to load lead record");
      }

      setLead(data);
      setNotes(data.notes || "");
      setEditValues({
        business_name: data.business_name || "",
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        website_url: data.website_url || "",
        city: data.city || "",
        status: data.status || "new",
      });
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to load lead record");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      void fetchLead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateLead = async (updates: Partial<Lead>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      if (!res.ok || updated.error) {
        throw new Error(updated.error || "Failed to update record");
      }
      setLead(updated);
      setEditValues({
        business_name: updated.business_name || "",
        name: updated.name || "",
        email: updated.email || "",
        phone: updated.phone || "",
        website_url: updated.website_url || "",
        city: updated.city || "",
        status: updated.status || "new",
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update record");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    await updateLead({ notes });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const handleGenerateOutreach = async () => {
    if (!lead?.id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/leads/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await fetchLead();
    } catch (e: unknown) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Failed to generate outreach");
    } finally {
      setSaving(false);
    }
  };

  const handleSendDynamicEmail = async () => {
    if (!lead?.email) return;
    setEmailSending(true);
    try {
      const res = await fetch("/api/send-email/dynamic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          toEmail: lead.email,
          fromName: senderName,
          fromEmail: senderEmail,
          subject: emailSubject,
          body: emailBody,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Email dispatch failed");
      }
      setShowEmailModal(false);
      await fetchLead();
    } catch (e: unknown) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Failed to dispatch email");
    } finally {
      setEmailSending(false);
    }
  };

    if (loading) {
    return <LoadingState label="Loading record…" />;
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center">
        <ErrorState size="page" title="Record unavailable" description={error || "The specified lead record was not found."} onRetry={fetchLead} retryLabel="Retry" />
        <Button variant="ghost" onClick={() => router.push("/admin/leads")}>Back to leads</Button>
      </div>
    );
  }

  const openCompose = () => {
    setSenderName("GrowX Labs");
    setSenderEmail("hello@growxlabs.tech");
    setEmailSubject(`Inquiry — ${lead.business_name || lead.name}`);
    setEmailBody(lead.outreach_content?.email || "");
    setShowEmailModal(true);
  };
  const outreachText = activeOutreachTab === "email" ? lead.outreach_content?.email || "" : activeOutreachTab === "whatsapp" ? lead.outreach_content?.whatsapp || "" : lead.outreach_content?.call || "";
  const field = (key: keyof Lead, label: string, span = false) => (
    <div className={span ? "sm:col-span-2" : undefined}>
      <FormField label={label}>
        {(f) => <Input {...f} value={String(editValues[key] || "")} onChange={(e) => setEditValues((prev) => ({ ...prev, [key]: e.target.value }))} />}
      </FormField>
    </div>
  );

  return (
    <DetailPage
      header={{
        title: lead.business_name || lead.name || "Lead",
        breadcrumb,
        info: `ID ${lead.id?.slice(0, 8)} · Source: ${lead.source || "System"}`,
        actions: (
          <>
            <Button iconLeft={<Edit3 size={16} strokeWidth={1.5} />} onClick={() => setEditOpen(true)}>Edit record</Button>
            {lead.phone && (
              <Button iconLeft={<Phone size={16} strokeWidth={1.5} />} onClick={() => window.open(`https://wa.me/${lead.phone?.replace(/\D/g, "")}`, "_blank")}>WhatsApp</Button>
            )}
            {lead.email && (
              <Button variant="primary" iconLeft={<Mail size={16} strokeWidth={1.5} />} onClick={openCompose}>Compose email</Button>
            )}
          </>
        ),
        children: (
          <div className="mt-3">
            <StageStepper stages={PIPELINE_STAGES} current={lead.status} disabled={saving} onSelect={(key) => updateLead({ status: key })} />
          </div>
        ),
      }}
      side={
        <>
          <AdminLeadAssignment leadId={id} />
          <AdminLeadSalesContext leadId={id} />
          <Card>
            <CardHeader title="Audit trail" />
            <Timeline label="Audit trail" items={[
              { id: "ingested", title: "Record ingested", time: lead.created_at ? new Date(lead.created_at).toLocaleString() : "Date unknown", icon: <Shield size={12} strokeWidth={1.5} /> },
              { id: "stage", title: "Current stage", meta: lead.status, time: "", icon: <CheckCircle2 size={12} strokeWidth={1.5} />, tone: "accent" },
              ...(lead.outreach_generated ? [{ id: "outreach", title: "Outreach strategy", meta: "Generated & ready", time: "", icon: <Send size={12} strokeWidth={1.5} />, tone: "success" as const }] : []),
            ]} />
          </Card>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader
            title="Account profile"
            actions={
              <>
                <Badge variant="neutral">{lead.status}</Badge>
                <LeadScore score={Number(lead.lead_score || 0)} />
              </>
            }
          />
          <KeyValueList columns={2} items={[
            { label: "Contact person", value: <span className="inline-flex items-center gap-1.5"><User size={14} strokeWidth={1.5} className="text-[var(--text-muted)]" />{lead.name || "—"}</span> },
            { label: "Work email", value: lead.email ? <span className="inline-flex items-center gap-1"><a href={`mailto:${lead.email}`} className="ds-focus truncate rounded-[var(--radius-xs)] text-[var(--accent)]">{lead.email}</a><CopyButton value={lead.email} label="Copy email" /></span> : "—" },
            { label: "Direct phone", value: lead.phone ? <span className="inline-flex items-center gap-1"><a href={`tel:${lead.phone}`} className="ds-focus rounded-[var(--radius-xs)] text-[var(--accent)]">{lead.phone}</a><CopyButton value={lead.phone} label="Copy phone" /></span> : "—" },
            {
              label: "Website",
              value: (
                <span className="inline-flex min-w-0 items-center gap-2">
                  {lead.website_url ? (
                    <a href={lead.website_url.startsWith("http") ? lead.website_url : `https://${lead.website_url}`} target="_blank" rel="noopener noreferrer" className="ds-focus inline-flex min-w-0 items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)]">
                      <Globe size={14} strokeWidth={1.5} className="shrink-0" /><span className="truncate">{lead.website_url.replace(/^https?:\/\//, "")}</span>
                    </a>
                  ) : "—"}
                  <Badge variant={lead.has_website ? "success" : "warning"}>{lead.has_website ? "Active" : "Missing"}</Badge>
                </span>
              ),
            },
            { label: "Territory / city", value: <span className="inline-flex items-center gap-1.5"><MapPin size={14} strokeWidth={1.5} className="text-[var(--text-muted)]" />{lead.city || "—"}</span> },
            { label: "Google reviews", value: <span className="inline-flex items-center gap-1.5"><Star size={14} strokeWidth={1.5} className="text-[var(--warning)]" />{lead.google_rating ? `${lead.google_rating} (${lead.reviews_count || 0} reviews)` : "—"}</span> },
          ]} />
        </Card>

        <Card>
          <CardHeader
            title="Account notes"
            actions={
              <>
                {notesSaved && <Badge variant="success"><Check size={12} strokeWidth={1.5} aria-hidden />Saved</Badge>}
                <Button size={28} variant="primary" iconLeft={<Save size={14} strokeWidth={1.5} />} onClick={handleSaveNotes} disabled={saving || notes === (lead.notes || "")}>Save</Button>
              </>
            }
          />
          <Textarea aria-label="Account notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Record client requirements, call outcomes, or account details…" rows={4} />
        </Card>

        <Card>
          <CardHeader
            title="Outbound communications"
            actions={
              lead.outreach_generated ? (
                <Tabs value={activeOutreachTab} onValueChange={(v) => setActiveOutreachTab(v as typeof activeOutreachTab)}>
                  <TabsList aria-label="Outreach channel" className="h-8 border-b-0">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                    <TabsTrigger value="call">Call</TabsTrigger>
                  </TabsList>
                </Tabs>
              ) : (
                <Button size={28} variant="primary" loading={saving} iconLeft={<RefreshCw size={14} strokeWidth={1.5} />} onClick={handleGenerateOutreach}>Generate copy</Button>
              )
            }
          />
          {lead.outreach_generated && lead.outreach_content ? (
            <div className="flex flex-col gap-3">
              <div className="relative rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-canvas)] p-4 pr-12">
                <div className="absolute right-2 top-2"><CopyButton value={outreachText} label="Copy content" /></div>
                <p className="ds-t-body whitespace-pre-wrap text-[var(--text-secondary)]">{outreachText}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {activeOutreachTab === "email" && lead.email && (
                  <>
                    <Button variant="primary" iconLeft={<Mail size={16} strokeWidth={1.5} />} onClick={openCompose}>Dispatch via server</Button>
                    <Button onClick={() => window.open(`mailto:${lead.email}?subject=${encodeURIComponent(`Inquiry — ${lead.business_name || lead.name}`)}&body=${encodeURIComponent(lead.outreach_content?.email || "")}`)}>Open mail client</Button>
                  </>
                )}
                {activeOutreachTab === "whatsapp" && lead.phone && (
                  <Button variant="primary" iconLeft={<Phone size={16} strokeWidth={1.5} />} onClick={() => window.open(`https://wa.me/${lead.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(lead.outreach_content?.whatsapp || "")}`, "_blank")}>Open WhatsApp Web</Button>
                )}
                <Button variant="ghost" className="ml-auto" loading={saving} iconLeft={<RefreshCw size={16} strokeWidth={1.5} />} onClick={handleGenerateOutreach}>Regenerate copy</Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-6">
              <Button variant="primary" loading={saving} iconLeft={<RefreshCw size={16} strokeWidth={1.5} />} onClick={handleGenerateOutreach}>Generate outreach copy</Button>
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit account record"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={async () => { await updateLead(editValues); setEditOpen(false); }}>Save changes</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {field("business_name", "Account / company name")}
          {field("name", "Contact person")}
          {field("email", "Work email")}
          {field("phone", "Direct phone")}
          {field("website_url", "Website URL")}
          {field("city", "Territory / city")}
          <div className="sm:col-span-2">
            <FormField label="Operational stage">
              {(f) => <Select {...f} value={String(editValues.status || "new")} onValueChange={(v) => setEditValues((prev) => ({ ...prev, status: v as Lead["status"] }))} options={PIPELINE_STAGES.map((s) => ({ value: s.key, label: s.label }))} />}
            </FormField>
          </div>
        </div>
      </Modal>

      <Modal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        title="Compose outreach email"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEmailModal(false)}>Cancel</Button>
            <Button variant="primary" loading={emailSending} onClick={handleSendDynamicEmail}>Dispatch email</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Sender name">{(f) => <Input {...f} value={senderName} onChange={(e) => setSenderName(e.target.value)} />}</FormField>
            <FormField label="Sender email">{(f) => <Input {...f} value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />}</FormField>
          </div>
          <FormField label="Recipient">{(f) => <Input {...f} value={lead?.email || ""} disabled />}</FormField>
          <FormField label="Subject line">{(f) => <Input {...f} value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />}</FormField>
          <FormField label="Message body">{(f) => <Textarea {...f} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={7} />}</FormField>
        </div>
      </Modal>
    </DetailPage>
  );
}
