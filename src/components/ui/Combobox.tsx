"use client";
import { useId, useMemo, useState, KeyboardEvent } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldFrame, FieldSize } from "./Input";

export type ComboboxOption = { value: string; label: string; hint?: string; disabled?: boolean };

const heightClass: Record<FieldSize, string> = { 28: "h-7", 32: "h-8", 36: "h-9" };

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  size?: FieldSize;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

/** Searchable single select. Arrow keys move, Enter picks, Esc closes. */
export function Combobox({ options, value, onValueChange, placeholder = "Select…", searchPlaceholder = "Search…", emptyText = "No matches", size = 32, disabled, invalid = false, id, className, "aria-label": ariaLabel }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listId = useId();
  const selected = options.find((o) => o.value === value) || null;
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q) || o.hint?.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const pick = (o: ComboboxOption) => {
    if (o.disabled) return;
    onValueChange(o.value === value ? null : o.value);
    setOpen(false);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); const o = results[cursor]; if (o) pick(o); }
  };

  return (
    <Popover.Root open={open} onOpenChange={(o) => { setOpen(o); if (o) { setQuery(""); setCursor(Math.max(0, options.findIndex((x) => x.value === value))); } }}>
      <Popover.Trigger
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        data-invalid={invalid}
        data-disabled={disabled}
        className={cn(fieldFrame, heightClass[size], "ds-t-body justify-between text-left outline-none focus-visible:border-[var(--accent)] focus-visible:shadow-[var(--focus-ring)]", className)}
      >
        <span className={cn("truncate", selected ? "text-[var(--text-primary)]" : "text-[var(--text-disabled)]")}>{selected ? selected.label : placeholder}</span>
        <ChevronsUpDown size={16} strokeWidth={1.5} className="shrink-0 text-[var(--text-muted)]" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={4} className="ds-portal z-[500] w-[var(--radix-popover-trigger-width)] min-w-56 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-flyout)]">
          <div className="flex h-9 items-center gap-2 border-b border-[var(--border)] px-2.5">
            <Search size={16} strokeWidth={1.5} className="shrink-0 text-[var(--text-muted)]" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
              onKeyDown={onKey}
              placeholder={searchPlaceholder}
              aria-controls={listId}
              aria-activedescendant={results[cursor] ? `${listId}-${results[cursor].value}` : undefined}
              aria-autocomplete="list"
              className="ds-t-body h-full flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] outline-none"
            />
          </div>
          <ul id={listId} role="listbox" aria-label={ariaLabel} className="max-h-64 overflow-y-auto p-1">
            {results.length === 0 && <li className="ds-t-meta px-2 py-6 text-center text-[var(--text-muted)]">{emptyText}</li>}
            {results.map((o, i) => (
              <li
                key={o.value}
                id={`${listId}-${o.value}`}
                role="option"
                aria-selected={o.value === value}
                aria-disabled={o.disabled || undefined}
                onMouseEnter={() => setCursor(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(o)}
                className={cn(
                  "ds-t-body flex h-8 cursor-default items-center gap-2 rounded-[var(--radius-sm)] px-2 text-[var(--text-secondary)]",
                  i === cursor && "bg-[var(--bg-hover)] text-[var(--text-primary)]",
                  o.disabled && "opacity-50",
                )}
              >
                <span className="flex-1 truncate">{o.label}</span>
                {o.hint && <span className="ds-t-meta text-[var(--text-muted)]">{o.hint}</span>}
                {o.value === value && <Check size={16} strokeWidth={1.5} className="text-[var(--accent)]" />}
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
