import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getToken } from "next-auth/jwt";

// List of ignored Instagram paths that are not usernames
const IGNORED_PATHS = new Set([
  "p", "reels", "reel", "explore", "tags", "tv", "stories", "direct", 
  "developer", "about", "legal", "press", "jobs", "blog", "accounts"
]);

export async function POST(req: Request) {
  try {
    // 1. Session authorization
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { niche, city, emailDomain } = await req.json();

    if (!niche || !city) {
      return NextResponse.json({ error: "Niche and City are required" }, { status: 400 });
    }

    const targetEmailDomain = emailDomain || "@gmail.com";
    
    let nicheQuery = `"${niche}"`;
    if (niche === "All Niches") {
      nicheQuery = `("clothing brand" OR "restaurant" OR "salon" OR "gym" OR "boutique" OR "founder" OR "sarees")`;
    }

    let cityQuery = `"${city}"`;
    if (city === "All Cities") {
      cityQuery = `"India"`; // Scope to all of India
    }

    const searchQuery = `site:instagram.com ${nicheQuery} ${cityQuery} "${targetEmailDomain}"`;

    let leads: any[] = [];
    const googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const googleCx = process.env.GOOGLE_SEARCH_CX;

    // A. Use official Google Custom Search API if keys exist (100% clean on Vercel/Cloud!)
    if (googleApiKey && googleCx && googleApiKey !== "your_api_key_here") {
      console.log(`Instagram X-Ray Search via Google Custom Search API: ${searchQuery}`);
      leads = await scrapeViaGoogleApi(searchQuery, city, googleApiKey, googleCx);
    } else {
      // B. Fall back to DuckDuckGo Scraper (works locally on residential IPs)
      console.log(`Instagram X-Ray Search via DuckDuckGo: ${searchQuery}`);
      try {
        leads = await scrapeViaDuckDuckGo(searchQuery, city);
      } catch (err: any) {
        if (err.message.includes("status 403")) {
          return NextResponse.json({
            error: "DuckDuckGo blocked this request (Status 403). For cloud hosting (like growxlabs.tech), please configure GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_CX in your environment variables for free, official Google Search API access."
          }, { status: 403 });
        }
        throw err;
      }
    }

    // Save/check leads in Supabase
    const savedLeads: any[] = [];
    for (const lead of leads) {
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
          savedLeads.push(data);
        } else if (error) {
          console.error("INSTAGRAM LEAD SAVE FAILURE:", error.message);
        }
      } else {
        const { data: fullLead } = await supabaseAdmin
          .from("leads")
          .select("*")
          .eq("id", existing.id)
          .single();
        if (fullLead) {
          savedLeads.push({ ...fullLead, alreadyExists: true });
        }
      }
    }

    console.log(`Instagram X-Ray Scrape completed: Saved/Retrieved ${savedLeads.length} leads.`);

    return NextResponse.json({
      success: true,
      count: savedLeads.length,
      leads: savedLeads
    });

  } catch (error: any) {
    console.error("Instagram Scraper API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 1. Google Custom Search JSON API implementation
async function scrapeViaGoogleApi(query: string, city: string, apiKey: string, cx: string): Promise<any[]> {
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Google Custom Search API responded with status ${res.status}`);
  }
  const data = await res.json();
  const items = data.items || [];
  const leads: any[] = [];

  for (const item of items) {
    const link = item.link || "";
    if (!link.includes("instagram.com")) continue;

    const igUrlMatch = link.match(/instagram\.com\/([a-zA-Z0-9_\.]+)/);
    if (!igUrlMatch) continue;

    const rawUsername = igUrlMatch[1];
    const username = rawUsername.split(/[/?#]/)[0].trim().toLowerCase();

    if (!username || IGNORED_PATHS.has(username) || username.length < 3) {
      continue;
    }

    const title = item.title || "";
    let name = title.replace(/\s*[•|(-]\s*Instagram.*$/i, "").trim();
    name = name.replace(/^@/, "").trim();

    const snippet = item.snippet || "";
    const emailMatch = snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (!emailMatch) continue;
    const email = emailMatch[0].trim().toLowerCase();

    const linksInSnippet = snippet.match(/[a-zA-Z0-9-]+\.(com|in|org|net|co|io|me|linktr\.ee|info)/gi) || [];
    const externalLink = linksInSnippet.find((l: string) => {
      const low = l.toLowerCase();
      return !low.includes("instagram") && !low.includes("facebook") && !low.includes("gmail") && !low.includes("yahoo") && !low.includes("outlook");
    });

    const hasWebsite = !!externalLink;

    let score = 7;
    if (!hasWebsite) score += 2;
    if (snippet.toLowerCase().includes("whatsapp") || snippet.toLowerCase().includes("contact") || snippet.toLowerCase().includes("dm")) {
      score += 1;
    }

    leads.push({
      name: name || username,
      business_name: name || username,
      phone: "",
      website_url: `https://instagram.com/${username}`,
      has_website: hasWebsite,
      google_rating: 0,
      reviews_count: 0,
      city,
      lead_score: score,
      status: "new",
      message: "",
      requirement: "",
      notes: `Instagram: @${username} | Email: ${email} | Bio: ${snippet}`,
      created_at: new Date().toISOString()
    });
  }

  return leads;
}

