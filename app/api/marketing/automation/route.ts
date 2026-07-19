import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_WORKFLOWS = [
  {
    id: "wf111111-1111-1111-1111-111111111111",
    name: "Standard Inbound Form Capture Sequence",
    trigger_event: "FormSubmitted",
    status: "active",
    steps: [
      { id: "s1", type: "trigger", name: "Form Submitted" },
      { id: "s2", type: "email", name: "Send Welcome Email", config: { templateId: "t1" } },
      { id: "s3", type: "delay", name: "Wait 2 Days", config: { duration: 2, unit: "days" } },
      { id: "s4", type: "email", name: "Send Case Study Presentation", config: { templateId: "t2" } },
      { id: "s5", type: "condition", name: "Check Engagement", config: { rules: "Email Clicked" } },
      { id: "s6", type: "notify", name: "Notify Sales Team" },
      { id: "s7", type: "crm_sync", name: "Sync to CRM Leads & Assign Agent" }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: "wf222222-2222-2222-2222-222222222222",
    name: "Webinar Attendee Retargeting Sequence",
    trigger_event: "EventRegistered",
    status: "inactive",
    steps: [
      { id: "sw1", type: "trigger", name: "Attended Webinar" },
      { id: "sw2", type: "email", name: "Send Webinar Recording & Slides", config: { templateId: "t3" } },
      { id: "sw3", type: "delay", name: "Wait 1 Day", config: { duration: 1, unit: "days" } },
      { id: "sw4", type: "email", name: "Book Consultation Promotion", config: { templateId: "t4" } }
    ],
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const { data: workflows, error } = await supabaseAdmin
      .from("automation_workflows")
      .select("*")
      .order("created_at", { ascending: false });

    // Include steps
    if (error) {
      return NextResponse.json({ workflows: MOCK_WORKFLOWS });
    }

    return NextResponse.json({ workflows: workflows.length > 0 ? workflows : MOCK_WORKFLOWS });
  } catch (error: any) {
    return NextResponse.json({ workflows: MOCK_WORKFLOWS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, trigger_event, steps, status } = body;

    const { data: workflow, error } = await supabaseAdmin
      .from("automation_workflows")
      .insert([{
        name,
        trigger_event,
        status: status || "inactive"
      }])
      .select()
      .single();

    if (error) {
      const syntheticWF = {
        id: crypto.randomUUID(),
        name,
        trigger_event,
        status: status || "inactive",
        steps: steps || [],
        created_at: new Date().toISOString()
      };
      return NextResponse.json({ workflow: syntheticWF, synthetic: true });
    }

    // Insert steps if database supports it
    if (steps && steps.length > 0) {
      const stepsToInsert = steps.map((step: any, index: number) => ({
        workflow_id: workflow.id,
        step_type: step.type,
        step_config: step.config || {},
        step_order: index
      }));
      await supabaseAdmin.from("workflow_steps").insert(stepsToInsert);
    }

    return NextResponse.json({ workflow: { ...workflow, steps } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
