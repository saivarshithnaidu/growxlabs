import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_ARTICLES = [
  {
    id: "kb1",
    title: "How to Configure SSO & SAML 2.0 Integration",
    category: "Authentication",
    slug: "sso-saml-setup",
    content: "Step-by-step guide to setting up Okta, Azure AD, and Google Workspace SSO with GrowXLabs...",
    views: 1420,
    helpful_count: 89,
    unhelpful_count: 3,
    status: "Published"
  },
  {
    id: "kb2",
    title: "REST API Authentication & Rate Limits Guide",
    category: "Developer APIs",
    slug: "api-rate-limits",
    content: "Understanding Bearer Tokens, API Key rotation, and handling 429 Too Many Requests responses...",
    views: 2850,
    helpful_count: 142,
    unhelpful_count: 6,
    status: "Published"
  },
  {
    id: "kb3",
    title: "Troubleshooting Webhook Delivery Failures",
    category: "Webhooks",
    slug: "webhook-failures-debug",
    content: "How to inspect retry payloads, IP whitelisting rules, and verifying HMAC SHA-256 signatures...",
    views: 980,
    helpful_count: 64,
    unhelpful_count: 2,
    status: "Published"
  }
];

export async function GET() {
  try {
    const { data: articles } = await supabaseAdmin.from("knowledge_articles").select("*");
    if (!articles || articles.length === 0) {
      return NextResponse.json({ articles: MOCK_ARTICLES });
    }
    return NextResponse.json({ articles });
  } catch (e) {
    return NextResponse.json({ articles: MOCK_ARTICLES });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, content, status } = body;

    if (!title || !content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const { data, error } = await supabaseAdmin
      .from("knowledge_articles")
      .insert([{
        title,
        slug,
        content,
        status: status || "Published"
      }])
      .select()
      .single();

    if (error) {
      const synthetic = {
        id: crypto.randomUUID(),
        title,
        slug,
        category: category || "General",
        content,
        views: 0,
        helpful_count: 0,
        unhelpful_count: 0,
        status: status || "Published"
      };
      return NextResponse.json({ article: synthetic, synthetic: true });
    }

    return NextResponse.json({ article: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
