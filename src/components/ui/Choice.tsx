"use client";
import { ReactNode, useId } from "react";
import * as RC from "@radix-ui/react-checkbox";
import * as RSw from "@radix-ui/react-switch";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

function ChoiceLabel({ htmlFor, label, description, disabled }: { htmlFor: string; label?: ReactNode; description?: ReactNode; disabled?: boolean }) {
  if (!label) return null;
  return (
    <label htmlFor={htmlFor} className={cn("flex flex-col cursor-pointer", disabled && "cursor-not-allowed opacity-60")}>
      <span className="ds-t-body text-[var(--text-primary)]">{label}</span>
      {description && <span className="ds-t-meta text-[var(--text-muted)]">{description}</span>}
    </label>
  );
}

export interface CheckboxProps {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

export function Checkbox({ checked, defaultChecked, onCheckedChange, label, description, disabled, invalid, id, name, "aria-label": ariaLabel }: CheckboxProps) {
  const autoId = useId();
  const cid = id || autoId;
  return (
    <div className="inline-flex items-start gap-2">
      <RC.Root
        id={cid}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(v) => onCheckedChange?.(v === true)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={cn(
          "ds-focus mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border bg-[var(--bg-surface)] transition-colors",
          invalid ? "border-[var(--danger)]" : "border-[var(--border-strong)] hover:border-[var(--text-disabled)]",
          "data-[state=checked]:border-[var(--accent)] data-[state=checked]:bg-[var(--accent)] data-[state=indeterminate]:border-[var(--accent)] data-[state=indeterminate]:bg-[var(--accent)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <RC.Indicator className="flex text-[var(--on-accent)]">
          {checked === "indeterminate" ? <Minus size={12} strokeWidth={2} /> : <Check size={12} strokeWidth={2} />}
        </RC.Indicator>
      </RC.Root>
      <ChoiceLabel htmlFor={cid} label={label} description={description} disabled={disabled} />
    </div>
  );
}

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

export function Switch({ checked, defaultChecked, onCheckedChange, label, description, disabled, id, name, "aria-label": ariaLabel }: SwitchProps) {
  const autoId = useId();
  const sid = id || autoId;
  return (
    <div className="inline-flex items-start gap-2">
      <RSw.Root
        id={sid}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={ariaLabel}
        className="ds-focus relative mt-0.5 inline-flex h-4 w-7 shrink-0 items-center rounded-[var(--radius-full)] bg-[var(--border-strong)] transition-colors data-[state=checked]:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RSw.Thumb className="block h-3 w-3 translate-x-0.5 rounded-[var(--radius-full)] bg-[var(--bg-surface)] shadow-[var(--shadow-flyout)] transition-transform duration-[var(--motion-fast)] data-[state=checked]:translate-x-3.5" />
      </RSw.Root>
      <ChoiceLabel htmlFor={sid} label={label} description={description} disabled={disabled} />
    </div>
  );
}

export type RadioOption = { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean };

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  label?: string;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  invalid?: boolean;
}

/** Native radios: arrow-key navigation and form submission come for free. */
export function RadioGroup({ options, value, onValueChange, name, label, orientation = "vertical", disabled, invalid }: RadioGroupProps) {
  const autoName = useId();
  const groupName = name || autoName;
  return (
    <div role="radiogroup" aria-label={label} aria-invalid={invalid || undefined} className={cn("flex gap-2", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap gap-4")}>
      {options.map((o) => {
        const rid = `${groupName}-${o.value}`;
        const isDisabled = disabled || o.disabled;
        return (
          <div key={o.value} className="inline-flex items-start gap-2">
            <input
              type="radio"
              id={rid}
              name={groupName}
              value={o.value}
              checked={value === undefined ? undefined : value === o.value}
              onChange={() => onValueChange?.(o.value)}
              disabled={isDisabled}
              className={cn(
                "ds-focus peer mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[var(--radius-full)] border bg-[var(--bg-surface)] transition-colors",
                invalid ? "border-[var(--danger)]" : "border-[var(--border-strong)] hover:border-[var(--text-disabled)]",
                "checked:border-[5px] checked:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
            <ChoiceLabel htmlFor={rid} label={o.label} description={o.description} disabled={isDisabled} />
          </div>
        );
      })}
    </div>
  );
}
