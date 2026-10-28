import { ReactNode } from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Surface";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Usually one primary Button. */
  action?: ReactNode;
  /** "inline" for inside a table body / card (48px padding); "page" for a full region. */
  size?: "inline" | "page";
}

export function EmptyState({ title, description, icon, action, size = "inline" }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", size === "inline" ? "py-12" : "py-24")}>
      <span aria-hidden className="flex text-[var(--text-disabled)]">{icon ?? <Inbox size={24} strokeWidth={1.5} />}</span>
      <p className="ds-t-body-bold mt-2 text-[var(--text-primary)]">{title}</p>
      {description && <p className="ds-t-meta mt-1 max-w-sm text-[var(--text-muted)]">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  size?: "inline" | "page";
}

export function ErrorState({ title = "Something went wrong", description = "We couldn't load this. Try again in a moment.", onRetry, retryLabel = "Try again", size = "inline" }: ErrorStateProps) {
  return (
    <div role="alert" className={cn("flex flex-col items-center text-center", size === "inline" ? "py-12" : "py-24")}>
      <span aria-hidden className="flex text-[var(--danger)]"><AlertCircle size={24} strokeWidth={1.5} /></span>
      <p className="ds-t-body-bold mt-2 text-[var(--text-primary)]">{title}</p>
      <p className="ds-t-meta mt-1 max-w-sm text-[var(--text-muted)]">{description}</p>
      {onRetry && <Button className="mt-3" onClick={onRetry}>{retryLabel}</Button>}
    </div>
  );
}

export interface LoadingStateProps {
  /** Announced to screen readers. */
  label?: string;
  /** "page" reserves header + content skeletons; "inline" is a short block. */
  size?: "inline" | "page";
}

export function LoadingState({ label = "Loading…", size = "page" }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">{label}</span>
      {size === "page" && (
        <div className="flex flex-col gap-2">
          <Skeleton width={160} height={12} />
          <Skeleton width={280} height={24} />
        </div>
      )}
      <Skeleton height={size === "page" ? 72 : 16} radius="md" />
      <Skeleton height={size === "page" ? 240 : 16} radius="md" />
    </div>
  );
}
