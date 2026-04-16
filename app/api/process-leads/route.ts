import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { leads } = await req.json();
    const supabase = await createClient();
    
    const processedLeads = leads.map((lead: any) => {
      let score = 0;
      const has_website = !!lead.website;
      
      if (!has_website) score += 4;
      if (lead.phone) score += 2;
      if (lead.email) score += 2;
      if (lead.rating > 4) score += 1;

      return {
        business_name: lead.business_name,
        category: lead.category || "General",
        city: lead.city || "Unknown",
        phone: lead.phone,
        email: lead.email || null,
        website: lead.website || null,
        has_website: has_website,
        source: "Google Maps / Apify",
        lead_score: score,
        status: "prospect",
        message: `Automatic Prospect: Rating ${lead.rating}`, // Compatibility with existing schema
        requirement: `Automated lead scoring: ${score}` // Compatibility with existing schema
      };
    });

    // Bulk insert into Supabase
    // We use upsert on business_name and phone to avoid duplicates if possible
    const { data, error } = await supabase
      .from("leads")
      .upsert(processedLeads, { onConflict: "phone,business_name" });

    if (error) {
      console.error("Supabase Process Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      count: processedLeads.length,
      high_potential: processedLeads.filter((l: any) => l.lead_score >= 7).length
    });

  } catch (error: any) {
    console.error("Process API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
