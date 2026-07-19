import { NextResponse } from "next/server";
import { EnterpriseCrmService } from "@/services/enterprise-crm";
import { WorkflowEngine } from "@/services/workflow-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const owner_id = searchParams.get("owner_id") || undefined;

    const companies = await EnterpriseCrmService.getCompanies({ search, status, owner_id });
    return NextResponse.json({ companies });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const company = await EnterpriseCrmService.createCompany(body);
    
    // Evaluate workflows for company creation
    await WorkflowEngine.evaluateRules("company_created", company, "company");
    
    return NextResponse.json({ company }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create company" }, { status: 400 });
  }
}
