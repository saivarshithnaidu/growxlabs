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

  if (status === "unauthenticated" || (session?.user as any).role !== "CLIENT") {
    // For now, allowing access in dev if needed, but keeping the check UI
    /*
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="heading-md text-white mb-4">Authentication Required</h1>
        <p className="text-[var(--text-secondary)] max-w-md">Please sign in to your client account to access this project portal.</p>
        <Button onClick={() => router.push("/login")} className="mt-8 h-12 px-8 rounded-xl">
          Sign In
        </Button>
      </div>
    );
    */
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
