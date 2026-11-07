import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { denyUnlessHrAdmin } from "@/lib/hrms/admin-guard";

const COLUMNS = "id, title, level, department_id";

function fields(body: any) {
  return {
    title: String(body?.title || "").trim(),
    level: String(body?.level || "").trim() || null,
    department_id: body?.department_id || null,
  };
}

export async function GET() {
  const denied = await denyUnlessHrAdmin("designation.manage", "employee.view");
  if (denied) return denied;
  const { data, error } = await supabaseAdmin.from("designations").select(COLUMNS).order("title");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const denied = await denyUnlessHrAdmin("designation.manage");
  if (denied) return denied;
  const row = fields(await request.json().catch(() => null));
  if (!row.title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("designations").insert(row).select(COLUMNS).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const denied = await denyUnlessHrAdmin("designation.manage");
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const row = fields(body);
  if (!body?.id || !row.title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("designations").update(row).eq("id", body.id).select(COLUMNS).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data });
}
