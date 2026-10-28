"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type AvatarSize = 20 | 24 | 28 | 32 | 40;
const sizeClass: Record<AvatarSize, string> = { 20: "h-5 w-5", 24: "h-6 w-6", 28: "h-7 w-7", 32: "h-8 w-8", 40: "h-10 w-10" };
const textClass: Record<AvatarSize, string> = { 20: "ds-t-caption", 24: "ds-t-caption", 28: "ds-t-caption", 32: "ds-t-meta-strong", 40: "ds-t-body-strong" };

export function initials(name: string) {
  return name.trim().split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "?";
}

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ name, src, size = 28, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className={cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]", sizeClass[size], className)}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden className={textClass[size]}>{initials(name)}</span>
      )}
    </span>
  );
}

export interface AvatarGroupProps {
  people: { name: string; src?: string | null }[];
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ people, max = 4, size = 24 }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <span className="inline-flex items-center" aria-label={`${people.length} people`} role="group">
      {shown.map((p, i) => (
        <Avatar key={p.name + i} name={p.name} src={p.src} size={size} className={cn("ring-2 ring-[var(--bg-surface)]", i > 0 && "-ml-1.5")} />
      ))}
      {rest > 0 && (
        <span className={cn("ds-t-caption -ml-1.5 inline-flex items-center justify-center rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] ring-2 ring-[var(--bg-surface)]", sizeClass[size])} title={people.slice(max).map((p) => p.name).join(", ")}>
          +{rest}
        </span>
      )}
    </span>
  );
}

const TINTS = 6;
function tintIndex(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return (h % TINTS) + 1;
}

export interface MonogramProps {
  name: string;
  size?: 24 | 28 | 32 | 40;
  className?: string;
}

/** Square company mark: initials on a soft tint chosen from the name (stable per company). */
export function Monogram({ name, size = 28, className }: MonogramProps) {
  const t = tintIndex(name || "?");
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center rounded-[var(--radius-md)]", sizeClass[size], size >= 32 ? "ds-t-meta-strong" : "ds-t-caption", className)}
      style={{ background: `var(--tint-${t}-bg)`, color: `var(--tint-${t}-fg)` }}
    >
      {initials(name || "?")}
    </span>
  );
}
