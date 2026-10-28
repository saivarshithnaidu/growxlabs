import { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant = "info" | "success" | "warning" | "danger";

const surface: Record<AlertVariant, string> = {
  info: "bg-[var(--info-tint)]",
  success: "bg-[var(--success-tint)]",
  warning: "bg-[var(--warning-tint)]",
  danger: "bg-[var(--danger-tint)]",
};
const icon: Record<AlertVariant, ReactNode> = {
  info: <Info size={16} strokeWidth={1.5} className="text-[var(--info)]" />,
  success: <CheckCircle2 size={16} strokeWidth={1.5} className="text-[var(--success)]" />,
  warning: <AlertTriangle size={16} strokeWidth={1.5} className="text-[var(--warning)]" />,
  danger: <AlertCircle size={16} strokeWidth={1.5} className="text-[var(--danger)]" />,
};

export interface AlertProps {
  variant?: AlertVariant;
  title?: ReactNode;
  children?: ReactNode;
  /** Right-aligned action, e.g. a ghost Button. */
  action?: ReactNode;
  className?: string;
}

/** Inline, in-flow message (not a toast). Danger alerts are announced. */
export function Alert({ variant = "info", title, children, action, className }: AlertProps) {
  return (
    <div role={variant === "danger" ? "alert" : "status"} className={cn("flex items-start gap-2.5 rounded-[var(--radius-md)] px-3 py-2.5", surface[variant], className)}>
      <span aria-hidden className="mt-0.5 flex shrink-0">{icon[variant]}</span>
      <div className="min-w-0 flex-1">
        {title && <p className="ds-t-body-strong text-[var(--text-primary)]">{title}</p>}
        {children && <div className="ds-t-body text-[var(--text-secondary)]">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
