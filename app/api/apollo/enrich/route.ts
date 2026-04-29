import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

    if (!APOLLO_API_KEY || APOLLO_API_KEY === "your_apollo_key_here") {
      return NextResponse.json({ error: "Apollo API key missing or invalid." }, { status: 500 });
    }

    // 1. Fetch leads where email is null
    // High priority: website_url is NOT null (to make matching easier)
    // We'll fetch up to 20 leads
    const { data: prospects, error: fetchError } = await supabaseAdmin
      .from("leads")
      .select("*")
      .is("email", null)
      .limit(20);

    if (fetchError) throw fetchError;
    if (!prospects || prospects.length === 0) {
      return NextResponse.json({ 
        message: "No leads found for enrichment.",
        processed: 0,
        enriched: 0,
        failed: 0
      });
    }

    let enrichedCount = 0;
    let failedCount = 0;
    let lastError = null;
    const results = [];

    for (const lead of prospects) {
      try {
        const domain = lead.website_url ? (() => {
          try {
            return new URL(lead.website_url).hostname.replace("www.", "");
          } catch {
            return null;
          }
        })() : null;
        
        const apolloRes = await fetch("https://api.apollo.io/v1/people/match", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "X-Api-Key": APOLLO_API_KEY
          },
          body: JSON.stringify({
            first_name: lead.name?.split(" ")[0] || null,
            last_name: lead.name?.split(" ").slice(1).join(" ") || null,
            organization_name: lead.business_name,
            domain: domain,
            reveal_personal_emails: true
          })
        });

        if (!apolloRes.ok) {
           const errData = await apolloRes.json();
           console.error("Apollo API Error:", apolloRes.status, errData);
           lastError = errData.error || `Apollo Error ${apolloRes.status}`;
           failedCount++;
           continue;
        }

        const apolloData = await apolloRes.json();
        const person = apolloData.person;

        if (person && (person.email || person.professional_email)) {
          const email = person.email || person.professional_email;
          const designation = person.title || "Unspecified";
          const company = person.organization?.name || lead.business_name;
          
          // 3. Update DB
          const enrichmentNote = `[APOLLO ENRICHED] Designation: ${designation} | Company: ${company}`;
          const currentNotes = lead.notes ? `${lead.notes}\n${enrichmentNote}` : enrichmentNote;

          const { error: updateError } = await supabaseAdmin
            .from("leads")
            .update({ 
              email: email,
              lead_score: (lead.lead_score || 0) + 2,
              notes: currentNotes,
              status: "enriched" 
            })
            .eq("id", lead.id);

          if (updateError) {
             console.error("SUPABASE UPDATE ERROR for Lead", lead.id, updateError);
             lastError = updateError.message;
             failedCount++;
          } else {
             enrichedCount++;
             results.push({ id: lead.id, email, designation });
          }
        } else {
          console.log("No person match found for", lead.business_name);
          failedCount++;
        }
      } catch (innerError: any) {
        console.error("Processing error for lead", lead.id, innerError);
        lastError = innerError.message;
        failedCount++;
      }
    }

    return NextResponse.json({ 
      message: "Enrichment process completed.",
      processed: prospects.length,
      enriched: enrichedCount,
      failed: failedCount,
      error: lastError,
      data: results
    });

  } catch (error: any) {
    console.error("Apollo Enrichment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
