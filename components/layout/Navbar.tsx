"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "@/navigation";
import { Link } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const locale = useLocale();

  const navLinks = [
    { name: t("services"), href: "/services" },
    { name: t("portfolio"), href: "/portfolio" },
    { name: "Courses", href: "/courses" },
    { name: t("pricing"), href: "/pricing" },
    { name: t("subscriptions"), href: "/subscriptions" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
  ];

  if (pathname?.includes("/demos")) return null;

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const isLoggedIn = status === "authenticated";
  const userRole = (session?.user as any)?.role;
  const dashboardPath = (userRole === "ADMIN" || userRole === "CO_ADMIN") ? "/admin/leads" : "/client/dashboard";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 py-4",
          isScrolled 
            ? "bg-black/80 backdrop-blur-md border-b border-white/10" 
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-10 xl:px-16 2xl:px-24">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative h-12 w-48 transition-transform group-hover:scale-[1.02] duration-300">
                <Image 
                  src="/logo.svg" 
                  alt="GrowX Labs" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors duration-200 whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center space-x-4">
                <Link href={isLoggedIn ? dashboardPath : "/register"}>
                  <Button size="sm" variant="primary" className="bg-[#00A86B] hover:bg-[#00A86B]/90 shadow-none text-white font-semibold px-6">
                    {isLoggedIn ? t("dashboard") : t("get_started")}
                  </Button>
                </Link>
                {isLoggedIn && (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-[#A0A0A0] hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5"
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#A0A0A0] hover:text-white z-[60] transition-transform active:scale-90"
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
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/98 backdrop-blur-xl" />
        
        {/* Menu Content — slides from right */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center space-y-8 transition-all duration-500 ease-out px-6 text-center",
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white hover:text-[#00A86B] transition-all active:scale-95"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-10 flex flex-col items-center space-y-4 w-full max-w-[280px]">
            <Link href={isLoggedIn ? dashboardPath : "/register"} className="block w-full">
              <Button 
                className="w-full bg-[#00A86B] hover:bg-[#00A86B]/90 shadow-none text-white font-semibold h-14 rounded-full text-lg" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isLoggedIn ? t("dashboard") : t("get_started")}
              </Button>
            </Link>
            {isLoggedIn && (
              <Button 
                variant="outline" 
                className="w-full border-white/10 text-white/40 h-14 rounded-full"
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
