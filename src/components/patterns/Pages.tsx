"use client";
import { FormEvent, ReactNode, useId } from "react";
import { cn } from "@/lib/utils";
import { PageHeader, PageHeaderProps } from "./PageHeader";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";

/* ── Toolbar ──────────────────────────────────────────────────────── */

export interface ToolbarProps {
  /** Usually a SearchInput. */
  search?: ReactNode;
  /** FilterChips. */
  filters?: ReactNode;
  /** Right-aligned controls (view toggles, export…). */
  actions?: ReactNode;
}

export function Toolbar({ search, filters, actions }: ToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2" role="toolbar" aria-label="Filters">
      {search && <div className="w-64 max-w-full">{search}</div>}
      {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ── ListPage ─────────────────────────────────────────────────────── */

export interface ListPageProps {
  header: PageHeaderProps;
  /** Optional KPIStrip. */
  kpis?: ReactNode;
  /** Optional Toolbar. */
  toolbar?: ReactNode;
  /** The DataTable (or an EmptyState / ErrorState). */
  children: ReactNode;
}

export function ListPage({ header, kpis, toolbar, children }: ListPageProps) {
  return (
    <div>
      <PageHeader {...header} />
      {kpis && <div className="mb-4">{kpis}</div>}
      {toolbar}
      {children}
    </div>
  );
}

/* ── DetailPage ───────────────────────────────────────────────────── */

export interface DetailPageProps {
  header: PageHeaderProps;
  tabs?: { value: string; label: string; count?: number }[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  /** Main column. */
  children: ReactNode;
  /** 280px side panel (key facts, owner, related records). */
  side?: ReactNode;
}

export function DetailPage({ header, tabs, activeTab, onTabChange, children, side }: DetailPageProps) {
  return (
    <div>
      <PageHeader {...header}>
        {tabs && tabs.length > 0 && (
          <Tabs value={activeTab} onValueChange={onTabChange} className="mt-3">
            <TabsList aria-label={`${header.title} sections`}>
              {tabs.map((t) => <TabsTrigger key={t.value} value={t.value} count={t.count}>{t.label}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        )}
      </PageHeader>
      <div className={cn("grid gap-6", side && "lg:grid-cols-[minmax(0,1fr)_280px]")}>
        <div className="min-w-0">{children}</div>
        {side && <aside className="flex min-w-0 flex-col gap-4">{side}</aside>}
      </div>
    </div>
  );
}

/* ── Forms ────────────────────────────────────────────────────────── */

export interface FormPageProps {
  header: PageHeaderProps;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  /** Sticky footer actions, e.g. Cancel + Save. */
  footer: ReactNode;
  /** Left side of the footer, e.g. "Unsaved changes". */
  footerNote?: ReactNode;
}

export function FormPage({ header, onSubmit, children, footer, footerNote }: FormPageProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="flex min-h-full flex-col">
      <PageHeader {...header} />
      <div className="flex max-w-[880px] flex-col gap-4 pb-4">{children}</div>
      <div className="sticky bottom-0 -mx-6 mt-auto flex items-center gap-2 border-t border-[var(--border)] bg-[var(--bg-surface)] px-6 py-3">
        <div className="ds-t-meta text-[var(--text-muted)]">{footerNote}</div>
        <div className="ml-auto flex items-center gap-2">{footer}</div>
      </div>
    </form>
  );
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
      <div>
        <h2 className="ds-t-title-sm text-[var(--text-primary)]">{title}</h2>
        {description && <p className="ds-t-meta mt-1 text-[var(--text-muted)]">{description}</p>}
      </div>
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
    </section>
  );
}

export interface FieldA11y { id: string; "aria-describedby"?: string; invalid: boolean; required?: boolean }

export interface FormFieldProps {
  label: string;
  /** Render prop: spread `field` onto the control so label, hint and error are wired up. */
  children: (field: FieldA11y) => ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  id?: string;
}

export function FormField({ label, children, hint, error, required, id }: FormFieldProps) {
  const autoId = useId();
  const fid = id || autoId;
  const describedBy = [hint && `${fid}-hint`, error && `${fid}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fid} className="ds-t-meta-strong text-[var(--text-primary)]">
        {label}
        {required && <span className="text-[var(--danger)]" aria-hidden> *</span>}
      </label>
      {children({ id: fid, "aria-describedby": describedBy, invalid: !!error, required })}
      {error ? (
        <p id={`${fid}-error`} className="ds-t-meta text-[var(--danger)]">{error}</p>
      ) : hint ? (
        <p id={`${fid}-hint`} className="ds-t-meta text-[var(--text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

/* ── DashboardGrid ────────────────────────────────────────────────── */

export function DashboardGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12">{children}</div>;
}

const spanClass = { 3: "md:col-span-3 xl:col-span-3", 4: "md:col-span-3 xl:col-span-4", 6: "md:col-span-6 xl:col-span-6", 8: "md:col-span-6 xl:col-span-8", 12: "md:col-span-6 xl:col-span-12" };

export function DashboardGridItem({ span = 6, children }: { span?: keyof typeof spanClass; children: ReactNode }) {
  return <div className={cn("min-w-0", spanClass[span])}>{children}</div>;
}

/* ── SettingsLayout ───────────────────────────────────────────────── */

export interface SettingsNavItem { id: string; label: string; description?: string }

export interface SettingsLayoutProps {
  header: PageHeaderProps;
  sections: SettingsNavItem[];
  active: string;
  onSelect: (id: string) => void;
  children: ReactNode;
}

export function SettingsLayout({ header, sections, active, onSelect, children }: SettingsLayoutProps) {
  return (
    <div>
      <PageHeader {...header} />
      <div className="grid gap-6 md:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="flex flex-col gap-0.5">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-current={s.id === active ? "page" : undefined}
              className={cn(
                "ds-focus flex h-8 items-center rounded-[var(--radius-sm)] px-2 text-left transition-colors",
                s.id === active ? "ds-t-body-strong bg-[var(--accent-tint)] text-[var(--accent)]" : "ds-t-body text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="flex min-w-0 max-w-[720px] flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
