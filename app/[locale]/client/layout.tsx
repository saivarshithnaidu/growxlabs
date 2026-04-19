"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ClientNav } from "@/components/client/ClientNav";
import { Loader2 } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user as any).role !== "CLIENT") {
    // router.push("/login");
    // return null;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientNav />
        {children}
      </div>
    </div>
  );
}
