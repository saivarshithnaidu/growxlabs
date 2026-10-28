import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cn("ds-t-mono inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--bg-canvas)] text-[var(--text-muted)]", className)}>
      {children}
    </kbd>
  );
}
