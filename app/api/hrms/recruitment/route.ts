import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: jobs, error } = await supabaseAdmin
      .from("recruitment_jobs")
      .select("*, candidates(id, full_name, email, stage, score, summary), department:departments(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ jobs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch recruitment data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: job, error } = await supabaseAdmin
      .from("recruitment_jobs")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ job }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create job opening" }, { status: 400 });
  }
}
