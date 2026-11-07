import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { denyUnlessHrAdmin } from "@/lib/hrms/admin-guard";

const COLUMNS = "id, name, head_id, description";

function fields(body: any) {
  return {
    name: String(body?.name || "").trim(),
    description: String(body?.description || "").trim() || null,
    head_id: body?.head_id || null,
  };
}

export async function GET() {
  const denied = await denyUnlessHrAdmin("department.manage", "employee.view");
  if (denied) return denied;
  const { data, error } = await supabaseAdmin.from("departments").select(COLUMNS).order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const denied = await denyUnlessHrAdmin("department.manage");
  if (denied) return denied;
  const row = fields(await request.json().catch(() => null));
  if (!row.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("departments").insert(row).select(COLUMNS).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const denied = await denyUnlessHrAdmin("department.manage");
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const row = fields(body);
  if (!body?.id || !row.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("departments").update(row).eq("id", body.id).select(COLUMNS).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data });
}
