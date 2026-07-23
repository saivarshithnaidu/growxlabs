import React from "react";
import { EditorialCarouselClient } from "@/components/shared/EditorialCarouselClient";

export async function generateMetadata() {
  return {
    title: "Editorial Carousel Creator | GrowXLabs Admin",
    description: "Premium Figma/Canva-like content creator for GrowXLabs LinkedIn & Instagram carousels with fixed and free layout modes."
  };
}

export default async function EditorialCarouselPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-5 border-b border-neutral-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-neutral-900 -tracking-[0.025em] flex items-center gap-2">
            <span>✨</span> Editorial Carousel Creator
          </h1>
          <p className="text-neutral-500 text-sm">
            Figma/Canva-style premium slide generator with locked editorial grids and custom templates.
          </p>
        </div>
      </div>

      {/* Main Client Tool */}
      <EditorialCarouselClient />
    </div>
  );
}
