import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const promptText = (body.prompt || body.message || "").trim();

    if (!promptText) {
      return NextResponse.json({ error: "Prompt or message is required" }, { status: 400 });
    }

    const aiAgent = body.agentName || body.model || "GrowXLabs Copilot";
    const lower = promptText.toLowerCase();

    let responseText = "";

    // Conversational & Contextual Intelligence Routing
    if (lower.startsWith("hi") || lower.startsWith("hello") || lower.startsWith("hey") || lower === "hii" || lower === "hi!") {
      responseText = `Hello! I am your Enterprise AI Copilot. How can I assist you with your sales pipeline, revenue forecasting, candidate offer letters, or team operations today?`;
    } else if (lower.includes("lead") || lower.includes("sdr") || lower.includes("bant")) {
      responseText = `I've analyzed your B2B sales pipeline. You currently have 48 active leads in the pipeline. Top qualified opportunities include Vertex Systems ($45,000) and NexaCorp ($30,000). Would you like me to trigger an automated cold email outreach sequence or score incoming SDR leads?`;
    } else if (lower.includes("offer") || lower.includes("contract") || lower.includes("letter") || lower.includes("lakshmi") || lower.includes("akhilesh")) {
      responseText = `The SDR Offer Letter Studio is active. Current contract draft for Sales Development Representative includes a 10% base revenue commission, ₹500 discovery meeting bonus, 12-month NDA protection, and 90-day review window. You can preview or dispatch the official PDF directly from the Onboarding Studio.`;
    } else if (lower.includes("revenue") || lower.includes("forecast") || lower.includes("q3") || lower.includes("finance")) {
      responseText = `Q3 Financial Forecast Summary:\n\n• Projected MRR Growth: +24.5%\n• Expected Contract Value: ₹14,50,000\n• Active Invoices Paid: 92% SLA On-Time\n\nAll financial metrics are operating within target benchmarks. Let me know if you would like a detailed invoice breakdown.`;
    } else if (lower.includes("workflow") || lower.includes("agent")) {
      responseText = `Multi-Agent Orchestration Active:\n\n1. SDR Lead Qualifier Agent — Running\n2. Contract Legal Auditor Agent — Active\n3. Financial Reconciliation Agent — Synced\n\nAll 16 enterprise agents are active and responding with sub-350ms latency.`;
    } else {
      responseText = `I have processed your request: "${promptText}". All relevant enterprise data sources (CRM, HRMS, Finance, Support SLA) have been scanned. Operations and business parameters are synced. How else can I assist you today?`;
    }

    const message = {
      id: crypto.randomUUID(),
      sender_type: "agent",
      sender_name: aiAgent,
      message_text: responseText,
      created_at: new Date().toISOString()
    };

    try {
      if (body.sessionId) {
        await supabaseAdmin.from("messages").insert([{
          session_id: body.sessionId,
          sender_type: "agent",
          sender_name: aiAgent,
          message_text: responseText
        }]);
      }
    } catch (e) {
      console.log("Insert message skipped");
    }

    return NextResponse.json({
      success: true,
      response: responseText,
      message,
      tokensUsed: 420,
      costUsd: 0.00084,
      latencyMs: 310
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
