import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_API_KEYS = [
  { id: "k1", key_name: "Production Backend Service Key", key_prefix: "gx_live_9a...", scopes: ["crm.*", "pm.*", "finance.read"], created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), is_active: true },
  { id: "k2", key_name: "Zapier / Make Automation Key", key_prefix: "gx_live_4f...", scopes: ["marketing.leads", "support.tickets"], created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), is_active: true }
];

const MOCK_FEATURE_FLAGS = [
  { id: "ff1", flag_key: "enable_ai_copilot_marketing", description: "Enable Gemini AI copywriter in Phase 5 Marketing Hub", is_enabled: true, rollout_percentage: 100, environment: "Production" },
  { id: "ff2", flag_key: "enable_live_chat_support", description: "Enable visitor live chat widget in Phase 6 Support Hub", is_enabled: true, rollout_percentage: 100, environment: "Production" },
  { id: "ff3", flag_key: "enable_beta_audit_export", description: "Enable automated point-in-time compliance report exports", is_enabled: false, rollout_percentage: 50, environment: "Staging" }
];

const MOCK_INTEGRATIONS = [
  { id: "i1", provider_name: "Google Workspace & OAuth 2.0", category: "Authentication & SSO", status: "Connected", config: { domain: "growxlabs.tech" } },
  { id: "i2", provider_name: "Microsoft 365 / Entra ID", category: "Authentication & Identity", status: "Connected", config: { tenant: "enterprise.onmicrosoft.com" } },
  { id: "i3", provider_name: "Razorpay / Stripe Payments", category: "Finance Gateway", status: "Connected", config: { webhookActive: true } },
  { id: "i4", provider_name: "Slack Enterprise Grid", category: "Notifications & Bot", status: "Connected", config: { channel: "#support-alerts" } },
  { id: "i5", provider_name: "Google Gemini 1.5 AI", category: "AI Models", status: "Connected", config: { model: "gemini-1.5-flash" } },
  { id: "i6", provider_name: "AWS S3 / Supabase Storage", category: "Media & Attachments", status: "Connected", config: { bucket: "growx-assets" } }
];

export async function GET() {
  try {
    const { data: keys } = await supabaseAdmin.from("api_keys").select("*");
    const { data: flags } = await supabaseAdmin.from("feature_flags").select("*");
    const { data: integrations } = await supabaseAdmin.from("integrations").select("*");

    return NextResponse.json({
      apiKeys: keys && keys.length > 0 ? keys : MOCK_API_KEYS,
      featureFlags: flags && flags.length > 0 ? flags : MOCK_FEATURE_FLAGS,
      integrations: integrations && integrations.length > 0 ? integrations : MOCK_INTEGRATIONS
    });
  } catch (e) {
    return NextResponse.json({
      apiKeys: MOCK_API_KEYS,
      featureFlags: MOCK_FEATURE_FLAGS,
      integrations: MOCK_INTEGRATIONS
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, key_name, scopes, flag_key, is_enabled } = body;

    if (action === "create-api-key" && key_name) {
      const prefix = "gx_live_" + Math.random().toString(36).substring(2, 6);
      const newKey = {
        id: crypto.randomUUID(),
        key_name,
        key_prefix: `${prefix}...`,
        scopes: scopes || ["read"],
        created_at: new Date().toISOString(),
        is_active: true
      };

      try {
        await supabaseAdmin.from("api_keys").insert([{
          key_name,
          api_key_hash: prefix + Date.now(),
          key_prefix: `${prefix}...`,
          scopes: scopes || ["read"]
        }]);
      } catch (e) {
        console.log("API key DB insert skipped");
      }

      return NextResponse.json({ success: true, apiKey: newKey });
    }

    if (action === "toggle-flag" && flag_key) {
      try {
        await supabaseAdmin.from("feature_flags").update({ is_enabled }).eq("flag_key", flag_key);
      } catch (e) {
        console.log("Toggle flag skipped");
      }
      return NextResponse.json({ success: true, flag_key, is_enabled });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
