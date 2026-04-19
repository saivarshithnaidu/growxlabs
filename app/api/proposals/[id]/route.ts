import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await req.json();
    const { id } = await params;

    const updates: any = { status };
    if (status === 'accepted') updates.accepted_at = new Date().toISOString();
    if (status === 'rejected') updates.rejected_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("proposals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
