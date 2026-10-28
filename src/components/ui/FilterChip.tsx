"use client";
import { ReactNode } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./DropdownMenu";

export interface FilterChipProps {
  label: string;
  /** Applied value summary, e.g. "Open, Won". Presence marks the chip active. */
  value?: string;
  selected?: boolean;
  count?: number;
  icon?: ReactNode;
  /** Show a chevron (chip opens a menu). */
  menu?: boolean;
  onClick?: () => void;
  /** Show an × that clears the filter. */
  onRemove?: () => void;
  disabled?: boolean;
  /** DropdownMenuContent to open from the chip (implies `menu`). */
  menuContent?: ReactNode;
  "data-force"?: "hover" | "focus";
}

export function FilterChip({ label, value, selected, count, icon, menu, onClick, onRemove, disabled, menuContent, "data-force": force }: FilterChipProps) {
  const active = selected ?? !!value;
  const hasMenu = menu || !!menuContent;
  const main = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={hasMenu ? undefined : active}
      aria-haspopup={hasMenu ? "menu" : undefined}
      className={cn("ds-focus ds-t-meta-strong inline-flex h-full items-center gap-1.5 rounded-[var(--radius-full)] pl-2.5 group-data-[force=focus]:shadow-[var(--focus-ring)]", onRemove ? "pr-1" : "pr-2.5")}
    >
      {icon && <span className="flex" aria-hidden>{icon}</span>}
      <span>{label}</span>
      {value && <span className="max-w-40 truncate text-[var(--text-primary)]">: {value}</span>}
      {count != null && <span className="ds-num text-[var(--text-muted)]">{count}</span>}
      {hasMenu && <ChevronDown size={14} strokeWidth={1.5} aria-hidden />}
    </button>
  );
  return (
    <span
      data-force={force}
      className={cn(
        "group inline-flex h-7 items-center rounded-[var(--radius-full)] border transition-colors",
        active ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]" : "border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] data-[force=hover]:bg-[var(--bg-hover)]",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {menuContent ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{main}</DropdownMenuTrigger>
          {menuContent}
        </DropdownMenu>
      ) : main}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Clear ${label} filter`} className="ds-focus mr-1 flex h-5 w-5 items-center justify-center rounded-[var(--radius-full)] hover:bg-[var(--bg-active)]">
          <X size={12} strokeWidth={1.5} />
        </button>
      )}
    </span>
  );
}

export interface FilterSelectProps {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
  /** Label of the "no filter" option. */
  allLabel?: string;
}

/** FilterChip that opens a single-choice menu; shows the applied value and an × to clear. */
export function FilterSelect({ label, value, options, onChange, allLabel = "All" }: FilterSelectProps) {
  const active = options.find((o) => o.value === value);
  const item = (key: string, text: string, checked: boolean, pick: () => void) => (
    <DropdownMenuItem key={key} onSelect={pick} icon={<Check size={16} strokeWidth={1.5} className={checked ? "text-[var(--accent)]" : "opacity-0"} />}>{text}</DropdownMenuItem>
  );
  return (
    <FilterChip
      label={label}
      value={active?.label}
      onRemove={value ? () => onChange(null) : undefined}
      menuContent={
        <DropdownMenuContent align="start" minWidth={176}>
          {item("__all", allLabel, !value, () => onChange(null))}
          {options.map((o) => item(o.value, o.label, value === o.value, () => onChange(o.value)))}
        </DropdownMenuContent>
      }
    />
  );
}
