"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { usePathname } from "@/navigation";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { getAbsoluteUrl } from "@/lib/subdomains";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const userRole = (session?.user as any)?.role;
  const dashboardPath = (userRole === "ADMIN" || userRole === "CO_ADMIN" || userRole === "crm_agent")
    ? "/admin/team"
    : "/client/dashboard";

  const pathname = usePathname();
  const t = useTranslations("Nav");
  const isDemoRoute = Boolean(pathname?.includes("/demos"));
  const isBlog = Boolean(pathname?.includes("/blog"));
  const isContact = Boolean(pathname?.includes("/contact"));
  const isLightThemePage = false; // Redesigned blog uses dark mode layout
  const isLandingPage = pathname === "/";


  // Dynamic Theme Colors
  const navBg = isScrolled
    ? (isLightThemePage
        ? "bg-white/90 border-b border-[#E5E2DC] shadow-sm"
        : "bg-[#111111]/90 border-b border-white/10 shadow-sm")
    : (isLightThemePage
        ? "bg-[#F5F3EE]/80 border-b border-transparent"
        : "bg-[#111111]/80 border-b border-transparent");

  const logoColor1 = isLightThemePage ? "text-[#1A1A1A]" : "text-white";
  const logoColor2 = isBlog ? "text-white" : "text-primary";

  const buttonOverrideClass = isLightThemePage
    ? "border-[#E5E2DC] text-[#1A1A1A] hover:bg-neutral-100"
    : "border-white/10 text-white hover:bg-white/5 bg-transparent";

  const topLinks = [
    { name: "Home", href: "/" },
    { name: t("services"), href: "/services" },
    { name: t("portfolio"), href: "/portfolio" },
    { name: t("products"), href: "/products" },
    { name: t("blog"), href: "/blog" },
    { name: t("faq"), href: "/faq" },
    { name: t("contact"), href: "/contact" },
  ];

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
          "fixed top-0 w-full z-50 transition-all duration-500 py-5",
          navBg
        )}
      >
        <div className="w-full px-6 md:px-10">
          <div className="flex justify-between items-center relative h-10">
            {/* Left Hamburger Button (Standard on Desktop & Mobile) */}
            <div className="flex items-center lg:w-1/4">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "transition-colors p-1 cursor-pointer bg-transparent border-0",
                  isLightThemePage ? "text-[#1A1A1A] hover:text-[#111111]" : "text-zinc-400 hover:text-white"
                )}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Desktop Center: Centered Serif Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              {(() => {
                const resolvedHref = getAbsoluteUrl("/");
                const isExternal = resolvedHref.startsWith("http") && isMounted;
                if (isExternal) {
                  return (
                    <a href={resolvedHref} className="flex items-center group notranslate" translate="no" aria-label="GrowXLabsTech home">
                      <div className="flex items-center text-xl md:text-2xl font-serif font-bold tracking-tight transition-transform group-hover:scale-[1.02] duration-300">
                        <span className={logoColor1}>GrowXLabs</span>
                        <span className={logoColor2}>.tech</span>
                      </div>
                    </a>
                  );
                }
                return (
                  <Link href="/" className="flex items-center group notranslate" translate="no" aria-label="GrowXLabsTech home">
                    <div className="flex items-center text-xl md:text-2xl font-serif font-bold tracking-tight transition-transform group-hover:scale-[1.02] duration-300">
                      <span className={logoColor1}>GrowXLabs</span>
                      <span className={logoColor2}>.tech</span>
                    </div>
                  </Link>
                );
              })()}
            </div>

            {/* Right: Bordered Contact Button */}
            <div className="flex items-center justify-end lg:w-1/4">
              {(() => {
                const resolvedHref = getAbsoluteUrl("/contact");
                const isExternal = resolvedHref.startsWith("http") && isMounted;
                if (isExternal) {
                  return (
                    <a href={resolvedHref}>
                      <Button size="sm" variant="outline" className={cn("font-semibold px-5 rounded-md border", buttonOverrideClass)}>
                        {t("contact")}
                      </Button>
                    </a>
                  );
                }
                return (
                  <Link href="/contact">
                    <Button size="sm" variant="outline" className={cn("font-semibold px-5 rounded-md border", buttonOverrideClass)}>
                      {t("contact")}
                    </Button>
                  </Link>
                );
              })()}
            </div>
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
            "absolute top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-[#020202] border-r border-neutral-900 text-white flex flex-col justify-between py-6 transition-transform duration-500 ease-out z-10",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Top Section */}
          <div className="flex flex-col">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6 px-6">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
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
                      className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors text-left block w-full px-6 py-3.5 border-b border-neutral-800 hover:bg-white/[0.02]"
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
                    className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors text-left block w-full px-6 py-3.5 border-b border-neutral-800 hover:bg-white/[0.02]"
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
                          className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors text-left block w-full px-6 py-3.5 border-b border-neutral-800 hover:bg-white/[0.02]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {t("dashboard")}
                        </a>
                      );
                    }
                    return (
                      <Link
                        href={dashboardPath}
                        className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors text-left block w-full px-6 py-3.5 border-b border-neutral-800 hover:bg-white/[0.02]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("dashboard")}
                      </Link>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-semibold text-neutral-300 hover:text-red-400 transition-colors text-left block w-full px-6 py-3.5 border-b border-neutral-800 hover:bg-white/[0.02] bg-transparent border-0 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-neutral-900 flex flex-col mt-auto pt-4">
            {(() => {
              const resolvedHref = getAbsoluteUrl("/careers");
              const isExternal = resolvedHref.startsWith("http") && isMounted;
              if (isExternal) {
                return (
                  <a
                    href={resolvedHref}
                    className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors text-left block w-full px-6 py-2.5 border-b border-neutral-800 hover:bg-white/[0.02]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Careers
                  </a>
                );
              }
              return (
                <Link
                  href="/careers"
                  className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors text-left block w-full px-6 py-2.5 border-b border-neutral-800 hover:bg-white/[0.02]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Careers
                </Link>
              );
            })()}
            <Link
              href="/contact"
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors text-left block w-full px-6 py-2.5 border-b border-neutral-800 hover:bg-white/[0.02]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Advertise with us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

