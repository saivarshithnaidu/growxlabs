import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MODULES = ["CRM", "PM", "Finance", "HRMS", "Marketing", "Support", "Admin"];
const ACTIONS = ["Create", "Read", "Update", "Delete", "Export", "Approve", "Assign", "Support"];

const MOCK_ROLES = [
  { id: "r1", role_name: "Super Admin", is_system_default: true, description: "Full unrestricted platform access across all 7 modules." },
  { id: "r2", role_name: "Organization Admin", is_system_default: true, description: "Manage users, billing, subscriptions, and company settings." },
  { id: "r3", role_name: "IT Administrator", is_system_default: true, description: "Manage identity, OAuth, SSO, API keys, and integrations." },
  { id: "r4", role_name: "Security Administrator", is_system_default: true, description: "Manage security threats, MFA policies, and audit logs." },
  { id: "r5", role_name: "Compliance Officer", is_system_default: true, description: "Inspect GDPR/SOC2 compliance records, data retention, and consent logs." },
  { id: "r6", role_name: "Department Admin", is_system_default: false, description: "Manage specific department teams and resources." },
  { id: "r7", role_name: "Employee", is_system_default: true, description: "Standard internal employee access." },
  { id: "r8", role_name: "Client", is_system_default: true, description: "Restricted portal access for active customers." }
];

export async function GET() {
  try {
    const { data: roles } = await supabaseAdmin.from("roles").select("*");
    const { data: permissions } = await supabaseAdmin.from("permissions").select("*");

    return NextResponse.json({
      roles: roles && roles.length > 0 ? roles : MOCK_ROLES,
      modules: MODULES,
      actions: ACTIONS
    });
  } catch (e) {
    return NextResponse.json({
      roles: MOCK_ROLES,
      modules: MODULES,
      actions: ACTIONS
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role_name, description } = body;

    if (!role_name) return NextResponse.json({ error: "Role name required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("roles")
      .insert([{ role_name, description, is_system_default: false }])
      .select()
      .single();

    if (error) {
      const synthetic = {
        id: crypto.randomUUID(),
        role_name,
        description,
        is_system_default: false
      };
      return NextResponse.json({ role: synthetic, synthetic: true });
    }

    return NextResponse.json({ role: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
