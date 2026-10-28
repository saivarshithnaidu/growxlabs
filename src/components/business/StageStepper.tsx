"use client";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StageStepperProps<K extends string> {
  stages: { key: K; label: string }[];
  current: K | string | null | undefined;
  onSelect?: (key: K) => void;
  disabled?: boolean;
  label?: string;
}

/** Pipeline stages as a segmented row. Earlier stages show a check; the current one is accented. */
export function StageStepper<K extends string>({ stages, current, onSelect, disabled, label = "Pipeline stage" }: StageStepperProps<K>) {
  const currentIndex = stages.findIndex((s) => s.key === current);
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-1 sm:grid-flow-col sm:auto-cols-fr sm:grid-cols-none">
      {stages.map((stage, idx) => {
        const active = stage.key === current;
        const done = currentIndex > -1 && idx < currentIndex;
        return (
          <button
            key={stage.key}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onSelect?.(stage.key)}
            className={cn(
              "ds-focus ds-t-body-strong flex h-8 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 transition-colors disabled:opacity-50",
              active ? "bg-[var(--accent)] text-[var(--on-accent)]" : done ? "bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
            )}
          >
            {done && <CheckCircle2 size={14} strokeWidth={1.5} className="shrink-0 text-[var(--success)]" />}
            <span className="truncate">{stage.label}</span>
          </button>
        );
      })}
    </div>
  );
}
