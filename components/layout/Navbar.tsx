"use client";

import { useState, useEffect } from "react";
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
        : "bg-black md:bg-black/90 border-b border-white/10 shadow-sm")
    : (isLightThemePage
        ? "bg-[#FBF9F5] border-b border-transparent"
        : "bg-black/80 border-b border-transparent");

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
          "fixed top-0 w-full z-50 transition-all duration-500",
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
          className={cn(
            "absolute top-0 bottom-0 left-0 w-80 max-w-[85vw] border-r border-dashed flex flex-col justify-between py-6 transition-transform duration-500 ease-out z-10",
            isLightThemePage ? "bg-[#F7F4EE] border-[#111111]/15 text-[#111111]" : "bg-[#020202] border-neutral-800 text-white",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Top Section */}
          <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6 px-6">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "transition-colors cursor-pointer bg-transparent border-0",
                  isLightThemePage ? "text-[#65625D] hover:text-[#111111]" : "text-neutral-400 hover:text-white"
                )}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col">
              {topLinks.map((link) => {
                const resolvedHref = getAbsoluteUrl(link.href);
                const isExternal = resolvedHref.startsWith("http") && isMounted;
                if (isExternal) {
                  return (
                    <a
                      key={link.href}
                      href={resolvedHref}
                      className={cn(
                        "text-sm font-semibold transition-colors text-left block w-full px-6 py-3.5 border-b border-dashed",
                        isLightThemePage ? "text-[#34312D] hover:text-[#111111] border-[#111111]/15 hover:bg-black/[0.03]" : "text-neutral-300 hover:text-white border-neutral-800 hover:bg-white/[0.02]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-semibold transition-colors text-left block w-full px-6 py-3.5 border-b border-dashed",
                      isLightThemePage ? "text-[#34312D] hover:text-[#111111] border-[#111111]/15 hover:bg-black/[0.03]" : "text-neutral-300 hover:text-white border-neutral-800 hover:bg-white/[0.02]"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {isLoggedIn && (
                <>
                  {(() => {
                    const resolvedHref = getAbsoluteUrl(dashboardPath);
                    const isExternal = resolvedHref.startsWith("http") && isMounted;
                    if (isExternal) {
                      return (
                        <a
                          href={resolvedHref}
                          className={cn(
                            "text-sm font-semibold transition-colors text-left block w-full px-6 py-3.5 border-b border-dashed",
                            isLightThemePage ? "text-[#34312D] hover:text-[#111111] border-[#111111]/15 hover:bg-black/[0.03]" : "text-neutral-300 hover:text-white border-neutral-800 hover:bg-white/[0.02]"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </a>
                      );
                    }
                    return (
                      <Link
                        href={dashboardPath}
                        className={cn(
                          "text-sm font-semibold transition-colors text-left block w-full px-6 py-3.5 border-b border-dashed",
                          isLightThemePage ? "text-[#34312D] hover:text-[#111111] border-[#111111]/15 hover:bg-black/[0.03]" : "text-neutral-300 hover:text-white border-neutral-800 hover:bg-white/[0.02]"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-semibold text-neutral-300 hover:text-red-400 transition-colors text-left block w-full px-6 py-3.5 border-b border-dashed border-neutral-800 hover:bg-white/[0.02] bg-transparent border-0 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Section: Careers + Direct Contact Details */}
          <div className={cn(
            "border-t border-dashed flex flex-col mt-auto pt-3 shrink-0",
            isLightThemePage ? "border-[#111111]/15" : "border-neutral-800"
          )}>
            {/* Careers Link */}
            {(() => {
              const resolvedHref = getAbsoluteUrl("/careers");
              const isExternal = resolvedHref.startsWith("http") && isMounted;
              const linkContent = (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold uppercase tracking-wider">Careers</span>
                  <span className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded border border-dashed tracking-normal",
                    isLightThemePage 
                      ? "text-[#111111]/60 border-[#111111]/20 bg-black/[0.02]" 
                      : "text-neutral-400 border-neutral-700 bg-white/[0.02]"
                  )}>
                    WE&apos;RE HIRING
                  </span>
                </div>
              );

              if (isExternal) {
                return (
                  <a
                    href={resolvedHref}
                    className={cn(
                      "transition-colors text-left block w-full px-6 py-2.5 border-b border-dashed",
                      isLightThemePage ? "text-[#34312D] hover:text-[#111111] border-[#111111]/15 hover:bg-black/[0.03]" : "text-neutral-300 hover:text-white border-neutral-800 hover:bg-white/[0.02]"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {linkContent}
                  </a>
                );
              }
              return (
                <Link
                  href="/careers"
                  className={cn(
                    "transition-colors text-left block w-full px-6 py-2.5 border-b border-dashed",
                    isLightThemePage ? "text-[#34312D] hover:text-[#111111] border-[#111111]/15 hover:bg-black/[0.03]" : "text-neutral-300 hover:text-white border-neutral-800 hover:bg-white/[0.02]"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {linkContent}
                </Link>
              );
            })()}

            {/* Contact Details Section */}
            <div className="flex flex-col">
              {/* Contact Email */}
              <a
                href="mailto:svp@growxlabs.tech"
                className={cn(
                  "group flex items-center w-full px-6 py-2.5 border-b border-dashed transition-colors text-left",
                  isLightThemePage
                    ? "text-[#65625D] hover:text-[#111111] border-[#111111]/15 hover:bg-black/[0.03]"
                    : "text-neutral-400 hover:text-white border-neutral-800 hover:bg-white/[0.02]"
                )}
                title="Email us directly"
              >
                <span className="text-xs font-mono tracking-tight truncate">svp@growxlabs.tech</span>
              </a>

              {/* Mobile No & WhatsApp */}
              <div
                className={cn(
                  "flex items-center justify-between w-full px-6 py-2.5 transition-colors text-left",
                  isLightThemePage
                    ? "text-[#65625D] hover:text-[#111111] hover:bg-black/[0.03]"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                )}
              >
                <a
                  href="tel:+919381188153"
                  className="group flex items-center truncate flex-1"
                  title="Call directly"
                >
                  <span className="text-xs font-mono tracking-tight group-hover:text-white transition-colors">+91 93811 88153</span>
                </a>
                <a
                  href="https://wa.me/919381188153"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors shrink-0 ml-2 border flex items-center",
                    isLightThemePage
                      ? "text-emerald-700 border-emerald-300/60 bg-emerald-50 hover:bg-emerald-100"
                      : "text-emerald-400 border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50"
                  )}
                  title="Chat on WhatsApp"
                >
                  <span>WA</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

