"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Loader2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-white/20" />
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-6 opacity-20" />
        <h1 className="text-3xl font-black text-white tracking-tighter mb-4 italic">Security Restricted.</h1>
        <p className="text-white/40 max-w-md font-medium">Your account does not have the clearance levels required to access the outbound intelligence systems.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-neutral-200 transition-all uppercase tracking-tighter text-[11px]"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
      {/* 
          Z-INDEX STRATEGY:
          AdminNav: z-[200]
          Content Main: z-[10]
          This ensures the sidebar always floats on top and nothing leaks through.
      */}

      {/* PERSISTENT SIDEBAR */}
      <AdminNav isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      {/* SCROLLABLE MAIN CONTENT AREA */}
      <main className={cn(
        "flex-1 min-h-screen overflow-y-auto relative custom-scrollbar transition-all duration-500 ease-in-out bg-black z-10",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
         {/* Internal Spacing: Removed excessive pt-24, using simple p-10/14 */}
         <div className="p-10 lg:p-14 max-w-[1600px] mx-auto space-y-12">
           {children}
         </div>

         <footer className="mt-20 border-t border-white/5 p-10 text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">GrowX Labs · Administrative Suite · 2026</p>
         </footer>
      </main>
    </div>
  );
}
