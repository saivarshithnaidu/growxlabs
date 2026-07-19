import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_FORMS = [
  {
    id: "f1111111-1111-1111-1111-111111111111",
    title: "AI Beta Early Registration Form",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "business_name", label: "Company Name", type: "text", required: true },
      { name: "company_size", label: "Company Size", type: "select", required: false, options: ["1-10", "11-50", "51-200", "201+"] }
    ],
    validation_rules: { email: "regex" },
    conditional_logic: {},
    spam_protection: { turnstile: true },
    webhook_url: "https://growxlabs.tech/hooks/mktg-beta-webhook",
    created_at: new Date().toISOString()
  },
  {
    id: "f2222222-2222-2222-2222-222222222222",
    title: "Enterprise Demo Consultation Form",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Work Email", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "business_name", label: "Company Name", type: "text", required: true },
      { name: "industry", label: "Industry", type: "select", required: true, options: ["SaaS", "E-commerce", "Real Estate", "Healthcare", "Education", "Other"] },
      { name: "notes", label: "How can we help?", type: "textarea", required: false }
    ],
    validation_rules: {},
    conditional_logic: {},
    spam_protection: { captcha: true },
    webhook_url: "https://growxlabs.tech/hooks/enterprise-leads",
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const { data: forms, error } = await supabaseAdmin
      .from("forms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ forms: MOCK_FORMS });
    }

    return NextResponse.json({ forms: forms.length > 0 ? forms : MOCK_FORMS });
  } catch (error: any) {
    return NextResponse.json({ forms: MOCK_FORMS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, fields, validation_rules, conditional_logic, spam_protection, webhook_url } = body;

    const { data, error } = await supabaseAdmin
      .from("forms")
      .insert([{
        title,
        fields: fields || [],
        validation_rules: validation_rules || {},
        conditional_logic: conditional_logic || {},
        spam_protection: spam_protection || {},
        webhook_url
      }])
      .select()
      .single();

    if (error) {
      const syntheticForm = {
        id: crypto.randomUUID(),
        title,
        fields: fields || [],
        validation_rules: validation_rules || {},
        conditional_logic: conditional_logic || {},
        spam_protection: spam_protection || {},
        webhook_url,
        created_at: new Date().toISOString()
      };
      return NextResponse.json({ form: syntheticForm, synthetic: true });
    }

    return NextResponse.json({ form: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
