"use client";
import { ReactNode, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Rows2, Rows3, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../Choice";
import { Skeleton } from "../Surface";
import { Pagination } from "../Pagination";
import { IconButton } from "../Button";
import { Tooltip } from "../Tooltip";

export type SortDirection = "asc" | "desc";
export type SortState = { columnId: string; direction: SortDirection } | null;
export type Density = "comfortable" | "compact";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  /** Cell renderer. Defaults to row[id]. */
  cell?: (row: T) => ReactNode;
  /** Value used for client-side sorting; enables sorting when set. */
  sortValue?: (row: T) => string | number | Date | null | undefined;
  /** Show sort controls (defaults to !!sortValue). Use with onSortChange for server/caller sorting. */
  sortable?: boolean;
  /** Right-aligns header + cells and uses tabular numbers. */
  numeric?: boolean;
  width?: number | string;
  /** Allow wrapping instead of truncating. */
  wrap?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Accessible table name. */
  label: string;
  loading?: boolean;
  /** Rendered inside the table body when there are no rows. */
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
  /** Actions revealed on row hover / focus (right edge). */
  rowActions?: (row: T) => ReactNode;

  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Shown in the bulk bar while rows are selected. */
  bulkActions?: (ids: string[]) => ReactNode;

  /** Controlled sort. Omit onSortChange to let the table sort rows itself. */
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;

  density?: Density;
  onDensityChange?: (density: Density) => void;
  showDensityToggle?: boolean;

  /** Max height of the scroll area; the header sticks within it. */
  maxHeight?: number | string;
  pagination?: { page: number; pageSize: number; total: number; onPageChange: (page: number) => void; pageSizeOptions?: number[]; onPageSizeChange?: (size: number) => void };
  skeletonRows?: number;
}

const rowHeight: Record<Density, string> = { comfortable: "h-11", compact: "h-9" };

function compare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

