"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { usePathname } from "@/navigation";

// Dynamic import of the heavy ParticleWave component
const ParticleWave = dynamic(
  () => import("@/components/ui/particle-wave").then(mod => mod.ParticleWave), 
  { 
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black -z-50" /> 
  }
);

/**
 * GlobalBackground Component
 * 
 * Style: Particle Wave Surface (Three.js)
 * Aesthetic: Kinetic particle waves for a premium AI-native feel.
 */
export function GlobalBackground() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const pathname = usePathname();
  
  const isDashboard = pathname?.includes("/admin") || pathname?.includes("/client") || pathname?.includes("/demos");

  useEffect(() => {
    if (isDashboard) return;

    // Performance Guard: 
    // We defer the loading of 40,000 particles to ensure 95+ PageSpeed scores.
    const loadBackground = () => {
      const delay = window.innerWidth < 768 ? 3000 : 2000;
      setTimeout(() => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => setShouldLoad(true));
        } else {
          setShouldLoad(true);
        }
      }, delay);
    };

    if (document.readyState === 'complete') {
      loadBackground();
    } else {
      window.addEventListener('load', loadBackground);
      return () => window.removeEventListener('load', loadBackground);
    }
  }, [isDashboard]);

  if (isDashboard) {
    return <div className="fixed inset-0 -z-50 bg-black pointer-events-none" />;
  }

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-black overflow-hidden">
      {shouldLoad && <ParticleWave className="opacity-40" />}
      {!shouldLoad && <div className="fixed inset-0 bg-black" />}
    </div>
  );
}
