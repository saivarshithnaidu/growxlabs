"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GrowXChatWidget } from "@/components/ui/GrowXChatWidget";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Detect if we are in a dashboard or demo
  const isDashboard = pathname?.includes("/admin") || pathname?.includes("/client");
  const isDemo = pathname?.includes("/demos");
  
  // Hide marketing UI for dashboard components to prevent visual conflicts
  if (isDashboard || isDemo) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <GrowXChatWidget />
    </>
  );
}