export function DataTable<T>({
  columns, rows, getRowId, label, loading = false, emptyState, onRowClick, rowActions,
  selectable = false, selectedIds, onSelectionChange, bulkActions,
  sort: sortProp, onSortChange, density: densityProp, onDensityChange, showDensityToggle = false,
  maxHeight, pagination, skeletonRows = 6,
}: DataTableProps<T>) {
  const [innerSort, setInnerSort] = useState<SortState>(null);
  const [innerDensity, setInnerDensity] = useState<Density>("comfortable");
  const [innerSelected, setInnerSelected] = useState<string[]>([]);
  const sort = sortProp !== undefined ? sortProp : innerSort;
  const density = densityProp ?? innerDensity;
  const selected = selectedIds ?? innerSelected;
  const setSelected = (ids: string[]) => (onSelectionChange ? onSelectionChange(ids) : setInnerSelected(ids));
  const setSort = (s: SortState) => (onSortChange ? onSortChange(s) : setInnerSort(s));
  const setDensity = (d: Density) => (onDensityChange ? onDensityChange(d) : setInnerDensity(d));

  const sorted = useMemo(() => {
    if (!sort || onSortChange) return rows;
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col?.sortValue) return rows;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => compare(col.sortValue!(a), col.sortValue!(b)) * dir);
  }, [rows, sort, columns, onSortChange]);

  const ids = sorted.map(getRowId);
  const allSelected = ids.length > 0 && ids.every((id) => selected.includes(id));
  const someSelected = !allSelected && ids.some((id) => selected.includes(id));
  const toggleAll = () => setSelected(allSelected ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
  const toggleOne = (id: string) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  const cycleSort = (colId: string) => {
    if (!sort || sort.columnId !== colId) setSort({ columnId: colId, direction: "asc" });
    else if (sort.direction === "asc") setSort({ columnId: colId, direction: "desc" });
    else setSort(null);
  };

  const colCount = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);
  const cellPad = "px-3 first:pl-4 last:pr-4";
  const showBar = selectable && selected.length > 0;

  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)]">
      {(showBar || showDensityToggle) && (
        <div className={cn("flex h-11 items-center gap-2 border-b border-[var(--border)] px-4", showBar && "bg-[var(--accent-tint)]")}>
          {showBar ? (
            <>
              <span className="ds-t-body-strong ds-num text-[var(--text-primary)]" aria-live="polite">{selected.length} selected</span>
              <div className="ml-2 flex items-center gap-2">{bulkActions?.(selected)}</div>
              <button type="button" onClick={() => setSelected([])} className="ds-focus ds-t-meta-strong ml-auto inline-flex items-center gap-1 rounded-[var(--radius-xs)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X size={14} strokeWidth={1.5} /> Clear
              </button>
            </>
          ) : (
            <div className="ml-auto flex items-center gap-1" role="group" aria-label="Row density">
              <Tooltip content="Comfortable rows">
                <IconButton label="Comfortable rows" size={28} icon={<Rows2 size={16} strokeWidth={1.5} />} aria-pressed={density === "comfortable"} className={density === "comfortable" ? "bg-[var(--bg-hover)] text-[var(--text-primary)]" : ""} onClick={() => setDensity("comfortable")} />
              </Tooltip>
              <Tooltip content="Compact rows">
                <IconButton label="Compact rows" size={28} icon={<Rows3 size={16} strokeWidth={1.5} />} aria-pressed={density === "compact"} className={density === "compact" ? "bg-[var(--bg-hover)] text-[var(--text-primary)]" : ""} onClick={() => setDensity("compact")} />
              </Tooltip>
            </div>
          )}
        </div>
      )}

      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full border-collapse text-left" aria-label={label} aria-busy={loading || undefined}>
          <thead>
            <tr>
              {selectable && (
                <th scope="col" className="sticky top-0 z-[1] h-9 w-10 border-b border-[var(--border)] bg-[var(--bg-canvas)] pl-4 pr-0">
                  <Checkbox aria-label="Select all rows" checked={allSelected ? true : someSelected ? "indeterminate" : false} onCheckedChange={toggleAll} disabled={loading || ids.length === 0} />
                </th>
              )}
              {columns.map((c) => {
                const active = sort?.columnId === c.id ? sort.direction : null;
                const sortable = c.sortable ?? !!c.sortValue;
                return (
                  <th
                    key={c.id}
                    scope="col"
                    aria-sort={active === "asc" ? "ascending" : active === "desc" ? "descending" : sortable ? "none" : undefined}
                    style={{ width: c.width }}
                    className={cn("ds-t-label sticky top-0 z-[1] h-9 whitespace-nowrap border-b border-[var(--border)] bg-[var(--bg-canvas)] text-[var(--text-muted)]", cellPad, c.numeric && "text-right")}
                  >
                    {sortable ? (
                      <button type="button" onClick={() => cycleSort(c.id)} className={cn("ds-focus ds-t-label group inline-flex items-center gap-1 rounded-[var(--radius-xs)] hover:text-[var(--text-primary)]", c.numeric && "flex-row-reverse", active && "text-[var(--text-primary)]")}>
                        {c.header}
                        {active === "asc" ? <ArrowUp size={12} strokeWidth={1.5} /> : active === "desc" ? <ArrowDown size={12} strokeWidth={1.5} /> : <ChevronsUpDown size={12} strokeWidth={1.5} className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" />}
                      </button>
                    ) : c.header}
                  </th>
                );
              })}
              {rowActions && <th scope="col" className="sticky top-0 z-[1] h-9 w-px border-b border-[var(--border)] bg-[var(--bg-canvas)] pr-4"><span className="sr-only">Actions</span></th>}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: skeletonRows }, (_, i) => (
                <tr key={`sk-${i}`} className={rowHeight[density]}>
                  {Array.from({ length: colCount }, (_, j) => (
                    <td key={j} className={cn("border-b border-[var(--border)]", cellPad)}><Skeleton height={12} width={j === 0 ? "70%" : "50%"} /></td>
                  ))}
                </tr>
              ))}

            {!loading && sorted.length === 0 && (
              <tr><td colSpan={colCount} className="px-4">{emptyState}</td></tr>
            )}

            {!loading && sorted.map((row) => {
              const id = getRowId(row);
              const isSelected = selected.includes(id);
              return (
                <tr
                  key={id}
                  aria-selected={selectable ? isSelected : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "group/row border-b border-[var(--border)] last:border-b-0 transition-colors",
                    rowHeight[density],
                    isSelected ? "bg-[var(--accent-tint)]" : "hover:bg-[var(--bg-hover)] focus-within:bg-[var(--bg-hover)]",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {selectable && (
                    <td className="w-10 pl-4 pr-0" onClick={(e) => e.stopPropagation()}>
                      <Checkbox aria-label={`Select row ${id}`} checked={isSelected} onCheckedChange={() => toggleOne(id)} />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.id} className={cn("ds-t-body text-[var(--text-secondary)]", cellPad, c.numeric && "ds-num text-right", !c.wrap && "max-w-80 truncate")}>
                      {c.cell ? c.cell(row) : String((row as Record<string, unknown>)[c.id] ?? "—")}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="w-px whitespace-nowrap pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover/row:opacity-100 group-focus-within/row:opacity-100">{rowActions(row)}</div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > 0 && (
        <div className="border-t border-[var(--border)] px-4 py-2">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
}
