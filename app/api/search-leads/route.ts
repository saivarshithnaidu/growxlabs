import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { category, city, radius } = await req.json();
    
    if (!process.env.APIFY_API_TOKEN || process.env.APIFY_API_TOKEN === "your_apify_token_here") {
      // Mock data for demonstration if token is missing
      return NextResponse.json({ 
        leads: [
          { business_name: "Guntur Grand", address: "Main Road, Guntur", phone: "+91 9988776655", website: "https://gunturgrand.com", rating: 4.5 },
          { business_name: "Tech Cafe", address: "Outer Ring Road, Guntur", phone: "+91 8877665544", website: null, rating: 3.8 }
        ] 
      });
    }

    const searchQuery = `${category} in ${city}`;
    
    // Call Apify Google Maps Scraper (Official Actor: apify/google-maps-scraper)
    const runRes = await fetch("https://api.apify.com/v2/acts/apify~google-maps-scraper/run-sync?token=" + process.env.APIFY_API_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries: [searchQuery],
        maxItems: 20,
        searchMatching: "all",
        language: "en"
      })
    });

    const runData = await runRes.json();
    const datasetId = runData.data.defaultDatasetId;
    
    // Fetch dataset results
    const resultsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${process.env.APIFY_API_TOKEN}`);
    const items = await resultsRes.json();

    const leads = items.map((item: any) => ({
      business_name: item.title,
      phone: item.phone,
      website: item.website,
      address: item.address,
      rating: item.totalScore,
      category: category,
      city: city
    }));

    // Pass to processing engine internally or return for frontend to trigger
    // In this flow, we'll return them to the UI so the admin can verify
    return NextResponse.json({ leads });

  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
