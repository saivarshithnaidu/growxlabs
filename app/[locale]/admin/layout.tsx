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

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const role = (session?.user as any)?.role;
    if (role === "ADMIN" || role === "CO_ADMIN") {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [status, session, router]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-8 w-8 text-primary/40" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">Authorizing Suite</p>
        </div>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-8">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="heading-md text-white mb-4">Security Restricted.</h1>
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
    <div className="min-h-screen bg-[var(--background)] text-white flex overflow-hidden relative print:bg-white print:text-black print:block print:overflow-visible">
      {/* PERSISTENT SIDEBAR */}
      <div className="print:hidden">
        <AdminNav isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </div>
      
      {/* SCROLLABLE MAIN CONTENT AREA */}
      <main className={cn(
        "flex-1 min-h-screen overflow-y-auto relative custom-scrollbar transition-all duration-500 ease-in-out bg-[var(--background)] z-10 print:ml-0 print:bg-transparent print:overflow-visible print:min-h-0",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
         {/* Internal Spacing */}
         <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-10 print:p-0 print:m-0 print:space-y-0 print:max-w-none">
            {children}
         </div>

         <footer className="mt-20 border-t border-[var(--border-subtle)] p-10 text-center opacity-30 print:hidden">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--text-muted)]">GrowX Labs · Administrative Suite · 2026</p>
         </footer>
      </main>
    </div>
  );
}
