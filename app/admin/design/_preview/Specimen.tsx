import { ReactNode } from "react";
import { Card } from "@/src/components/ui";

// Layout-only helpers for the preview page.
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="ds-t-title-md mb-3 text-[var(--text-primary)]">{title}</h2>
      <Card className="flex flex-col gap-5">{children}</Card>
    </section>
  );
}

export function Row({ label, children, stack = false }: { label: string; children: ReactNode; stack?: boolean }) {
  return (
    <div className="grid gap-2 md:grid-cols-[140px_minmax(0,1fr)] md:gap-4">
      <p className="ds-t-label pt-1.5 text-[var(--text-muted)]">{label}</p>
      <div className={stack ? "flex min-w-0 flex-col gap-3" : "flex min-w-0 flex-wrap items-center gap-3"}>{children}</div>
    </div>
  );
}

export function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      {children}
      <span className="ds-t-meta text-[var(--text-muted)]">{label}</span>
    </div>
  );
}
