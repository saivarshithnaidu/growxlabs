import { NextResponse } from "next/server";
import { EnterpriseCrmService } from "@/services/enterprise-crm";
import { WorkflowEngine } from "@/services/workflow-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const company_id = searchParams.get("company_id") || undefined;

    const contacts = await EnterpriseCrmService.getContacts({ search, company_id });
    return NextResponse.json({ contacts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contact = await EnterpriseCrmService.createContact(body);
    
    // Evaluate workflows
    await WorkflowEngine.evaluateRules("contact_created", contact, "contact");

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create contact" }, { status: 400 });
  }
}
