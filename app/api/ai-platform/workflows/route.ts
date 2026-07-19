import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_WORKFLOWS = [
  { id: "w1", workflow_name: "MQL Lead Handoff Automation", trigger_module: "Marketing", trigger_event: "Lead_Score_Over_80", description: "Automatically creates CRM deal, notifies SDR on Slack, and assigns task.", is_active: true },
  { id: "w2", workflow_name: "Overdue Invoice Escalation Flow", trigger_module: "Finance", trigger_event: "Invoice_Overdue_7_Days", description: "Sends email reminder, updates account risk score, and alerts CSM.", is_active: true },
  { id: "w3", workflow_name: "Critical Ticket SLA Escalation", trigger_module: "Support", trigger_event: "Urgent_SLA_Breach", description: "Reassigns ticket to Lead Engineer and alerts Manager.", is_active: true }
];

export async function GET() {
  try {
    const { data: workflows } = await supabaseAdmin.from("agent_workflows").select("*");
    return NextResponse.json({
      workflows: workflows && workflows.length > 0 ? workflows : MOCK_WORKFLOWS
    });
  } catch (e) {
    return NextResponse.json({ workflows: MOCK_WORKFLOWS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workflow_name, trigger_module, trigger_event, description } = body;

    if (!workflow_name) return NextResponse.json({ error: "Workflow name required" }, { status: 400 });

    const newWf = {
      id: crypto.randomUUID(),
      workflow_name,
      trigger_module: trigger_module || "CRM",
      trigger_event: trigger_event || "Manual_Trigger",
      description: description || "Automated cross-module workflow",
      is_active: true
    };

    try {
      await supabaseAdmin.from("agent_workflows").insert([newWf]);
    } catch (e) {
      console.log("Insert workflow skipped");
    }

    return NextResponse.json({ workflow: newWf });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
