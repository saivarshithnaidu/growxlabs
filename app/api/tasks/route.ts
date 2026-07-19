import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { WorkflowEngine } from "@/services/workflow-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assigned_to = searchParams.get("assigned_to");
    const status = searchParams.get("status");

    let query = supabaseAdmin.from("tasks").select("*, deal:deals(name), company:companies(name), contact:contacts(first_name, last_name)");
    
    if (assigned_to) query = query.eq("assigned_to", assigned_to);
    if (status) query = query.eq("status", status);

    const { data: tasks, error } = await query.order("due_date", { ascending: true });
    if (error) throw error;

    return NextResponse.json({ tasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: task, error } = await supabaseAdmin.from("tasks").insert(body).select().single();
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
    const { data: task, error } = await supabaseAdmin.from("tasks").update(updates).eq("id", id).select().single();
    if (error) throw error;

    if (updates.status === "COMPLETED") {
      // Evaluate workflows on task completion
      await WorkflowEngine.evaluateRules("task_completed", task, "task");
    }

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update task" }, { status: 400 });
  }
}
