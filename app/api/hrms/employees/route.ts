import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { denyUnlessHrAdmin } from "@/lib/hrms/admin-guard";
import { EMPLOYEE_COLUMNS, employeeFields } from "@/lib/hrms/employee-fields";

export async function GET() {
  const denied = await denyUnlessHrAdmin("employee.view");
  if (denied) return denied;
  try {
    const { data: employees, error } = await supabaseAdmin
      .from("employees")
      .select(EMPLOYEE_COLUMNS)
      .order("full_name", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ employees });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch employees list" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await denyUnlessHrAdmin("employee.manage");
  if (denied) return denied;
  try {
    const fields = employeeFields(await request.json());
    if (!fields.employee_id || !fields.full_name || !fields.email) {
      return NextResponse.json({ error: "Employee ID, name and email are required." }, { status: 400 });
    }
    const { data: employee, error } = await supabaseAdmin
      .from("employees")
      .insert(fields)
      .select(EMPLOYEE_COLUMNS)
      .single();

    if (error) throw error;
    return NextResponse.json({ employee }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create employee" }, { status: 400 });
  }
}
