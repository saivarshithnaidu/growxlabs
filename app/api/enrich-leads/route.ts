import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Select leads that don't have an email yet
    const { data: prospects, error: fetchError } = await supabase
      .from("leads")
      .select("*")
      .is("email", null)
      .limit(10); // Batch processing for safety

    if (fetchError || !prospects) throw fetchError;

    if (!process.env.APOLLO_API_KEY || process.env.APOLLO_API_KEY === "your_apollo_key_here") {
      return NextResponse.json({ message: "Apollo API key missing. Enrichment skipped." });
    }

    const results = [];
    
    for (const lead of prospects) {
      // Search Apollo for organization data or person
      const domain = lead.website ? new URL(lead.website).hostname.replace("www.", "") : null;
      
      const apolloRes = await fetch("https://api.apollo.io/v1/people/match", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache" 
        },
        body: JSON.stringify({
          api_key: process.env.APOLLO_API_KEY,
          organization_name: lead.business_name,
          domain: domain,
          reveal_personal_emails: true
        })
      });

      const apolloData = await apolloRes.json();
      const person = apolloData.person;

      if (person && (person.email || person.professional_email)) {
        const email = person.email || person.professional_email;
        
        // Update Supabase
        await supabase
          .from("leads")
          .update({ 
            email: email,
            lead_score: lead.lead_score + 2 // +2 for having email as per rules
          })
          .eq("id", lead.id);
          
        results.push({ id: lead.id, email: email });
      }
    }

    return NextResponse.json({ enriched_count: results.length, data: results });

  } catch (error: any) {
    console.error("Enrichment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
