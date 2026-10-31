"use client";

import { 
  AlertCircle, 
  Bell, 
  Brain, 
  Check, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Download, 
  ExternalLink, 
  FileCode, 
  FileText, 
  Layers, 
  Loader2, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Trash2, 
  X,
  ChevronRight
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ActivityItem, FlyoutMode } from "./command-center.types";
import { record, safeString } from "./sse";
import { useDialogFocus } from "./useDialogFocus";

interface SafeItem {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  status: string;
  action?: string;
  secondaryAction?: string;
  tertiaryAction?: string;
}

const config: Record<Exclude<FlyoutMode, "activity">, { endpoint: string; key: string }> = {
  approvals: { endpoint: "/api/admin/command-center/governance/approvals/list?limit=50", key: "items" },
  artifacts: { endpoint: "/api/admin/command-center/artifacts", key: "artifacts" },
  memory: { endpoint: "/api/admin/command-center/memory", key: "memories" },
  notifications: { endpoint: "/api/admin/command-center/notifications", key: "notifications" },
};

export function ContextFlyout({
  open,
  mode,
  activity,
  onClose,
  onMode,
  onUnreadChange,
}: {
  open: boolean;
  mode: FlyoutMode;
  activity: ActivityItem[];
  onClose: () => void;
  onMode: (mode: FlyoutMode) => void;
  onUnreadChange: (count: number) => void;
}) {
  const [items, setItems] = useState<SafeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLElement>(null);

  const load = useCallback(async () => {
    if (mode === "activity") return;
    setLoading(true);
    setError("");
    try {
      const source = config[mode];
      const response = await fetch(source.endpoint, { cache: "no-store" });
      if (!response.ok) {
        setItems([]);
        return;
      }
      const payload = record(await response.json());
      const rawValues = Array.isArray(payload[source.key]) ? (payload[source.key] as unknown[]) : [];
      const mapped = rawValues
        .map((value: unknown) => mapItem(mode, value))
        .filter((value: SafeItem | null): value is SafeItem => value !== null);
      setItems(mapped);
      if (mode === "notifications") {
        onUnreadChange(mapped.filter((item: SafeItem) => item.status === "unread" || item.status === "critical").length);
      }
    } catch (_cause) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [mode, onUnreadChange]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  useDialogFocus(panelRef, open, onClose);
  if (!open) return null;

  async function act(item: SafeItem, action = item.action) {
    if (mode === "artifacts") {
      if (action === "Delete") {
        const deleted = await fetch(`/api/admin/command-center/artifacts?id=${encodeURIComponent(item.id)}`, {
          method: "DELETE",
        });
        if (!deleted.ok) {
          setError("This artifact cannot be deleted.");
          return;
        }
        await load();
        return;
      }
      const response = await fetch("/api/admin/command-center/artifacts/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artifactId: item.id }),
      });
      const payload = record(await response.json());
      const url = safeString(payload.signedUrl);
      if (!response.ok || !url) {
        setError("A signed download link could not be created.");
        return;
      }
      window.location.assign(url);
    } else if (mode === "notifications") {
      if (action === "Clear all") {
        await fetch("/api/admin/command-center/notifications?all=true", { method: "DELETE" });
        await load();
        return;
      }
      await fetch(`/api/admin/command-center/notifications?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
      });
      await load();
    }
  }

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      className="relative z-30 flex h-full w-[360px] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--bg-surface)]"
      aria-label="Activity and alerts"
    >
      <div className="flex h-14 items-center gap-2 px-3">
        <nav className="flex min-w-0 flex-1 gap-1" aria-label="Panel views">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onMode(tab.id)}
              aria-current={mode === tab.id ? "page" : undefined}
              className={cn(
                "ds-focus ds-t-body-strong rounded-[var(--radius-sm)] px-2.5 py-1.5 focus-visible:shadow-[var(--focus-ring)]",
                mode === tab.id
                  ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] active:bg-[var(--bg-active)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          title="Close panel"
          className="ds-focus grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)]"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <span className="ds-working ds-t-body">Loading</span>
          </div>
        ) : mode === "activity" ? (
          activity.length > 0 ? (
            <ol className="flex flex-col">
              {activity.map((act) => (
                <li key={act.id} className="flex items-start gap-3 rounded-[var(--radius-sm)] px-2 py-2">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-[var(--radius-full)]",
                      act.state === "complete" ? "bg-[var(--success)]" : act.state === "failed" ? "bg-[var(--danger)]" : "bg-[var(--accent)]"
                    )}
                  />
                  <span className="ds-t-body min-w-0 flex-1 text-[var(--text-primary)]">{act.label}</span>
                  <time className="ds-t-meta ds-num shrink-0 text-[var(--text-disabled)]">{formatTimestamp(act.timestamp)}</time>
                </li>
              ))}
            </ol>
          ) : (
            <p className="ds-t-body px-2 py-16 text-center text-[var(--text-muted)]">Nothing has run yet.</p>
          )
        ) : (
          <>
            {items.length > 0 && (
              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <li key={item.id} className="rounded-[var(--radius-md)] px-2 py-2.5 hover:bg-[var(--bg-hover)]">
                    <div className="flex items-start justify-between gap-2">
                      <p className="ds-t-body-strong min-w-0 text-[var(--text-primary)]">{item.title}</p>
                      <span className="ds-t-meta shrink-0 text-[var(--text-muted)]">{sentence(item.status)}</span>
                    </div>
                    {item.subtitle && item.subtitle !== "Details unavailable" && (
                      <p className="ds-t-meta mt-0.5 line-clamp-2 text-[var(--text-muted)]">{item.subtitle}</p>
                    )}
                    {item.action && (
                      <button
                        type="button"
                        onClick={() => void act(item, item.action)}
                        className="ds-focus ds-t-meta-strong mt-1.5 inline-flex items-center gap-1 rounded-[var(--radius-xs)] text-[var(--accent)] hover:underline focus-visible:shadow-[var(--focus-ring)] active:opacity-80"
                      >
                        {item.action}
                        <ChevronRight size={12} strokeWidth={1.5} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {!items.length && !error && (
              <p className="ds-t-body px-2 py-16 text-center text-[var(--text-muted)]">{EMPTY[mode] || "Nothing here yet."}</p>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

const TABS: { id: FlyoutMode; label: string }[] = [
  { id: "activity", label: "Activity" },
  { id: "approvals", label: "Approvals" },
  { id: "artifacts", label: "Files" },
  { id: "notifications", label: "Alerts" },
];
const EMPTY: Partial<Record<FlyoutMode, string>> = {
  approvals: "Nothing waiting for approval.",
  artifacts: "No files created yet.",
  notifications: "No alerts.",
  memory: "Nothing remembered yet.",
};
const sentence = (value: string) => {
  const t = value.replaceAll("_", " ").toLowerCase().trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function mapItem(mode: FlyoutMode, raw: unknown): SafeItem | null {
  const item = record(raw);
  if (!item) return null;
  return {
    id: safeString(item.id, crypto.randomUUID()),
    title: safeString(item.title || item.name || item.key, "Item"),
    subtitle: safeString(item.subtitle || item.description || item.value || item.message, "Details unavailable"),
    meta: safeString(item.createdAt || item.updatedAt || item.timestamp, ""),
    status: safeString(item.status || item.category, "active"),
    action: mode === "approvals" ? "Review" : mode === "artifacts" ? "Download" : undefined,
  };
}

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
