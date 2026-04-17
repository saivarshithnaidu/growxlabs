import { supabaseAdmin } from "../lib/supabase/admin";

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

async function testEnrich() {
  const { data: prospects } = await supabaseAdmin
      .from("leads")
      .select("*")
      .is("email", null)
      .limit(1);

  if (!prospects || prospects.length === 0) return console.log("No leads");

  const lead = prospects[0];
  console.log("Testing Lead:", lead.id, lead.business_name);

  // Match
  const apolloRes = await fetch("https://api.apollo.io/v1/people/match", {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "X-Api-Key": APOLLO_API_KEY as string
    },
    body: JSON.stringify({
      organization_name: lead.business_name,
      reveal_personal_emails: true
    })
  });

  const data = await apolloRes.json();
  if (!apolloRes.ok) return console.log("Apollo Err:", apolloRes.status, data);

  const person = data.person;
  if (!person) return console.log("No person found");

  console.log("Found Person:", person.name, person.email);

  // Update
  const { error } = await supabaseAdmin
    .from("leads")
    .update({ 
        status: "enriched",
        email: person.email || person.professional_email 
    })
    .eq("id", lead.id);

  if (error) {
    console.log("SUPABASE ERROR:", error);
  } else {
    console.log("SUCCESS!");
  }
}

testEnrich();
