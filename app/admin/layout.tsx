"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Loader2, ShieldAlert, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const role = (session?.user as any)?.role;
    const rawPathname = window.location.pathname;
    // Strip locale prefix (e.g., /en-IN/admin → /admin)
    const pathname = rawPathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?(?=\/admin)/, '');

    if (role === "ADMIN" || role === "CO_ADMIN") {
      setAuthorized(true);
    } else if (role === "crm_agent") {
      // Strict security override: CRM agents are never allowed to access team management or command-center
      if (pathname.startsWith("/admin/team") || pathname.startsWith("/admin/command-center")) {
        setAuthorized(false);
        router.replace("/admin/crm");
        return;
      }

      const allowedPaths = (session?.user as any)?.allowed_paths || [];
      let isAllowed = false;
      
      for (const p of allowedPaths) {
        if (p === "/admin") {
          if (pathname === "/admin" || pathname === "/admin/") {
            isAllowed = true;
            break;
          }
        } else if (p === "/admin/leads/scrape") {
          if (pathname.startsWith("/admin/leads/scrape")) {
            isAllowed = true;
            break;
          }
        } else if (p === "/admin/leads") {
          // Allow leads subroutes EXCEPT scrape unless they explicitly have scrape permission
          if (pathname.startsWith("/admin/leads") && !pathname.startsWith("/admin/leads/scrape")) {
            isAllowed = true;
            break;
          }
        } else if (pathname.startsWith(p)) {
          isAllowed = true;
          break;
        }
      }

      const isRootPath = pathname === "/admin" || pathname === "/admin/" || rawPathname.match(/^(\/[a-z]{2}(-[A-Z]{2})?)?\/admin\/?$/);
      if (isAllowed || isRootPath) {
        setAuthorized(true);
        if (isRootPath) {
          // Prioritize /admin/crm for CRM agents, then fall back to first allowed path
          const crmPath = allowedPaths.includes("/admin/crm") ? "/admin/crm" : null;
          const fallbackPath = crmPath || allowedPaths.find((p: string) => p !== "/admin/leads/scrape") || allowedPaths[0] || "/admin/crm";
          router.replace(fallbackPath);
        }
      } else {
        setAuthorized(false);
        router.replace("/admin/crm");
        // Log the unauthorized access attempt in the database
        fetch("/api/team/log-alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathname }),
        }).catch(err => console.error("Failed to log security alert:", err));
      }
    } else {
      setAuthorized(false);
    }
  }, [status, session, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, []);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  if (authorized === null) {
    return (
      <div className="notion-theme min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-8 w-8 text-primary/40" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">Authorizing Suite</p>
        </div>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="notion-theme min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-8">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="heading-md text-[var(--text-primary)] mb-4">Security Restricted.</h1>
        <p className="text-[var(--text-secondary)] max-w-md">Your account does not have the clearance levels required to access the outbound intelligence systems.</p>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="mt-8 h-12 px-8 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="notion-theme min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex overflow-hidden relative print:bg-white print:text-black print:block print:overflow-visible">
      {/* PERSISTENT SIDEBAR */}
      <div className="print:hidden">
        <AdminNav
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
        />
      </div>
      
      {/* SCROLLABLE MAIN CONTENT AREA */}
      <main className={cn(
        "flex-1 min-h-screen overflow-y-auto relative custom-scrollbar transition-all duration-500 ease-in-out bg-[var(--background)] z-10 print:ml-0 print:bg-transparent print:overflow-visible print:min-h-0",
        // Desktop margin based on sidebar state
        isCollapsed ? "lg:ml-20" : "lg:ml-64",
        // Mobile: no margin, add top padding for the mobile top bar
        "ml-0 pt-14 lg:pt-0"
      )}>
         {/* Internal Spacing — responsive padding */}
         <div className="p-4 sm:p-6 lg:p-12 max-w-[1600px] mx-auto space-y-6 sm:space-y-8 lg:space-y-10 print:p-0 print:m-0 print:space-y-0 print:max-w-none">
            {children}
         </div>
      </main>
    </div>
  );
}
