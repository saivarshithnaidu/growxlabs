"use client";

import { Bot, Box, Cpu, Slash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MentionOption } from "./command-center.types";

export function MentionMenu({ options, activeIndex, onSelect }: { options: MentionOption[]; activeIndex: number; onSelect: (option: MentionOption) => void }) {
  if (!options.length) return null;
  return (
    <div role="listbox" aria-label="Suggestions" className="absolute bottom-full left-4 right-4 z-20 mb-2 max-w-md overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-surface)] p-1 shadow-[var(--shadow-flyout)] sm:left-6">
      {options.map((option, index) => {
        const Icon = option.kind === "agent" ? Bot : option.kind === "project" ? Box : option.kind === "model" ? Cpu : Slash;
        return (
          <button
            key={option.id}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(option)}
            className={cn(
              "ds-focus flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2.5 py-2 text-left focus-visible:shadow-[var(--focus-ring)]",
              index === activeIndex ? "bg-[var(--bg-active)]" : "hover:bg-[var(--bg-hover)] active:bg-[var(--bg-active)]"
            )}
          >
            <Icon size={16} strokeWidth={1.5} className="shrink-0 text-[var(--text-muted)]" />
            <span className="min-w-0 flex-1">
              <span className="ds-t-body-strong block text-[var(--text-primary)]">{option.label}</span>
              <span className="ds-t-meta block truncate text-[var(--text-muted)]">{option.description}</span>
            </span>
            <code className="ds-t-mono shrink-0 text-[var(--text-disabled)]">{option.token}</code>
          </button>
        );
      })}
    </div>
  );
}
