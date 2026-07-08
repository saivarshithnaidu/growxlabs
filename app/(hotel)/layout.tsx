import { HotelProvider } from "@/lib/hotel-context";
import { HotelNavbar } from "@/components/hotel/Navbar";
import { HotelFooter } from "@/components/hotel/Footer";

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HotelProvider>
      <div className="min-h-screen bg-black flex flex-col">
        <HotelNavbar />
        <main className="flex-grow">
          {children}
        </main>
        <HotelFooter />
      </div>
    </HotelProvider>
  );
}

