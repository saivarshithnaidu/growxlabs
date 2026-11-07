"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, CreditCard, FileText, LifeBuoy, Rocket } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  label: string;
  title: string;
  message: string;
  targetUrl: string | null;
  actionLabel: string | null;
  createdAt: string;
  validUntil: string | null;
  readAt: string | null;
  status: "read" | "unread";
};
type Group = { key: string; items: Notification[] };

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0075de]";

/* Notifications about the same invoice (submitted, verified, receipt) collapse into one row. */
function groupKey(item: Notification) {
  return /GXL-INV-\d{4}-\d+/.exec(`${item.title} ${item.message}`)?.[0] || item.id;
}

function iconFor(type: string) {
  const t = type.toLowerCase();
  if (/(payment|receipt|invoice)/.test(t)) return CreditCard;
  if (/(proposal|contract|agreement)/.test(t)) return FileText;
  if (/(project|milestone|progress)/.test(t)) return Rocket;
  if (/(support|ticket|change)/.test(t)) return LifeBuoy;
  return Bell;
}

function dayLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Earlier";
  const days = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

const time = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
};

export default function ClientNotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const query = useQuery({
    queryKey: ["client", "notifications"],
    queryFn: async () => {
      const response = await fetch("/api/client/notifications", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to load notifications.");
      return body as { notifications: Notification[] };
    },
  });
  const markRead = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => fetch(`/api/client/notifications/${encodeURIComponent(id)}/read`, { method: "POST" })));
      return ids;
    },
    onSuccess: (ids) => {
      const now = new Date().toISOString();
      queryClient.setQueryData<{ notifications: Notification[] }>(["client", "notifications"], (current) => current ? {
        notifications: current.notifications.map((item) => ids.includes(item.id) ? { ...item, status: "read", readAt: now } : item),
      } : current);
    },
  });

  const notifications = query.data?.notifications ?? [];
  const unreadIds = notifications.filter((n) => n.status === "unread").map((n) => n.id);

  const days = useMemo(() => {
    const groups = new Map<string, Group>();
    for (const item of notifications) {
      const key = groupKey(item);
      const group = groups.get(key) ?? { key, items: [] };
      group.items.push(item);
      groups.set(key, group);
    }
    const visible = [...groups.values()]
      .map((g) => ({ ...g, items: [...g.items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) }))
      .filter((g) => filter === "all" || g.items.some((i) => i.status === "unread"))
      .sort((a, b) => b.items[0].createdAt.localeCompare(a.items[0].createdAt));
    const byDay = new Map<string, Group[]>();
    for (const g of visible) {
      const label = dayLabel(g.items[0].createdAt);
      byDay.set(label, [...(byDay.get(label) ?? []), g]);
    }
    return [...byDay.entries()];
  }, [notifications, filter]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Notifications</h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-[var(--border-subtle)] p-0.5" role="group" aria-label="Show">
            {(["all", "unread"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={`rounded px-3 py-1 text-sm ${filter === value ? "bg-[var(--surface-2)] font-medium text-[var(--text-primary)]" : "text-[var(--text-secondary)]"} ${focus}`}
              >
                {value === "all" ? "All" : `Unread${unreadIds.length ? ` (${unreadIds.length})` : ""}`}
              </button>
            ))}
          </div>
          {unreadIds.length > 0 && (
            <button
              onClick={() => markRead.mutate(unreadIds)}
              disabled={markRead.isPending}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] disabled:opacity-50 ${focus}`}
            >
              <Check size={15} aria-hidden /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {query.isPending ? (
          <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-[var(--surface-2)] motion-reduce:animate-none" />)}</div>
        ) : query.error ? (
          <p role="alert" className="text-sm text-red-500">{query.error.message}</p>
        ) : days.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border-subtle)] p-10 text-center text-sm text-[var(--text-secondary)]">
            {filter === "unread" ? "You're all caught up." : "No notifications yet."}
          </div>
        ) : (
          days.map(([day, groups]) => (
            <section key={day} className="mb-6" aria-label={day}>
              <h2 className="mb-2 text-sm font-medium text-[var(--text-muted)]">{day}</h2>
              <ul className="divide-y divide-[var(--border-subtle)] overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--card)]">
                {groups.map((group) => {
                  const latest = group.items[0];
                  const unread = group.items.some((i) => i.status === "unread");
                  const Icon = iconFor(latest.type);
                  const actions = group.items.filter((i, idx, all) => i.targetUrl && all.findIndex((x) => x.targetUrl === i.targetUrl) === idx);
                  const earlier = group.items.slice(1).map((i) => i.label).filter(Boolean);
                  return (
                    <li key={group.key} className="flex gap-3 p-4">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)]">
                        <Icon size={15} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className={`text-sm ${unread ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}>
                            {unread && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#0075de] align-middle" aria-label="Unread" />}
                            {latest.title}
                          </p>
                          <time dateTime={latest.createdAt} className="shrink-0 text-xs text-[var(--text-muted)]">{time(latest.createdAt)}</time>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{latest.message}</p>
                        {earlier.length > 0 && <p className="mt-1 text-xs text-[var(--text-muted)]">Also: {earlier.join(", ").toLowerCase()}</p>}
                        {latest.validUntil && <p className="mt-1 text-xs text-[var(--text-muted)]">Valid until {new Date(latest.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>}
                        {actions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            {actions.map((a) => (
                              <Link
                                key={a.id}
                                href={a.targetUrl!}
                                onClick={() => { const ids = group.items.filter((i) => i.status === "unread").map((i) => i.id); if (ids.length) markRead.mutate(ids); }}
                                className={`rounded text-sm font-medium text-[#0075de] hover:underline ${focus}`}
                              >
                                {a.actionLabel || "Open"} →
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
