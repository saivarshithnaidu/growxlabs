import React from "react";
import InteractiveWorkspace from "./InteractiveWorkspace";

export async function generateMetadata() {
  return {
    title: "GXL Command Center | GrowXLabs",
    description: "Internal AI Operating System for GrowXLabs business operations, content, financial modeling, and software engineering."
  };
}

export default async function CommandCenterPage() {
  return (
    <div className="space-y-10">
      {/* Dynamic Command Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">GXL Command Center</h1>
          <p className="text-[var(--text-secondary)] text-sm">Internal AI Operating System & Autonomous Agent Suite.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#355CFF]/15 border border-[#355CFF]/30 rounded-xl px-5 py-2.5">
          <div className="w-2 h-2 rounded-full bg-[#355CFF] animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-[#355CFF] font-bold uppercase">Clearance Levels Max</span>
        </div>
      </div>

      {/* Main Terminal Workspace */}
      <InteractiveWorkspace />
    </div>
  );
}
