"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { usePathname } from "@/navigation";

const TunnelBackground = dynamic(() => import("@/components/ui/tunnel-hero").then(mod => mod.TunnelBackground), {
  ssr: false,
});

export function GlobalBackground() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const pathname = usePathname();
  
  const isAdminPage = pathname?.includes("/admin") ?? false;
  const isClientPage = pathname?.includes("/client") ?? false;
  const isDemoPage = pathname?.includes("/demos") ?? false;

  useEffect(() => {
    // Reverting to a safer initialization to resolve stability issues
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isAdminPage || isClientPage || isDemoPage) {
    return <div className="fixed inset-0 -z-50 bg-black pointer-events-none" />;
  }

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-black">
      {shouldLoad && <TunnelBackground />}
    </div>
  );
}
