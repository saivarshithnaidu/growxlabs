"use client";
import { DragEvent, KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type KanbanTone = "neutral" | "accent" | "success" | "warning" | "danger";
const toneDot: Record<KanbanTone, string> = {
  neutral: "bg-[var(--text-disabled)]",
  accent: "bg-[var(--accent)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger: "bg-[var(--danger)]",
};

/** Horizontally scrolling board. Drag-and-drop is left to the caller. */
export function KanbanBoard({ children, label = "Board" }: { children: ReactNode; label?: string }) {
  return (
    <div role="list" aria-label={label} className="flex gap-3 overflow-x-auto pb-2">
      {children}
    </div>
  );
}

export interface KanbanColumnProps {
  title: string;
  count?: number;
  /** Secondary figure, e.g. total value. */
  meta?: ReactNode;
  tone?: KanbanTone;
  actions?: ReactNode;
  footer?: ReactNode;
  /** Shown when the column has no cards. */
  emptyText?: string;
  /** Drop target hooks; the caller owns drag state. */
  onDragOver?: (e: DragEvent<HTMLElement>) => void;
  onDrop?: (e: DragEvent<HTMLElement>) => void;
  /** Extra classes on the column, e.g. a width or a drop-target ring. */
  className?: string;
  children: ReactNode;
}

export function KanbanColumn({ title, count, meta, tone = "neutral", actions, footer, emptyText, onDragOver, onDrop, className, children }: KanbanColumnProps) {
  const empty = Array.isArray(children) ? children.length === 0 : !children;
  return (
    <section role="listitem" aria-label={title} onDragOver={onDragOver} onDrop={onDrop} className={cn("flex w-72 shrink-0 flex-col rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-canvas)]", className)}>
      <header className="flex h-10 items-center gap-2 px-3">
        <span aria-hidden className={cn("h-2 w-2 shrink-0 rounded-[var(--radius-full)]", toneDot[tone])} />
        <h3 className="ds-t-body-bold truncate text-[var(--text-primary)]">{title}</h3>
        {count != null && <span className="ds-t-meta ds-num text-[var(--text-muted)]">{count}</span>}
        {meta && <span className="ds-t-meta ds-num ml-auto text-[var(--text-muted)]">{meta}</span>}
        {actions && <span className={cn("flex items-center", !meta && "ml-auto")}>{actions}</span>}
      </header>
      <ul className="flex min-h-16 flex-col gap-2 px-2 pb-2">
        {empty && emptyText ? <li className="ds-t-meta flex min-h-16 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] px-3 text-center text-[var(--text-muted)]">{emptyText}</li> : children}
      </ul>
      {footer && <div className="border-t border-[var(--border)] p-2">{footer}</div>}
    </section>
  );
}

export interface KanbanCardProps {
  title: string;
  /** One line under the title (company, amount…). */
  meta?: ReactNode;
  /** Badges row. */
  badges?: ReactNode;
  /** Bottom-right slot, e.g. an Avatar. */
  assignee?: ReactNode;
  /** Bottom-left slot, e.g. a due date. */
  footnote?: ReactNode;
  onOpen?: () => void;
  selected?: boolean;
  /** Native drag source; the caller owns drag state. */
  draggable?: boolean;
  onDragStart?: (e: DragEvent<HTMLElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLElement>) => void;
  /** Dim the card while it is being dragged. */
  dragging?: boolean;
}

export function KanbanCard({ title, meta, badges, assignee, footnote, onOpen, selected, draggable, onDragStart, onDragEnd, dragging }: KanbanCardProps) {
  const onKey = (e: KeyboardEvent) => { if (onOpen && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onOpen(); } };
  return (
    <li
      tabIndex={onOpen ? 0 : undefined}
      role={onOpen ? "button" : undefined}
      aria-pressed={onOpen && selected != null ? selected : undefined}
      onClick={onOpen}
      onKeyDown={onKey}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      aria-grabbed={draggable ? !!dragging : undefined}
      className={cn(
        "ds-focus rounded-[var(--radius-md)] border bg-[var(--bg-surface)] p-3 transition-shadow",
        selected ? "border-[var(--accent)]" : "border-[var(--border)]",
        onOpen && "cursor-pointer hover:shadow-[var(--shadow-flyout)]",
        draggable && "cursor-grab select-none hover:shadow-[var(--shadow-flyout)] active:cursor-grabbing",
        dragging && "opacity-40",
      )}
    >
      <p className="ds-t-body-strong line-clamp-2 text-[var(--text-primary)]">{title}</p>
      {meta && <p className="ds-t-meta mt-0.5 truncate text-[var(--text-muted)]">{meta}</p>}
      {badges && <div className="mt-2 flex flex-wrap gap-1">{badges}</div>}
      {(assignee || footnote) && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="ds-t-meta ds-num truncate text-[var(--text-muted)]">{footnote}</span>
          {assignee}
        </div>
      )}
    </li>
  );
}