// 2. DuckDuckGo Scraper implementation
async function scrapeViaDuckDuckGo(query: string, city: string): Promise<any[]> {
  const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const response = await fetch(ddgUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache"
    }
  });

  if (!response.ok) {
    throw new Error(`DuckDuckGo Search responded with status ${response.status}`);
  }

  const html = await response.text();
  const leads: any[] = [];

  const resultBlocks = html.split(/class="result results_links/);
  const blocksToProcess = resultBlocks.slice(1);

  for (const block of blocksToProcess) {
    const urlMatch = block.match(/uddg=https?(?:%3A%2F%2F|:\/\/)(?:www\.)?instagram\.com%2F([a-zA-Z0-9_\.]+)/i) || 
                     block.match(/instagram\.com\/([a-zA-Z0-9_\.]+)/i);
                     
    if (!urlMatch) continue;

    const rawUsername = decodeURIComponent(urlMatch[1]);
    const username = rawUsername.split(/[/?#&%]/)[0].trim().toLowerCase();

    if (!username || IGNORED_PATHS.has(username) || username.length < 3) {
      continue;
    }

    const emailMatch = block.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (!emailMatch) continue;
    const email = emailMatch[0].trim().toLowerCase();

    const titleMatch = block.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/i);
    let name = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, "").trim() : `@${username}`;
    name = name.replace(/\s*[•|(-]\s*Instagram.*$/i, "").trim();
    name = name.replace(/^@/, "").trim();

    const snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);
    const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, "").trim() : "";

    const linksInSnippet = snippet.match(/[a-zA-Z0-9-]+\.(com|in|org|net|co|io|me|linktr\.ee|info)/gi) || [];
    const externalLink = linksInSnippet.find((link: string) => {
      const l = link.toLowerCase();
      return !l.includes("instagram") && !l.includes("facebook") && !l.includes("gmail") && !l.includes("yahoo") && !l.includes("outlook");
    });

    const hasWebsite = !!externalLink;

    let score = 7;
    if (!hasWebsite) score += 2;
    if (snippet.toLowerCase().includes("whatsapp") || snippet.toLowerCase().includes("contact") || snippet.toLowerCase().includes("dm")) {
      score += 1;
    }

    leads.push({
      name: name || username,
      business_name: name || username,
      phone: "",
      website_url: `https://instagram.com/${username}`,
      has_website: hasWebsite,
      google_rating: 0,
      reviews_count: 0,
      city,
      lead_score: score,
      status: "new",
      message: "",
      requirement: "",
      notes: `Instagram: @${username} | Email: ${email} | Bio: ${snippet}`,
      created_at: new Date().toISOString()
    });
  }

  return leads;
}
