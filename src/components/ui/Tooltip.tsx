"use client";
import { ReactNode } from "react";
import * as RT from "@radix-ui/react-tooltip";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** ms before showing; 300 by default. */
  delay?: number;
  /** Forces the tooltip open (preview / controlled use). */
  open?: boolean;
  /** Render the child without a tooltip. */
  disabled?: boolean;
}

/** The child must be focusable (button, link) so keyboard users get the tooltip too. */
export function Tooltip({ content, children, side = "top", align = "center", delay = 300, open, disabled }: TooltipProps) {
  if (disabled) return <>{children}</>;
  return (
    <RT.Provider delayDuration={delay} skipDelayDuration={100}>
      <RT.Root open={open}>
        <RT.Trigger asChild>{children}</RT.Trigger>
        <RT.Portal>
          <RT.Content
            side={side}
            align={align}
            sideOffset={8}
            collisionPadding={8}
            className="ds-portal ds-t-meta-strong z-[600] max-w-64 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1 text-[var(--text-primary)] shadow-[var(--shadow-flyout)]"
          >
            {content}
          </RT.Content>
        </RT.Portal>
      </RT.Root>
    </RT.Provider>
  );
}
