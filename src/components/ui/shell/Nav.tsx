"use client";
import { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "../Tooltip";
import type { NavIcon } from "./nav-match";

export const RAIL_WIDTH = 56;
export const PANEL_WIDTH = 232;
export const TOP_HEIGHT = 56;

/* ── Rail ─────────────────────────────────────────────────────────── */

export interface NavRailProps {
  /** 32×32 logo mark, centered in the 56px top zone. */
  logo: ReactNode;
  children: ReactNode;
  /** Pinned to the bottom (search, user menu). */
  footer?: ReactNode;
  label?: string;
}

export function NavRail({ logo, children, footer, label = "Modules" }: NavRailProps) {
  return (
    <aside className="relative flex shrink-0 flex-col overflow-x-hidden border-r border-[var(--border)] bg-[var(--bg-surface)]" style={{ width: RAIL_WIDTH }}>
      <div className="flex shrink-0 items-center justify-center border-b border-[var(--border)]" style={{ height: TOP_HEIGHT }}>{logo}</div>
      <nav aria-label={label} className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </nav>
      {footer && <div className="flex w-full shrink-0 flex-col items-center gap-2 pb-3 pt-2">{footer}</div>}
    </aside>
  );
}

export interface NavRailItemProps {
  label: string;
  icon: NavIcon;
  href: string;
  active?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  /** Hide the hover tooltip (e.g. while a flyout already shows the module name). */
  hideTooltip?: boolean;
  "data-force"?: "hover" | "focus";
}

export function NavRailItem({ label, icon: Icon, href, active = false, onMouseEnter, onMouseLeave, hideTooltip = false, "data-force": force }: NavRailItemProps) {
  return (
    <div className="relative flex h-10 w-full shrink-0 justify-center" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {active && <span aria-hidden className="absolute left-0 top-2.5 h-5 w-0.5 rounded-r-[var(--radius-xs)] bg-[var(--accent)]" />}
      <Tooltip content={label} side="right" disabled={hideTooltip}>
        <Link
          href={href}
          aria-label={label}
          aria-current={active ? "page" : undefined}
          data-force={force}
          className={cn(
            "ds-focus flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] transition-colors data-[force=focus]:shadow-[var(--focus-ring)]",
            active ? "bg-[var(--accent-tint)] text-[var(--accent)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] data-[force=hover]:bg-[var(--bg-hover)]",
          )}
        >
          <Icon size={20} strokeWidth={1.5} />
        </Link>
      </Tooltip>
    </div>
  );
}

/** 40×40 rail button for non-link actions (search, etc.). */
export function NavRailButton({ label, icon: Icon, onClick }: { label: string; icon: NavIcon; onClick: () => void }) {
  return (
    <Tooltip content={label} side="right">
      <button type="button" aria-label={label} onClick={onClick} className="ds-focus flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]">
        <Icon size={20} strokeWidth={1.5} />
      </button>
    </Tooltip>
  );
}

/* ── Section panel ────────────────────────────────────────────────── */

export interface SectionPanelProps {
  title: string;
  children: ReactNode;
  onCollapse?: () => void;
}

export function SectionPanel({ title, children, onCollapse }: SectionPanelProps) {
  return (
    <aside aria-label={title} className="flex shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]" style={{ width: PANEL_WIDTH }}>
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border)] px-4" style={{ height: TOP_HEIGHT }}>
        <h2 className="ds-t-title-sm truncate text-[var(--text-primary)]">{title}</h2>
        {onCollapse && (
          <Tooltip content="Collapse panel  [" side="bottom">
            <button type="button" onClick={onCollapse} aria-label="Collapse panel" className="ds-focus flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">
              <PanelLeftClose size={16} strokeWidth={1.5} />
            </button>
          </Tooltip>
        )}
      </div>
      <SectionPanelBody>{children}</SectionPanelBody>
    </aside>
  );
}

export function SectionPanelBody({ children }: { children: ReactNode }) {
  return <nav className="flex-1 overflow-y-auto px-2 pb-3 pt-3">{children}</nav>;
}

export function NavGroup({ label, children, first = false }: { label: string; children: ReactNode; first?: boolean }) {
  return (
    <div className={first ? "mt-1" : "mt-4"} role="group" aria-label={label}>
      <div className="ds-t-label mb-1 px-2 text-[var(--text-muted)]">{label}</div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export interface NavItemProps {
  label: string;
  href: string;
  icon: NavIcon;
  count?: number;
  active?: boolean;
  "data-force"?: "hover" | "focus";
}

export function NavItem({ label, href, icon: Icon, count, active = false, "data-force": force }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-force={force}
      className={cn(
        "ds-focus group flex h-8 items-center gap-2.5 rounded-[var(--radius-sm)] px-2 transition-colors data-[force=focus]:shadow-[var(--focus-ring)]",
        active
          ? "ds-t-body-strong bg-[var(--accent-tint)] text-[var(--accent)]"
          : "ds-t-body text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] data-[force=hover]:bg-[var(--bg-hover)] data-[force=hover]:text-[var(--text-primary)]",
      )}
    >
      <Icon size={16} strokeWidth={1.5} className={cn("shrink-0", active ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count != null && <span className="ds-t-meta ds-num shrink-0 text-[var(--text-muted)]">{count}</span>}
    </Link>
  );
}

/* ── Flyout (collapsed panel on rail hover) ───────────────────────── */

export interface FlyoutProps {
  title: string;
  children: ReactNode;
  top: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: CSSProperties;
}

export function Flyout({ title, children, top, onMouseEnter, onMouseLeave, style }: FlyoutProps) {
  return (
    <div
      role="dialog"
      aria-label={title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="ds-portal fixed z-[150] flex max-h-[70vh] flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-flyout)]"
      style={{ left: RAIL_WIDTH + 8, top: Math.max(12, top), width: PANEL_WIDTH, ...style }}
    >
      <div className="flex h-12 shrink-0 items-center border-b border-[var(--border)] px-4">
        <h2 className="ds-t-title-sm truncate text-[var(--text-primary)]">{title}</h2>
      </div>
      <SectionPanelBody>{children}</SectionPanelBody>
    </div>
  );
}
