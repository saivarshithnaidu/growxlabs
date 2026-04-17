"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { AdminNav } from "@/components/admin/AdminNav";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-6 opacity-20" />
        <h1 className="text-3xl font-black text-white tracking-tighter mb-4 italic">Security Restricted.</h1>
        <p className="text-white/40 max-w-md">Your account does not have the clearance levels required to access the outbound intelligence systems.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-neutral-200 transition-all uppercase tracking-tighter"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="pl-64 pt-24 min-h-screen">
        <div className="max-w-[1200px] mx-auto p-8 space-y-10">
          {children}
        </div>
      </main>
    </div>
  );
}
