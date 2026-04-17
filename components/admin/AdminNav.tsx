"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { 
  BarChart3, Users, Target, Inbox, 
  FileText, Zap, ShieldCheck, Rocket, FileCheck, Mail, LogOut
} from "lucide-react";

const navItems = [
  { name: "Leads", href: "/admin/leads", icon: Target },
  { name: "Scraper", href: "/admin/leads/scrape", icon: Zap },
  { name: "Apollo Leads", href: "/admin/apollo", icon: Rocket },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Outreach", href: "/admin/outreach", icon: Inbox },
  { name: "Invoices", href: "/admin/invoices", icon: BarChart3 },
  { name: "Agreements", href: "/admin/agreements", icon: FileText },
];

const templateItems = [
  { name: "Agreement Preview", href: "/admin/agreements/preview", icon: ShieldCheck },
  { name: "Invoice Preview", href: "/admin/invoices/preview", icon: BarChart3 },
  { name: "Onboarding Preview", href: "/onboarding", icon: Rocket },
  { name: "Onboarding Submissions", href: "/admin/onboarding", icon: Target },
  { name: "Welcome Mail", href: "/templates/welcome_email.html", icon: Inbox },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-black/20 flex flex-col fixed left-0 top-0 overflow-y-auto pb-8">
      <div className="p-8 pb-12 flex items-center space-x-3">
         <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-black h-5 w-5" />
         </div>
         <span className="text-xl font-bold tracking-tighter text-white">GrowX Labs</span>
      </div>
      
      <div className="flex-1">
        <div className="flex flex-col space-y-1 px-4 mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 px-5">Main Operations</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center py-3 px-5 rounded-lg transition-all group relative",
                  isActive 
                    ? "bg-white/[0.08] text-white shadow-[0_0_20px_rgba(255,255,255,0.02)] border-l-2 border-white" 
                    : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 mr-4 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-white/20 group-hover:text-white"
                )} />
                <span className="text-sm font-medium tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col space-y-1 px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 px-5">System Templates</p>
          {templateItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center py-3 px-5 rounded-lg transition-all group relative",
                  isActive 
                    ? "bg-white/[0.08] text-white border-l-2 border-white" 
                    : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 mr-4 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-white/20 group-hover:text-white"
                )} />
                <span className="text-sm font-medium tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-auto pt-8 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center py-3 px-5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all group"
        >
          <LogOut className="h-4 w-4 mr-4 shrink-0 text-white/20 group-hover:text-red-400 transition-colors" />
          <span className="text-sm font-black uppercase tracking-widest text-[10px]">Sign Out System</span>
        </button>
      </div>
    </aside>
  );
}
