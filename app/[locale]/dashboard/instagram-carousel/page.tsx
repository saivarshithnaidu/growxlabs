import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CarouselGeneratorClient } from "@/components/shared/CarouselGeneratorClient";

export default async function CarouselGeneratorPage() {
  let session = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch (e) {
    // Suppress auth error in local testing
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 min-h-screen">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
            Growth Laboratory
          </span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter italic leading-none">
          Instagram <span className="text-primary">Carousel Generator</span>
        </h1>
        <p className="text-white/40 text-sm max-w-xl">
          Draft educational slide carousels using Gemini AI, live edit slide contents, apply modern aesthetics (Cyberpunk, Cream, Glassmorphic), and export high-res PNG files instantly.
        </p>
      </div>

      {/* Main Client Tool */}
      <CarouselGeneratorClient />
    </div>
  );
}
