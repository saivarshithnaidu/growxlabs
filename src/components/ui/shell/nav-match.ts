import type { ComponentType } from "react";

export type NavIcon = ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>;
export type NavItemConfig = { label: string; href: string; icon: NavIcon; count?: number };
export type NavGroupConfig = { label: string; items: NavItemConfig[] };
export type NavModuleConfig = { id: string; label: string; icon: NavIcon; href: string; groups: NavGroupConfig[] };

export type ActiveNav = { module: NavModuleConfig; item: NavItemConfig | null };

function matches(path: string, href: string, exact: boolean) {
  if (exact) return path === href || path === href + "/";
  return path === href || path.startsWith(href + "/");
}

/**
 * Longest-prefix match over every item (and module href): at most one item is active.
 * `exactHrefs` lists hrefs that only match exactly (e.g. a root like "/admin").
 */
export function findActiveNav(modules: NavModuleConfig[], pathname: string, exactHrefs: string[] = []): ActiveNav {
  let mod: NavModuleConfig | null = null;
  let item: NavItemConfig | null = null;
  let best = -1;
  for (const m of modules) {
    for (const g of m.groups) {
      for (const i of g.items) {
        if (matches(pathname, i.href, exactHrefs.includes(i.href)) && i.href.length > best) {
          mod = m; item = i; best = i.href.length;
        }
      }
    }
    if (matches(pathname, m.href, exactHrefs.includes(m.href)) && m.href.length > best) {
      mod = m; item = null; best = m.href.length;
    }
  }
  return { module: mod || modules[0], item };
}
