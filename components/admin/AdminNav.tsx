"use client";

import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3, Users, Target, Inbox, Terminal,
  FileText, Zap, ShieldCheck, Rocket, FileCheck, LogOut, PanelLeftClose, PanelLeft,
  GraduationCap, BookOpen, Award, CreditCard, ClipboardList, PenTool,
  TicketPercent, ListOrdered, Database, UserCog, Settings, Menu, X
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: BarChart3 },
  { name: "Command Center", href: "/admin/command-center", icon: Terminal },
  { name: "CRM", href: "/admin/crm", icon: Database },
  { name: "Team", href: "/admin/team", icon: UserCog },
  { name: "Leads", href: "/admin/leads", icon: Target },
  { name: "Scraper", href: "/admin/leads/scrape", icon: Zap },
  { name: "Apollo Leads", href: "/admin/apollo", icon: Rocket },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Outreach", href: "/admin/outreach", icon: Inbox },
  { name: "Onboarding", href: "/admin/onboarding", icon: Rocket },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const academyItems = [
  { name: "Courses", href: "/admin/academy/courses", icon: BookOpen },
  { name: "Assessments", href: "/admin/academy/assessments", icon: PenTool },
  { name: "Students & Progress", href: "/admin/academy/users", icon: GraduationCap },
  { name: "Certificates", href: "/admin/academy/certificates", icon: Award },
];

const monetizationItems = [
  { name: "Coupons", href: "/admin/monetization/coupons", icon: TicketPercent },
  { name: "Order Logs", href: "/admin/monetization/orders", icon: ListOrdered },
  { name: "Revenue Tracking", href: "/admin/academy/payments", icon: CreditCard },
];

const financialItems = [
  { name: "Invoices", href: "/admin/invoices", icon: ClipboardList },
  { name: "Agreements", href: "/admin/agreements", icon: FileText },
  { name: "Proposals", href: "/admin/proposals", icon: FileCheck },
];

const templateItems = [
  { name: "Agreement Preview", href: "/admin/agreements/preview", icon: ShieldCheck },
  { name: "Invoice Preview", href: "/admin/invoices/preview", icon: BarChart3 },
  { name: "Onboarding Preview", href: "/admin/onboarding/preview", icon: Rocket },
];

