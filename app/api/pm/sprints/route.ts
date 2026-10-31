import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

    const { data: sprint, error: findError } = await supabaseAdmin.from("sprints").select("id,project_id,status").eq("id", id).maybeSingle();
    if (findError) throw findError;
    if (!sprint) return NextResponse.json({ error: "Sprint not found." }, { status: 404 });

    if (action === "start") {
      if (sprint.status !== "FUTURE") return NextResponse.json({ error: "Only an upcoming sprint can be started." }, { status: 409 });
      let active = supabaseAdmin.from("sprints").select("id,name").eq("status", "ACTIVE");
      active = sprint.project_id ? active.eq("project_id", sprint.project_id) : active.is("project_id", null);
      const { data: running, error: activeError } = await active.limit(1);
      if (activeError) throw activeError;
      if (running?.length) return NextResponse.json({ error: `Complete "${running[0].name}" before starting another sprint.` }, { status: 409 });
    } else if (sprint.status !== "ACTIVE") {
      return NextResponse.json({ error: "Only the active sprint can be completed." }, { status: 409 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from("sprints")
      .update({ status: action === "start" ? "ACTIVE" : "COMPLETED", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ sprint: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update sprint" }, { status: 500 });
  }
}
