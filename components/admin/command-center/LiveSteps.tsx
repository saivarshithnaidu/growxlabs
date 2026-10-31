"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { ToolActivity } from "./command-center.types";
import { toolLabel } from "./tool-labels";

/*
 * What the orchestrator is doing while a reply is in progress: thinking, each tool as it runs
 * (then done), then writing. Replaces the spinner; once the reply finishes, the thread folds
 * this into the quiet "Used N tools" line.
 */
export function LiveSteps({ toolCalls, hasText }: { toolCalls: ToolActivity[]; hasText: boolean }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const allDone = toolCalls.length > 0 && toolCalls.every((t) => t.status !== "calling");
  const current = !toolCalls.length && !hasText ? "Thinking" : allDone && !hasText ? "Writing the answer" : null;

  return (
    <ol className="flex flex-col gap-1.5" aria-live="polite" aria-label="Progress">
      {toolCalls.map((t) => {
        const running = t.status === "calling";
        return (
          <li key={t.id} className="flex items-center gap-2.5 text-[14px] leading-6">
            <span aria-hidden className="grid size-4 shrink-0 place-items-center">
              {running
                ? <span className="ds-breathe size-1.5 rounded-[var(--radius-full)] bg-[var(--accent)]" />
                : <Check size={14} strokeWidth={2} className="text-[var(--success)]" />}
            </span>
            {running
              ? <span className="ds-working">{toolLabel(t.name, "doing")}</span>
              : <span className="text-[var(--text-muted)]">{toolLabel(t.name, "done")}</span>}
          </li>
        );
      })}
      {current && (
        <li className="flex items-center gap-2.5 text-[14px] leading-6">
          <span aria-hidden className="grid size-4 shrink-0 place-items-center">
            <span className="ds-breathe size-1.5 rounded-[var(--radius-full)] bg-[var(--text-muted)]" />
          </span>
          <span className="ds-working">{current}</span>
          {seconds >= 3 && <span className="ds-t-meta ds-num text-[var(--text-disabled)]">{seconds}s</span>}
        </li>
      )}
    </ol>
  );
}
