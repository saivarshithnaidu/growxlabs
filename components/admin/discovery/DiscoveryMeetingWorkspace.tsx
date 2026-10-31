"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, MessageSquare, MoreHorizontal } from "lucide-react";
import {
  Alert, Badge, Button, Card, CardHeader, Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, IconButton, KeyValueList, Skeleton, Textarea, toast, type BadgeVariant,
} from "@/src/components/ui";
import { ErrorState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

type AgendaItem = { order: number; title: string; draft?: boolean; covered?: boolean; notes?: string; [key: string]: unknown };

type Meeting = {
  id: string;
  meeting_number: string;
  title: string;
  status: string;
  meeting_type: string;
  assessment_id: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  timezone: string | null;
  platform: string | null;
  meeting_url: string | null;
  location: string | null;
  closed_at: string | null;
  agenda: AgendaItem[];
  client_assessments?: { assessment_number: string | null; assessment_answers?: Array<{ question_key: string; value: unknown }> } | null;
  companies?: { name: string } | null;
  discovery_meeting_notes?: Array<{ id: string; section_key: string; content: Record<string, unknown> }>;
  discovery_findings?: Array<{ id: string; finding_number: string; title: string; priority: string }>;
  discovery_requirements?: Array<{ id: string; requirement_number: string; title: string; status: string }>;
  discovery_decisions?: Array<{ id: string; decision_number: string; decision: string; status: string | null }>;
  discovery_action_items?: Array<{ id: string; action: string; status: string; owner_name?: string | null; due_date?: string | null }>;
  discovery_risks?: Array<{ id: string; risk: string; severity: string | null; status: string | null }>;
};

const STATUS: Record<string, { label: string; variant: BadgeVariant }> = {
  draft: { label: "Draft", variant: "neutral" },
  scheduled: { label: "Scheduled", variant: "info" },
  confirmed: { label: "Confirmed", variant: "info" },
  in_progress: { label: "In progress", variant: "info" },
  completed: { label: "Meeting completed", variant: "success" },
  information_required: { label: "Information required", variant: "warning" },
  follow_up_required: { label: "Follow-up required", variant: "warning" },
  closed: { label: "Discovery complete", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
};
const STATUS_ORDER = Object.keys(STATUS);

// The one obvious next move from each status; everything else lives in the menu.
const NEXT: Record<string, { status: string; label: string; confirm?: string }> = {
  draft: { status: "scheduled", label: "Mark scheduled" },
  scheduled: { status: "confirmed", label: "Mark confirmed" },
  confirmed: { status: "in_progress", label: "Start meeting" },
  in_progress: { status: "completed", label: "Mark completed" },
  completed: { status: "closed", label: "Close discovery", confirm: "Close discovery? Notes and the agenda become read-only until it is reopened." },
  information_required: { status: "closed", label: "Close discovery", confirm: "Close discovery? Notes and the agenda become read-only until it is reopened." },
  follow_up_required: { status: "closed", label: "Close discovery", confirm: "Close discovery? Notes and the agenda become read-only until it is reopened." },
  closed: { status: "in_progress", label: "Reopen" },
  cancelled: { status: "draft", label: "Reopen" },
};

const NOTE_SECTIONS = [
  { key: "discussion", label: "Discussion notes", placeholder: "What the client said, by topic" },
  { key: "risks", label: "Business risks", placeholder: "Technical, timeline or budget risks" },
  { key: "opportunities", label: "AI and automation opportunities", placeholder: "Where AI could take work off their plate" },
  { key: "next_action", label: "Recommended next action", placeholder: "What we should do next, and who owns it" },
] as const;
type NoteKey = (typeof NOTE_SECTIONS)[number]["key"];

const humanize = (value: string) => {
  const t = value.replaceAll("_", " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const formatWhen = (value: string | null, end?: string | null) => {
  if (!value) return null;
  const start = new Date(value);
  const date = start.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const time = (d: Date) => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return end ? `${date}, ${time(start)} to ${time(new Date(end))}` : `${date}, ${time(start)}`;
};
const noteText = (m: Meeting, key: string) => {
  const text = m.discovery_meeting_notes?.find((n) => n.section_key === key)?.content?.text;
  return typeof text === "string" ? text : "";
};

export function DiscoveryMeetingWorkspace({ meetingId }: { meetingId: string }) {
  const qc = useQueryClient();
  const breadcrumb = useAdminBreadcrumb();
  const queryKey = ["discovery-meeting", meetingId];
  const [drafts, setDrafts] = useState<Record<NoteKey, string> | null>(null);
  const [openTopic, setOpenTopic] = useState<number | null>(null);
  const [topicDraft, setTopicDraft] = useState("");

  const query = useQuery<{ meeting: Meeting }>({
    queryKey,
    queryFn: async () => {
      const r = await fetch(`/api/admin/discovery-meetings/${meetingId}`);
      const b = await r.json();
      if (!r.ok) throw new Error(b.error || "Unable to load meeting.");
      return b;
    }
  });

  const update = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const r = await fetch(`/api/admin/discovery-meetings/${meetingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error || "Unable to update meeting.");
      return b;
    },
    onError: (e: Error) => toast({ title: e.message, variant: "danger" }),
    onSettled: () => qc.invalidateQueries({ queryKey })
  });

  const saveNotes = useMutation({
    mutationFn: async (notes: { sectionKey: NoteKey; text: string }[]) => {
      const r = await fetch(`/api/admin/discovery-meetings/${meetingId}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error || "Unable to save notes.");
      return b;
    },
    onSuccess: () => { toast({ title: "Notes saved", variant: "success" }); qc.invalidateQueries({ queryKey }); },
    onError: (e: Error) => toast({ title: e.message, variant: "danger" })
  });

  const m = query.data?.meeting;

  // Seed the editable notes once from what the server has saved.
  useEffect(() => {
    if (m && drafts === null) {
      setDrafts(Object.fromEntries(NOTE_SECTIONS.map((s) => [s.key, noteText(m, s.key)])) as Record<NoteKey, string>);
    }
  }, [m, drafts]);

  if (query.isPending) {
    return (
      <div className="mx-auto max-w-[1280px]" aria-busy="true">
        <Skeleton width={180} height={12} />
        <Skeleton width={320} height={28} className="mt-3" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Skeleton height={420} radius="md" />
          <Skeleton height={260} radius="md" />
        </div>
      </div>
    );
  }

  if (query.error || !m) {
    return <ErrorState title="Couldn't load this meeting" description={query.error?.message} onRetry={() => query.refetch()} />;
  }

  const status = STATUS[m.status] || STATUS.draft;
  const readOnly = m.status === "closed" || m.status === "cancelled";
  const next = NEXT[m.status];
  const agenda = [...(m.agenda || [])].sort((a, b) => a.order - b.order);
  const covered = agenda.filter((a) => a.covered).length;
  const agendaIsDraft = agenda.some((a) => a.draft);
  const dirty = drafts ? NOTE_SECTIONS.filter((s) => drafts[s.key] !== noteText(m, s.key)) : [];

  const changeStatus = (to: string, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    update.mutate({ status: to });
  };

  const saveAgenda = (items: AgendaItem[]) => {
    qc.setQueryData<{ meeting: Meeting }>(queryKey, (old) => old && { meeting: { ...old.meeting, agenda: items } });
    update.mutate({ agenda: items });
  };
  const patchTopic = (order: number, patch: Partial<AgendaItem>) =>
    saveAgenda(agenda.map((a) => (a.order === order ? { ...a, ...patch } : a)));

  const toggleTopicNotes = (item: AgendaItem) => {
    if (openTopic === item.order) { setOpenTopic(null); return; }
    setOpenTopic(item.order);
    setTopicDraft(item.notes || "");
  };
  const commitTopicNotes = (item: AgendaItem) => {
    if (topicDraft !== (item.notes || "")) patchTopic(item.order, { notes: topicDraft });
  };

  const outcomes = [
    { title: "Findings", rows: (m.discovery_findings || []).map((f) => ({ id: f.id, ref: f.finding_number, text: f.title, meta: f.priority })) },
    { title: "Requirements", rows: (m.discovery_requirements || []).map((r) => ({ id: r.id, ref: r.requirement_number, text: r.title, meta: r.status })) },
    { title: "Decisions", rows: (m.discovery_decisions || []).map((d) => ({ id: d.id, ref: d.decision_number, text: d.decision, meta: d.status })) },
    { title: "Action items", rows: (m.discovery_action_items || []).map((a) => ({ id: a.id, ref: null, text: a.action, meta: [a.owner_name, a.status].filter(Boolean).join(", ") })) },
    { title: "Risks", rows: (m.discovery_risks || []).map((r) => ({ id: r.id, ref: null, text: r.risk, meta: r.severity || r.status })) },
  ].filter((g) => g.rows.length > 0);

  const scheduled = formatWhen(m.scheduled_start, m.scheduled_end);

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title={m.companies?.name || m.title}
        breadcrumb={breadcrumb}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton variant="secondary" label="More status options" icon={<MoreHorizontal size={16} strokeWidth={1.5} />} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" minWidth={208}>
                <DropdownMenuLabel>Move to</DropdownMenuLabel>
                {STATUS_ORDER.filter((s) => s !== m.status && s !== "cancelled").map((s) => (
                  <DropdownMenuItem key={s} onSelect={() => changeStatus(s, s === "closed" ? NEXT.completed.confirm : undefined)}>{STATUS[s].label}</DropdownMenuItem>
                ))}
                {m.status !== "cancelled" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem danger onSelect={() => changeStatus("cancelled", "Cancel this discovery meeting?")}>Cancel meeting</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {next && (
              <Button variant={readOnly ? "secondary" : "primary"} loading={update.isPending && !!update.variables && "status" in update.variables} onClick={() => changeStatus(next.status, next.confirm)}>
                {next.label}
              </Button>
            )}
          </>
        }
      >
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Badge variant={status.variant}>{status.label}</Badge>
          <span className="ds-t-meta ds-num text-[var(--text-muted)]">{m.meeting_number}</span>
          {m.companies?.name && m.title && <span className="ds-t-meta text-[var(--text-muted)]">{m.title}</span>}
        </div>
      </PageHeader>

      {readOnly && (
        <div className="mb-6">
          <Alert variant={m.status === "cancelled" ? "warning" : "success"} title={m.status === "cancelled" ? "This meeting was cancelled" : "Discovery is complete"}>
            The agenda and notes are read-only. Reopen the meeting to change them.
          </Alert>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* Agenda: the work of the meeting */}
          <Card as="section" padding="none">
            <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
              <div>
                <h2 className="ds-t-title-sm text-[var(--text-primary)]">Agenda</h2>
                <p className="ds-t-meta ds-num mt-0.5 text-[var(--text-muted)]">{covered} of {agenda.length} topics covered</p>
              </div>
              {agendaIsDraft && !readOnly && (
                <Button size={28} variant="secondary" onClick={() => saveAgenda(agenda.map((a) => ({ ...a, draft: false })))}>Mark agenda reviewed</Button>
              )}
            </div>
            {agendaIsDraft && !readOnly && (
              <p className="ds-t-meta mx-5 mt-3 text-[var(--warning)]">Drafted from the assessment. Review the topics before the meeting.</p>
            )}

            {agenda.length === 0 ? (
              <p className="ds-t-body px-5 py-8 text-[var(--text-muted)]">No agenda topics yet.</p>
            ) : (
              <ol className="mt-3 divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
                {agenda.map((item) => {
                  const open = openTopic === item.order;
                  return (
                    <li key={item.order} className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={!!item.covered}
                          disabled={readOnly}
                          onCheckedChange={(v) => patchTopic(item.order, { covered: v })}
                          aria-label={`${item.title} covered`}
                        />
                        <span className="ds-t-meta ds-num w-5 shrink-0 text-[var(--text-muted)]">{item.order}</span>
                        <span className={cn("ds-t-body min-w-0 flex-1", item.covered ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]")}>{item.title}</span>
                        {(item.notes || !readOnly) && (
                          <button
                            type="button"
                            onClick={() => toggleTopicNotes(item)}
                            aria-expanded={open}
                            className="ds-focus ds-t-meta inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-xs)] px-1.5 py-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:text-[var(--text-primary)]"
                          >
                            <MessageSquare size={14} strokeWidth={1.5} />
                            {item.notes ? "Notes" : "Add notes"}
                            <ChevronDown size={14} strokeWidth={1.5} className={cn("transition-transform motion-reduce:transition-none", open && "rotate-180")} />
                          </button>
                        )}
                      </div>
                      {open && (
                        <div className="mt-2 pl-[52px]">
                          {readOnly ? (
                            <p className="ds-t-body whitespace-pre-wrap text-[var(--text-secondary)]">{item.notes}</p>
                          ) : (
                            <Textarea
                              aria-label={`Notes for ${item.title}`}
                              rows={3}
                              autoFocus
                              value={topicDraft}
                              onChange={(e) => setTopicDraft(e.target.value)}
                              onBlur={() => commitTopicNotes(item)}
                              placeholder="What came up on this topic. Saves when you click away."
                            />
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>

          {/* Consultant notes: internal, never shown to the client */}
          <Card as="section">
            <CardHeader
              title="Consultant notes"
              description="Internal. Never shared with the client."
              actions={!readOnly && (
                <>
                  {dirty.length > 0 && <span className="ds-t-meta text-[var(--text-muted)]">Unsaved changes</span>}
                  <Button
                    size={28}
                    variant="primary"
                    disabled={!dirty.length}
                    loading={saveNotes.isPending}
                    onClick={() => drafts && saveNotes.mutate(dirty.map((s) => ({ sectionKey: s.key, text: drafts[s.key] })))}
                  >
                    Save notes
                  </Button>
                </>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              {NOTE_SECTIONS.map((s) => (
                <label key={s.key} className={cn("flex flex-col gap-1.5", s.key === "discussion" && "md:col-span-2")}>
                  <span className="ds-t-meta-strong text-[var(--text-secondary)]">{s.label}</span>
                  {readOnly ? (
                    <span className="ds-t-body whitespace-pre-wrap text-[var(--text-primary)]">{noteText(m, s.key) || <span className="text-[var(--text-disabled)]">Nothing recorded</span>}</span>
                  ) : (
                    <Textarea
                      rows={s.key === "discussion" ? 6 : 4}
                      value={drafts?.[s.key] ?? ""}
                      onChange={(e) => setDrafts((d) => d && { ...d, [s.key]: e.target.value })}
                      placeholder={s.placeholder}
                    />
                  )}
                </label>
              ))}
            </div>
          </Card>

          {/* Outcomes recorded against this meeting */}
          <Card as="section">
            <CardHeader title="Outcomes" />
            {outcomes.length === 0 ? (
              <p className="ds-t-body text-[var(--text-muted)]">No findings, requirements, decisions or action items recorded yet.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {outcomes.map((group) => (
                  <div key={group.title}>
                    <h3 className="ds-t-meta-strong text-[var(--text-secondary)]">{group.title} <span className="ds-num text-[var(--text-muted)]">({group.rows.length})</span></h3>
                    <ul className="mt-2 divide-y divide-[var(--border-subtle)]">
                      {group.rows.map((row) => (
                        <li key={row.id} className="flex items-baseline gap-3 py-2">
                          {row.ref && <span className="ds-t-meta ds-num shrink-0 text-[var(--text-muted)]">{row.ref}</span>}
                          <span className="ds-t-body min-w-0 flex-1 text-[var(--text-primary)]">{row.text}</span>
                          {row.meta && <span className="ds-t-meta shrink-0 text-[var(--text-muted)]">{humanize(String(row.meta))}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Meeting details */}
        <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <Card as="section">
            <CardHeader title="Details" />
            <KeyValueList items={[
              { label: "Company", value: m.companies?.name || <span className="text-[var(--text-disabled)]">Not linked</span> },
              {
                label: "Assessment",
                value: m.client_assessments?.assessment_number ? (
                  <Link href={`/admin/assessments/${m.assessment_id}`} className="ds-focus ds-num inline-flex items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)] hover:underline">
                    {m.client_assessments.assessment_number}<ArrowUpRight size={14} strokeWidth={1.5} />
                  </Link>
                ) : <span className="text-[var(--text-disabled)]">None</span>,
              },
              { label: "Type", value: humanize(m.meeting_type) },
              { label: "When", value: scheduled || <span className="text-[var(--text-disabled)]">Not scheduled</span> },
              ...(m.timezone ? [{ label: "Time zone", value: m.timezone }] : []),
              { label: "Platform", value: m.platform ? humanize(m.platform) : <span className="text-[var(--text-disabled)]">Not set</span> },
              ...(m.meeting_url ? [{
                label: "Join link",
                value: <a href={m.meeting_url} target="_blank" rel="noopener noreferrer" className="ds-focus inline-flex items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)] hover:underline">Open<ArrowUpRight size={14} strokeWidth={1.5} /></a>,
              }] : []),
              ...(m.location ? [{ label: "Location", value: m.location }] : []),
              ...(m.closed_at ? [{ label: "Closed", value: formatWhen(m.closed_at) }] : []),
            ]} />
          </Card>
        </aside>
      </div>
    </div>
  );
}
