"use client";
import { ReactNode } from "react";
import * as DM from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const DropdownMenu = DM.Root;
export const DropdownMenuTrigger = DM.Trigger;
export const DropdownMenuGroup = DM.Group;

export function DropdownMenuContent({ children, align = "end", side = "bottom", className, minWidth = 192 }: { children: ReactNode; align?: "start" | "center" | "end"; side?: "top" | "right" | "bottom" | "left"; className?: string; minWidth?: number }) {
  return (
    <DM.Portal>
      <DM.Content
        align={align}
        side={side}
        sideOffset={4}
        collisionPadding={8}
        style={{ minWidth }}
        className={cn("ds-portal z-[500] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-1 shadow-[var(--shadow-flyout)]", className)}
      >
        {children}
      </DM.Content>
    </DM.Portal>
  );
}

const itemClass = "ds-t-body flex h-8 cursor-default select-none items-center gap-2 rounded-[var(--radius-sm)] px-2 text-[var(--text-secondary)] outline-none data-[highlighted]:bg-[var(--bg-hover)] data-[highlighted]:text-[var(--text-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

export interface DropdownMenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export function DropdownMenuItem({ children, icon, shortcut, danger, disabled, onSelect }: DropdownMenuItemProps) {
  return (
    <DM.Item disabled={disabled} onSelect={onSelect} className={cn(itemClass, danger && "text-[var(--danger)] data-[highlighted]:bg-[var(--danger-tint)] data-[highlighted]:text-[var(--danger)]")}>
      {icon && <span className="flex shrink-0" aria-hidden>{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {shortcut && <span className="ds-t-meta text-[var(--text-muted)]">{shortcut}</span>}
    </DM.Item>
  );
}

export function DropdownMenuCheckboxItem({ children, checked, onCheckedChange, disabled }: { children: ReactNode; checked: boolean; onCheckedChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <DM.CheckboxItem checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} onSelect={(e) => e.preventDefault()} className={cn(itemClass, "pr-8 relative")}>
      <span className="flex-1 truncate">{children}</span>
      <DM.ItemIndicator className="absolute right-2 flex text-[var(--accent)]"><Check size={16} strokeWidth={1.5} /></DM.ItemIndicator>
    </DM.CheckboxItem>
  );
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return <DM.Label className="ds-t-label px-2 pb-1 pt-2 text-[var(--text-muted)]">{children}</DM.Label>;
}

export function DropdownMenuSeparator() {
  return <DM.Separator className="-mx-1 my-1 h-px bg-[var(--border)]" />;
}
