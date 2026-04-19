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
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

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
    { name: t("pricing"), href: "/pricing" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
  ];

  if (pathname?.includes("/demos")) return null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isLoggedIn = status === "authenticated";
  const userRole = (session?.user as any)?.role;
  const dashboardPath = (userRole === "ADMIN" || userRole === "CO_ADMIN") ? "/admin/leads" : "/client/dashboard";

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ease-in-out py-4",
        isScrolled 
          ? "glass border-b border-white/10" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-6">
              <LanguageSwitcher />
              <Link href={isLoggedIn ? dashboardPath : "/register"}>
                <Button size="sm" variant="primary">
                  {isLoggedIn ? t("dashboard") : t("get_started")}
                </Button>
              </Link>
              {isLoggedIn && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-muted-foreground hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-white"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass absolute top-full w-full py-4 px-4 space-y-4 shadow-xl border-t border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium text-muted-foreground hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <Link href={isLoggedIn ? dashboardPath : "/register"} className="block w-full">
            <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
              {isLoggedIn ? t("dashboard") : t("get_started")}
            </Button>
          </Link>
          {isLoggedIn && (
            <Button 
              variant="outline" 
              className="w-full border-white/5 text-white/40"
              onClick={() => {
                signOut();
                setIsMobileMenuOpen(false);
              }}
            >
              Sign Out
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
