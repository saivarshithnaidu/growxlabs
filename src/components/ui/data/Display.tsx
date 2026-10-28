import { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../Surface";

/* ── KPIs ─────────────────────────────────────────────────────────── */

export interface KPIItemProps {
  label: string;
  value: ReactNode;
  /** e.g. { value: "12%", direction: "up" }. `good` decides the color (defaults to up = good). */
  delta?: { value: string; direction: "up" | "down"; good?: boolean };
  hint?: ReactNode;
  loading?: boolean;
}

export function KPIItem({ label, value, delta, hint, loading }: KPIItemProps) {
  const good = delta ? delta.good ?? delta.direction === "up" : false;
  return (
    <div className="min-w-0 px-4 py-3">
      <p className="ds-t-label truncate text-[var(--text-muted)]">{label}</p>
      {loading ? (
        <Skeleton height={32} width="60%" className="mt-1" />
      ) : (
        <div className="mt-1 flex items-baseline gap-2">
          <span className="ds-t-kpi truncate text-[var(--text-primary)]">{value}</span>
          {delta && (
            <span className={cn("ds-t-meta-strong ds-num inline-flex items-center gap-0.5", good ? "text-[var(--success)]" : "text-[var(--danger)]")}>
              {delta.direction === "up" ? <ArrowUp size={12} strokeWidth={1.5} aria-hidden /> : <ArrowDown size={12} strokeWidth={1.5} aria-hidden />}
              <span className="sr-only">{delta.direction === "up" ? "up" : "down"}</span>
              {delta.value}
            </span>
          )}
        </div>
      )}
      {hint && <p className="ds-t-meta mt-0.5 truncate text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

/** One bordered strip, items separated by hairlines; wraps on narrow screens. */
export function KPIStrip({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] divide-x divide-[var(--border)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)]">
      {children}
    </div>
  );
}

/* ── Timeline ─────────────────────────────────────────────────────── */

export type TimelineTone = "neutral" | "accent" | "success" | "warning" | "danger";
const toneDot: Record<TimelineTone, string> = {
  neutral: "bg-[var(--text-disabled)]",
  accent: "bg-[var(--accent)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger: "bg-[var(--danger)]",
};

export interface TimelineItem {
  id: string;
  title: ReactNode;
  time: ReactNode;
  meta?: ReactNode;
  body?: ReactNode;
  icon?: ReactNode;
  tone?: TimelineTone;
}

export function Timeline({ items, label = "Activity" }: { items: TimelineItem[]; label?: string }) {
  return (
    <ol aria-label={label} className="relative">
      {items.map((it, i) => (
        <li key={it.id} className="relative flex gap-3 pb-4 last:pb-0">
          {i < items.length - 1 && <span aria-hidden className="absolute bottom-0 left-[11px] top-6 w-px bg-[var(--border)]" />}
          <span aria-hidden className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)]">
            {it.icon ?? <span className={cn("h-1.5 w-1.5 rounded-[var(--radius-full)]", toneDot[it.tone ?? "neutral"])} />}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="ds-t-body-strong min-w-0 truncate text-[var(--text-primary)]">{it.title}</p>
              <span className="ds-t-meta ds-num shrink-0 text-[var(--text-muted)]">{it.time}</span>
            </div>
            {it.meta && <p className="ds-t-meta text-[var(--text-muted)]">{it.meta}</p>}
            {it.body && <div className="ds-t-body mt-1 text-[var(--text-secondary)]">{it.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ── Key / value ──────────────────────────────────────────────────── */

export interface KeyValue { label: string; value: ReactNode }

export function KeyValueList({ items, columns = 1 }: { items: KeyValue[]; columns?: 1 | 2 }) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3", columns === 2 && "sm:grid-cols-2")}>
      {items.map((kv) => (
        <div key={kv.label} className="grid grid-cols-[120px_1fr] items-baseline gap-3">
          <dt className="ds-t-meta truncate text-[var(--text-muted)]">{kv.label}</dt>
          <dd className="ds-t-body min-w-0 break-words text-[var(--text-primary)]">{kv.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
