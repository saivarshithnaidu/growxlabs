import { NextResponse } from "next/server";
import { EnterpriseCrmService } from "@/services/enterprise-crm";
import { WorkflowEngine } from "@/services/workflow-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get("company_id") || undefined;
    const stage_id = searchParams.get("stage_id") || undefined;
    const owner_id = searchParams.get("owner_id") || undefined;

    const deals = await EnterpriseCrmService.getDeals({ company_id, stage_id, owner_id });
    const stages = await EnterpriseCrmService.getDealStages();
    
    return NextResponse.json({ deals, stages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch deals data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deal = await EnterpriseCrmService.createDeal(body);

    // Evaluate workflows
    await WorkflowEngine.evaluateRules("deal_created", deal, "deal");

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create deal" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("Missing deal ID parameter");

    const { stage_id } = await request.json();
    const deal = await EnterpriseCrmService.updateDealStage(id, stage_id);

    // Evaluate workflows on stage update
    await WorkflowEngine.evaluateRules("deal_stage_updated", deal, "deal");

    return NextResponse.json({ deal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update deal stage" }, { status: 400 });
  }
}
