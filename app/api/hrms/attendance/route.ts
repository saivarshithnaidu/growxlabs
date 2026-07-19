import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EnterpriseHrmsService } from "@/services/enterprise-hrms";

export async function GET(request: Request) {
  try {
    const { data: attendance, error } = await supabaseAdmin
      .from("attendance")
      .select("*, employee:employees(full_name)")
      .order("work_date", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ attendance });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, employee_id, gps_coordinates } = await request.json();

    if (!employee_id) throw new Error("Missing employee_id parameter");

    let punchLog;
    if (action === "check_in") {
      punchLog = await EnterpriseHrmsService.clockIn(employee_id, gps_coordinates || "");
    } else if (action === "check_out") {
      punchLog = await EnterpriseHrmsService.clockOut(employee_id);
    } else {
      throw new Error("Invalid check-in/out action code");
    }

    return NextResponse.json({ log: punchLog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Attendance punch failed" }, { status: 400 });
  }
}
