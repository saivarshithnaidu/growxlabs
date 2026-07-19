import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: leaves, error } = await supabaseAdmin
      .from("leave_requests")
      .select("*, employee:employees(full_name, employee_id)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Also fetch leave balances
    const { data: balances } = await supabaseAdmin
      .from("leave_balances")
      .select("*, employee:employees(full_name)");

    return NextResponse.json({ leaves, balances: balances || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch leaves" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { employee_id, leave_type, start_date, end_date, reason } = await request.json();

    if (!employee_id || !leave_type || !start_date || !end_date) {
      throw new Error("Missing required fields: employee_id, leave_type, start_date, end_date");
    }

    // Calculate number of days
    const startMs = new Date(start_date).getTime();
    const endMs = new Date(end_date).getTime();
    const days = Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;

    // Check leave balance
    const { data: balance } = await supabaseAdmin
      .from("leave_balances")
      .select("*")
      .eq("employee_id", employee_id)
      .eq("leave_type", leave_type)
      .single();

    if (balance && balance.remaining < days) {
      throw new Error(`Insufficient ${leave_type} leave balance. Available: ${balance.remaining}, Requested: ${days}`);
    }

    const { data: leave, error } = await supabaseAdmin
      .from("leave_requests")
      .insert({ employee_id, leave_type, start_date, end_date, reason, status: "PENDING" })
      .select()
      .single();

    if (error) throw error;

    // Update leave balance
    if (balance) {
      await supabaseAdmin
        .from("leave_balances")
        .update({ used: balance.used + days, remaining: balance.remaining - days })
        .eq("id", balance.id);
    }

    return NextResponse.json({ leave }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit leave request" }, { status: 400 });
  }
}
