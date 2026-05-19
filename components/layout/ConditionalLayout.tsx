"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useTheme } from "next-themes";

const Footer = dynamic(() => import("@/components/layout/Footer").then(mod => mod.Footer), {
  ssr: true,
});

const GrowXChatWidget = dynamic(() => import("@/components/ui/GrowXChatWidget").then(mod => mod.GrowXChatWidget), {
  ssr: false,
});

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  
  // Detect if we are in a dashboard or demo
  const isDashboard = pathname?.includes("/admin") || pathname?.includes("/client");
  const isDemo = pathname?.includes("/demos");

  // Apply dark theme for admin/dashboard, light for marketing
  useEffect(() => {
    if (isDashboard || isDemo) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [isDashboard, isDemo, setTheme]);
  
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
