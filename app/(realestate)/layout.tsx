import React from "react";
import { RealEstateNavbar } from "@/components/realestate/Navbar";
import { RealEstateFooter } from "@/components/realestate/Footer";

export default function RealEstateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <RealEstateNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <RealEstateFooter />
    </div>
  );
}
