import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required for tracking." }, { status: 400 });
    }

    // Check if the record already exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("wish_game_data")
      .select("id, play_again_count")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      console.error("Fetch existing tracking data error:", fetchError);
    }

    if (body.play_again) {
      const currentCount = existing?.play_again_count || 0;
      const { error: upsertError } = await supabaseAdmin
        .from("wish_game_data")
        .upsert(
          {
            email,
            play_again_count: currentCount + 1,
          },
          { onConflict: "email" }
        );

      if (upsertError) {
        console.error("Upsert play_again tracking error:", upsertError);
        return NextResponse.json({ error: "Could not track play again." }, { status: 500 });
      }

      return NextResponse.json({ success: true, play_again_count: currentCount + 1 });
    }

    // Build update fields dynamically
    const updatePayload: Record<string, any> = { email };

    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.wish !== undefined) updatePayload.wish = body.wish;
    if (body.consequence !== undefined) updatePayload.consequence = body.consequence;
    if (body.screen_reached !== undefined) updatePayload.screen_reached = body.screen_reached;
    if (body.disclaimer_accepted !== undefined) updatePayload.disclaimer_accepted = body.disclaimer_accepted;

    const { error: upsertError } = await supabaseAdmin
      .from("wish_game_data")
      .upsert(updatePayload, { onConflict: "email" });

    if (upsertError) {
      console.error("Upsert tracking data error:", upsertError);
      return NextResponse.json({ error: "Could not save tracking data." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("track-wish API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
