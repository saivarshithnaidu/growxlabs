import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "info" | "neutral" | "success" | "warning" | "danger";

// Text stays --text-secondary for contrast; the variant colors the tint and the dot.
const surface: Record<BadgeVariant, string> = {
  info: "bg-[var(--info-tint)]",
  neutral: "bg-[var(--bg-canvas)] border border-[var(--border)]",
  success: "bg-[var(--success-tint)]",
  warning: "bg-[var(--warning-tint)]",
  danger: "bg-[var(--danger-tint)]",
};
const dot: Record<BadgeVariant, string> = {
  info: "bg-[var(--info)]",
  neutral: "bg-[var(--text-disabled)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger: "bg-[var(--danger)]",
};

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  /** Hide the leading status dot. */
  noDot?: boolean;
  className?: string;
}

export function Badge({ variant = "neutral", children, noDot = false, className }: BadgeProps) {
  return (
    <span className={cn("ds-t-meta-strong inline-flex h-5 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-full)] px-2 text-[var(--text-secondary)]", surface[variant], className)}>
      {!noDot && <span aria-hidden className={cn("h-1.5 w-1.5 shrink-0 rounded-[var(--radius-full)]", dot[variant])} />}
      {children}
    </span>
  );
}

export type StatusDomain = "lead" | "deal" | "invoice" | "import" | "proposal";

/** Display mapping only: which badge color a status string gets. */
export const STATUS_VARIANTS: Record<StatusDomain, Record<string, BadgeVariant>> = {
  lead: {
    new: "info", contacted: "neutral", nurturing: "neutral", qualified: "success", proposal: "info", outreach: "info", warm: "warning", cold: "neutral", client: "success",
    negotiation: "warning", won: "success", converted: "success", lost: "danger", disqualified: "danger", unresponsive: "warning",
  },
  deal: {
    open: "info", discovery: "neutral", proposal: "info", negotiation: "warning", on_hold: "warning",
    won: "success", closed_won: "success", lost: "danger", closed_lost: "danger",
  },
  invoice: {
    draft: "neutral", sent: "info", viewed: "info", partially_paid: "warning", paid: "success",
    overdue: "danger", void: "neutral", cancelled: "neutral", refunded: "neutral",
  },
  import: {
    received: "info", queued: "info", processing: "info", running: "info", needs_review: "warning", partial: "warning",
    ready: "success", imported: "success", completed: "success", failed: "danger", rejected: "danger", cancelled: "neutral",
  },
  proposal: {
    draft: "neutral", internal_review: "info", changes_required: "warning", approved_internal: "info", ready_for_client: "info",
    sent: "info", viewed: "info", negotiation: "warning", client_changes_requested: "warning", approved: "success", signed: "success",
    rejected: "danger", expired: "neutral", cancelled: "neutral", archived: "neutral",
  },
};

function humanize(s: string) {
  const t = s.replace(/[_-]+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export interface StatusBadgeProps {
  domain: StatusDomain;
  status: string | null | undefined;
  /** Override or extend the mapping for this badge. */
  map?: Record<string, BadgeVariant>;
  label?: string;
}

export function StatusBadge({ domain, status, map, label }: StatusBadgeProps) {
  const key = (status || "").toLowerCase().replace(/\s+/g, "_");
  const variant = map?.[key] || STATUS_VARIANTS[domain][key] || "neutral";
  return <Badge variant={variant}>{label || (status ? humanize(status) : "Unknown")}</Badge>;
}
