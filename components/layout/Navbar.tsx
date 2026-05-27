"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "@/navigation";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

const servicesSubLinks = (t: (key: string) => string) =>
  [
    { name: t("services_overview"), href: "/services" },
    { name: t("process"), href: "/services#process" },
    { name: t("subscriptions"), href: "/services#subscriptions" },
  ] as const;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const isDemoRoute = Boolean(pathname?.includes("/demos"));

  const sub = servicesSubLinks(t);

  const topLinks = [
    { name: t("portfolio"), href: "/portfolio" },
    { name: t("products"), href: "/products" },
    { name: t("courses"), href: "/courses" },
    { name: t("blog"), href: "/blog" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
  ];

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

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isLoggedIn = status === "authenticated";
  const userRole = (session?.user as { role?: string })?.role;
  const dashboardPath =
    userRole === "ADMIN" || userRole === "CO_ADMIN" || userRole === "crm_agent" ? "/admin/team" : "/client/dashboard";

  if (isDemoRoute) return null;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 py-4",
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-[#E5E2DC] shadow-sm"
            : "bg-[#F5F3EE]/80 backdrop-blur-sm border-b border-transparent"
        )}
      >
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-10 xl:px-16 2xl:px-24">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center group" aria-label="GrowXLabsTech home">
              <div className="flex items-center text-xl md:text-2xl font-black tracking-tight transition-transform group-hover:scale-[1.02] duration-300">
                <span className="text-[#1A1A1A]">GrowX</span>
                <span className="text-[#1A1A1A]">Labs</span>
                <span className="text-[#355CFF]">.tech</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="relative" ref={servicesRef}>
                <button
                  type="button"
                  className={cn(
                    "text-[13px] font-semibold transition-colors duration-200 inline-flex items-center gap-1 whitespace-nowrap",
                    servicesOpen ? "text-[#1A1A1A]" : "text-[#6B7280] hover:text-[#1A1A1A]"
                  )}
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  onClick={() => setServicesOpen((o) => !o)}
                >
                  {t("services")}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", servicesOpen && "rotate-180")} aria-hidden="true" />
                </button>
                {servicesOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 min-w-[220px] rounded-xl border border-[#E5E2DC] bg-white py-2 shadow-lg z-[60]"
                    role="menu"
                  >
                    {sub.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className="block px-4 py-2.5 text-[13px] font-semibold text-[#4B5563] hover:bg-[#F5F3EE] hover:text-[#1A1A1A]"
                        onClick={() => setServicesOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {topLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-semibold text-[#6B7280] hover:text-[#1A1A1A] transition-colors duration-200 whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-3">
                <Link href={isLoggedIn ? dashboardPath : "/register"}>
                  <Button size="sm" variant="primary" className="font-semibold px-5 rounded-md">
                    {isLoggedIn ? t("dashboard") : t("get_started")}
                  </Button>
                </Link>
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-[#6B7280] hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#1A1A1A] hover:text-[#355CFF] z-[60] transition-transform active:scale-90 rounded-md border border-[#E5E2DC] bg-white"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — Full Screen Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[55] lg:hidden transition-all duration-500 ease-in-out",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-[#F5F3EE]/98 backdrop-blur-xl" />

        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out px-6 text-center overflow-y-auto py-24",
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
            <button
              type="button"
              className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              aria-expanded={mobileServicesOpen}
            >
              {t("services")}
              <ChevronDown className={cn("h-6 w-6 transition-transform", mobileServicesOpen && "rotate-180")} aria-hidden="true" />
            </button>
            {mobileServicesOpen && (
              <div className="flex flex-col gap-3 w-full border border-[#E5E2DC] rounded-xl bg-white/90 p-4">
                {sub.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-semibold text-[#4B5563] hover:text-[#355CFF]"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileServicesOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {topLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold text-[#1A1A1A] hover:text-[#355CFF] transition-all active:scale-95"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-10 flex flex-col items-center space-y-4 w-full max-w-[280px]">
            <Link href={isLoggedIn ? dashboardPath : "/register"} className="block w-full">
              <Button
                className="w-full bg-[#355CFF] hover:bg-[#2A4AD4] shadow-none text-white font-semibold h-14 rounded-md text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isLoggedIn ? t("dashboard") : t("get_started")}
              </Button>
            </Link>
            {isLoggedIn && (
              <Button
                variant="outline"
                className="w-full border-[#E5E2DC] text-[#6B7280] h-14 rounded-md"
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
