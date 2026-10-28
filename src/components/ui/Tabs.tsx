"use client";
import { ReactNode } from "react";
import * as RT from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = RT.Root;

export function TabsList({ children, className, "aria-label": ariaLabel }: { children: ReactNode; className?: string; "aria-label"?: string }) {
  return (
    <RT.List aria-label={ariaLabel} className={cn("flex h-9 items-end gap-4 border-b border-[var(--border)]", className)}>
      {children}
    </RT.List>
  );
}

export function TabsTrigger({ value, children, count, disabled }: { value: string; children: ReactNode; count?: number; disabled?: boolean }) {
  return (
    <RT.Trigger
      value={value}
      disabled={disabled}
      className={cn(
        "ds-focus ds-t-body-strong -mb-px inline-flex h-9 items-center gap-1.5 border-b-2 border-transparent text-[var(--text-muted)] transition-colors",
        "hover:text-[var(--text-primary)] data-[state=active]:border-[var(--accent)] data-[state=active]:text-[var(--text-primary)] disabled:opacity-50",
      )}
    >
      {children}
      {count != null && <span className="ds-t-meta ds-num rounded-[var(--radius-full)] bg-[var(--bg-canvas)] px-1.5 text-[var(--text-muted)]">{count}</span>}
    </RT.Trigger>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  return <RT.Content value={value} className={cn("ds-focus pt-4 outline-none", className)}>{children}</RT.Content>;
}
