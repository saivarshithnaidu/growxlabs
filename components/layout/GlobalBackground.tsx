"use client";

import { DottedSurface } from "@/components/ui/dotted-surface";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-black">
      {/* 
        This is the consolidated singular theme based on the most recent 
        "DottedSurface" requirement. 
      */}
      <DottedSurface className="opacity-30" />
      
      {/* Subtle brand glow to prevent total darkness */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
