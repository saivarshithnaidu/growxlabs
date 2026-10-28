"use client";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { PanelLeft, Search } from "lucide-react";
import { Flyout, NavGroup, NavItem, NavRail, NavRailButton, NavRailItem, SectionPanel, TOP_HEIGHT } from "./Nav";
import { CommandItem, CommandPalette, UserMenu, UserMenuProps } from "./Menus";
import { findActiveNav, NavItemConfig, NavModuleConfig } from "./nav-match";
import { IconButton } from "../Button";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  modules: NavModuleConfig[];
  /** Current path with any locale prefix already stripped. */
  pathname: string;
  /** Hrefs that only match exactly (e.g. the "/admin" root). */
  exactHrefs?: string[];
  logo: ReactNode;
  user: UserMenuProps;
  /** Defaults to every nav item. */
  commandItems?: CommandItem[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Global keyboard shortcuts (⌘K, /, [). Turn off when nesting a shell, e.g. in a preview. */
  shortcuts?: boolean;
  /** Fill the parent instead of the viewport. */
  embedded?: boolean;
  children: ReactNode;
}

function ModuleNav({ module, activeItem }: { module: NavModuleConfig; activeItem: NavItemConfig | null }) {
  return (
    <>
      {module.groups.map((g, gi) => (
        <NavGroup key={g.label + gi} label={g.label} first={gi === 0}>
          {g.items.map((it) => <NavItem key={it.href} label={it.label} href={it.href} icon={it.icon} count={it.count} active={it === activeItem} />)}
        </NavGroup>
      ))}
    </>
  );
}

/**
 * Rail (56) + section panel (232) + content. Keyboard: ⌘K / Ctrl+K or "/" opens the palette,
 * "[" toggles the panel. When collapsed, hovering a rail item opens a flyout.
 */
export function AppShell({ modules, pathname, exactHrefs, logo, user, commandItems, collapsed: collapsedProp, onCollapsedChange, shortcuts = true, embedded = false, children }: AppShellProps) {
  const [innerCollapsed, setInnerCollapsed] = useState(false);
  const collapsed = collapsedProp ?? innerCollapsed;
  const toggle = () => (onCollapsedChange ? onCollapsedChange(!collapsed) : setInnerCollapsed(!collapsed));
  const [palette, setPalette] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { module: activeModule, item: activeItem } = useMemo(() => findActiveNav(modules, pathname, exactHrefs), [modules, pathname, exactHrefs]);
  const items = useMemo<CommandItem[]>(
    () => commandItems ?? modules.flatMap((m) => m.groups.flatMap((g) => g.items.map((i) => ({ id: m.id + i.href, label: i.label, group: m.label, icon: i.icon, hint: g.label.toLowerCase(), href: i.href })))),
    [commandItems, modules],
  );

  useEffect(() => {
    if (!shortcuts) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setPalette(true); }
      else if (e.key === "/" && !typing) { e.preventDefault(); setPalette(true); }
      else if (e.key === "[" && !typing) { e.preventDefault(); toggle(); }
      else if (e.key === "Escape") setHoverId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const openFlyout = (id: string) => { clearTimeout(closeTimer.current); clearTimeout(openTimer.current); openTimer.current = setTimeout(() => setHoverId(id), 120); };
  const closeFlyout = () => { clearTimeout(openTimer.current); closeTimer.current = setTimeout(() => setHoverId(null), 200); };
  const flyoutIndex = hoverId ? modules.findIndex((m) => m.id === hoverId) : -1;
  const flyoutModule = flyoutIndex >= 0 ? modules[flyoutIndex] : null;

  return (
    <div className={cn("ds-shell flex w-full overflow-hidden bg-[var(--bg-page)]", embedded ? "h-full" : "h-screen")}>
      <NavRail
        logo={logo}
        footer={
          <>
            <NavRailButton label="Search ⌘K" icon={Search} onClick={() => setPalette(true)} />
            <UserMenu {...user} />
          </>
        }
      >
        {modules.map((m) => (
          <NavRailItem
            key={m.id}
            label={m.label}
            icon={m.icon}
            href={m.href}
            active={m.id === activeModule.id}
            onMouseEnter={collapsed ? () => openFlyout(m.id) : undefined}
            onMouseLeave={collapsed ? closeFlyout : undefined}
          />
        ))}
      </NavRail>

      {!collapsed && (
        <SectionPanel title={activeModule.label} onCollapse={toggle}>
          <ModuleNav module={activeModule} activeItem={activeItem} />
        </SectionPanel>
      )}

      {collapsed && flyoutModule && (
        <Flyout title={flyoutModule.label} top={TOP_HEIGHT + 8 + flyoutIndex * 44} onMouseEnter={() => clearTimeout(closeTimer.current)} onMouseLeave={closeFlyout}>
          <ModuleNav module={flyoutModule} activeItem={activeItem} />
        </Flyout>
      )}

      <main className="relative h-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg-page)]">
        {collapsed && (
          <div className="absolute left-3 top-3 z-20">
            <IconButton label="Expand panel" variant="secondary" size={28} icon={<PanelLeft size={16} strokeWidth={1.5} />} onClick={toggle} />
          </div>
        )}
        <div className="p-6 print:p-0">{children}</div>
      </main>

      <CommandPalette open={palette} onOpenChange={setPalette} items={items} />
    </div>
  );
}
