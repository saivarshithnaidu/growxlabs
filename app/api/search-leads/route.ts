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
    
    // Call Apify Google Maps Places API (Actor: johnvc/google-maps-places-api), which returns the dataset items directly
    const runRes = await fetch("https://api.apify.com/v2/acts/johnvc~google-maps-places-api/run-sync-get-dataset-items?token=" + process.env.APIFY_API_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchTerms: [searchQuery],
        maxResultsPerSearch: 20,
        language: "en"
      })
    });

    if (!runRes.ok) {
      throw new Error(`Apify run error: ${await runRes.text()}`);
    }

    const items = await runRes.json();

    // Skip rows without a place name (the Actor's error and notice rows)
    const leads = items.filter((item: { title?: string }) => item.title).map((item: any) => ({
      business_name: item.title,
      phone: item.phoneNumber,
      website: item.website,
      address: item.address,
      rating: item.rating,
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
