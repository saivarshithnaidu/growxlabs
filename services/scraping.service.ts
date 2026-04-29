import { supabaseAdmin } from "@/lib/supabase/admin";
import { Lead } from "@/types";

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;

export class ScrapingService {
  static async scrapeLeads(city: string, category: string, options: { radius?: number, maxResults?: number } = {}) {
    if (!APIFY_TOKEN) throw new Error("APIFY_API_TOKEN is not configured");

    // Target Small/Local businesses for better conversion
    const enhancedCategory = category.toLowerCase().includes('small') || category.toLowerCase().includes('local') 
      ? category 
      : `small ${category}`;
      
    console.log(`Pivoting to High-Conversion Leads: ${enhancedCategory} in ${city}...`);

    try {
      // 1. Trigger Apify Run
      const runResponse = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${APIFY_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchStringsArray: [
            `${category} in ${city}`,
            `${category} near me ${city}`,
            `local ${category} ${city}`,
            `small ${category} ${city}`
          ],
          maxCrawledPlacesPerSearch: options.maxResults || 100,
          language: "en",
          includeReviews: false
        })
      });

      if (!runResponse.ok) {
        throw new Error(`Apify start error: ${await runResponse.text()}`);
      }

      const runData = await runResponse.json();
      const runId = runData.data.id;
      const datasetId = runData.data.defaultDatasetId;

      // 2. Poll for completion
      let isFinished = false;
      let attempts = 0;
      while (!isFinished && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
        const statusData = await statusRes.json();
        if (statusData.data.status === 'SUCCEEDED') isFinished = true;
        else if (['FAILED', 'ABORTED'].includes(statusData.data.status)) throw new Error("Scraping failed");
        attempts++;
      }

      // 3. Fetch & Process
      const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`);
      const rawItems = await itemsRes.json();
      
      const processedLeads: Lead[] = [];

      for (const item of rawItems) {
        // FILTER: Skip if they already have a website (Low conversion potential)
        if (item.website) continue;

        const businessName = item.title || item.name;
        if (!businessName) continue;

        const phone = item.phone || "";
        const googleRating = item.totalScore || 0;
        const reviewsCount = item.reviewsCount || 0;
        
        // SCORING SYSTEM (Target: No Website / Low Digital Presence)
        let score = 0;
        if (!item.website) score += 4;
        if (!phone) score += 2;
        if (reviewsCount < 50) score += 2;
        if (googleRating < 4.2) score += 1;

        // FILTER: Only high-potential leads (Score >= 6)
        if (score < 6) continue;

        const lead = {
          name: businessName,
          business_name: businessName,
          phone: phone ? phone.replace(/\s+/g, '') : "",
          website_url: null,
          has_website: false,
          google_rating: googleRating,
          reviews_count: reviewsCount,
          city,
          lead_score: score,
          status: "new",
          message: "", // Safe fallback for DB
          requirement: "", // Safe fallback for DB
          notes: `LDP Lead: ${item.address || ''}`,
          created_at: new Date().toISOString()
        };

        const { data: existing } = await supabaseAdmin
          .from("leads")
          .select("id")
          .eq("business_name", lead.business_name)
          .maybeSingle();

        if (!existing) {
          const { data, error } = await supabaseAdmin
            .from("leads")
            .insert([lead])
            .select()
            .single();

          if (!error && data) {
            processedLeads.push(data);
          } else if (error) {
            console.error("LEAD SAVE FAILURE:", error.message);
          }
        }
      }

      console.log(`SUCCESS: Captured ${processedLeads.length} High-Potential Leads.`);
      return processedLeads;
    } catch (error: any) {
      console.error("ScrapingService Error:", error.message);
      throw new Error("Scraping failed. Check API or actor configuration.");
    }
  }

  private static async triggerAlert(lead: Lead) {
    console.log(`🚨 LEAD DETECTED: ${lead.business_name} (Score: ${lead.lead_score})`);
  }
}
