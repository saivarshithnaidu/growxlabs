import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");

    let query = supabaseAdmin.from("sprints").select("*");
    if (project_id) query = query.eq("project_id", project_id);

    const { data: sprints, error } = await query.order("start_date", { ascending: true });
    if (error) throw error;

    return NextResponse.json({ sprints });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch sprints" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: sprint, error } = await supabaseAdmin
      .from("sprints")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ sprint }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create sprint" }, { status: 400 });
  }
}
