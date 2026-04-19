import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch proposal
    const { data: proposal, error } = await supabaseAdmin
      .from("proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !proposal) throw new Error("Architectural Vault not found");

    // 2. Track view (background)
    if (!proposal.viewed_at) {
        await supabaseAdmin
          .from("proposals")
          .update({ viewed_at: new Date().toISOString() })
          .eq("id", id);
    }

    return NextResponse.json(proposal);
  } catch (error: any) {
    console.error("Proposal View API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
