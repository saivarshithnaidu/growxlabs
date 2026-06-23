import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReelsGeneratorClient } from "@/components/shared/ReelsGeneratorClient";

export default async function ReelsGeneratorPage() {
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
          Instagram <span className="text-primary">Reels Creator</span>
        </h1>
        <p className="text-white/40 text-sm max-w-xl">
          Draft vertical video scripts and storyboard timelines using Gemini AI, view kinetic caption animations, apply styling themes, and export vectors.
        </p>
      </div>

      {/* Main Client Tool */}
      <ReelsGeneratorClient />
    </div>
  );
}
