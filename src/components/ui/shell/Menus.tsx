"use client";
import { Fragment, ReactNode, useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as D from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "../Avatar";
import { Kbd } from "../Kbd";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../DropdownMenu";
import type { NavIcon } from "./nav-match";

/* ── Command palette ──────────────────────────────────────────────── */

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  icon?: NavIcon;
  hint?: string;
  /** Navigate on select… */
  href?: string;
  /** …or run a callback. */
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  /** Items shown before the user types. */
  initialCount?: number;
}

export function CommandPalette({ open, onOpenChange, ...body }: CommandPaletteProps) {
  // Content unmounts while closed, so the query and cursor start fresh on every open.
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="ds-portal fixed inset-0 z-[450] bg-[var(--overlay)]" />
        <D.Content aria-describedby={undefined} className="ds-portal fixed left-1/2 top-[20vh] z-[460] w-[calc(100vw-32px)] max-w-[560px] -translate-x-1/2 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-modal)] outline-none">
          <D.Title className="sr-only">Command palette</D.Title>
          <PaletteBody {...body} onClose={() => onOpenChange(false)} />
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

function PaletteBody({ items, placeholder = "Search pages and actions…", initialCount = 12, onClose }: Omit<CommandPaletteProps, "open" | "onOpenChange"> & { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, initialCount);
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q) || i.hint?.toLowerCase().includes(q)).slice(0, 30);
  }, [items, query, initialCount]);

  useEffect(() => { listRef.current?.querySelector(`[data-index="${cursor}"]`)?.scrollIntoView({ block: "nearest" }); }, [cursor]);

  const run = (item: CommandItem) => {
    onClose();
    if (item.onSelect) item.onSelect();
    else if (item.href) router.push(item.href);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); const r = results[cursor]; if (r) run(r); }
  };

  return (
    <>
          <div className="flex h-12 items-center gap-2 border-b border-[var(--border)] px-4">
            <Search size={16} strokeWidth={1.5} className="shrink-0 text-[var(--text-muted)]" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
              onKeyDown={onKey}
              placeholder={placeholder}
              role="combobox"
              aria-expanded
              aria-controls="ds-cmdk-list"
              aria-activedescendant={results[cursor] ? `ds-cmdk-${results[cursor].id}` : undefined}
              className="ds-t-body h-full flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] outline-none"
            />
            <Kbd>esc</Kbd>
          </div>
          <ul id="ds-cmdk-list" role="listbox" ref={listRef} className="max-h-[50vh] overflow-y-auto p-1">
            {results.length === 0 && <li className="ds-t-body px-4 py-8 text-center text-[var(--text-muted)]">No results</li>}
            {results.map((r, i) => {
              const Icon = r.icon;
              const showGroup = i === 0 || results[i - 1].group !== r.group;
              return (
                <Fragment key={r.id}>
                  {showGroup && <li role="presentation" className="ds-t-label px-2 pb-1 pt-2 text-[var(--text-muted)]">{r.group}</li>}
                  <li
                    id={`ds-cmdk-${r.id}`}
                    role="option"
                    aria-selected={i === cursor}
                    data-index={i}
                    onMouseMove={() => setCursor(i)}
                    onClick={() => run(r)}
                    className={cn("ds-t-body flex h-9 cursor-default items-center gap-2.5 rounded-[var(--radius-sm)] px-2", i === cursor ? "bg-[var(--bg-hover)] text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}
                  >
                    {Icon && <Icon size={16} strokeWidth={1.5} className={i === cursor ? "text-[var(--accent)]" : "text-[var(--text-muted)]"} />}
                    <span className="flex-1 truncate">{r.label}</span>
                    {r.hint && <span className="ds-t-meta text-[var(--text-muted)]">{r.hint}</span>}
                  </li>
                </Fragment>
              );
            })}
          </ul>
          <div className="ds-t-meta flex h-8 items-center gap-4 border-t border-[var(--border)] bg-[var(--bg-canvas)] px-4 text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1"><Kbd>↑↓</Kbd> navigate</span>
            <span className="inline-flex items-center gap-1"><Kbd>↵</Kbd> open</span>
          </div>
    </>
  );
}

/* ── User menu ────────────────────────────────────────────────────── */

export interface UserMenuItem {
  label: string;
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
  danger?: boolean;
  /** Draw a separator above this item. */
  separated?: boolean;
}

export interface UserMenuProps {
  name: string;
  role?: string;
  avatarSrc?: string | null;
  items: UserMenuItem[];
}

export function UserMenu({ name, role, avatarSrc, items }: UserMenuProps) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Account menu for ${name}`} className="ds-focus rounded-[var(--radius-full)]">
        <Avatar name={name} src={avatarSrc} size={28} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" minWidth={224}>
        <div className="border-b border-[var(--border)] px-2 pb-2 pt-1 mb-1">
          <p className="ds-t-body-strong truncate text-[var(--text-primary)]">{name}</p>
          {role && <p className="ds-t-meta truncate capitalize text-[var(--text-muted)]">{role}</p>}
        </div>
        {items.map((it) => (
          <Fragment key={it.label}>
            {it.separated && <DropdownMenuSeparator />}
            <DropdownMenuItem icon={it.icon} danger={it.danger} onSelect={() => (it.onSelect ? it.onSelect() : it.href && router.push(it.href))}>
              {it.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Breadcrumb ───────────────────────────────────────────────────── */

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="ds-t-meta flex min-w-0 items-center text-[var(--text-muted)]">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.label + i} className={cn("flex min-w-0 items-center", last && "truncate")}>
              {it.href && !last ? (
                <Link href={it.href} className="ds-focus ds-t-meta rounded-[var(--radius-xs)] transition-colors hover:text-[var(--text-primary)]">{it.label}</Link>
              ) : (
                <span className="ds-t-meta truncate" aria-current={last ? "page" : undefined}>{it.label}</span>
              )}
              {!last && <span aria-hidden className="mx-1.5">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
