"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

export interface ApprovalRequest {
  status: "approval_required";
  token: string;
  summary: string;
  tool: string;
  details?: Array<{ label: string; value: string }>;
}

type CardState =
  | { phase: "pending" }
  | { phase: "running" }
  | { phase: "done"; outcome: string }
  | { phase: "cancelled" }
  | { phase: "error"; message: string };

export function isApprovalRequest(value: unknown): value is ApprovalRequest {
  return Boolean(value && typeof value === "object" && (value as { status?: unknown }).status === "approval_required" && typeof (value as { token?: unknown }).token === "string");
}

// The decision is remembered per token so a reload doesn't offer the same action again.
const storageKey = (token: string) => `gxl_cc_approval_${token.slice(-32)}`;

function describe(result: unknown): string {
  if (!result || typeof result !== "object") return "Done.";
  const parts = Object.entries(result as Record<string, unknown>)
    .filter(([, v]) => v !== undefined && v !== null && v !== "" && typeof v !== "object")
    .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1").toLowerCase()}: ${v}`);
  return parts.length ? parts.join(", ") : "Done.";
}

export function ApprovalCard({ request }: { request: ApprovalRequest }) {
  const [state, setState] = useState<CardState>({ phase: "pending" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(request.token));
      if (saved) setState(JSON.parse(saved));
    } catch {
      /* storage unavailable: the card simply starts pending */
    }
  }, [request.token]);

  const settle = (next: CardState) => {
    setState(next);
    try {
      localStorage.setItem(storageKey(request.token), JSON.stringify(next));
    } catch {
      /* not critical */
    }
  };

  async function approve() {
    setState({ phase: "running" });
    try {
      const response = await fetch("/api/admin/command-center/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: request.token }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.success) throw new Error(body.error || "The action could not be completed.");
      settle({ phase: "done", outcome: describe(body.result) });
    } catch (error) {
      setState({ phase: "error", message: error instanceof Error ? error.message : "The action could not be completed." });
    }
  }

  const button =
    "ds-focus ds-t-body-strong inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] px-3 focus-visible:shadow-[var(--focus-ring)] disabled:opacity-50";

  return (
    <section aria-label="Action waiting for approval" className="w-full rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] p-4">
      <p className="ds-t-body-strong text-[var(--text-primary)]">{request.summary}</p>

      {request.details && request.details.length > 0 && (
        <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1">
          {request.details.map((row) => (
            <div key={row.label} className="contents">
              <dt className="ds-t-meta text-[var(--text-muted)]">{row.label}</dt>
              <dd className="ds-t-meta ds-num truncate text-[var(--text-secondary)]">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-3 flex items-center gap-2" role="status">
        {state.phase === "pending" || state.phase === "error" ? (
          <>
            <button type="button" onClick={() => void approve()} className={`${button} bg-[var(--bg-inverse)] text-[var(--text-inverse)] active:opacity-80`}>
              <Check size={14} strokeWidth={2} />
              Approve
            </button>
            <button type="button" onClick={() => settle({ phase: "cancelled" })} className={`${button} text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] active:bg-[var(--bg-active)]`}>
              Cancel
            </button>
            {state.phase === "error" && <span className="ds-t-meta min-w-0 text-[var(--danger)]">{state.message}</span>}
          </>
        ) : state.phase === "running" ? (
          <span className="ds-t-meta inline-flex items-center gap-2">
            <span aria-hidden className="ds-breathe size-1.5 rounded-[var(--radius-full)] bg-[var(--accent)]" />
            <span className="ds-working">Approving</span>
          </span>
        ) : state.phase === "done" ? (
          <span className="ds-t-meta inline-flex min-w-0 items-start gap-1.5 text-[var(--text-secondary)]">
            <Check size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-[var(--success)]" />
            <span className="min-w-0">Done. {state.outcome}</span>
          </span>
        ) : (
          <span className="ds-t-meta inline-flex items-center gap-1.5 text-[var(--text-muted)]">
            <X size={14} strokeWidth={1.5} />
            Cancelled
          </span>
        )}
      </div>
    </section>
  );
}
