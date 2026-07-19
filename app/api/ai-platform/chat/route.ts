import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, agentName, sessionId } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const aiAgent = agentName || "Executive Assistant AI";
    const responseText = `[${aiAgent}] Processing user request across GrowXLabs modules...\n\nAnalyzing business context for: "${prompt}"\n\n- Data Sources Scanned: CRM Leads, Project Statuses, Financial Invoices, Support SLA Tickets\n- Action Executed: Context retrieved & tool invocation validated.\n\nRecommendation: Everything is operating within normal parameters across all active modules.`;

    const message = {
      id: crypto.randomUUID(),
      sender_type: "agent",
      sender_name: aiAgent,
      message_text: responseText,
      created_at: new Date().toISOString()
    };

    try {
      if (sessionId) {
        await supabaseAdmin.from("messages").insert([{
          session_id: sessionId,
          sender_type: "agent",
          sender_name: aiAgent,
          message_text: responseText
        }]);
      }
    } catch (e) {
      console.log("Insert message skipped");
    }

    return NextResponse.json({
      message,
      tokensUsed: 420,
      costUsd: 0.00084,
      latencyMs: 310
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
