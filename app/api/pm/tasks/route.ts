import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");
    const sprint_id = searchParams.get("sprint_id");

    let query = supabaseAdmin.from("tasks").select("*, assignee:team_members(name)");
    
    if (project_id) query = query.eq("project_id", project_id);
    if (sprint_id) query = query.eq("sprint_id", sprint_id);

    const { data: tasks, error } = await query.order("created_at", { ascending: true });
    if (error) throw error;

    return NextResponse.json({ tasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: task, error } = await supabaseAdmin
      .from("tasks")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create task" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("Missing task ID");

    const updates = await request.json();
    const { data: task, error } = await supabaseAdmin
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Log PM Activity Event
    await supabaseAdmin.from("activity_logs").insert({
      project_id: task.project_id,
      task_id: task.id,
      action_type: "TASK_ADDED",
      title: "Task Status Updated",
      description: `Task status changed to ${task.status}.`
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update task" }, { status: 400 });
  }
}
