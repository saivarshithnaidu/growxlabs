import React from "react";
import { CarouselGeneratorClient } from "@/components/shared/CarouselGeneratorClient";

export async function generateMetadata() {
  return {
    title: "Instagram Carousel Creator | GrowXLabs Admin",
    description: "Internal AI-powered tool to draft educational slide carousels using Gemini AI, live edit contents, apply aesthetic styles, and download high-res PNGs."
  };
}

export default async function AdminCarouselPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e6e6e6]">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-neutral-900 -tracking-[0.025em] flex items-center gap-2">
            <span>📷</span> Instagram Carousel Creator
          </h1>
          <p className="text-[#615d59] text-sm">
            Draft educational slide carousels using Gemini AI, live edit slide contents, apply modern aesthetics, and export high-res PNG files instantly.
          </p>
        </div>
      </div>

      {/* Main Client Tool */}
      <CarouselGeneratorClient />
    </div>
  );
}
