"use client";
import { ReactNode } from "react";
import { Info } from "lucide-react";
import { Breadcrumb, BreadcrumbItem } from "../ui/shell/Menus";
import { Tooltip } from "../ui/Tooltip";

export interface PageHeaderProps {
  title: string;
  /** Parent levels; the title is appended as the current page. */
  breadcrumb?: BreadcrumbItem[];
  /** Context that would otherwise be a description line; shown in a 16px info tooltip. */
  info?: string;
  /** Right side of the title row: 32px buttons, 8px apart. */
  actions?: ReactNode;
  /** Extra content under the title row (e.g. tabs on DetailPage). */
  children?: ReactNode;
}

export function PageHeader({ title, breadcrumb, info, actions, children }: PageHeaderProps) {
  return (
    <header className="mb-4">
      {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={[...breadcrumb, { label: title }]} />}
      <div className={breadcrumb?.length ? "mt-1 flex min-h-8 items-center justify-between gap-4" : "flex min-h-8 items-center justify-between gap-4"}>
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="ds-t-title truncate text-[var(--text-primary)]">{title}</h1>
          {info && (
            <Tooltip content={info} side="bottom" align="start">
              <button type="button" aria-label={`About this page: ${info}`} className="ds-focus flex rounded-[var(--radius-full)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <Info size={16} strokeWidth={1.5} />
              </button>
            </Tooltip>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  );
}
