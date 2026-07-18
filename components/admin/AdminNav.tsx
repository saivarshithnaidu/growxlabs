"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/navigation-client";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  BarChart3, Users, Target, Inbox, Terminal,
  FileText, Zap, ShieldCheck, Rocket, FileCheck, LogOut, PanelLeftClose, PanelLeft,
  GraduationCap, BookOpen, Award, CreditCard, ClipboardList, PenTool,
  TicketPercent, ListOrdered, Database, UserCog, Settings, Menu, X, Gamepad2, Video, Mail, Presentation, UserCheck,
  KeyRound, Eye, EyeOff, Loader2, CheckCircle, Sun, Moon, Monitor
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
  { name: "GrowX Email", href: "/admin/growx-email", icon: Mail },
  { name: "Pitch Deck Gen", href: "/admin/pitch-deck", icon: Presentation },
  { name: "Onboarding", href: "/admin/onboarding", icon: Rocket },
  { name: "SDR Onboarding", href: "/admin/employee-onboarding", icon: UserCheck },
  { name: "Career Portal", href: "/admin/career-portal", icon: ClipboardList },
  { name: "Interviewer Playbook", href: "/admin/career-portal/playbook", icon: BookOpen },
  { name: "Carousel Creator", href: "/admin/instagram-carousel", icon: InstagramNavIcon },
  { name: "Reels Creator", href: "/admin/reels-creator", icon: Video },
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
  const allowedPaths = (session?.user as any)?.allowed_paths || [];
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && theme) {
      updateThemeClass(theme);
    }
  }, [mounted, theme]);

  console.log("[AdminNav] Render -> mounted:", mounted, "theme:", theme);

  const updateThemeClass = (newTheme: string) => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else if (newTheme === "light") {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        html.classList.add("dark");
        html.classList.remove("light");
      } else {
        html.classList.add("light");
        html.classList.remove("dark");
      }
    }
  };

  // Change Password state
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleChangePassword = async () => {
    setPwError("");
    if (!currentPw) { setPwError("Enter your current password."); return; }
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }
    setPwLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setPwSuccess(true);
      setTimeout(() => {
        setShowPwModal(false);
        setPwSuccess(false);
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      }, 1800);
    } catch (e: any) {
      setPwError(e.message);
    } finally {
      setPwLoading(false);
    }
  };

  const isPathAllowed = (itemHref: string) => {
    return allowedPaths.some((p: string) => {
      if (p === "/admin") {
        return itemHref === "/admin";
      }
      if (p === "/admin/leads/scrape") {
        return itemHref === "/admin/leads/scrape";
      }
      if (p === "/admin/leads") {
        return itemHref.startsWith("/admin/leads") && !itemHref.startsWith("/admin/leads/scrape");
      }
      return itemHref === p || itemHref.startsWith(p + "/");
    });
  };

  const filteredNavItems = isCrmAgent 
    ? navItems.filter(item => isPathAllowed(item.href))
    : navItems;

  const filteredAcademyItems = isCrmAgent
    ? academyItems.filter(item => isPathAllowed(item.href))
    : academyItems;

  const filteredMonetizationItems = isCrmAgent
    ? monetizationItems.filter(item => isPathAllowed(item.href))
    : monetizationItems;

  const filteredFinancialItems = isCrmAgent
    ? financialItems.filter(item => isPathAllowed(item.href))
    : financialItems;

  const filteredTemplateItems = isCrmAgent
    ? templateItems.filter(item => isPathAllowed(item.href))
    : templateItems;

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
            ? "bg-[var(--card)] text-[var(--text-primary)] border-[var(--border-subtle)] shadow-sm font-semibold"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/50",
          isCollapsed && "lg:justify-center lg:px-0"
        )}
      >
        <item.icon className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-[#0075de]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]",
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
    <div className="flex flex-col h-full overflow-hidden bg-[var(--surface-2)] text-[var(--text-primary)] transition-colors duration-300">
      
      {/* Branding Header */}
      <div className={cn(
          "p-6 border-b border-[var(--border-subtle)] transition-all duration-500 bg-[var(--card)]/30 shrink-0", 
          isCollapsed ? "lg:px-0 lg:flex lg:justify-center px-6" : "px-6"
      )}>
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[var(--surface-2)] rounded-md border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
               <ShieldCheck className="text-[#0075de] h-4 w-4" />
            </div>
            <div className={cn(
              "flex flex-col overflow-hidden whitespace-nowrap",
              isCollapsed ? "lg:hidden" : ""
            )}>
                 <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] leading-none">GrowX<span className="text-[#0075de]">Labs</span></span>
                 <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] mt-1">Admin Central</span>
            </div>
         </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar mt-4 px-3">
        <div className="flex flex-col space-y-1 mb-8">
          {filteredNavItems.length > 0 && (
            <>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mb-3 px-3",
                isCollapsed ? "lg:hidden" : ""
              )}>Core Systems</p>
              {filteredNavItems.map(renderLink)}
            </>
          )}

          {filteredAcademyItems.length > 0 && (
            <>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mt-6 mb-3 px-3",
                isCollapsed ? "lg:hidden" : ""
              )}>Academy Suite</p>
              {filteredAcademyItems.map(renderLink)}
            </>
          )}

          {filteredMonetizationItems.length > 0 && (
            <>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mt-6 mb-3 px-3",
                isCollapsed ? "lg:hidden" : ""
              )}>Revenue</p>
              {filteredMonetizationItems.map(renderLink)}
            </>
          )}

          {filteredFinancialItems.length > 0 && (
            <>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mt-6 mb-3 px-3",
                isCollapsed ? "lg:hidden" : ""
              )}>Financials</p>
              {filteredFinancialItems.map(renderLink)}
            </>
          )}
          
          {filteredTemplateItems.length > 0 && (
            <>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.25em] text-[#a39e98] mt-6 mb-3 px-3",
                isCollapsed ? "lg:hidden" : ""
              )}>Templates</p>
              {filteredTemplateItems.map(renderLink)}
            </>
          )}
        </div>
      </div>

      {/* Footer Area */}
      <div className={cn("mt-auto py-4 border-t border-[var(--border-subtle)] bg-[var(--card)]/30 space-y-2.5 shrink-0", isCollapsed ? "lg:px-2 px-4" : "px-4")}>
        {/* Theme Switcher Segmented Control */}
        <div className={cn(
          "flex items-center bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-lg p-0.5 transition-all w-full h-9",
          isCollapsed ? "justify-center mx-auto w-9" : ""
        )}>
          {!mounted ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--text-muted)]" />
            </div>
          ) : isCollapsed ? (
            <button
              onClick={() => {
                const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
                console.log("Collapsed theme switcher clicked. Setting to:", nextTheme);
                setTheme(nextTheme);
                updateThemeClass(nextTheme);
              }}
              className="flex items-center justify-center w-7 h-7 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] rounded-md transition-all cursor-pointer"
              title={`Theme: ${theme}`}
            >
              {theme === 'light' && <Sun size={14} />}
              {theme === 'dark' && <Moon size={14} />}
              {theme === 'system' && <Monitor size={14} />}
            </button>
          ) : (
            <div className="flex w-full h-full gap-0.5">
              {(['light', 'dark', 'system'] as const).map((t) => {
                const isActive = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      console.log("Theme switcher clicked. Setting to:", t);
                      setTheme(t);
                      updateThemeClass(t);
                    }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer h-full px-1.5",
                      isActive 
                        ? "bg-[var(--surface-2)] text-[#0075de] dark:text-white border border-[var(--border-subtle)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-black" 
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]/40"
                    )}
                  >
                    {t === 'light' && <Sun size={11} />}
                    {t === 'dark' && <Moon size={11} />}
                    {t === 'system' && <Monitor size={11} />}
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Change Password */}
        <button
          onClick={() => { setPwError(""); setPwSuccess(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setShowPwModal(true); }}
          className={cn(
            "w-full flex items-center h-8 px-3 rounded-md text-[#615d59] dark:text-neutral-450 hover:text-[#0075de] dark:hover:text-white hover:bg-[#0075de]/5 transition-all group text-left",
            isCollapsed && "lg:justify-center lg:px-0"
          )}
        >
          <KeyRound className={cn("h-4 w-4 shrink-0 transition-colors group-hover:text-[#0075de] dark:group-hover:text-white", !isCollapsed && "mr-2")} />
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            isCollapsed ? "lg:hidden" : ""
          )}>Change Password</span>
        </button>
        {/* Sign Out */}
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[250] h-14 bg-[var(--card)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[var(--surface-2)] rounded-md border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
            <ShieldCheck className="text-[#0075de] h-4 w-4" />
          </div>
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] leading-none">GrowXLabsTech</span>
            <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] mt-1">Admin</span>
          </div>
        </div>
        <button
          onClick={onMobileToggle}
          className="h-9 w-9 rounded-md bg-[var(--card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-all"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* ═══ MOBILE DRAWER OVERLAY ═══ */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[290]"
          onClick={onMobileToggle}
        />
      )}

      {/* ═══ MOBILE DRAWER SIDEBAR ═══ */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-screen w-72 bg-[var(--surface-2)] border-r border-[var(--border-subtle)] z-[300] transition-transform duration-300 ease-in-out overflow-hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button inside drawer */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onMobileToggle}
            className="h-8 w-8 rounded-lg bg-[var(--card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-all"
          >
            <X size={16} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* ═══ DESKTOP FIXED SIDEBAR (hidden on mobile) ═══ */}
      <aside 
        className={cn(
          "hidden lg:flex h-screen border-r border-[var(--border-subtle)] bg-[var(--surface-2)] flex-col fixed left-0 top-0 overflow-hidden transition-all duration-500 ease-in-out z-[200]",
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

      {/* ── Change Password Modal ── */}
      <AnimatePresence>
        {showPwModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPwModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
              className="relative w-full max-w-md bg-[var(--card)] rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] border border-[var(--border-subtle)] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-[var(--border-subtle)] bg-[var(--surface-2)]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0075de] to-[#0060b8] flex items-center justify-center shadow-md shadow-[#0075de]/20">
                    <KeyRound className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-extrabold text-[var(--text-primary)] tracking-tight">Change Password</h3>
                    <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-0.5">
                      {(session?.user as any)?.email || "Update your account password"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                {pwSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                      <CheckCircle className="text-[#10b981]" size={28} />
                    </div>
                    <p className="text-[14px] font-bold text-[var(--text-primary)]">Password Updated!</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">Your new password is now active.</p>
                  </div>
                ) : (
                  <>
                    {/* Current Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPw ? "text" : "password"}
                          value={currentPw}
                          onChange={(e) => setCurrentPw(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-2.5 text-[var(--text-primary)] text-[13px] font-medium focus:bg-[var(--card)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 focus:outline-none transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                        >
                          {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">New Password</span>
                      <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPw ? "text" : "password"}
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-2.5 text-[var(--text-primary)] text-[13px] font-medium focus:bg-[var(--card)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 focus:outline-none transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                        >
                          {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {/* Strength indicator */}
                      {newPw.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 flex gap-1">
                            <div className={cn("h-1 rounded-full flex-1 transition-colors", newPw.length >= 1 ? "bg-red-400" : "bg-[var(--border-subtle)]")} />
                            <div className={cn("h-1 rounded-full flex-1 transition-colors", newPw.length >= 6 ? "bg-yellow-400" : "bg-[var(--border-subtle)]")} />
                            <div className={cn("h-1 rounded-full flex-1 transition-colors", newPw.length >= 10 ? "bg-[#10b981]" : "bg-[var(--border-subtle)]")} />
                          </div>
                          <span className={cn("text-[9px] font-bold uppercase tracking-wider",
                            newPw.length >= 10 ? "text-[#10b981]" : newPw.length >= 6 ? "text-yellow-500" : "text-red-400"
                          )}>
                            {newPw.length >= 10 ? "Strong" : newPw.length >= 6 ? "Medium" : "Weak"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        placeholder="Re-enter new password"
                        className={cn(
                          "w-full bg-[var(--surface-1)] border rounded-lg px-3.5 py-2.5 text-[var(--text-primary)] text-[13px] font-medium focus:bg-[var(--card)] focus:outline-none transition-all",
                          confirmPw && confirmPw === newPw
                            ? "border-[#10b981] focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/10"
                            : confirmPw && confirmPw !== newPw
                              ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
                              : "border-[var(--border-subtle)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                        )}
                      />
                      {confirmPw && confirmPw !== newPw && (
                        <p className="text-[10px] text-red-400 font-medium">Passwords do not match</p>
                      )}
                    </div>

                    {/* Error */}
                    {pwError && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <span className="text-red-400 text-[11px] font-semibold">{pwError}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!pwSuccess && (
                <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--surface-2)] flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowPwModal(false)}
                    className="px-4 h-9 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-1)] text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={pwLoading || !currentPw || newPw.length < 6 || newPw !== confirmPw}
                    className="px-5 h-9 rounded-lg bg-gradient-to-r from-[#0075de] to-[#005bab] hover:from-[#005bab] hover:to-[#004a8f] text-white text-[11px] font-bold flex items-center gap-2 shadow-md shadow-[#0075de]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {pwLoading ? (
                      <><Loader2 size={13} className="animate-spin" /> Updating…</>
                    ) : (
                      <><KeyRound size={13} /> Update Password</>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
