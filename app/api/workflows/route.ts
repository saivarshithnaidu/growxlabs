import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { data: rules, error } = await supabaseAdmin
      .from("automation_rules")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: runs } = await supabaseAdmin
      .from("automation_runs")
      .select("*, rule:automation_rules(name)")
      .order("executed_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return NextResponse.json({ rules, runs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch workflows data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: rule, error } = await supabaseAdmin
      .from("automation_rules")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ rule }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create workflow rule" }, { status: 400 });
  }
}
