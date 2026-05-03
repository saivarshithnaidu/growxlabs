"use client";

import React from "react";
import { usePathname } from "@/navigation";

/**
 * GlobalBackground Component
 * 
 * Style: Deep Mesh (CSS only)
 * Aesthetic: High-performance, near-zero JS background.
 */
export function GlobalBackground() {
  const pathname = usePathname();
  
  const isDashboard = pathname?.includes("/admin") || pathname?.includes("/client") || pathname?.includes("/demos");

  if (isDashboard) {
    return <div className="fixed inset-0 -z-50 bg-black pointer-events-none" />;
  }

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-black overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(0, 168, 107, 0.1) 0%, transparent 50%),
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />
    </div>
  );
}
