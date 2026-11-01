import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { changeSprint, DeliveryError } from "@/lib/pm/delivery";

const READ_ROLES = ["ADMIN", "CO_ADMIN", "crm_agent"];
const WRITE_ROLES = ["ADMIN", "CO_ADMIN"];
const SPRINT_FIELDS = ["project_id", "name", "goal", "start_date", "end_date", "capacity_story_points"] as const;

/** Returns an error response when the caller may not use this route, otherwise null. */
async function denyUnless(roles: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!roles.includes(String(session.user.role))) return NextResponse.json({ error: "You don't have permission to do this." }, { status: 403 });
  return null;
}

export async function GET(request: Request) {
  try {
    const denied = await denyUnless(READ_ROLES);
    if (denied) return denied;

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
    const denied = await denyUnless(WRITE_ROLES);
    if (denied) return denied;

    // Only known fields; status and completed points are set by the workflow, never by the caller.
    const body = (await request.json()) as Record<string, unknown>;
    const row: Record<string, unknown> = {};
    for (const field of SPRINT_FIELDS) if (body[field] !== undefined) row[field] = body[field];
    if (typeof row.name !== "string" || !row.name.trim()) return NextResponse.json({ error: "Sprint name is required." }, { status: 400 });

    const { data: sprint, error } = await supabaseAdmin
      .from("sprints")
      .insert(row)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ sprint }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create sprint" }, { status: 400 });
  }
}

// Start or complete a sprint. Only one sprint per project may be active at a time.
export async function PATCH(request: Request) {
  try {
    const denied = await denyUnless(WRITE_ROLES);
    if (denied) return denied;

    const { id, action } = (await request.json()) as { id?: string; action?: "start" | "complete" };
    if (!id || !["start", "complete"].includes(String(action))) return NextResponse.json({ error: "Sprint id and a start or complete action are required." }, { status: 400 });

    return NextResponse.json({ sprint: await changeSprint(id, action as "start" | "complete") });
  } catch (error: any) {
    const status = error instanceof DeliveryError ? error.status : 500;
    return NextResponse.json({ error: error.message || "Failed to update sprint" }, { status });
  }
}
