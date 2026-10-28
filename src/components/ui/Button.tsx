"use client";
import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = 28 | 32 | 36;

const sizeClass: Record<ButtonSize, string> = {
  28: "h-7 px-2 gap-1.5 rounded-[var(--radius-sm)]",
  32: "h-8 px-3 gap-2 rounded-[var(--radius-md)]",
  36: "h-9 px-4 gap-2 rounded-[var(--radius-md)]",
};
const iconOnlyClass: Record<ButtonSize, string> = {
  28: "w-7 px-0 rounded-[var(--radius-sm)]",
  32: "w-8 px-0",
  36: "w-9 px-0",
};
export const iconSize: Record<ButtonSize, number> = { 28: 14, 32: 16, 36: 16 };

// `data-force` lets the preview page pin a hover/focus state without a pointer.
const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-active)] data-[force=hover]:bg-[var(--accent-active)]",
  secondary:
    "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-hover)] data-[force=hover]:bg-[var(--bg-hover)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] data-[force=hover]:bg-[var(--bg-hover)] data-[force=hover]:text-[var(--text-primary)]",
  danger:
    "bg-[var(--danger)] text-[var(--text-inverse)] hover:bg-[var(--danger-active)] data-[force=hover]:bg-[var(--danger-active)]",
};

export function buttonClass({ variant = "secondary", size = 32, iconOnly = false }: { variant?: ButtonVariant; size?: ButtonSize; iconOnly?: boolean } = {}) {
  return cn(
    "ds-focus ds-t-body-strong inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none",
    "transition-colors duration-[var(--motion-fast)] data-[force=focus]:shadow-[var(--focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    sizeClass[size],
    iconOnly && iconOnlyClass[size],
    variantClass[variant],
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, disables the button and sets aria-busy. */
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Square button; pass an icon as children and an aria-label. Prefer IconButton. */
  iconOnly?: boolean;
  /** Render the child element (e.g. a Link) with button styling. */
  asChild?: boolean;
  "data-force"?: "hover" | "focus";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = 32, loading = false, iconLeft, iconRight, iconOnly = false, asChild = false, className, children, disabled, type = "button", ...props },
  ref,
) {
  const cls = cn(buttonClass({ variant, size, iconOnly }), className);
  if (asChild) {
    return <Slot ref={ref} className={cls} {...props}>{children}</Slot>;
  }
  return (
    <button ref={ref} type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? <Loader2 size={iconSize[size]} strokeWidth={1.5} className="animate-spin" aria-hidden /> : iconLeft}
      {iconOnly && loading ? null : children}
      {!loading && iconRight}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, "iconOnly" | "iconLeft" | "iconRight" | "children"> {
  /** Accessible name; required because the button has no visible text. */
  label: string;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = "ghost", ...props },
  ref,
) {
  return <Button ref={ref} variant={variant} iconOnly aria-label={label} title={label} {...props}>{icon}</Button>;
});
