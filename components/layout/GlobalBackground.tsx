"use client";

import React from "react";
import { usePathname } from "@/navigation";

/**
 * GlobalBackground Component
 * 
 * Style: Warm Cream for marketing, Dark for admin/dashboard
 */
export function GlobalBackground() {
  const pathname = usePathname();
  
  const isDashboard = pathname?.includes("/admin") || pathname?.includes("/client") || pathname?.includes("/demos");

  if (isDashboard) {
    return <div className="fixed inset-0 -z-50 bg-[#0B0F1A] pointer-events-none" />;
  }

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-[#F5F3EE] overflow-hidden">
      <div 
        className="absolute inset-0 opacity-50" 
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 42% at 50% -10%, rgba(53, 92, 255, 0.06) 0%, transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(245,243,238,0) 38%)
          `,
        }}
      />
    </div>
  );
}
