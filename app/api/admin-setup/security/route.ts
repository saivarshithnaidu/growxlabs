import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_SECURITY_EVENTS = [
  {
    id: "se1",
    event_type: "Failed_Login_Threshold",
    severity: "High",
    description: "5 consecutive failed password attempts detected from IP 192.168.1.105",
    ip_address: "192.168.1.105",
    is_resolved: false,
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: "se2",
    event_type: "Suspicious_Location",
    severity: "Medium",
    description: "Admin login detected from unrecognized geographic region (Frankfurt, DE)",
    ip_address: "185.220.101.5",
    is_resolved: true,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const MOCK_AUDIT_LOGS = [
  { id: "al1", user_email: "alex.rivera@growxlabs.tech", action: "UPDATE_ROLE_PERMISSIONS", module: "Admin", entity_name: "Security Administrator", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  { id: "al2", user_email: "elena.r@growxlabs.tech", action: "GENERATE_API_KEY", module: "Integrations", entity_name: "Stripe Webhook Key", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: "al3", user_email: "david.m@growxlabs.tech", action: "EXPORT_LEADS_CSV", module: "CRM", entity_name: "Enterprise Leads", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "al4", user_email: "sarah.j@growxlabs.tech", action: "ESCALATE_TICKET", module: "Support", entity_name: "TICK-9082", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }
];

export async function GET() {
  try {
    const { data: events } = await supabaseAdmin.from("security_events").select("*").order("created_at", { ascending: false });
    const { data: logs } = await supabaseAdmin.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(50);

    return NextResponse.json({
      events: events && events.length > 0 ? events : MOCK_SECURITY_EVENTS,
      logs: logs && logs.length > 0 ? logs : MOCK_AUDIT_LOGS
    });
  } catch (e) {
    return NextResponse.json({
      events: MOCK_SECURITY_EVENTS,
      logs: MOCK_AUDIT_LOGS
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, eventId } = body;

    if (action === "resolve-event" && eventId) {
      try {
        await supabaseAdmin.from("security_events").update({ is_resolved: true }).eq("id", eventId);
      } catch (e) {
        console.log("Resolve event skipped");
      }
      return NextResponse.json({ success: true, eventId });
    }

    // Insert new Audit Log entry
    const { user_email, auditAction, module, entity_name } = body;
    try {
      await supabaseAdmin.from("admin_audit_logs").insert([{
        user_email: user_email || "system@growxlabs.tech",
        action: auditAction || "PLATFORM_GOVERNANCE_UPDATE",
        module: module || "Admin",
        entity_name: entity_name || "System Settings",
        ip_address: "127.0.0.1"
      }]);
    } catch (e) {
      console.log("Audit log insert skipped");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
