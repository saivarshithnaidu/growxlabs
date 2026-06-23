import React from "react";
import { ReelsGeneratorClient } from "@/components/shared/ReelsGeneratorClient";

export async function generateMetadata() {
  return {
    title: "Instagram Reels Creator | GrowXLabs Admin",
    description: "Internal AI-powered tool to draft educational reels/video timelines using Gemini AI, live edit contents, apply aesthetic styles, and preview animations."
  };
}

export default async function AdminReelsPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e6e6e6]">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-neutral-900 -tracking-[0.025em] flex items-center gap-2">
            <span>🎬</span> Instagram Reels Creator
          </h1>
          <p className="text-[#615d59] text-sm">
            Draft vertical video scripts and storyboard timelines using Gemini AI, view kinetic caption animations, apply styling themes, and export vectors.
          </p>
        </div>
      </div>

      {/* Main Client Tool */}
      <ReelsGeneratorClient />
    </div>
  );
}
