import { cn } from "@/lib/utils";

/** Thin progress bar with its percentage; scales with transform so it never animates width. */
export function ProgressMeter({ value, className, barClassName = "w-20" }: { value: number; className?: string; barClassName?: string }) {
  const pct = Math.min(100, Math.max(0, Math.round(value || 0)));
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress"
        className={cn("h-1.5 overflow-hidden rounded-[var(--radius-full)] bg-[var(--surface-hover)]", barClassName)}
      >
        <span className="block h-full origin-left bg-[var(--accent)]" style={{ transform: `scaleX(${pct / 100})` }} />
      </span>
      <span className="ds-t-meta ds-num text-[var(--text-secondary)]">{pct}%</span>
    </span>
  );
}
