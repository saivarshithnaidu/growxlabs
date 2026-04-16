"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, FolderKanban, LogOut, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    // DEV ONLY: Sync with localStorage demo session
    const storedRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedRole) {
      router.push("/login");
    } else {
      setUser({ email: storedEmail || "user@growxlabs.tech", role: storedRole });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Co-Admin", "Client"] },
    { name: "Clients", href: "/dashboard/clients", icon: Users, roles: ["Admin", "Co-Admin"] },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban, roles: ["Admin", "Co-Admin", "Client"] },
    { name: "Requests", href: "/dashboard/requests", icon: MessageSquare, roles: ["Admin", "Co-Admin", "Client"] },
  ].filter(link => link.roles.includes(user?.role || ""));

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-black pt-20">
      {/* Static Sidebar for Desktop */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="flex-1 flex flex-col pt-12 pb-4 overflow-y-auto">
          <div className="px-8 mb-12">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">
              {user.role} Portal
            </p>
            <p className="text-sm font-bold text-white truncate opacity-80">{user.email}</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className="mr-3 h-5 w-5 flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-white/5 p-6">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-sm font-bold text-white/30 hover:text-red-400 transition-colors w-full rounded-2xl hover:bg-red-500/5 group"
          >
            <LogOut className="mr-3 h-5 w-5 opacity-30 group-hover:opacity-100" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
