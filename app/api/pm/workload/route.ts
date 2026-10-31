import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Load = {
  id: string;
  name: string;
  email: string;
  open_tasks: number;
  open_points: number;
  in_progress: number;
  blocked: number;
  done_tasks: number;
  projects: string[];
};

const OPEN_DONE = "DONE";

// Workload = task assignments across delivery projects (tasks live in each project's JSON description).
// There is no capacity or hours data yet, so nothing here claims a member is over or under capacity.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    if (!["ADMIN", "CO_ADMIN", "crm_agent"].includes(String(session.user.role))) {
      return NextResponse.json({ error: "You don't have permission to view workload." }, { status: 403 });
    }

    const { data: identities } = await supabaseAdmin
      .schema("identity")
      .from("employee_identities")
      .select("employee_id, email")
      .eq("workspace_status", "active");
    const empIds = (identities || []).map((i) => i.employee_id).filter(Boolean);
    const emailById = new Map((identities || []).map((i) => [i.employee_id, i.email || ""]));
    const { data: employees, error: empError } = empIds.length
      ? await supabaseAdmin.schema("people").from("employees").select("id, first_name, last_name").in("id", empIds).is("deleted_at", null)
      : { data: [], error: null };
    if (empError) throw new Error(empError.message);

    const loads = new Map<string, Load>();
    const byName = new Map<string, string>();
    const byEmail = new Map<string, string>();
    for (const e of employees || []) {
      const name = `${e.first_name} ${e.last_name || ""}`.trim();
      const email = emailById.get(e.id) || "";
      loads.set(e.id, { id: e.id, name, email, open_tasks: 0, open_points: 0, in_progress: 0, blocked: 0, done_tasks: 0, projects: [] });
      byName.set(name.toLowerCase(), e.id);
      if (email) byEmail.set(email.toLowerCase(), e.id);
    }

    const { data: projects, error: projectError } = await supabaseAdmin.from("projects").select("id, title, name, description");
    if (projectError) throw new Error(projectError.message);

    let unassignedOpen = 0;
    let unmatchedOpen = 0;
    for (const p of projects || []) {
      let tasks: any[] = [];
      try {
        const meta = JSON.parse(p.description || "{}");
        if (Array.isArray(meta.tasks)) tasks = meta.tasks;
      } catch {
        continue;
      }
      const projectName = p.title || p.name || "Project";
      for (const t of tasks) {
        const open = t.status !== OPEN_DONE;
        const assignee = t.assignee || {};
        const memberId = (assignee.email && byEmail.get(String(assignee.email).toLowerCase())) || (assignee.name && byName.get(String(assignee.name).toLowerCase()));
        if (!memberId) {
          if (open) {
            if (assignee.name || assignee.email) unmatchedOpen++;
            else unassignedOpen++;
          }
          continue;
        }
        const load = loads.get(memberId)!;
        if (!open) { load.done_tasks++; continue; }
        load.open_tasks++;
        load.open_points += Number(t.story_points) || 0;
        if (t.status === "IN_PROGRESS" || t.status === "REVIEW" || t.status === "TESTING") load.in_progress++;
        if (t.status === "BLOCKED") load.blocked++;
        if (!load.projects.includes(projectName)) load.projects.push(projectName);
      }
    }

    const members = [...loads.values()].sort((a, b) => b.open_points - a.open_points || b.open_tasks - a.open_tasks || a.name.localeCompare(b.name));
    return NextResponse.json({ members, unassignedOpen, unmatchedOpen });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load workload." }, { status: 500 });
  }
}
