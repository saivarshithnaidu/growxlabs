"use client";

import { Link, usePathname } from "@/navigation-client";
import { cn } from "@/lib/utils";
import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

const navItems = [
  { name: "Overview", href: "/client/dashboard" },
  { name: "Proposals", href: "/client/proposals" },
  { name: "Contracts", href: "/client/agreement" },
  { name: "Onboarding", href: "/client/onboarding" },
  { name: "Billing", href: "/client/invoices" },
  { name: "Progress", href: "/client/project" },
  { name: "Changes", href: "/client/change-requests" },
];

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0075de]";

export function ClientNav() {
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ["client", "notifications"],
    queryFn: async () => {
      const response = await fetch("/api/client/notifications", { cache: "no-store" });
      return response.ok ? ((await response.json()) as { notifications: { status: string }[] }) : { notifications: [] };
    },
  });
  const unread = data?.notifications.filter((n) => n.status === "unread").length ?? 0;
  const onNotifications = pathname === "/client/notifications";

  return (
    <nav className="mb-8 flex items-center gap-3 rounded-md border border-[var(--border-subtle)] bg-[var(--card)] p-2 pl-4" aria-label="Client portal">
      <Link href="/client/dashboard" className={cn("flex shrink-0 items-center gap-2 rounded-md pr-3", focus)}>
        <ShieldCheck className="text-[#0075de]" size={16} aria-hidden />
        <span className="hidden text-sm font-semibold text-[var(--text-primary)] sm:block">Client portal</span>
      </Link>

      <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto border-l border-[var(--border-subtle)] pl-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors",
                active ? "bg-[#0075de]/10 font-medium text-[#0075de]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
                focus,
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Link
          href="/client/notifications"
          aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          aria-current={onNotifications ? "page" : undefined}
          className={cn("relative rounded-md p-2 transition-colors", onNotifications ? "bg-[#0075de]/10 text-[#0075de]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]", focus)}
        >
          <Bell size={16} aria-hidden />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0075de] px-1 text-[10px] font-semibold text-white" aria-hidden>
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn("rounded-md p-2 text-[var(--text-secondary)] transition-colors hover:bg-red-500/10 hover:text-red-500", focus)}
          aria-label="Sign out"
        >
          <LogOut size={16} aria-hidden />
        </button>
      </div>
    </nav>
  );
}
