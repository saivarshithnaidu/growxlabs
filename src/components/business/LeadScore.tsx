import { cn } from "@/lib/utils";

/** "heat": high = hot (danger). "quality": high = good (success). */
export type LeadScoreTone = "heat" | "quality";

function tone(score: number, high: number, mid: number, kind: LeadScoreTone) {
  if (score >= high) return kind === "heat" ? "bg-[var(--danger)]" : "bg-[var(--success)]";
  return score >= mid ? "bg-[var(--warning)]" : "bg-[var(--text-disabled)]";
}

export interface LeadScoreProps {
  score: number | null | undefined;
  /** "bars": compact 3-bar indicator for tables; "meter": full-width bar for detail panels. */
  variant?: "bars" | "meter";
  tone?: LeadScoreTone;
}

export function LeadScore({ score: raw, variant = "bars", tone: kind = "heat" }: LeadScoreProps) {
  const score = raw || 0;
  if (variant === "meter") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="ds-t-kpi text-[var(--text-primary)]">{score.toFixed(1)}</span>
          <span className="ds-t-meta text-[var(--text-muted)]">/ 10 calculated quality</span>
        </div>
        <div role="meter" aria-valuemin={0} aria-valuemax={10} aria-valuenow={score} aria-label="Lead score" className="h-1.5 w-full overflow-hidden rounded-[var(--radius-full)] bg-[var(--bg-active)]">
          <div className={cn("h-full rounded-[var(--radius-full)]", tone(score, 7, 4, kind))} style={{ width: `${Math.min(100, score * 10)}%` }} />
        </div>
      </div>
    );
  }
  const filled = score >= 8 ? 3 : score >= 5 ? 2 : score >= 2 ? 1 : 0;
  return (
    <span className="inline-flex items-center gap-1.5" title={`Score: ${score}/10`}>
      <span className="ds-num w-6 text-[var(--text-primary)]">{score.toFixed(1)}</span>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((bar) => (
          <span key={bar} className={cn("h-3 w-1 rounded-[var(--radius-full)]", bar <= filled ? tone(score, 8, 5, kind) : "bg-[var(--bg-active)]")} />
        ))}
      </span>
    </span>
  );
}
