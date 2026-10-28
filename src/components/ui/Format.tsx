import { cn } from "@/lib/utils";

/* ── Relative time ────────────────────────────────────────────────── */

export function formatRelative(value: string | number | Date | null | undefined, now = Date.now()): string {
  if (value == null || value === "") return "—";
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return "—";
  const min = Math.round((now - t) / 60_000);
  if (min < 1 && min > -1) return "Just now";
  if (min < 0) return new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/** "3d ago", with the full date/time on hover. */
export function RelativeTime({ value, className }: { value: string | number | Date | null | undefined; className?: string }) {
  if (value == null || value === "") return <span className={className}>—</span>;
  const d = new Date(value);
  const valid = !Number.isNaN(d.getTime());
  return (
    <time dateTime={valid ? d.toISOString() : undefined} title={valid ? d.toLocaleString() : undefined} className={cn("ds-num whitespace-nowrap", className)}>
      {formatRelative(value)}
    </time>
  );
}

/* ── Currency ─────────────────────────────────────────────────────── */

export function formatCurrency(value: number | string | null | undefined, { currency = "INR", compact = false, decimals }: { currency?: string; compact?: boolean; decimals?: number } = {}): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: decimals ?? (compact ? 1 : 0),
    minimumFractionDigits: decimals ?? 0,
  }).format(n);
}

export interface CurrencyAmountProps {
  value: number | string | null | undefined;
  currency?: string;
  /** ₹4.2L / $1.2M style. */
  compact?: boolean;
  decimals?: number;
  /** Color negative values with --danger. */
  signed?: boolean;
  className?: string;
}

/** Tabular-number money. Defaults to INR. */
export function CurrencyAmount({ value, currency = "INR", compact, decimals, signed, className }: CurrencyAmountProps) {
  const n = typeof value === "string" ? Number(value) : value;
  return (
    <span className={cn("ds-num whitespace-nowrap", signed && n != null && n < 0 && "text-[var(--danger)]", className)} title={compact ? formatCurrency(value, { currency }) : undefined}>
      {formatCurrency(value, { currency, compact, decimals })}
    </span>
  );
}

/* ── Due dates ────────────────────────────────────────────────────── */

export type DueTone = "danger" | "warning" | "neutral" | "muted";

/** Human label + tone for a follow-up date: "Overdue 2d", "Today", "Tomorrow", "In 4d", "12 Nov". */
export function dueInfo(value: string | number | Date | null | undefined, now = Date.now()): { label: string; tone: DueTone } {
  if (value == null || value === "") return { label: "No follow-up", tone: "muted" };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { label: "—", tone: "muted" };
  const startOf = (t: number) => { const x = new Date(t); x.setHours(0, 0, 0, 0); return x.getTime(); };
  const days = Math.round((startOf(d.getTime()) - startOf(now)) / 86_400_000);
  if (days < 0) return { label: `Overdue ${-days}d`, tone: "danger" };
  if (days === 0) return { label: "Today", tone: "warning" };
  if (days === 1) return { label: "Tomorrow", tone: "neutral" };
  if (days < 7) return { label: `In ${days}d`, tone: "neutral" };
  return { label: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }), tone: "neutral" };
}

const dueTone: Record<DueTone, string> = {
  danger: "bg-[var(--danger-tint)] text-[var(--danger)]",
  warning: "bg-[var(--warning-tint)] text-[var(--warning)]",
  neutral: "bg-[var(--bg-canvas)] text-[var(--text-secondary)]",
  muted: "text-[var(--text-disabled)]",
};

/** Follow-up chip for tables and panels. */
export function DueChip({ value, className }: { value: string | number | Date | null | undefined; className?: string }) {
  const { label, tone } = dueInfo(value);
  return (
    <span title={value ? new Date(value).toLocaleString() : undefined} className={cn("ds-t-meta-strong ds-num inline-flex h-6 items-center whitespace-nowrap rounded-[var(--radius-sm)]", tone === "muted" ? "" : "px-2", dueTone[tone], className)}>
      {label}
    </span>
  );
}
