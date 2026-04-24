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

  return (
    <aside 
      className={cn(
        "h-screen border-r border-white/10 bg-[#000000] flex flex-col fixed left-0 top-0 overflow-visible transition-all duration-500 ease-in-out shadow-2xl",
        isCollapsed ? "w-20" : "w-64",
        "z-[200]"
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* Branding Header */}
        <div className={cn(
            "p-8 transition-all duration-500", 
            isCollapsed ? "px-0 flex justify-center" : "px-8"
        )}>
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-[#00A86B] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#00A86B]/10">
                <ShieldCheck className="text-white h-6 w-6" />
              </div>
              {!isCollapsed && (
                  <div className="flex flex-col overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                      <span className="text-xl font-bold tracking-tighter text-white leading-none">GrowX Labs</span>
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1.5">Admin Central</span>
                  </div>
              )}
           </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 mt-4">
          <div className={cn("flex flex-col space-y-1 mb-10", isCollapsed ? "px-3" : "px-6")}>
            {!isCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-5 px-4">Core Systems</p>
            )}
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center h-11 px-4 rounded-xl transition-all duration-300 group relative",
                    isActive
                      ? "bg-[#00A86B]/10 text-[#00A86B] border-l-2 border-[#00A86B]"
                      : "text-white/40 hover:text-white hover:bg-white/[0.03]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-[#00A86B]" : "text-white/20 group-hover:text-white",
                    !isCollapsed && "mr-4"
                  )} />
                  {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">{item.name}</span>}
                  {isCollapsed && isActive && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#00A86B] rounded-full" />
                  )}
                </Link>
              );
            })}

            {!isCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-8 mb-5 px-4 animate-in fade-in duration-700">Academy Suite</p>
            )}
            {academyItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center h-11 px-4 rounded-xl transition-all duration-300 group relative",
                    isActive
                      ? "bg-[#00A86B]/10 text-[#00A86B] border-l-2 border-[#00A86B]"
                      : "text-white/40 hover:text-white hover:bg-white/[0.03]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-[#00A86B]" : "text-white/20 group-hover:text-white",
                    !isCollapsed && "mr-4"
                  )} />
                  {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">{item.name}</span>}
                  {isCollapsed && isActive && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#00A86B] rounded-full" />
                  )}
                </Link>
              );
            })}

            {!isCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-8 mb-5 px-4 animate-in fade-in duration-700">Revenue & Monetization</p>
            )}
            {monetizationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center h-11 px-4 rounded-xl transition-all duration-300 group relative",
                    isActive
                      ? "bg-[#00A86B]/10 text-[#00A86B] border-l-2 border-[#00A86B]"
                      : "text-white/40 hover:text-white hover:bg-white/[0.03]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-[#00A86B]" : "text-white/20 group-hover:text-white",
                    !isCollapsed && "mr-4"
                  )} />
                  {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">{item.name}</span>}
                  {isCollapsed && isActive && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#00A86B] rounded-full" />
                  )}
                </Link>
              );
            })}

            {!isCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-8 mb-5 px-4 animate-in fade-in duration-700">Financial Systems</p>
            )}
            {financialItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center h-11 px-4 rounded-xl transition-all duration-300 group relative",
                    isActive
                      ? "bg-[#00A86B]/10 text-[#00A86B] border-l-2 border-[#00A86B]"
                      : "text-white/40 hover:text-white hover:bg-white/[0.03]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-[#00A86B]" : "text-white/20 group-hover:text-white",
                    !isCollapsed && "mr-4"
                  )} />
                  {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">{item.name}</span>}
                  {isCollapsed && isActive && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#00A86B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className={cn("flex flex-col space-y-1", isCollapsed ? "px-3" : "px-6")}>
            {!isCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-5 px-4">Templates</p>
            )}
            {templateItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center h-11 px-4 rounded-xl transition-all duration-300 group relative",
                    isActive
                        ? "bg-[#00A86B]/10 text-[#00A86B] border-l-2 border-[#00A86B]"
                        : "text-white/40 hover:text-white hover:bg-white/[0.03]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-[#00A86B]" : "text-white/20 group-hover:text-white",
                    !isCollapsed && "mr-4"
                  )} />
                  {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Area */}
        <div className={cn("mt-auto py-8 border-t border-white/5", isCollapsed ? "px-3" : "px-6")}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "w-full flex items-center h-11 px-4 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all group",
              isCollapsed && "justify-center px-0"
            )}
          >
            <LogOut className={cn("h-4 w-4 shrink-0 text-white/10 group-hover:text-red-400 transition-colors", !isCollapsed && "mr-4")} />
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Toggle Control */}
      <button 
        onClick={onToggle}
        className="absolute top-10 -right-4 h-8 w-8 rounded-xl bg-[#00A86B] text-white flex items-center justify-center border border-[#00A86B]/40 z-[210] shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
      </button>
    </aside>
  );
}
