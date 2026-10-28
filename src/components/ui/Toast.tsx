"use client";
import { ReactNode } from "react";
import { Toaster, toast as sonner } from "sonner";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "info" | "success" | "warning" | "danger";

const TOASTER_ID = "ds";
const icons: Record<ToastVariant, ReactNode> = {
  info: <Info size={16} strokeWidth={1.5} className="text-[var(--info)]" />,
  success: <CheckCircle2 size={16} strokeWidth={1.5} className="text-[var(--success)]" />,
  warning: <AlertTriangle size={16} strokeWidth={1.5} className="text-[var(--warning)]" />,
  danger: <AlertCircle size={16} strokeWidth={1.5} className="text-[var(--danger)]" />,
};

export interface ToastProps {
  title: ReactNode;
  meta?: ReactNode;
  variant?: ToastVariant;
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
}

/** Visual toast. Rendered by `toast()`, or standalone (e.g. on the preview page). */
export function Toast({ title, meta, variant = "info", action, onClose }: ToastProps) {
  return (
    <div role={variant === "danger" ? "alert" : "status"} className="ds-portal flex w-[360px] max-w-[calc(100vw-32px)] items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-3 shadow-[var(--shadow-flyout)]">
      <span className="mt-0.5 flex shrink-0" aria-hidden>{icons[variant]}</span>
      <div className="min-w-0 flex-1">
        <p className="ds-t-body-strong truncate text-[var(--text-primary)]">{title}</p>
        {meta && <p className="ds-t-meta truncate text-[var(--text-muted)]">{meta}</p>}
      </div>
      {action && (
        <button type="button" onClick={action.onClick} className="ds-focus ds-t-meta-strong shrink-0 rounded-[var(--radius-xs)] px-1 py-0.5 text-[var(--accent)] hover:text-[var(--accent-active)]">
          {action.label}
        </button>
      )}
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss notification" className={cn("ds-focus flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]")}>
          <X size={16} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

/** Mount once (the admin layout or a page). Bottom-right, 16px from the edges; sonner pauses on hover. */
export function ToastViewport() {
  return <Toaster id={TOASTER_ID} position="bottom-right" offset={16} gap={8} visibleToasts={4} toastOptions={{ unstyled: true }} />;
}

/** Show a toast. Auto-dismisses after 5s unless `duration` says otherwise. */
export function toast({ duration = 5000, ...props }: Omit<ToastProps, "onClose"> & { duration?: number }) {
  return sonner.custom((id) => <Toast {...props} onClose={() => sonner.dismiss(id)} />, { duration, toasterId: TOASTER_ID });
}
