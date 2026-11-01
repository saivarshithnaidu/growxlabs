import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";

/*
 * Delivery rules shared by the PM API routes and the command center tools, so a sprint
 * started from the chat follows exactly the same checks as one started on the Sprints page.
 */

export class DeliveryError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const TASK_STATUSES = ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "TESTING", "BLOCKED", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

type Meta = Record<string, any> & { tasks?: any[] };

function parseMeta(description: string | null): Meta {
  try {
    return JSON.parse(description || "{}");
  } catch {
    return {};
  }
}

/** A project by id, or by (part of) its name when exactly one matches. */
export async function findProject(reference: string) {
  const ref = reference.trim();
  const query = supabaseAdmin.from("projects").select("id,title,name,status,description");
  const { data, error } = UUID.test(ref) ? await query.eq("id", ref) : await query.ilike("title", `%${ref}%`).limit(5);
  if (error) throw new Error(error.message);
  if (!data?.length) throw new DeliveryError(404, `No project found for "${reference}".`);
  if (data.length > 1) throw new DeliveryError(409, `"${reference}" matches ${data.length} projects: ${data.map((p) => p.title || p.name).join(", ")}. Be more specific.`);
  const project = data[0];
  return { ...project, displayName: project.title || project.name || "Project", meta: parseMeta(project.description) };
}

/** A task inside a project, by its key (e.g. TRX-03) or by (part of) its title. */
export function findTask(meta: Meta, reference: string) {
  const ref = reference.trim().toLowerCase();
  const tasks = Array.isArray(meta.tasks) ? meta.tasks : [];
  const byKey = tasks.filter((t) => String(t.key || "").toLowerCase() === ref || String(t.id) === reference.trim());
  const matches = byKey.length ? byKey : tasks.filter((t) => String(t.title || "").toLowerCase().includes(ref));
  if (!matches.length) throw new DeliveryError(404, `No task "${reference}" in this project.`);
  if (matches.length > 1) throw new DeliveryError(409, `"${reference}" matches ${matches.length} tasks: ${matches.map((t) => t.key || t.title).join(", ")}.`);
  return matches[0];
}

export async function setTaskStatus(projectId: string, taskId: string, status: TaskStatus) {
  const { data: project, error } = await supabaseAdmin.from("projects").select("description").eq("id", projectId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!project) throw new DeliveryError(404, "Project not found.");
  const meta = parseMeta(project.description);
  const tasks = Array.isArray(meta.tasks) ? meta.tasks : [];
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) throw new DeliveryError(404, "Task not found.");
  tasks[index] = { ...tasks[index], status, updated_at: new Date().toISOString() };
  meta.tasks = tasks;
  const { error: saveError } = await supabaseAdmin.from("projects").update({ description: JSON.stringify(meta) }).eq("id", projectId);
  if (saveError) throw new Error(saveError.message);
  return tasks[index];
}

/** Start an upcoming sprint (only one active per project) or complete the active one. */
export async function changeSprint(id: string, action: "start" | "complete") {
  const { data: sprint, error: findError } = await supabaseAdmin.from("sprints").select("id,name,project_id,status").eq("id", id).maybeSingle();
  if (findError) throw new Error(findError.message);
  if (!sprint) throw new DeliveryError(404, "Sprint not found.");

  if (action === "start") {
    if (sprint.status !== "FUTURE") throw new DeliveryError(409, "Only an upcoming sprint can be started.");
    let active = supabaseAdmin.from("sprints").select("id,name").eq("status", "ACTIVE");
    active = sprint.project_id ? active.eq("project_id", sprint.project_id) : active.is("project_id", null);
    const { data: running, error: activeError } = await active.limit(1);
    if (activeError) throw new Error(activeError.message);
    if (running?.length) throw new DeliveryError(409, `Complete "${running[0].name}" before starting another sprint.`);
  } else if (sprint.status !== "ACTIVE") {
    throw new DeliveryError(409, "Only the active sprint can be completed.");
  }

  const { data: updated, error } = await supabaseAdmin
    .from("sprints")
    .update({ status: action === "start" ? "ACTIVE" : "COMPLETED", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return updated;
}

/** A sprint by id or (part of) its name. */
export async function findSprint(reference: string) {
  const ref = reference.trim();
  const query = supabaseAdmin.from("sprints").select("id,name,status,start_date,end_date,capacity_story_points,completed_story_points,project_id");
  const { data, error } = UUID.test(ref) ? await query.eq("id", ref) : await query.ilike("name", `%${ref}%`).limit(5);
  if (error) throw new Error(error.message);
  if (!data?.length) throw new DeliveryError(404, `No sprint found for "${reference}".`);
  if (data.length > 1) throw new DeliveryError(409, `"${reference}" matches ${data.length} sprints: ${data.map((s) => s.name).join(", ")}.`);
  return data[0];
}

export type MemberLoad = {
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

/**
 * Open tasks and story points per active team member across delivery projects. There is no
 * capacity or hours data, so nothing here judges whether someone is over capacity.
 */
export async function teamWorkload() {
  const { data: identities } = await supabaseAdmin.schema("identity").from("employee_identities").select("employee_id, email").eq("workspace_status", "active");
  const empIds = (identities || []).map((i) => i.employee_id).filter(Boolean);
  const emailById = new Map((identities || []).map((i) => [i.employee_id, i.email || ""]));
  const { data: employees, error: empError } = empIds.length
    ? await supabaseAdmin.schema("people").from("employees").select("id, first_name, last_name").in("id", empIds).is("deleted_at", null)
    : { data: [], error: null };
  if (empError) throw new Error(empError.message);

  const loads = new Map<string, MemberLoad>();
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
    const tasks = parseMeta(p.description).tasks;
    if (!Array.isArray(tasks)) continue;
    const projectName = p.title || p.name || "Project";
    for (const t of tasks) {
      const open = t.status !== "DONE";
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
  return { members, unassignedOpen, unmatchedOpen };
}
