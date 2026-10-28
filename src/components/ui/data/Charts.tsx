"use client";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../Format";

/* ── Sparkline ────────────────────────────────────────────────────── */

export function Sparkline({ values, height = 32, className }: { values: number[]; height?: number; className?: string }) {
  if (values.length < 2) return <div style={{ height }} className={className} />;
  const w = 120;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, height - 3 - ((v - min) / span) * (height - 6)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" width="100%" height={height} aria-hidden className={className}>
      <path d={`${line} L${w} ${height} L0 ${height}Z`} fill="var(--chart-area)" stroke="none" />
      <path d={line} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r={2.5} fill="var(--chart-1)" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ── Stat tile ────────────────────────────────────────────────────── */

export interface StatTileProps {
  label: string;
  value: ReactNode;
  /** e.g. { value: "18%", direction: "up" }; `good` decides the color (defaults to up = good). */
  delta?: { value: string; direction: "up" | "down"; good?: boolean };
  /** One short line under the number. */
  caption?: ReactNode;
  /** Sparkline values, oldest first. */
  trend?: number[];
  /** 0–1 progress bar instead of a sparkline (e.g. collected vs billed). */
  progress?: number;
  href?: string;
}

/** Hero KPI: big number, delta, one caption, and a trend. Flat — sits on whitespace. */
export function StatTile({ label, value, delta, caption, trend, progress, href }: StatTileProps) {
  const good = delta ? delta.good ?? delta.direction === "up" : false;
  const body = (
    <>
      <p className="ds-t-meta-strong flex items-center justify-between text-[var(--text-muted)]">
        {label}
        {href && <ArrowRight size={14} strokeWidth={1.5} aria-hidden className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />}
      </p>
      <p className="ds-t-display mt-2 truncate text-[var(--text-primary)]">{value}</p>
      <p className="ds-t-meta mt-1 flex min-h-4 items-center gap-1.5 truncate text-[var(--text-muted)]">
        {delta && (
          <span className={cn("ds-t-meta-strong ds-num inline-flex items-center gap-0.5", good ? "text-[var(--success)]" : "text-[var(--danger)]")}>
            {delta.direction === "up" ? <ArrowUp size={12} strokeWidth={2} aria-hidden /> : <ArrowDown size={12} strokeWidth={2} aria-hidden />}
            <span className="sr-only">{delta.direction}</span>
            {delta.value}
          </span>
        )}
        {caption}
      </p>
      <div className="mt-4">
        {progress != null ? (
          <div role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label={`${label} progress`} className="h-1.5 overflow-hidden rounded-[var(--radius-full)] bg-[var(--bg-active)]">
            <div className="h-full rounded-[var(--radius-full)] bg-[var(--chart-1)]" style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }} />
          </div>
        ) : trend ? (
          <Sparkline values={trend} />
        ) : (
          <div className="h-1.5" />
        )}
      </div>
    </>
  );
  const cls = "group block min-w-0 rounded-[var(--radius-lg)] p-4 -m-4 transition-colors";
  return href ? (
    <Link href={href} className={cn(cls, "ds-focus hover:bg-[var(--bg-canvas)]")}>{body}</Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function StatRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-x-10 gap-y-8 px-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

/* ── Chart card ───────────────────────────────────────────────────── */

export interface ChartLegendItem { label: string; color: string; dashed?: boolean }

export function ChartCard({ title, action, legend, children }: { title: string; action?: ReactNode; legend?: ChartLegendItem[]; children: ReactNode }) {
  return (
    <section aria-label={title} className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="ds-t-title-sm text-[var(--text-primary)]">{title}</h2>
        <div className="flex items-center gap-4">
          {legend && (
            <ul className="ds-t-meta flex items-center gap-3 text-[var(--text-muted)]">
              {legend.map((l) => (
                <li key={l.label} className="inline-flex items-center gap-1.5">
                  <svg width="14" height="2" aria-hidden><line x1="0" y1="1" x2="14" y2="1" stroke={l.color} strokeWidth="2" strokeDasharray={l.dashed ? "3 3" : undefined} /></svg>
                  {l.label}
                </li>
              ))}
            </ul>
          )}
          {action}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ── Trend chart (line / area, responsive SVG) ────────────────────── */

export interface TrendSeries { key: string; label: string; color: string; area?: boolean; dashed?: boolean }

export interface TrendChartProps {
  data: Record<string, number | string>[];
  /** Key in each datum used for the x label. */
  xKey: string;
  series: TrendSeries[];
  height?: number;
  formatValue?: (v: number) => string;
  /** Serializable alternative to formatValue (usable from server components). */
  valueFormat?: "number" | "inr-compact";
  /** Accessible summary. */
  label: string;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

export function TrendChart({ data, xKey, series, height = 220, formatValue: fmt, valueFormat = "number", label }: TrendChartProps) {
  const formatValue = fmt ?? (valueFormat === "inr-compact" ? (v: number) => formatCurrency(v, { compact: true }) : (v: number) => String(Math.round(v)));
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(240, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const padL = 52, padR = 12, padT = 8, padB = 26;
  const innerW = width - padL - padR, innerH = height - padT - padB;
  const max = useMemo(() => niceMax(Math.max(0, ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0)))), [data, series]);
  const x = (i: number) => padL + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / max) * innerH;
  const ticks = [0, max / 2, max];
  const every = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(innerW / 64))));

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const i = Math.round(((px - padL) / innerW) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  return (
    <div ref={ref} className="relative w-full">
      <svg width={width} height={height} role="img" aria-label={label} onMouseMove={onMove} onMouseLeave={() => setHover(null)} className="block">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={width - padR} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" strokeWidth={1} />
            <text x={padL - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--text-muted)" style={{ fontVariantNumeric: "tabular-nums" }}>{formatValue(t)}</text>
          </g>
        ))}
        {data.map((d, i) => (i % every === 0 || i === data.length - 1) && (
          <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fontSize={11} fill="var(--text-muted)">{String(d[xKey])}</text>
        ))}
        {series.map((s) => {
          const pts = data.map((d, i) => [x(i), y(Number(d[s.key]) || 0)] as const);
          const line = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
          return (
            <g key={s.key}>
              {s.area && pts.length > 1 && <path d={`${line} L${pts[pts.length - 1][0]} ${y(0)} L${pts[0][0]} ${y(0)}Z`} fill="var(--chart-area)" />}
              <path d={line} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? "4 4" : undefined} />
            </g>
          );
        })}
        {hover != null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + innerH} stroke="var(--border-strong)" strokeWidth={1} />
            {series.map((s) => <circle key={s.key} cx={x(hover)} cy={y(Number(data[hover][s.key]) || 0)} r={4} fill={s.color} stroke="var(--bg-page)" strokeWidth={2} />)}
          </g>
        )}
      </svg>
      {hover != null && (
        <div
          className="ds-portal pointer-events-none absolute top-0 z-10 min-w-36 rounded-[var(--radius-md)] bg-[var(--bg-surface)] px-3 py-2 shadow-[var(--shadow-flyout)]"
          style={{ left: Math.min(width - 160, Math.max(0, x(hover) + 12)) }}
        >
          <p className="ds-t-meta-strong mb-1 text-[var(--text-primary)]">{String(data[hover][xKey])}</p>
          {series.map((s) => (
            <p key={s.key} className="ds-t-meta flex items-center justify-between gap-4 text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-[var(--radius-full)]" style={{ background: s.color }} />{s.label}</span>
              <span className="ds-num text-[var(--text-primary)]">{formatValue(Number(data[hover][s.key]) || 0)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Segmented bar (part-to-whole / pipeline) ─────────────────────── */

export interface Segment { label: string; value: ReactNode; weight: number; color: string; href?: string }

export function SegmentedBar({ segments, label }: { segments: Segment[]; label: string }) {
  const total = segments.reduce((s, x) => s + Math.max(0, x.weight), 0) || 1;
  return (
    <div>
      <div role="img" aria-label={label} className="flex h-2.5 gap-0.5 overflow-hidden rounded-[var(--radius-full)]">
        {segments.map((s) => <div key={s.label} style={{ flexGrow: Math.max(0.02, s.weight / total), background: s.color }} />)}
      </div>
      <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))` }}>
        {segments.map((s) => {
          const inner = (
            <>
              <span className="ds-t-meta flex items-center gap-1.5 text-[var(--text-muted)]">
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-[var(--radius-full)]" style={{ background: s.color }} />
                <span className="truncate">{s.label}</span>
              </span>
              <span className="ds-t-title-md ds-num mt-1 block truncate text-[var(--text-primary)]">{s.value}</span>
            </>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="ds-focus -m-2 block min-w-0 rounded-[var(--radius-md)] p-2 transition-colors hover:bg-[var(--bg-canvas)]">{inner}</Link>
          ) : (
            <div key={s.label} className="min-w-0">{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Action list ("needs you") ────────────────────────────────────── */

export interface ActionItem { id: string; label: ReactNode; meta?: ReactNode; href: string; tone?: "neutral" | "danger" | "warning" | "success" }

const metaTone = { neutral: "text-[var(--text-muted)]", danger: "text-[var(--danger)]", warning: "text-[var(--warning)]", success: "text-[var(--success)]" };

/** One-line actionable rows on quiet tiles. */
export function ActionList({ items, label }: { items: ActionItem[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-col gap-1">
      {items.map((it) => (
        <li key={it.id}>
          <Link href={it.href} className="ds-focus group flex h-11 items-center gap-3 rounded-[var(--radius-md)] bg-[var(--bg-canvas)] px-3 transition-colors hover:bg-[var(--bg-hover)]">
            <span className="ds-t-body-strong min-w-0 flex-1 truncate text-[var(--text-primary)]">{it.label}</span>
            {it.meta && <span className={cn("ds-t-meta-strong ds-num shrink-0", metaTone[it.tone ?? "neutral"])}>{it.meta}</span>}
            <ArrowRight size={14} strokeWidth={1.5} aria-hidden className="shrink-0 text-[var(--text-disabled)] transition-colors group-hover:text-[var(--text-primary)]" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ── Compact feed ("recent") ──────────────────────────────────────── */

export function CompactFeed({ items, label }: { items: { id: string; label: ReactNode; time: ReactNode }[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-col">
      {items.map((it) => (
        <li key={it.id} className="flex items-baseline justify-between gap-4 border-b border-[var(--border)] py-2.5 last:border-b-0">
          <span className="ds-t-body min-w-0 truncate text-[var(--text-primary)]">{it.label}</span>
          <span className="ds-t-meta ds-num shrink-0 text-[var(--text-muted)]">{it.time}</span>
        </li>
      ))}
    </ul>
  );
}
