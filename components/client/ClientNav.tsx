"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Layout, FileText, CreditCard,
  Rocket, LogOut, ShieldCheck
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/client/dashboard", icon: Layout },
  { name: "Legal", href: "/client/agreement", icon: FileText },
  { name: "Payments", href: "/client/invoices", icon: CreditCard },
  { name: "Projects", href: "/client/project", icon: Rocket },
];

export function ClientNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-[2rem] mb-12">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 rounded-2xl transition-all whitespace-nowrap group",
                isActive
                  ? "bg-primary text-white font-black"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 mr-3",
                isActive ? "text-white" : "text-white/20 group-hover:text-white"
              )} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
          <ShieldCheck size={14} className="text-green-500" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Client Portal</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-3 text-white/20 hover:text-red-500 transition-all"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
