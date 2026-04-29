import { supabaseAdmin } from "@/lib/supabase/admin";
import { Lead } from "@/types";

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

export class EnrichmentService {
  static async enrichLeads() {
    if (!APOLLO_API_KEY) throw new Error("APOLLO_API_KEY is not configured");

    console.log("Starting enrichment for leads without email...");

    try {
      // Find leads without email
      const { data: leads, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .is("email", null)
        .limit(10); // Batch processing

      if (error) throw error;
      if (!leads || leads.length === 0) {
        console.log("No leads found for enrichment.");
        return [];
      }

      const enrichedLeads: Lead[] = [];

      for (const lead of leads) {
        console.log(`Enriching ${lead.business_name}...`);

        // Search in Apollo
        const response = await fetch("https://api.apollo.io/v1/organizations/enrich", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "X-Api-Key": APOLLO_API_KEY
          },
          body: JSON.stringify({
            name: lead.business_name,
            domain: lead.website_url ? (() => {
              try {
                return new URL(lead.website_url).hostname;
              } catch {
                return undefined;
              }
            })() : undefined
          })
        });

        if (response.ok) {
          const data = await response.json();
          const org = data.organization;

          if (org) {
            const newEmail = org.primary_contact?.email || lead.email;
            const linkedinUrl = org.linkedin_url || lead.linkedin_url;
            
            // Recalculate score
            let newScore = lead.lead_score;
            if (newEmail && !lead.email) newScore += 2;
            
            // update lead
            const { data: updatedLead, error: updateError } = await supabaseAdmin
              .from("leads")
              .update({
                email: newEmail,
                linkedin_url: linkedinUrl,
                lead_score: newScore,
                status: "enriching"
              })
              .eq("id", lead.id)
              .select()
              .single();

            if (!updateError && updatedLead) {
              enrichedLeads.push(updatedLead);
              if (newScore >= 7) {
                await this.triggerAlert(updatedLead);
              }
            }
          }
        }
      }

      return enrichedLeads;
    } catch (error) {
      console.error("EnrichmentService Error:", error);
      throw error;
    }
  }

  private static async triggerAlert(lead: Lead) {
    console.log(`🚨 HIGH QUALITY LEAD ALERT (ENRICHED): ${lead.business_name} (Score: ${lead.lead_score})`);
  }
}
