"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ClientNav } from "@/components/client/ClientNav";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-8 w-8 text-primary/40" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">Loading Portal</p>
        </div>
      </div>
    );
  }

  const userRole = (session?.user as any)?.role;

  if (status === "unauthenticated" || (userRole !== "CLIENT" && userRole !== "ADMIN" && userRole !== "CO_ADMIN")) {
    // Gracefully handle unauthorized access instead of crashing
    if (status === "unauthenticated") {
       router.push(`/${window.location.pathname.split('/')[1] || 'en-IN'}/login`);
       return null;
    }
  }


  return (
    <div className="min-h-screen bg-[var(--background)] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ClientNav />
        <main className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>
      </div>
    </div>
  );
}
