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
