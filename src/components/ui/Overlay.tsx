"use client";
import { ReactNode } from "react";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverlayBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Right-aligned actions row, e.g. Cancel + Save. */
  footer?: ReactNode;
}

function Header({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
      <div className="min-w-0">
        <D.Title className="ds-t-title-sm text-[var(--text-primary)]">{title}</D.Title>
        {description ? <D.Description className="ds-t-meta mt-0.5 text-[var(--text-muted)]">{description}</D.Description> : <D.Description className="sr-only">{typeof title === "string" ? title : "Dialog"}</D.Description>}
      </div>
      <D.Close aria-label="Close" className="ds-focus -mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]">
        <X size={16} strokeWidth={1.5} />
      </D.Close>
    </div>
  );
}

function Footer({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] px-4 py-3">{children}</div>;
}

const modalWidth = { sm: "max-w-[400px]", md: "max-w-[560px]", lg: "max-w-[720px]" };

export function Modal({ open, onOpenChange, title, description, children, footer, size = "md" }: OverlayBaseProps & { size?: keyof typeof modalWidth }) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="ds-portal fixed inset-0 z-[450] bg-[var(--overlay)]" />
        <D.Content className={cn("ds-portal fixed left-1/2 top-[12vh] z-[460] flex max-h-[76vh] w-[calc(100vw-32px)] -translate-x-1/2 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-modal)] outline-none", modalWidth[size])}>
          <Header title={title} description={description} />
          <div className="ds-t-body flex-1 overflow-y-auto p-4 text-[var(--text-secondary)]">{children}</div>
          <Footer>{footer}</Footer>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

const drawerWidth = { md: "w-[400px]", lg: "w-[560px]" };

export function Drawer({ open, onOpenChange, title, description, children, footer, size = "md" }: OverlayBaseProps & { size?: keyof typeof drawerWidth }) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="ds-portal fixed inset-0 z-[450] bg-[var(--overlay)]" />
        <D.Content className={cn("ds-portal fixed bottom-0 right-0 top-0 z-[460] flex max-w-[100vw] flex-col border-l border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-modal)] outline-none", drawerWidth[size])}>
          <Header title={title} description={description} />
          <div className="ds-t-body flex-1 overflow-y-auto p-4 text-[var(--text-secondary)]">{children}</div>
          <Footer>{footer}</Footer>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