interface AdminNavProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export function AdminNav({ isCollapsed, onToggle, isMobileOpen, onMobileToggle }: AdminNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isCrmAgent = role === "crm_agent";

  const filteredNavItems = isCrmAgent 
    ? navItems.filter(i => ["CRM", "Leads", "Outreach"].includes(i.name)).map(i => i.name === "CRM" ? { ...i, href: "/admin/leads" } : i)
    : navItems;

  const renderLink = (item: any) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        title={isCollapsed ? item.name : ""}
        onClick={() => {
          // Close mobile drawer on navigation
          if (isMobileOpen) onMobileToggle();
        }}
        className={cn(
          "flex items-center h-10 px-4 rounded-xl transition-all duration-300 group relative border border-transparent",
          isActive
            ? "bg-white/[0.04] text-white border-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            : "text-[#9CA3AF] hover:text-white hover:bg-white/[0.02]",
          isCollapsed && "lg:justify-center lg:px-0"
        )}
      >
        <item.icon className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-[#355CFF]" : "text-[#6B7280] group-hover:text-white",
          !isCollapsed && "mr-3"
        )} />
        {/* Always show labels on mobile drawer, conditionally on desktop */}
        <span className={cn(
          "text-[13px] font-medium tracking-tight",
          isCollapsed ? "lg:hidden" : ""
        )}>{item.name}</span>
        {isActive && (
          <div className={cn(
            "absolute bg-[#355CFF] rounded-r-md shadow-[0_0_12px_rgba(53,92,255,0.8)]",
            isCollapsed ? "lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-1 lg:h-5 left-0 top-1/2 -translate-y-1/2 w-0.5 h-5" : "left-0 top-1/2 -translate-y-1/2 w-[3px] h-5"
          )} />
        )}
      </Link>
    );
  };

  // Shared sidebar content (used in both desktop fixed sidebar and mobile drawer)
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar">
      
      {/* Branding Header */}
      <div className={cn(
          "p-8 transition-all duration-500", 
          isCollapsed ? "lg:px-0 lg:flex lg:justify-center px-8" : "px-8"
      )}>
         <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-[#355CFF] to-[#1E3BB3] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(53,92,255,0.35)] border border-[#355CFF]/30">
              <ShieldCheck className="text-white h-5 w-5" />
            </div>
            <div className={cn(
              "flex flex-col overflow-hidden whitespace-nowrap",
              isCollapsed ? "lg:hidden" : ""
            )}>
                <span className="text-lg font-black tracking-[-0.04em] text-white leading-none">GrowX<span className="text-[#355CFF]">Labs</span></span>
                <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-[0.25em] mt-1.5">Admin Central</span>
            </div>
         </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 mt-4 px-3">
        <div className="flex flex-col space-y-1 mb-8">
          <p className={cn(
            "text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 px-4",
            isCollapsed ? "lg:hidden" : ""
          )}>Core Systems</p>
          {filteredNavItems.map(renderLink)}

          {!isCrmAgent && (
            <>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mt-8 mb-4 px-4",
                isCollapsed ? "lg:hidden" : ""
              )}>Academy Suite</p>
              {academyItems.map(renderLink)}

              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mt-8 mb-4 px-4",
                isCollapsed ? "lg:hidden" : ""
              )}>Revenue</p>
              {monetizationItems.map(renderLink)}

              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mt-8 mb-4 px-4",
                isCollapsed ? "lg:hidden" : ""
              )}>Financials</p>
              {financialItems.map(renderLink)}
              
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mt-8 mb-4 px-4",
                isCollapsed ? "lg:hidden" : ""
              )}>Templates</p>
              {templateItems.map(renderLink)}
            </>
          )}
        </div>
      </div>

      {/* Footer Area */}
      <div className={cn("mt-auto py-6 border-t border-[var(--border-subtle)]", isCollapsed ? "lg:px-3 px-6" : "px-6")}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "w-full flex items-center h-10 px-4 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 transition-all group",
            isCollapsed && "lg:justify-center lg:px-0"
          )}
        >
          <LogOut className={cn("h-4 w-4 shrink-0 transition-colors group-hover:text-red-400", !isCollapsed && "mr-3")} />
          <span className={cn(
            "text-[11px] font-bold uppercase tracking-widest",
            isCollapsed ? "lg:hidden" : ""
          )}>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ═══ MOBILE TOP BAR ═══ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[250] h-14 bg-[var(--surface-1)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <ShieldCheck className="text-white h-4 w-4" />
          </div>
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            <span className="text-sm font-bold tracking-tighter text-white leading-none">GrowXLabsTech</span>
            <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Admin</span>
          </div>
        </div>
        <button
          onClick={onMobileToggle}
          className="h-10 w-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] flex items-center justify-center text-white hover:bg-white/10 transition-all"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ═══ MOBILE DRAWER OVERLAY ═══ */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[290]"
          onClick={onMobileToggle}
        />
      )}

      {/* ═══ MOBILE DRAWER SIDEBAR ═══ */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-screen w-72 bg-[var(--surface-1)] border-r border-[var(--border-subtle)] z-[300] transition-transform duration-300 ease-in-out overflow-visible",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button inside drawer */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onMobileToggle}
            className="h-8 w-8 rounded-lg bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* ═══ DESKTOP FIXED SIDEBAR (hidden on mobile) ═══ */}
      <aside 
        className={cn(
          "hidden lg:flex h-screen border-r border-[var(--border-subtle)] bg-[var(--surface-1)] flex-col fixed left-0 top-0 overflow-visible transition-all duration-500 ease-in-out z-[200]",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}

        {/* Toggle Control */}
        <button 
          onClick={onToggle}
          className="absolute top-10 -right-4 h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center border border-primary/40 z-[210] shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </aside>
    </>
  );
}
