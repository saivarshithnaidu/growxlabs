import React from "react";
import { CartProvider } from "@/lib/restaurant-context";
import { RestaurantNavbar } from "@/components/restaurant/Navbar";
import { RestaurantFooter } from "@/components/restaurant/Footer";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-black flex flex-col">
        <RestaurantNavbar />
        <main className="flex-grow">
          {children}
        </main>
        <RestaurantFooter />
      </div>
    </CartProvider>
  );
}
