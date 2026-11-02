"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { GrowxMenu, X } from "@/components/icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { usePathname } from "@/navigation-client";
import { Link } from "@/navigation-client";
import { useSession, signOut } from "next-auth/react";
import { getAbsoluteUrl } from "@/lib/subdomains";
import { getEditorialArticle } from "@/components/marketing/editorialArticleData";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const userRole = (session?.user as any)?.role;
  const dashboardPath = (userRole === "ADMIN" || userRole === "CO_ADMIN" || userRole === "crm_agent")
    ? "/admin"
    : "/client/dashboard";

  const pathname = usePathname();
  const isDemoRoute = Boolean(pathname?.includes("/demos"));
  const isBlog = Boolean(pathname?.includes("/blog"));
  const isContact = Boolean(pathname?.includes("/contact"));
  const blogSlug = pathname?.split("/").filter(Boolean).at(-1) || "";
  const editorialArticle = getEditorialArticle(blogSlug);
  const isLightThemePage = Boolean(isBlog && editorialArticle?.theme === "light");
  const isLandingPage = pathname === "/";


  // Dynamic Theme Colors
  const navBg = isScrolled
    ? (isLightThemePage
        ? "bg-[#FBF9F5] border-b border-[#E5E2DC] shadow-sm"
        : "bg-black border-b border-white/10 shadow-sm")
    : (isLightThemePage
        ? "bg-[#FBF9F5] border-b border-transparent"
        : "bg-black border-b border-transparent");

  const logoColor1 = isLightThemePage ? "text-[#1A1A1A]" : "text-white";
  const logoColor2 = isLightThemePage ? "text-[#111111]" : (isBlog ? "text-white" : "text-[#C0F0FB]");

  const buttonOverrideClass = isLightThemePage
    ? "border-[#E5E2DC] text-[#1A1A1A] hover:bg-neutral-100"
    : "border-white/10 text-white hover:bg-white/5 bg-transparent";

  const topLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Products", href: "/products" },
    { name: "R&D", href: "/research" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ'S", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const centerLinks = topLinks.filter((link) =>
    ["/portfolio", "/research", "/faq"].includes(link.href)
  );

  // Header links resolve cross-subdomain URLs the same way the drawer does
  const renderNavLink = (
    href: string,
    className: string,
    children: React.ReactNode,
    extra: Record<string, string> = {}
  ) => {
    const resolvedHref = getAbsoluteUrl(href);
    const isExternal = resolvedHref.startsWith("http") && isMounted;
    if (isExternal) {
      return <a href={resolvedHref} className={className} {...extra}>{children}</a>;
    }
    return <Link href={href} className={className} {...extra}>{children}</Link>;
  };

  // ── Drawer ──────────────────────────────────────────────
  const drawerRef = useRef<HTMLDivElement>(null);

  // Drawer theme tokens (dark default; cream variant on light editorial articles)
  const dt = isLightThemePage
    ? {
        surface: "bg-[#F7F4EE] border-[#111111]/[0.08] text-[#111111]",
        divider: "border-[#111111]/[0.08]",
        divide: "divide-[#111111]/[0.07]",
        textActive: "text-[#111111]",
        textIdle: "text-[#111111]/45 hover:text-[#111111] focus-visible:text-[#111111]",
        textSecondary: "text-[#111111]/60 hover:text-[#111111]",
        footerText: "text-[#65625D] hover:text-[#111111]",
        rowHover: "hover:bg-black/[0.03]",
        badge: "text-[#111111]/60 border-[#111111]/15 bg-black/[0.02]",
        closeButton: "text-[#65625D] hover:text-[#111111]",
        focus: "outline-none focus-visible:bg-black/[0.04] focus-visible:shadow-[inset_0_0_0_1px_rgba(17,17,17,0.35)]",
      }
    : {
        surface: "bg-[#020202] border-white/[0.08] text-white",
        divider: "border-white/[0.08]",
        divide: "divide-white/[0.06]",
        textActive: "text-white",
        textIdle: "text-white/45 hover:text-white focus-visible:text-white",
        textSecondary: "text-white/60 hover:text-white",
        footerText: "text-neutral-400 hover:text-white",
        rowHover: "hover:bg-white/[0.03]",
        badge: "text-neutral-400 border-white/10 bg-white/[0.02]",
        closeButton: "text-neutral-400 hover:text-white",
        focus: "outline-none focus-visible:bg-white/[0.04] focus-visible:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]",
      };

  // Hover/focus arrow: sits inline right after the label, fades in just after the label shifts
  const drawerArrowClass =
    "h-[0.65em] w-[0.65em] shrink-0 opacity-0 -translate-x-1 transition-[opacity,translate] duration-200 delay-75 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0";

  const isActiveRoute = (href: string) =>
    href === "/" ? pathname === "/" : Boolean(pathname === href || pathname?.startsWith(`${href}/`));

  // Drawer links resolve cross-subdomain URLs like the header, and close the drawer on click
  const renderDrawerLink = (href: string, className: string, children: React.ReactNode, isActive = false) => {
    const resolvedHref = getAbsoluteUrl(href);
    const isExternal = resolvedHref.startsWith("http") && isMounted;
    const shared = {
      className,
      onClick: () => setIsMobileMenuOpen(false),
      "aria-current": isActive ? ("page" as const) : undefined,
    };
    if (isExternal) {
      return <a href={resolvedHref} {...shared}>{children}</a>;
    }
    return <Link href={href} {...shared}>{children}</Link>;
  };

  // Staggered entrance when the drawer opens. Uses the Web Animations API on
  // opacity + `translate`, which globals.css "mobile performance mode"
  // (animation/transition/transform: none !important) does not override.
  useEffect(() => {
    if (!isMobileMenuOpen || !drawerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = drawerRef.current.querySelectorAll<HTMLElement>("[data-drawer-item]");
    const animations = Array.from(items).map((el, i) =>
      el.animate(
        [
          { opacity: 0, translate: "0 8px" },
          { opacity: 1, translate: "0 0" },
        ],
        { duration: 250, delay: 80 + i * 35, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "backwards" }
      )
    );
    return () => animations.forEach((a) => a.cancel());
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  if (isDemoRoute) return null;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-colors duration-500",
          navBg
        )}
      >
        {/* Mobile: flex row (center links hidden). Desktop (900px+): 1fr auto 1fr grid so links sit on true center. */}
        <div className="h-16 px-5 flex items-center justify-between min-[900px]:h-[88px] min-[900px]:px-12 min-[900px]:grid min-[900px]:grid-cols-[1fr_auto_1fr]">
          {/* Left: Menu icon + Logo */}
          <div className="flex items-center gap-6 justify-self-start">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                "transition-colors p-1.5 -m-1.5 cursor-pointer bg-transparent border-0 rounded-md",
                isLightThemePage ? "text-[#1A1A1A] hover:text-[#111111]" : "text-zinc-400 hover:text-white"
              )}
              aria-label="Open menu"
            >
              <GrowxMenu size={22} className="sm:w-6 sm:h-6" />
            </button>
            {renderNavLink(
              "/",
              "flex items-center group notranslate",
              <div className="flex items-center text-xl min-[900px]:text-2xl font-serif font-bold tracking-tight transition-transform group-hover:scale-[1.02] duration-300 whitespace-nowrap">
                <span className={logoColor1}>GrowxLabs</span>
                <span className={logoColor2}>.tech</span>
              </div>,
              { translate: "no", "aria-label": "GrowxLabs home" }
            )}
          </div>

          {/* Center: Primary links (desktop only; mobile uses the side menu) */}
          <div className="hidden min-[900px]:flex items-center gap-10">
            {centerLinks.map((link) => (
              <span key={link.href} className="contents">
                {renderNavLink(
                  link.href,
                  cn(
                    "text-[15px] transition-colors duration-200 whitespace-nowrap",
                    isLightThemePage ? "text-[#1A1A1A] hover:text-[#65625D]" : "text-white hover:text-[#C0F0FB]"
                  ),
                  link.name
                )}
              </span>
            ))}
          </div>

          {/* Right: Solid Contact button */}
          <div className="flex items-center justify-self-end">
            {renderNavLink(
              "/contact",
              cn(
                "inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors duration-200",
                "text-sm px-4 py-2.5 min-[900px]:text-[15px] min-[900px]:px-6 min-[900px]:py-3 min-[900px]:min-h-11",
                isLightThemePage
                  ? "bg-[#111111] text-white hover:bg-[#C0F0FB] hover:text-black"
                  : "bg-white text-black hover:bg-[#C0F0FB]"
              ),
              "Contact"
            )}
          </div>
        </div>
      </nav>

      {/* While the drawer is open, hide the dev-only floating widgets (TanStack Query devtools button,
          Next.js dev indicator) that sit bottom-left over the drawer footer; they return on close */}
      {isMobileMenuOpen && <style>{`.tsqd-open-btn-container,nextjs-portal{display:none !important}`}</style>}

      {/* Menu Drawer Overlay (slides in from left) */}
      <div
        className={cn(
          "fixed inset-0 z-[55] transition-all duration-500 ease-in-out",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop (dimmed background) */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        />

        {/* Drawer Container */}
        <div
          ref={drawerRef}
          className={cn(
            "absolute top-0 bottom-0 left-0 w-80 max-w-[85vw] border-r flex flex-col transition-transform duration-500 ease-out z-10",
            dt.surface,
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header: close button in its own 72px band */}
          <div className="flex items-center h-[72px] px-6 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "grid place-items-center h-10 w-10 -ml-2 rounded-md transition-colors cursor-pointer bg-transparent border-0",
                dt.focus,
                dt.closeButton
              )}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Primary navigation: a typographic block, separated by spacing only.
              Type and padding scale with viewport height so it fits without scrolling;
              very short screens can still scroll, with the scrollbar hidden. */}
          <nav
            aria-label="Main"
            className="flex-1 min-h-0 overflow-y-auto pt-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex flex-col">
              {topLinks.map((link) => {
                const isActive = isActiveRoute(link.href);
                return (
                  <div key={link.href} data-drawer-item>
                    {renderDrawerLink(
                      link.href,
                      cn(
                        "group flex items-center w-full min-h-11 px-6 py-[clamp(3px,0.7vh,10px)] text-left text-[clamp(20px,3.2vh,30px)] font-medium tracking-[-0.02em] leading-[1.1] transition-colors duration-200",
                        dt.focus,
                        isActive ? dt.textActive : dt.textIdle
                      ),
                      <span className="inline-flex items-center gap-[0.3em] transition-[translate] duration-200 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                        {link.name}
                        <ArrowRight aria-hidden="true" className={drawerArrowClass} />
                      </span>,
                      isActive
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Bottom section: one hairline above; account actions, then the contact footer.
              Icons and text share the main nav's 24px left edge. */}
          <div className={cn("shrink-0 border-t pb-[calc(20px+env(safe-area-inset-bottom))]", dt.divider)}>
            {/* Account actions: compact, low-emphasis, side by side.
                The ::after extends each tap target to 48px without changing the visual rhythm. */}
            {isLoggedIn && (
              <div data-drawer-item className="flex items-center gap-6 px-6 py-5">
                {renderDrawerLink(
                  dashboardPath,
                  cn(
                    "relative inline-flex items-center rounded-md text-[14px] font-medium transition-colors duration-200 after:absolute after:-inset-x-2 after:-inset-y-3.5",
                    dt.focus,
                    isActiveRoute(dashboardPath) ? dt.textActive : dt.textSecondary
                  ),
                  "Dashboard",
                  isActiveRoute(dashboardPath)
                )}
                <button
                  type="button"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "relative inline-flex items-center rounded-md text-[14px] font-medium transition-colors duration-200 bg-transparent border-0 cursor-pointer after:absolute after:-inset-x-2 after:-inset-y-3.5",
                    dt.focus,
                    dt.textSecondary,
                    "hover:text-[#f87171]/80"
                  )}
                >
                  Sign Out
                </button>
              </div>
            )}

            {/* Footer: Careers + Direct Contact Details. A hairline + 16px separates it from the
                account row; hairlines only between these rows. */}
            <div
              data-drawer-item
              className={cn("flex flex-col divide-y pt-4", dt.divide, isLoggedIn && cn("border-t", dt.divider))}
            >
              {/* Careers Link */}
              {renderDrawerLink(
                "/careers",
                cn(
                  "flex items-center justify-between gap-3 w-full min-h-[52px] px-6 text-left transition-colors duration-200",
                  dt.rowHover,
                  dt.focus,
                  dt.footerText
                ),
                <>
                  <span className="text-xs font-semibold uppercase tracking-wider">Careers</span>
                  <span className={cn("shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border tracking-normal", dt.badge)}>
                    WE&apos;RE HIRING
                  </span>
                </>
              )}

              {/* Contact Email */}
              <a
                href="mailto:svp@growxlabs.tech"
                className={cn(
                  "flex items-center w-full min-h-[52px] px-6 text-left transition-colors duration-200",
                  dt.rowHover,
                  dt.focus,
                  dt.footerText
                )}
                title="Email us directly"
              >
                <span className="text-xs font-mono tracking-tight truncate">svp@growxlabs.tech</span>
              </a>

              {/* Mobile No & WhatsApp */}
              <div className={cn("flex items-stretch w-full min-h-[52px] transition-colors duration-200", dt.rowHover)}>
                <a
                  href="tel:+919381188153"
                  className={cn(
                    "flex flex-1 items-center min-w-0 pl-6 pr-2 text-left transition-colors duration-200",
                    dt.focus,
                    dt.footerText
                  )}
                  title="Call directly"
                >
                  <span className="text-xs font-mono tracking-tight truncate">+91 93811 88153</span>
                </a>
                <a
                  href="https://wa.me/919381188153"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("flex items-center shrink-0 pl-2 pr-6 rounded-md", dt.focus)}
                  title="Chat on WhatsApp"
                >
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors border",
                      isLightThemePage
                        ? "text-emerald-700 border-emerald-300/60 bg-emerald-50 hover:bg-emerald-100"
                        : "text-emerald-400 border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50"
                    )}
                  >
                    WA
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

