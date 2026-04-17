import { supabaseAdmin } from "../lib/supabase/admin";

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

async function testOrgEnrich() {
  const { data: prospects } = await supabaseAdmin
    .from("leads")
    .select("*")
    .not("website_url", "is", null)
    .not("business_name", "is", null)
    .limit(1);

  if (!prospects || prospects.length === 0) return console.log("No valid leads");

  const lead = prospects[0];
  console.log("Testing Org Enrich:", lead.business_name, lead.website_url);

  const domain = new URL(lead.website_url).hostname.replace("www.", "");

  const res = await fetch("https://api.apollo.io/v1/organizations/enrich", {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "X-Api-Key": APOLLO_API_KEY as string
    },
    body: JSON.stringify({
      domain: domain,
      name: lead.business_name
    })
  });

  const data = await res.json();
  console.log("Status:", res.status, data);
}

testOrgEnrich();
