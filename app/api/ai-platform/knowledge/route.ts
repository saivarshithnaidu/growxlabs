import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_DOCS = [
  { id: "d1", title: "Enterprise Security & SLA Policy v4.2", file_type: "SOP", category: "Compliance", content_text: "Standard Operating Procedure for handling 99.99% uptime SLAs and data retention..." },
  { id: "d2", title: "Master Service Agreement Template", file_type: "Contract", category: "Legal", content_text: "Standard terms and conditions for enterprise software licensing and MSA terms..." },
  { id: "d3", title: "Product Architecture & API Guide", file_type: "PDF", category: "Engineering", content_text: "Technical architecture reference for developer integrations and webhook retries..." }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (query) {
      // Simulate vector semantic search
      const results = MOCK_DOCS.filter(d => d.title.toLowerCase().includes(query.toLowerCase()) || d.content_text.toLowerCase().includes(query.toLowerCase()));
      return NextResponse.json({ searchResults: results.length > 0 ? results : MOCK_DOCS });
    }

    const { data: docs } = await supabaseAdmin.from("knowledge_documents").select("*");
    return NextResponse.json({
      documents: docs && docs.length > 0 ? docs : MOCK_DOCS
    });
  } catch (e) {
    return NextResponse.json({ documents: MOCK_DOCS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, file_type, category, content_text } = body;

    if (!title || !content_text) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

    const newDoc = {
      id: crypto.randomUUID(),
      title,
      file_type: file_type || "PDF",
      category: category || "General",
      content_text
    };

    try {
      await supabaseAdmin.from("knowledge_documents").insert([newDoc]);
    } catch (e) {
      console.log("Knowledge doc insert skipped");
    }

    return NextResponse.json({ document: newDoc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
