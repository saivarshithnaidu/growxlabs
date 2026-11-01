"use client";

import { Table } from "./StructuredResponseFormatter";
import type { ToolActivity } from "./command-center.types";
import { isApprovalRequest } from "./ApprovalCard";
import { isArtifactResult } from "./ArtifactPanel";

/*
 * Shows what a tool actually returned, so the figures on screen come from the database and not
 * from the model's wording. Lists become a table, top-level figures a stat row, grouped counts
 * (e.g. leads by status) their own stat row. Internal fields (ids, scope) are left out.
 */

const HIDDEN_KEYS = /^(id|uuid|.*_id|.*Id|contextScope|token|status_code)$/;
const MAX_ROWS = 50;
const MAX_COLUMNS = 8;

const TITLES: Record<string, string> = {
  get_company_stats: "Company stats",
  query_leads: "Leads",
  get_daily_brief: "Today",
  get_billing_overview: "Billing",
  list_consulting_invoices: "Invoices",
  list_consulting_payments: "Payments",
  get_blog_posts_stats: "Blog posts",
  get_admin_projects: "Projects",
  get_admin_agreements: "Agreements",
  get_admin_users: "Users",
};

const humanize = (key: string) => {
  const t = key.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").toLowerCase().trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function cell(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-IN");
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return value.slice(0, 10);
    return value;
  }
  if (Array.isArray(value)) return value.map(cell).filter(Boolean).join(", ");
  if (typeof value === "object") {
    const named = (value as Record<string, unknown>).name ?? (value as Record<string, unknown>).title;
    return typeof named === "string" ? named : "";
  }
  return String(value);
}

const isScalar = (v: unknown) => v === null || ["string", "number", "boolean"].includes(typeof v);
const isRecordList = (v: unknown): v is Record<string, unknown>[] =>
  Array.isArray(v) && v.length > 0 && v.every((r) => r && typeof r === "object" && !Array.isArray(r));
const isCountMap = (v: unknown): v is Record<string, number> =>
  !!v && typeof v === "object" && !Array.isArray(v) && Object.values(v).length > 0 && Object.values(v).every((n) => typeof n === "number");

function RecordTable({ rows }: { rows: Record<string, unknown>[] }) {
  const columns = [...new Set(rows.flatMap((r) => Object.keys(r)))]
    .filter((k) => !HIDDEN_KEYS.test(k))
    .filter((k) => rows.some((r) => cell(r[k]) !== ""))
    .slice(0, MAX_COLUMNS);
  const shown = rows.slice(0, MAX_ROWS);
  return (
    <div className="flex flex-col gap-1.5">
      <Table header={columns.map(humanize)} rows={shown.map((r) => columns.map((c) => cell(r[c])))} />
      {rows.length > MAX_ROWS && <p className="ds-t-meta text-[var(--text-muted)]">Showing {MAX_ROWS} of {rows.length}.</p>}
    </div>
  );
}

function Stats({ entries }: { entries: Array<[string, unknown]> }) {
  return (
    <dl className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-6 gap-y-3">
      {entries.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="ds-t-meta truncate text-[var(--text-muted)]">{humanize(k)}</dt>
          <dd className="ds-num truncate text-[17px] font-semibold leading-7 text-[var(--text-primary)]">{cell(v) || "None"}</dd>
        </div>
      ))}
    </dl>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {title && <p className="ds-t-meta-strong text-[var(--text-secondary)]">{title}</p>}
      {children}
    </div>
  );
}

export function ToolResultView({ tool }: { tool: ToolActivity }) {
  const result = tool.result as unknown;
  if (tool.status !== "complete" || result === undefined || isApprovalRequest(result) || isArtifactResult(result)) return null;
  const title = TITLES[tool.name] || humanize(tool.name.replace(/^(get|list|query)_/, ""));

  if (result && typeof result === "object" && !Array.isArray(result) && typeof (result as { error?: unknown }).error === "string") {
    return <p className="ds-t-meta text-[var(--danger)]">Couldn&apos;t load {title.toLowerCase()}: {(result as { error: string }).error}</p>;
  }

  if (Array.isArray(result)) {
    if (!result.length) return <p className="ds-t-meta text-[var(--text-muted)]">{title}: nothing found.</p>;
    if (isRecordList(result)) return <Section title={`${title} (${result.length})`}><RecordTable rows={result} /></Section>;
    return null;
  }

  if (!result || typeof result !== "object") return null;
  const entries = Object.entries(result as Record<string, unknown>).filter(([k]) => !HIDDEN_KEYS.test(k));
  const scalars = entries.filter(([, v]) => isScalar(v));
  const counts = entries.filter(([, v]) => isCountMap(v));
  const lists = entries.filter(([, v]) => Array.isArray(v));

  if (!scalars.length && !counts.length && !lists.length) return null;

  return (
    <section aria-label={title} className="flex w-full flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
      <p className="ds-t-body-strong text-[var(--text-primary)]">{title}</p>
      {scalars.length > 0 && <Stats entries={scalars} />}
      {counts.map(([k, v]) => (
        <Section key={k} title={humanize(k)}>
          <Stats entries={Object.entries(v as Record<string, number>).map(([label, n]) => [label, n])} />
        </Section>
      ))}
      {lists.map(([k, v]) =>
        isRecordList(v)
          ? <Section key={k} title={`${humanize(k)} (${(v as unknown[]).length})`}><RecordTable rows={v} /></Section>
          : (v as unknown[]).length === 0
            ? <p key={k} className="ds-t-meta text-[var(--text-muted)]">{humanize(k)}: none.</p>
            : null
      )}
    </section>
  );
}
