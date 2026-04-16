"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "glass py-2" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-white">
              GrowX<span className="text-primary">Labs</span>
            </span>
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
            <Link href="/login">
              <Button size="sm" variant="primary">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
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
          <Link href="/login" className="block w-full">
            <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
