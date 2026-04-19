"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import {
  BarChart3, Users, Target, Inbox,
  FileText, Zap, ShieldCheck, Rocket, FileCheck, LogOut, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft
} from "lucide-react";

const navItems = [
  { name: "Leads", href: "/admin/leads", icon: Target },
  { name: "Scraper", href: "/admin/leads/scrape", icon: Zap },
  { name: "Apollo Leads", href: "/admin/apollo", icon: Rocket },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Outreach", href: "/admin/outreach", icon: Inbox },
  { name: "Invoices", href: "/admin/invoices", icon: BarChart3 },
  { name: "Agreements", href: "/admin/agreements", icon: FileText },
  { name: "Proposals", href: "/admin/proposals", icon: FileCheck },
];

const templateItems = [
  { name: "Agreement Preview", href: "/admin/agreements/preview", icon: ShieldCheck },
  { name: "Invoice Preview", href: "/admin/invoices/preview", icon: BarChart3 },
  { name: "Onboarding Preview", href: "/onboarding", icon: Rocket },
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
        "z-[200]" // High z-index to stay above everything
      )}
    >
      {/* 
          SCROLLABLE INNER WRAPPER 
          Note: overflow-y-auto is on this div so the toggle button stays visible outside it.
      */}
      <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* Branding Header */}
        <div className={cn(
            "p-8 transition-all duration-500", 
            isCollapsed ? "px-0 flex justify-center" : "px-8"
        )}>
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-white/5">
                <ShieldCheck className="text-black h-6 w-6" />
              </div>
              {!isCollapsed && (
                  <div className="flex flex-col overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                      <span className="text-xl font-bold tracking-tighter text-white leading-none">GrowX Labs</span>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1.5">Admin Central</span>
                  </div>
              )}
           </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 mt-4">
          <div className={cn("flex flex-col space-y-2 mb-10", isCollapsed ? "px-3" : "px-6")}>
            {!isCollapsed && (
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-5 px-4">Core Systems</p>
            )}
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center py-4 px-5 rounded-2xl transition-all duration-300 group relative",
                    isActive
                      ? "bg-white/10 text-white border-l-2 border-white shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                      : "text-white/40 hover:text-white hover:bg-white/[0.03]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-white/20 group-hover:text-white",
                    !isCollapsed && "mr-4"
                  )} />
                  {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">{item.name}</span>}
                  
                  {/* Active Indicator Dot for collapsed mode */}
                  {isCollapsed && isActive && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className={cn("flex flex-col space-y-2", isCollapsed ? "px-3" : "px-6")}>
            {!isCollapsed && (
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-5 px-4">Templates</p>
            )}
            {templateItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center py-4 px-5 rounded-2xl transition-all duration-300 group relative",
                    isActive
                        ? "bg-white/10 text-white border-l-2 border-white"
                        : "text-white/40 hover:text-white hover:bg-white/[0.03]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-white/20 group-hover:text-white",
                    !isCollapsed && "mr-4"
                  )} />
                  {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Area */}
        <div className={cn("mt-auto py-10 border-t border-white/5 bg-black/20", isCollapsed ? "px-3" : "px-6")}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "w-full flex items-center py-4 px-5 rounded-2xl text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all group",
              isCollapsed && "justify-center px-0"
            )}
          >
            <LogOut className={cn("h-4 w-4 shrink-0 text-white/10 group-hover:text-red-400 transition-colors", !isCollapsed && "mr-4")} />
            {!isCollapsed && <span className="text-xs font-black uppercase tracking-widest">Sign Out Hub</span>}
          </button>
        </div>
      </div>

      {/* 
          Stealth Toggle Control
          Floating outside the sidebars container boundary
      */}
      <button 
        onClick={onToggle}
        className="absolute top-10 -right-4 h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center border border-white/20 z-[210] shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
      </button>
    </aside>
  );
}
