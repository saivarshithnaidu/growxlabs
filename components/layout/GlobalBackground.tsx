"use client";

import { DottedSurface } from "@/components/ui/dotted-surface";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-black">
      {/* 
        This is the consolidated singular theme based on the most recent 
        "DottedSurface" requirement. 
      */}
      <DottedSurface className="opacity-50" />
      
      {/* Subtle brand glow to prevent total darkness */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] animate-float" />
      </div>
    </div>
  );
}
