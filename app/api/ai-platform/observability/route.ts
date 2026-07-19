import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_PROMPTS = [
  { id: "p1", title: "CRM Lead Qualifier Prompt", category: "Sales", template_text: "Analyze lead company size {{company_size}} and budget {{budget}} to output MQL status.", variables: ["company_size", "budget"] },
  { id: "p2", title: "Support Auto-Reply Generator", category: "Support", template_text: "Formulate a helpful response for support ticket {{ticket_subject}} adhering to SLA tier {{sla}}.", variables: ["ticket_subject", "sla"] },
  { id: "p3", title: "Executive Intelligence Summarizer", category: "Executive", template_text: "Synthesize weekly KPI progress across Sales, Finance, and Engineering.", variables: [] }
];

export async function GET() {
  try {
    const observabilityMetrics = {
      totalTokensThisMonth: 14258900,
      totalCostUsd: 28.5178,
      avgLatencyMs: 340,
      successfulRunsCount: 8940,
      failedRunsCount: 12,
      modelUsageBreakdown: [
        { model: "Google Gemini 1.5 Flash", calls: 7420, cost: "$14.84", tokens: "7.4M" },
        { model: "Google Gemini 1.5 Pro", calls: 1210, cost: "$11.20", tokens: "5.1M" },
        { model: "OpenAI GPT-4o Fallback", calls: 310, cost: "$2.47", tokens: "1.7M" }
      ],
      prompts: MOCK_PROMPTS
    };

    return NextResponse.json(observabilityMetrics);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
