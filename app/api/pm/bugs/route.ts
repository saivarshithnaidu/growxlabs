import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");

    let query = supabaseAdmin.from("bugs").select("*");
    if (project_id) query = query.eq("project_id", project_id);

    const { data: bugs, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    return NextResponse.json({ bugs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch bug reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: bug, error } = await supabaseAdmin
      .from("bugs")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    // Log Activity Event
    await supabaseAdmin.from("activity_logs").insert({
      project_id: bug.project_id,
      bug_id: bug.id,
      action_type: "BUG_LOGGED",
      title: "New Bug Reported",
      description: `Bug: ${bug.title} reported with severity ${bug.severity}.`
    });

    return NextResponse.json({ bug }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to report bug" }, { status: 400 });
  }
}
