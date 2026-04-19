import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GrowXChatWidget } from "@/components/ui/GrowXChatWidget";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="bg-red-500 text-white text-center py-1">MARKETING LAYOUT ACTIVE</div>
      <main className="flex-grow container mx-auto px-4 relative z-10 pt-20">
        {children}
      </main>
      <Footer />
      <GrowXChatWidget />
    </>
  );
}
