"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      router.push("/login");
    } else if (role !== "Admin" && role !== "Co-Admin") {
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [router]);

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
          onClick={() => router.push("/dashboard")}
          className="mt-8 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-neutral-200 transition-all uppercase tracking-tighter"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
