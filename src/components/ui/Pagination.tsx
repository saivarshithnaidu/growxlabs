"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./Button";
import { Select } from "./Select";

export interface PaginationProps {
  page: number;          // 1-based
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Show a rows-per-page picker. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

function pageList(page: number, count: number): (number | "…")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = new Set([1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => { if (i > 0 && p - sorted[i - 1] > 1) out.push("…"); out.push(p); });
  return out;
}

export function Pagination({ page, pageSize, total, onPageChange, pageSizeOptions, onPageSizeChange, className }: PaginationProps) {
  const count = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-3">
        <p className="ds-t-meta ds-num text-[var(--text-muted)]">{from}–{to} of {total}</p>
        {pageSizeOptions && onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="ds-t-meta text-[var(--text-muted)]">Rows</span>
            <div className="w-20"><Select size={28} aria-label="Rows per page" value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))} options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))} /></div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <IconButton label="Previous page" size={28} icon={<ChevronLeft size={16} strokeWidth={1.5} />} disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        {pageList(page, count).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="ds-t-meta w-7 text-center text-[var(--text-muted)]" aria-hidden>…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                "ds-focus ds-t-meta-strong ds-num h-7 min-w-7 rounded-[var(--radius-sm)] px-1.5 transition-colors",
                p === page ? "bg-[var(--accent-tint)] text-[var(--accent)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]",
              )}
            >
              {p}
            </button>
          ),
        )}
        <IconButton label="Next page" size={28} icon={<ChevronRight size={16} strokeWidth={1.5} />} disabled={page >= count} onClick={() => onPageChange(page + 1)} />
      </div>
    </nav>
  );
}
