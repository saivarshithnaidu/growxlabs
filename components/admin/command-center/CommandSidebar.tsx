"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { PanelLeftClose, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "./command-center.types";

interface Props {
  open: boolean;
  conversations: ConversationSummary[];
  activeId: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  onNew: () => void;
}

// Chat titles are the first words of the first message; show them as a sentence.
const titleCase = (title: string) => (title ? title.charAt(0).toUpperCase() + title.slice(1) : "Untitled");

const iconButton =
  "ds-focus grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)]";

export function CommandSidebar({ open, conversations, activeId, onClose, onSelect, onNew }: Props) {
  const { data: session } = useSession();
  const name = session?.user?.name || session?.user?.email || "You";

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[var(--overlay)] md:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-surface)] md:static md:z-auto",
          open ? "translate-x-0" : "-translate-x-full md:hidden"
        )}
        aria-label="Conversations"
      >
        <div className="flex h-14 items-center justify-between gap-2 px-3">
          <Link href="/admin" title="Back to admin" className="ds-focus flex items-center gap-2 rounded-[var(--radius-sm)] px-1 py-1 focus-visible:shadow-[var(--focus-ring)]">
            <span className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-[var(--bg-inverse)] text-[13px] font-semibold text-[var(--text-inverse)]">G</span>
            <span className="ds-t-body-strong text-[var(--text-primary)]">GrowX</span>
          </Link>
          <button type="button" onClick={onClose} aria-label="Collapse sidebar" title="Collapse sidebar" className={iconButton}>
            <PanelLeftClose size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={onNew}
            className="ds-focus ds-t-body-strong flex h-9 w-full items-center gap-2 rounded-[var(--radius-md)] px-2.5 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)]"
          >
            <Plus size={16} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            New conversation
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 custom-scrollbar" aria-label="Recent conversations">
          {conversations.length > 0 && (
            <ul className="flex flex-col gap-0.5">
              {conversations.map((c) => {
                const active = activeId === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      aria-current={active ? "page" : undefined}
                      title={titleCase(c.title)}
                      className={cn(
                        "ds-focus ds-t-body block w-full truncate rounded-[var(--radius-sm)] px-2.5 py-1.5 text-left focus-visible:shadow-[var(--focus-ring)]",
                        active
                          ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] active:bg-[var(--bg-active)]"
                      )}
                    >
                      {titleCase(c.title)}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] px-3 py-2.5">
          <span className="flex min-w-0 items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-[var(--radius-full)] bg-[var(--bg-active)] text-[12px] font-semibold text-[var(--text-primary)]">
              {name.charAt(0).toUpperCase()}
            </span>
            <span className="ds-t-body truncate text-[var(--text-primary)]">{name}</span>
          </span>
          <Link href="/admin/settings" aria-label="Settings" title="Settings" className={iconButton}>
            <Settings size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </aside>
    </>
  );
}
