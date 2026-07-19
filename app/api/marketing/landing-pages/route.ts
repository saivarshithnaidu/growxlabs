import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_PAGES = [
  {
    id: "lp111111-1111-1111-1111-111111111111",
    title: "AI Growth Engine Beta Signup",
    slug: "ai-growth-beta",
    template_type: "lead_capture",
    content: {
      headline: "Supercharge your business with autonomous AI growth strategies",
      subheadline: "Get early access to Phase 5 growX marketing suite.",
      primaryColor: "#00A86B",
      formId: "f1111111-1111-1111-1111-111111111111"
    },
    seo_title: "AI Growth Engine Beta Registration | GrowXLabs",
    seo_description: "Sign up for early access to GrowXLabs' revolutionary autonomous growth system.",
    analytics: { views: 4210, conversions: 350 },
    created_at: new Date().toISOString()
  },
  {
    id: "lp222222-2222-2222-2222-222222222222",
    title: "Growth Advisory Consultations",
    slug: "consultation",
    template_type: "product",
    content: {
      headline: "Book a complimentary strategy assessment with GrowXLabs experts",
      subheadline: "Accelerate sales pipeline and eliminate CAC leaks.",
      primaryColor: "#3B82F6",
      formId: "f2222222-2222-2222-2222-222222222222"
    },
    seo_title: "Free Growth Advisory Strategy Call | GrowXLabs",
    seo_description: "Request a custom strategy consultation to maximize lead conversion and boost performance.",
    analytics: { views: 1850, conversions: 120 },
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const { data: pages, error } = await supabaseAdmin
      .from("landing_pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ landingPages: MOCK_PAGES });
    }

    return NextResponse.json({ landingPages: pages.length > 0 ? pages : MOCK_PAGES });
  } catch (error: any) {
    return NextResponse.json({ landingPages: MOCK_PAGES });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, template_type, content, seo_title, seo_description } = body;

    const { data, error } = await supabaseAdmin
      .from("landing_pages")
      .insert([{
        title,
        slug,
        template_type: template_type || "product",
        content: content || {},
        seo_title,
        seo_description,
        analytics: { views: 0, conversions: 0 }
      }])
      .select()
      .single();

    if (error) {
      const syntheticLP = {
        id: crypto.randomUUID(),
        title,
        slug,
        template_type: template_type || "product",
        content: content || {},
        seo_title,
        seo_description,
        analytics: { views: 0, conversions: 0 },
        created_at: new Date().toISOString()
      };
      return NextResponse.json({ landingPage: syntheticLP, synthetic: true });
    }

    return NextResponse.json({ landingPage: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
