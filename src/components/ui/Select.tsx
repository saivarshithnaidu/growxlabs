"use client";
import * as RS from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldFrame, FieldSize } from "./Input";

export type SelectOption = { value: string; label: string; disabled?: boolean };

const heightClass: Record<FieldSize, string> = { 28: "h-7", 32: "h-8", 36: "h-9" };

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  size?: FieldSize;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "data-force"?: "hover" | "focus";
}

export function Select({ options, value, defaultValue, onValueChange, placeholder = "Select…", size = 32, disabled, invalid = false, id, name, required, className, "data-force": force, ...aria }: SelectProps) {
  return (
    <RS.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled} name={name} required={required}>
      <RS.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        {...aria}
        data-invalid={invalid}
        data-disabled={disabled}
        data-force={force}
        className={cn(fieldFrame, heightClass[size], "ds-t-body justify-between text-left text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)] focus-visible:shadow-[var(--focus-ring)] data-[placeholder]:text-[var(--text-disabled)]", className)}
      >
        <span className="truncate"><RS.Value placeholder={placeholder} /></span>
        <RS.Icon className="shrink-0 text-[var(--text-muted)]"><ChevronDown size={16} strokeWidth={1.5} /></RS.Icon>
      </RS.Trigger>
      <RS.Portal>
        <RS.Content
          position="popper"
          sideOffset={4}
          className="ds-portal z-[500] min-w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-1 shadow-[var(--shadow-flyout)]"
        >
          <RS.Viewport>
            {options.map((o) => (
              <RS.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className="ds-t-body relative flex h-8 cursor-default select-none items-center gap-2 rounded-[var(--radius-sm)] pl-2 pr-8 text-[var(--text-secondary)] outline-none data-[highlighted]:bg-[var(--bg-hover)] data-[highlighted]:text-[var(--text-primary)] data-[disabled]:opacity-50 data-[state=checked]:text-[var(--text-primary)]"
              >
                <RS.ItemText>{o.label}</RS.ItemText>
                <RS.ItemIndicator className="absolute right-2 flex text-[var(--accent)]"><Check size={16} strokeWidth={1.5} /></RS.ItemIndicator>
              </RS.Item>
            ))}
          </RS.Viewport>
        </RS.Content>
      </RS.Portal>
    </RS.Root>
  );
}
