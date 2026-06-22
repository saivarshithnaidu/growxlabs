"use client";

import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3, Users, Target, Inbox, Terminal,
  FileText, Zap, ShieldCheck, Rocket, FileCheck, LogOut, PanelLeftClose, PanelLeft,
  GraduationCap, BookOpen, Award, CreditCard, ClipboardList, PenTool,
  TicketPercent, ListOrdered, Database, UserCog, Settings, Menu, X, Gamepad2
} from "lucide-react";

const InstagramNavIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

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
  { name: "Carousel Creator", href: "/admin/instagram-carousel", icon: InstagramNavIcon },
  { name: "Wish Game", href: "/admin/wish-game", icon: Gamepad2 },
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
    const isWishAdmin = item.href === "/wish-admin";
    const isActive = isWishAdmin ? pathname.includes("/wish-admin") : pathname === item.href;
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
          "flex items-center h-9 px-3 rounded-md transition-all duration-200 group relative border border-transparent",
          isActive
            ? "bg-white text-neutral-900 border-[#e6e6e6] shadow-sm font-semibold"
            : "text-[#615d59] hover:text-neutral-900 hover:bg-[#e6e6e6]/50",
          isCollapsed && "lg:justify-center lg:px-0"
        )}
      >
        <item.icon className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-[#0075de]" : "text-[#615d59] group-hover:text-neutral-950",
          !isCollapsed && "mr-3"
        )} />
        {/* Always show labels on mobile drawer, conditionally on desktop */}
        <span className={cn(
          "text-[13px] font-medium tracking-tight",
          isCollapsed ? "lg:hidden" : ""
        )}>{item.name}</span>
        {isActive && (
          <div className={cn(
            "absolute bg-[#0075de] rounded-r-sm left-0 top-1/2 -translate-y-1/2 w-[3px] h-4",
            isCollapsed ? "lg:h-4 lg:w-1" : ""
          )} />
        )}
      </Link>
    );
  };

  // Shared sidebar content (used in both desktop fixed sidebar and mobile drawer)
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar bg-[#f6f5f4]">
      
      {/* Branding Header */}
      <div className={cn(
          "p-6 border-b border-[#e6e6e6] transition-all duration-500 bg-white/40", 
          isCollapsed ? "lg:px-0 lg:flex lg:justify-center px-6" : "px-6"
      )}>
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#f6f5f4] rounded-md border border-[#e6e6e6] flex items-center justify-center shrink-0">
               <ShieldCheck className="text-[#0075de] h-4 w-4" />
            </div>
            <div className={cn(
              "flex flex-col overflow-hidden whitespace-nowrap",
              isCollapsed ? "lg:hidden" : ""
            )}>
                 <span className="text-sm font-bold tracking-tight text-neutral-900 leading-none">GrowX<span className="text-[#0075de]">Labs</span></span>
                 <span className="text-[8px] font-bold text-[#a39e98] uppercase tracking-[0.15em] mt-1">Admin Central</span>
            </div>
         </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 mt-4 px-3">
        <div className="flex flex-col space-y-1 mb-8">
          <p className={cn(
            "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mb-3 px-3",
            isCollapsed ? "lg:hidden" : ""
          )}>Core Systems</p>
          {filteredNavItems.map(renderLink)}

          {!isCrmAgent && (
            <>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mt-6 mb-3 px-3",
                isCollapsed ? "lg:hidden" : ""
              )}>Academy Suite</p>
              {academyItems.map(renderLink)}

              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mt-6 mb-3 px-3",
                isCollapsed ? "lg:hidden" : ""
              )}>Revenue</p>
              {monetizationItems.map(renderLink)}

              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mt-6 mb-3 px-3",
                isCollapsed ? "lg:hidden" : ""
              )}>Financials</p>
              {financialItems.map(renderLink)}
              
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mt-6 mb-3 px-3",
                isCollapsed ? "lg:hidden" : ""
              )}>Templates</p>
              {templateItems.map(renderLink)}
            </>
          )}
        </div>
      </div>

      {/* Footer Area */}
      <div className={cn("mt-auto py-4 border-t border-[#e6e6e6] bg-white/40", isCollapsed ? "lg:px-2 px-4" : "px-4")}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "w-full flex items-center h-8 px-3 rounded-md text-[#615d59] hover:text-red-500 hover:bg-red-500/5 transition-all group text-left",
            isCollapsed && "lg:justify-center lg:px-0"
          )}
        >
          <LogOut className={cn("h-4 w-4 shrink-0 transition-colors group-hover:text-red-500", !isCollapsed && "mr-2")} />
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            isCollapsed ? "lg:hidden" : ""
          )}>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ═══ MOBILE TOP BAR ═══ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[250] h-14 bg-white border-b border-[#e6e6e6] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#f6f5f4] rounded-md border border-[#e6e6e6] flex items-center justify-center shrink-0">
            <ShieldCheck className="text-[#0075de] h-4 w-4" />
          </div>
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            <span className="text-sm font-bold tracking-tight text-neutral-900 leading-none">GrowXLabsTech</span>
            <span className="text-[8px] font-bold text-[#a39e98] uppercase tracking-[0.15em] mt-1">Admin</span>
          </div>
        </div>
        <button
          onClick={onMobileToggle}
          className="h-9 w-9 rounded-md bg-white border border-[#e6e6e6] flex items-center justify-center text-neutral-800 hover:bg-[#f6f5f4] transition-all"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* ═══ MOBILE DRAWER OVERLAY ═══ */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[290]"
          onClick={onMobileToggle}
        />
      )}

      {/* ═══ MOBILE DRAWER SIDEBAR ═══ */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-screen w-72 bg-[#f6f5f4] border-r border-[#e6e6e6] z-[300] transition-transform duration-300 ease-in-out overflow-visible",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button inside drawer */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onMobileToggle}
            className="h-8 w-8 rounded-lg bg-white border border-[#e6e6e6] flex items-center justify-center text-[#615d59] hover:text-neutral-900 hover:bg-[#f6f5f4] transition-all"
          >
            <X size={16} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* ═══ DESKTOP FIXED SIDEBAR (hidden on mobile) ═══ */}
      <aside 
        className={cn(
          "hidden lg:flex h-screen border-r border-[#e6e6e6] bg-[#f6f5f4] flex-col fixed left-0 top-0 overflow-visible transition-all duration-500 ease-in-out z-[200]",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}

        {/* Toggle Control */}
        <button 
          onClick={onToggle}
          className="absolute top-10 -right-3 h-6 w-6 rounded-full bg-white text-neutral-600 flex items-center justify-center border border-[#e6e6e6] z-[210] shadow-sm hover:bg-[#f6f5f4] hover:text-neutral-900 active:scale-95 transition-all duration-200"
        >
          {isCollapsed ? <PanelLeft size={12} /> : <PanelLeftClose size={12} />}
        </button>
      </aside>
    </>
  );
}
