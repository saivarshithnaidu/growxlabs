"use client";

import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import {
  BarChart3, Users, Target, Inbox,
  FileText, Zap, ShieldCheck, Rocket, FileCheck, LogOut, PanelLeftClose, PanelLeft,
  GraduationCap, BookOpen, Award, CreditCard, ClipboardList, PenTool,
  TicketPercent, ListOrdered
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: BarChart3 },
  { name: "Leads", href: "/admin/leads", icon: Target },
  { name: "Scraper", href: "/admin/leads/scrape", icon: Zap },
  { name: "Apollo Leads", href: "/admin/apollo", icon: Rocket },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Outreach", href: "/admin/outreach", icon: Inbox },
  { name: "Onboarding", href: "/admin/onboarding", icon: Rocket },
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
}

export function AdminNav({ isCollapsed, onToggle }: AdminNavProps) {
  const pathname = usePathname();

  const renderLink = (item: any) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        title={isCollapsed ? item.name : ""}
        className={cn(
          "flex items-center h-10 px-4 rounded-xl transition-all duration-300 group relative",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-[var(--text-tertiary)] hover:text-white hover:bg-white/[0.04]",
          isCollapsed && "justify-center px-0"
        )}
      >
        <item.icon className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-[var(--text-muted)] group-hover:text-white",
          !isCollapsed && "mr-3"
        )} />
        {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">{item.name}</span>}
        {isActive && (
          <div className={cn(
            "absolute bg-primary rounded-full shadow-[0_0_8px_rgba(0,168,107,0.5)]",
            isCollapsed ? "right-1 top-1/2 -translate-y-1/2 w-1 h-4" : "left-0 top-1/2 -translate-y-1/2 w-0.5 h-5"
          )} />
        )}
      </Link>
    );
  };

  return (
    <aside 
      className={cn(
        "h-screen border-r border-[var(--border-subtle)] bg-[var(--surface-1)] flex flex-col fixed left-0 top-0 overflow-visible transition-all duration-500 ease-in-out z-[200]",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar">
        
        {/* Branding Header */}
        <div className={cn(
            "p-8 transition-all duration-500", 
            isCollapsed ? "px-0 flex justify-center" : "px-8"
        )}>
           <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <ShieldCheck className="text-white h-5 w-5" />
              </div>
              {!isCollapsed && (
                  <div className="flex flex-col overflow-hidden whitespace-nowrap">
                      <span className="text-lg font-bold tracking-tighter text-white leading-none">GrowX Labs</span>
                      <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1.5">Admin Central</span>
                  </div>
              )}
           </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 mt-4 px-3">
          <div className="flex flex-col space-y-1 mb-8">
            {!isCollapsed && <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 px-4">Core Systems</p>}
            {navItems.map(renderLink)}

            {!isCollapsed && <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mt-8 mb-4 px-4">Academy Suite</p>}
            {academyItems.map(renderLink)}

            {!isCollapsed && <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mt-8 mb-4 px-4">Revenue</p>}
            {monetizationItems.map(renderLink)}

            {!isCollapsed && <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mt-8 mb-4 px-4">Financials</p>}
            {financialItems.map(renderLink)}
            
            {!isCollapsed && <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mt-8 mb-4 px-4">Templates</p>}
            {templateItems.map(renderLink)}
          </div>
        </div>

        {/* Footer Area */}
        <div className={cn("mt-auto py-6 border-t border-[var(--border-subtle)]", isCollapsed ? "px-3" : "px-6")}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "w-full flex items-center h-10 px-4 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 transition-all group",
              isCollapsed && "justify-center px-0"
            )}
          >
            <LogOut className={cn("h-4 w-4 shrink-0 transition-colors group-hover:text-red-400", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span className="text-[11px] font-bold uppercase tracking-widest">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Toggle Control */}
      <button 
        onClick={onToggle}
        className="absolute top-10 -right-4 h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center border border-primary/40 z-[210] shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
      </button>
    </aside>
  );
}
