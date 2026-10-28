import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  children: ReactNode;
  /** Inner padding; "none" for edge-to-edge content such as tables. */
  padding?: "none" | "sm" | "md";
  elevated?: boolean;
  className?: string;
  as?: "div" | "section" | "article";
}

export function Card({ children, padding = "md", elevated = false, className, as: Tag = "div" }: CardProps) {
  return (
    <Tag className={cn("rounded-[var(--radius-lg)]", elevated ? "bg-[var(--bg-surface)] shadow-[var(--shadow-flyout)]" : "bg-[var(--bg-canvas)]", padding === "md" && "p-5", padding === "sm" && "p-3", className)}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="ds-t-title-sm truncate text-[var(--text-primary)]">{title}</h3>
        {description && <p className="ds-t-meta mt-0.5 text-[var(--text-muted)]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Divider({ orientation = "horizontal", label, className }: { orientation?: "horizontal" | "vertical"; label?: string; className?: string }) {
  if (orientation === "vertical") return <span role="separator" aria-orientation="vertical" className={cn("inline-block w-px self-stretch bg-[var(--border)]", className)} />;
  if (label) {
    return (
      <div role="separator" className={cn("flex items-center gap-3", className)}>
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="ds-t-label text-[var(--text-muted)]">{label}</span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>
    );
  }
  return <hr className={cn("h-px border-0 bg-[var(--border)]", className)} />;
}

export function Skeleton({ width, height = 16, radius = "sm", className }: { width?: CSSProperties["width"]; height?: CSSProperties["height"]; radius?: "xs" | "sm" | "md" | "full"; className?: string }) {
  return <span aria-hidden className={cn("ds-skeleton block", className)} style={{ width: width ?? "100%", height, borderRadius: `var(--radius-${radius})` }} />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <span className="flex flex-col gap-2" aria-hidden>
      {Array.from({ length: lines }, (_, i) => <Skeleton key={i} height={12} width={i === lines - 1 ? "60%" : "100%"} />)}
    </span>
  );
}
