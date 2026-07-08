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
    /* Full-bleed: break out of admin layout padding */
    <div className="-m-4 sm:-m-6 lg:-m-12 h-[calc(100vh-3.5rem)] lg:h-screen overflow-hidden">
      <InteractiveWorkspace />
    </div>
  );
}
