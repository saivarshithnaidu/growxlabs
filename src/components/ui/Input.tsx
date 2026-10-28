"use client";
import { forwardRef, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kbd } from "./Kbd";

export type FieldSize = 28 | 32 | 36;
const heightClass: Record<FieldSize, string> = { 28: "h-7", 32: "h-8", 36: "h-9" };

export const fieldFrame = cn(
  "flex items-center gap-2 w-full rounded-[var(--radius-sm)] border bg-[var(--bg-surface)] px-2.5",
  "border-[var(--border-strong)] hover:border-[var(--text-disabled)] data-[force=hover]:border-[var(--text-disabled)]",
  "focus-within:border-[var(--accent)] focus-within:shadow-[var(--focus-ring)] data-[force=focus]:border-[var(--accent)] data-[force=focus]:shadow-[var(--focus-ring)]",
  "data-[invalid=true]:border-[var(--danger)] data-[disabled=true]:bg-[var(--bg-canvas)] data-[disabled=true]:opacity-60 data-[disabled=true]:pointer-events-none",
  "transition-[border-color,box-shadow] duration-[var(--motion-fast)]",
);
const inputReset = "ds-t-body flex-1 min-w-0 h-full bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] outline-none disabled:cursor-not-allowed";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: FieldSize;
  invalid?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  "data-force"?: "hover" | "focus";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 32, invalid = false, leading, trailing, className, disabled, "data-force": force, ...props },
  ref,
) {
  return (
    <div className={cn(fieldFrame, heightClass[size], className)} data-invalid={invalid} data-disabled={disabled} data-force={force}>
      {leading && <span className="shrink-0 flex text-[var(--text-muted)]">{leading}</span>}
      <input ref={ref} className={inputReset} disabled={disabled} aria-invalid={invalid || undefined} {...props} />
      {trailing && <span className="shrink-0 flex text-[var(--text-muted)]">{trailing}</span>}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid = false, className, disabled, rows = 4, ...props },
  ref,
) {
  return (
    <div className={cn(fieldFrame, "items-stretch py-1.5", className)} data-invalid={invalid} data-disabled={disabled}>
      <textarea ref={ref} rows={rows} className={cn(inputReset, "resize-y min-h-16")} disabled={disabled} aria-invalid={invalid || undefined} {...props} />
    </div>
  );
});

export interface SearchInputProps extends Omit<InputProps, "leading" | "trailing" | "type" | "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  /** Keyboard hint shown when empty, e.g. "/" */
  shortcut?: string;
}

export function SearchInput({ value, onValueChange, shortcut, placeholder = "Search", "aria-label": ariaLabel, ...props }: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Input
      ref={ref}
      type="search"
      role="searchbox"
      aria-label={ariaLabel || placeholder}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Escape" && value) { e.stopPropagation(); onValueChange(""); } }}
      leading={<Search size={16} strokeWidth={1.5} aria-hidden />}
      trailing={
        value ? (
          <button type="button" className="ds-focus flex rounded-[var(--radius-xs)] text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Clear search" onClick={() => { onValueChange(""); ref.current?.focus(); }}>
            <X size={14} strokeWidth={1.5} />
          </button>
        ) : shortcut ? <Kbd>{shortcut}</Kbd> : null
      }
      className="[&_input::-webkit-search-cancel-button]:hidden"
      {...props}
    />
  );
}
