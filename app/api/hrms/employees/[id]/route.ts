import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { denyUnlessHrAdmin } from "@/lib/hrms/admin-guard";
import { EMPLOYEE_COLUMNS, employeeFields } from "@/lib/hrms/employee-fields";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await denyUnlessHrAdmin("employee.manage");
  if (denied) return denied;
  const { id } = await params;
  const fields = employeeFields(await request.json().catch(() => null));
  if (fields.reporting_manager_id === id) return NextResponse.json({ error: "An employee can't report to themselves." }, { status: 400 });
  if ("full_name" in fields && !fields.full_name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const { data: employee, error } = await supabaseAdmin
    .from("employees")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(EMPLOYEE_COLUMNS)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ employee });
}
