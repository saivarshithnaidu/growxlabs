import "server-only";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EnterprisePmService } from "@/services/enterprise-pm";
import { changeSprint, findProject, findSprint, findTask, setTaskStatus, TASK_STATUSES, teamWorkload } from "@/lib/pm/delivery";
import { ToolExecutor } from "../registry/tool-types";

/*
 * Delivery and consulting-pipeline tools. Reads run straight away; moving a task and
 * starting or completing a sprint need the user's approval, then use the same rules as
 * the Projects board and the Sprints page (lib/pm/delivery.ts).
 */

const human = (value: unknown) => {
  const t = String(value || "").replaceAll("_", " ").toLowerCase().trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const day = (v: unknown) => (v ? String(v).slice(0, 10) : null);
const Empty = z.object({});

// ── Delivery: reads ────────────────────────────────────────────────────

export const listDeliveryProjectsExecutor: ToolExecutor<z.infer<typeof Empty>, unknown> = {
  name: "list_delivery_projects",
  description: "List delivery projects with client, status, health, progress (from completed story points) and task counts.",
  inputSchema: Empty,
  riskLevel: "low",
  requiredPermissions: ["projects:read"],
  async execute() {
    const { data, error } = await supabaseAdmin.from("projects").select("*").order("created_at", { ascending: false }).limit(50);
    if (error) throw new Error(error.message);
    return (data || []).map((row: any) => {
      const p: any = EnterprisePmService.formatProject(row);
      let tasks: any[] = [];
      try { tasks = JSON.parse(row.description || "{}").tasks || []; } catch { /* no tasks */ }
      return {
        project: p.name,
        client: p.company?.name || null,
        status: human(p.status),
        health: human(p.health),
        progress: `${p.progress}%`,
        openTasks: tasks.filter((t) => t.status !== "DONE").length,
        blocked: tasks.filter((t) => t.status === "BLOCKED").length,
      };
    });
  },
};

const ListTasksSchema = z.object({
  project: z.string().min(1),
  status: z.enum(TASK_STATUSES).optional(),
});

export const listProjectTasksExecutor: ToolExecutor<z.infer<typeof ListTasksSchema>, unknown> = {
  name: "list_project_tasks",
  description: "List the tasks on one project's board (by project name), optionally filtered by status.",
  inputSchema: ListTasksSchema,
  riskLevel: "low",
  requiredPermissions: ["projects:read"],
  async execute(input) {
    const project = await findProject(input.project);
    const tasks = (project.meta.tasks || []).filter((t: any) => !input.status || t.status === input.status);
    return tasks.map((t: any) => ({
      key: t.key || null,
      task: t.title,
      status: human(t.status),
      priority: human(t.priority),
      points: Number(t.story_points) || 0,
      assignee: t.assignee?.name || null,
      due: day(t.due_date),
    }));
  },
};

const ListSprintsSchema = z.object({ status: z.enum(["FUTURE", "ACTIVE", "COMPLETED", "all"]).optional() });

export const listSprintsExecutor: ToolExecutor<z.infer<typeof ListSprintsSchema>, unknown> = {
  name: "list_sprints",
  description: "List sprints with dates and story points committed and completed. Filter by FUTURE, ACTIVE or COMPLETED.",
  inputSchema: ListSprintsSchema,
  riskLevel: "low",
  requiredPermissions: ["projects:read"],
  async execute(input) {
    let query = supabaseAdmin.from("sprints").select("name,status,start_date,end_date,capacity_story_points,completed_story_points").order("start_date", { ascending: true });
    if (input.status && input.status !== "all") query = query.eq("status", input.status);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map((s) => ({
      sprint: s.name,
      status: s.status === "FUTURE" ? "Upcoming" : human(s.status),
      starts: day(s.start_date),
      ends: day(s.end_date),
      committed: s.capacity_story_points || 0,
      completed: s.completed_story_points || 0,
    }));
  },
};

export const getTeamWorkloadExecutor: ToolExecutor<z.infer<typeof Empty>, unknown> = {
  name: "get_team_workload",
  description: "Open tasks and story points assigned to each active team member across projects, with blocked and in-progress counts. There is no hours or capacity data.",
  inputSchema: Empty,
  riskLevel: "low",
  requiredPermissions: ["projects:read"],
  async execute() {
    const { members, unassignedOpen, unmatchedOpen } = await teamWorkload();
    return {
      unassignedOpenTasks: unassignedOpen,
      openTasksWithUnknownAssignee: unmatchedOpen,
      members: members.map((m) => ({ member: m.name, openTasks: m.open_tasks, openPoints: m.open_points, inProgress: m.in_progress, blocked: m.blocked, projects: m.projects.join(", ") })),
    };
  },
};

export const listChangeRequestsExecutor: ToolExecutor<z.infer<typeof Empty>, unknown> = {
  name: "list_change_requests",
  description: "List client change requests with status, impact and date.",
  inputSchema: Empty,
  riskLevel: "low",
  requiredPermissions: ["projects:read"],
  async execute() {
    const { data, error } = await supabaseAdmin.from("change_requests").select("change_number,title,status,impact,created_at").order("created_at", { ascending: false }).limit(30);
    if (error) throw new Error(error.message);
    return (data || []).map((c) => ({ request: c.change_number, title: c.title, status: human(c.status), impact: c.impact || null, created: day(c.created_at) }));
  },
};

// ── Delivery: writes (approval required) ───────────────────────────────

const MoveTaskSchema = z.object({
  project: z.string().min(1),
  task: z.string().min(1),
  status: z.enum(TASK_STATUSES),
});

export const moveTaskExecutor: ToolExecutor<z.infer<typeof MoveTaskSchema>, unknown> = {
  name: "move_task",
  description: "Move a task on a project board to another status (BACKLOG, TODO, IN_PROGRESS, REVIEW, TESTING, BLOCKED, DONE). Identify the project by name and the task by key (e.g. TRX-03) or title. Requires the user's approval on a card.",
  inputSchema: MoveTaskSchema,
  riskLevel: "medium",
  requiredPermissions: ["projects:write"],
  requiresApproval: true,
  async preview(input) {
    const project = await findProject(input.project);
    const task = findTask(project.meta, input.task);
    if (task.status === input.status) throw new Error(`${task.key || task.title} is already ${human(input.status).toLowerCase()}.`);
    return {
      summary: `Move ${task.key ? `${task.key} ` : ""}"${task.title}" to ${human(input.status)}`,
      details: [
        { label: "Project", value: project.displayName },
        { label: "From", value: human(task.status) },
        { label: "To", value: human(input.status) },
      ],
    };
  },
  async execute(input) {
    const project = await findProject(input.project);
    const task = findTask(project.meta, input.task);
    const updated = await setTaskStatus(project.id, task.id, input.status);
    return { task: updated.key || updated.title, status: human(updated.status), project: project.displayName };
  },
};

const SprintActionSchema = z.object({ sprint: z.string().min(1), action: z.enum(["start", "complete"]) });

export const changeSprintExecutor: ToolExecutor<z.infer<typeof SprintActionSchema>, unknown> = {
  name: "change_sprint",
  description: "Start an upcoming sprint or complete the active one (by sprint name). Only one sprint can be active per project. Requires the user's approval on a card.",
  inputSchema: SprintActionSchema,
  riskLevel: "medium",
  requiredPermissions: ["projects:write"],
  requiresApproval: true,
  async preview(input) {
    const sprint = await findSprint(input.sprint);
    if (input.action === "start" && sprint.status !== "FUTURE") throw new Error(`${sprint.name} is ${human(sprint.status).toLowerCase()}, so it can't be started.`);
    if (input.action === "complete" && sprint.status !== "ACTIVE") throw new Error(`${sprint.name} isn't active, so it can't be completed.`);
    return {
      summary: `${input.action === "start" ? "Start" : "Complete"} ${sprint.name}`,
      details: [
        { label: "Dates", value: `${day(sprint.start_date) || "No start"} to ${day(sprint.end_date) || "no end"}` },
        { label: "Points", value: `${sprint.completed_story_points || 0} of ${sprint.capacity_story_points || 0} done` },
      ],
    };
  },
  async execute(input) {
    const sprint = await findSprint(input.sprint);
    const updated: any = await changeSprint(sprint.id, input.action);
    return { sprint: updated.name, status: human(updated.status) };
  },
};

// ── Consulting pipeline: reads ─────────────────────────────────────────

const StatusFilter = z.object({ status: z.string().optional(), limit: z.number().int().min(1).max(50).optional() });

async function companyNames(ids: Array<string | null | undefined>) {
  const unique = [...new Set(ids.filter(Boolean))] as string[];
  if (!unique.length) return new Map<string, string>();
  const { data } = await supabaseAdmin.from("companies").select("id,name").in("id", unique);
  return new Map((data || []).map((c: { id: string; name: string }) => [c.id, c.name]));
}

export const listDiscoveryMeetingsExecutor: ToolExecutor<z.infer<typeof StatusFilter>, unknown> = {
  name: "list_discovery_meetings",
  description: "List discovery meetings with client, status, schedule and agenda progress. Filter by status (draft, scheduled, confirmed, in_progress, completed, closed, cancelled).",
  inputSchema: StatusFilter,
  riskLevel: "low",
  requiredPermissions: ["proposals:read"],
  async execute(input) {
    let query = supabaseAdmin.from("discovery_meetings").select("meeting_number,title,status,scheduled_start,company_id,agenda").order("created_at", { ascending: false }).limit(input.limit || 20);
    if (input.status) query = query.eq("status", input.status);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const names = await companyNames((data || []).map((m) => m.company_id));
    return (data || []).map((m: any) => {
      const agenda = Array.isArray(m.agenda) ? m.agenda : [];
      return {
        meeting: m.meeting_number,
        client: names.get(m.company_id) || null,
        status: human(m.status),
        scheduled: m.scheduled_start ? String(m.scheduled_start).slice(0, 16).replace("T", " ") : null,
        agenda: agenda.length ? `${agenda.filter((a: any) => a.covered).length} of ${agenda.length} covered` : null,
      };
    });
  },
};

export const listProposalsExecutor: ToolExecutor<z.infer<typeof StatusFilter>, unknown> = {
  name: "list_proposals",
  description: "List commercial proposals with status and version. Use status internal_review for proposals waiting for approval.",
  inputSchema: StatusFilter,
  riskLevel: "low",
  requiredPermissions: ["proposals:read"],
  async execute(input) {
    let query = supabaseAdmin.from("commercial_proposals").select("proposal_number,status,version,company_id,updated_at").order("updated_at", { ascending: false }).limit(input.limit || 20);
    if (input.status) query = query.eq("status", input.status);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const names = await companyNames((data || []).map((p) => p.company_id));
    return (data || []).map((p) => ({ proposal: p.proposal_number, client: names.get(p.company_id) || null, status: human(p.status), version: p.version, updated: day(p.updated_at) }));
  },
};

export const listAssessmentsExecutor: ToolExecutor<z.infer<typeof StatusFilter>, unknown> = {
  name: "list_assessments",
  description: "List client business assessments with status, completion and last update. Filter by status (draft, submitted, under_review, review_complete, more_information_required).",
  inputSchema: StatusFilter,
  riskLevel: "low",
  requiredPermissions: ["proposals:read"],
  async execute(input) {
    let query = supabaseAdmin.from("client_assessments").select("assessment_number,status,completion_percentage,company_id,updated_at").order("updated_at", { ascending: false }).limit(input.limit || 20);
    if (input.status) query = query.eq("status", input.status);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const names = await companyNames((data || []).map((a) => a.company_id));
    return (data || []).map((a) => ({ assessment: a.assessment_number, client: names.get(a.company_id) || null, status: human(a.status), completion: `${a.completion_percentage ?? 0}%`, updated: day(a.updated_at) }));
  },
};

export const DELIVERY_TOOL_NAMES = ["list_delivery_projects", "list_project_tasks", "list_sprints", "get_team_workload", "list_change_requests", "move_task", "change_sprint"];
export const PIPELINE_TOOL_NAMES = ["list_discovery_meetings", "list_proposals", "list_assessments"];
