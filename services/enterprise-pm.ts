import { supabaseAdmin } from "@/lib/supabase/admin";

export class EnterprisePmService {
  /**
   * Promotes a won CRM deal into a fully fledged Project execution model.
   * Creates projects, seeds standard milestones, epics, assigns PMs, and logs timeline logs.
   */
  static async promoteDealToProject(dealId: string) {
    // 1. Fetch CRM Deal Details
    const { data: deal, error: dealErr } = await supabaseAdmin
      .from("deals")
      .select("*, company:companies(*)")
      .eq("id", dealId)
      .single();

    if (dealErr || !deal) {
      throw new Error(`Failed to find CRM deal: ${dealErr?.message || "Not found"}`);
    }

    // 2. Insert Project
    const { data: project, error: projErr } = await supabaseAdmin
      .from("projects")
      .insert({
        name: `${deal.name} Delivery`,
        company_id: deal.company_id,
        deal_id: deal.id,
        project_manager_id: deal.owner_id || null,
        budget: deal.value,
        status: "PLANNING",
        priority: "MEDIUM",
        health: "ON_TRACK",
        progress: 0,
        description: `Project Delivery promoted automatically from won CRM Deal: ${deal.name}.`
      })
      .select()
      .single();

    if (projErr || !project) {
      throw new Error(`Failed to initialize Project: ${projErr?.message}`);
    }

    // 3. Assign Deal Owner as Project Manager
    if (deal.owner_id) {
      await supabaseAdmin.from("project_members").insert({
        project_id: project.id,
        team_member_id: deal.owner_id,
        role: "PROJECT_MANAGER",
        assigned_hours_per_week: 40.00
      });
    }

    // 4. Seed Standard Delivery Milestones
    const milestones = [
      { title: "Kickoff & Requirements Align", offsetDays: 7, desc: "Verify initial scope parameters" },
      { title: "High Fidelity Design Signoff", offsetDays: 21, desc: "UX design alignment" },
      { title: "Alpha MVP Release", offsetDays: 45, desc: "Working backend/frontend integration" },
      { title: "QA & Integration Signoff", offsetDays: 60, desc: "Testing suite validation" },
      { title: "Client UAT Approvals", offsetDays: 75, desc: "Final client review window" },
      { title: "Production Deployment", offsetDays: 90, desc: "Release product live" }
    ];

    const milestoneInserts = milestones.map(m => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + m.offsetDays);
      return {
        project_id: project.id,
        title: m.title,
        description: m.desc,
        due_date: dueDate.toISOString().split("T")[0],
        status: "PENDING",
        completion_percentage: 0
      };
    });

    await supabaseAdmin.from("milestones").insert(milestoneInserts);

    // 5. Seed Core Agile Epic
    await supabaseAdmin.from("epics").insert({
      project_id: project.id,
      name: "Phase 1 MVP Execution Core",
      description: "Baseline stories and tasks tracked for delivery",
      status: "TODO"
    });

    // 6. Log PM Activity Log
    await supabaseAdmin.from("activity_logs").insert({
      project_id: project.id,
      action_type: "PROJECT_CREATED",
      title: "Project Delivery Initiated",
      description: `Project automatically generated from won CRM deal ${deal.name}.`,
      performed_by_id: deal.owner_id || null
    });

    return project;
  }

  /**
   * Retrieves a full 360-degree view of a project, tasks, milestones, bugs, and calendar items.
   */
  static async getProjectDashboard(projectId: string) {
    const [projectRes, membersRes, milestonesRes, epicsRes, sprintsRes, tasksRes, bugsRes, docsRes, logsRes] = await Promise.all([
      supabaseAdmin.from("projects").select("*, company:companies(name)").eq("id", projectId).single(),
      supabaseAdmin.from("project_members").select("*, team_member:team_members(name, email)").eq("project_id", projectId),
      supabaseAdmin.from("milestones").select("*").eq("project_id", projectId).order("due_date", { ascending: true }),
      supabaseAdmin.from("epics").select("*").eq("project_id", projectId),
      supabaseAdmin.from("sprints").select("*").eq("project_id", projectId).order("start_date", { ascending: true }),
      supabaseAdmin.from("tasks").select("*, assignee:team_members(name)").eq("project_id", projectId),
      supabaseAdmin.from("bugs").select("*").eq("project_id", projectId),
      supabaseAdmin.from("documents").select("*").eq("project_id", projectId),
      supabaseAdmin.from("activity_logs").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).limit(25)
    ]);

    if (projectRes.error) throw projectRes.error;

    return {
      project: projectRes.data,
      members: membersRes.data || [],
      milestones: milestonesRes.data || [],
      epics: epicsRes.data || [],
      sprints: sprintsRes.data || [],
      tasks: tasksRes.data || [],
      bugs: bugsRes.data || [],
      documents: docsRes.data || [],
      activityLogs: logsRes.data || []
    };
  }

  /**
   * Logs time entry details and handles timer limits.
   */
  static async logTimeEntry(data: {
    timesheet_id: string;
    task_id: string;
    log_date: string;
    hours_logged: number;
    description?: string;
  }) {
    // Check if task exists and update task actual hours summary
    const { data: task, error: tErr } = await supabaseAdmin
      .from("tasks")
      .select("actual_hours, project_id")
      .eq("id", data.task_id)
      .single();

    if (tErr || !task) throw new Error("Task not found");

    // Insert log
    const { data: log, error: logErr } = await supabaseAdmin
      .from("time_logs")
      .insert(data)
      .select()
      .single();

    if (logErr) throw logErr;

    // Update Task Actuals
    const newActuals = Number(task.actual_hours) + Number(data.hours_logged);
    await supabaseAdmin.from("tasks").update({ actual_hours: newActuals }).eq("id", data.task_id);

    // Update Project Actuals
    const { data: proj } = await supabaseAdmin.from("projects").select("actual_hours").eq("id", task.project_id).single();
    if (proj) {
      const projHours = Number(proj.actual_hours) + Number(data.hours_logged);
      await supabaseAdmin.from("projects").update({ actual_hours: projHours }).eq("id", task.project_id);
    }

    return log;
  }
}
