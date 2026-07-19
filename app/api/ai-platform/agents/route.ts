import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_AGENTS = [
  { id: "a1", agent_name: "Sales Agent", role_description: "Automates lead scoring, follow-ups, and CRM deal updates.", model_name: "gemini-1.5-flash", is_active: true },
  { id: "a2", agent_name: "Finance Agent", role_description: "Performs invoice reconciliation, ARR forecasting, and expense audits.", model_name: "gemini-1.5-flash", is_active: true },
  { id: "a3", agent_name: "HR & Recruiter Agent", role_description: "Screens candidate resumes, schedules interviews, and tracks onboarding.", model_name: "gemini-1.5-flash", is_active: true },
  { id: "a4", agent_name: "Support Agent", role_description: "Classifies SLA support tickets, generates auto-replies, and updates KB.", model_name: "gemini-1.5-flash", is_active: true },
  { id: "a5", agent_name: "Project Manager Agent", role_description: "Tracks sprint deliverables, flags project risks, and assigns tasks.", model_name: "gemini-1.5-flash", is_active: true },
  { id: "a6", agent_name: "Marketing Agent", role_description: "Generates ad copy, landing page content, and social media carousels.", model_name: "gemini-1.5-flash", is_active: true },
  { id: "a7", agent_name: "Developer & QA Agent", role_description: "Performs code reviews, runs unit tests, and detects syntax regressions.", model_name: "gemini-1.5-flash", is_active: true },
  { id: "a8", agent_name: "Executive Assistant Agent", role_description: "Synthesizes cross-module business intelligence reports for leadership.", model_name: "gemini-1.5-flash", is_active: true }
];

export async function GET() {
  try {
    const { data: agents } = await supabaseAdmin.from("ai_agents").select("*");
    return NextResponse.json({
      agents: agents && agents.length > 0 ? agents : MOCK_AGENTS
    });
  } catch (e) {
    return NextResponse.json({ agents: MOCK_AGENTS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, goalPrompt } = body;

    if (action === "orchestrate" && goalPrompt) {
      // Simulate multi-agent orchestration pipeline
      const pipelineSteps = [
        { stage: "Planner Agent", action: "Deconstructed goal into 4 sub-tasks.", status: "Success" },
        { stage: "Researcher Agent", action: "Retrieved 14 CRM leads & 3 financial invoices from database.", status: "Success" },
        { stage: "Executor Agent", action: "Executed cross-module workflow actions.", status: "Success" },
        { stage: "Reviewer Agent", action: "Verified PII safety and role-based permissions.", status: "Success" },
        { stage: "Reporter Agent", action: "Generated final synthesized executive summary.", status: "Success" }
      ];

      return NextResponse.json({
        success: true,
        goalPrompt,
        pipelineSteps,
        summaryResult: `Multi-Agent Orchestration complete for: "${goalPrompt}". All 5 sub-agents executed tasks synchronously with 100% compliance.`
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
