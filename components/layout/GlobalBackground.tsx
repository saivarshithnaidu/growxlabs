"use client";

import dynamic from "next/dynamic";

const DottedSurface = dynamic(() => import("@/components/ui/dotted-surface").then(mod => mod.DottedSurface), {
  ssr: false,
});

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-black">
      <DottedSurface className="opacity-50" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>
    </div>
  );
}
