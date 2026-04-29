"use client";

import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import {
  Layout, FileText, CreditCard,
  Rocket, LogOut, ShieldCheck
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Overview", href: "/client/dashboard", icon: Layout },
  { name: "Contracts", href: "/client/agreement", icon: FileText },
  { name: "Billing", href: "/client/invoices", icon: CreditCard },
  { name: "Progress", href: "/client/project", icon: Rocket },
];

export function ClientNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between bg-[var(--surface-1)] border border-[var(--border-subtle)] p-3 pl-6 pr-3 rounded-2xl mb-12 shadow-xl shadow-black/20">
      <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
        {/* Logo/Brand for Client Portal */}
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-[var(--border-subtle)]">
           <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white" size={16} />
           </div>
           <span className="text-sm font-bold tracking-tighter text-white hidden sm:block">Client Suite</span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2.5 rounded-xl transition-all whitespace-nowrap group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-[var(--text-tertiary)] hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 mr-2.5",
                  isActive ? "text-primary" : "text-[var(--text-muted)] group-hover:text-white"
                )} />
                <span className="text-[11px] uppercase tracking-wider font-bold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Active Partner</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
