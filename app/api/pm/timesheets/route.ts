import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EnterprisePmService } from "@/services/enterprise-pm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const member_id = searchParams.get("member_id");

    let query = supabaseAdmin
      .from("time_logs")
      .select("*, task:tasks(title, project:projects(name))");

    const { data: logs, error } = await query.order("log_date", { ascending: false });
    if (error) throw error;

    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch timesheet logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const log = await EnterprisePmService.logTimeEntry(body);
    return NextResponse.json({ log }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log time" }, { status: 400 });
  }
}
