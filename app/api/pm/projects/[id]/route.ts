import { NextResponse } from "next/server";
import { EnterprisePmService } from "@/services/enterprise-pm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dashboard = await EnterprisePmService.getProjectDashboard(id);
    return NextResponse.json(dashboard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch project dashboard" }, { status: 500 });
  }
}
