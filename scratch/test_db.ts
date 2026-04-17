import { supabaseAdmin } from "../lib/supabase/admin";

async function testDBUpdate() {
  const { data: prospects } = await supabaseAdmin.from("leads").select("*").limit(1);
  if (!prospects || prospects.length === 0) return;

  const lead = prospects[0];
  console.log("Testing DB Update for:", lead.id);

  const { error } = await supabaseAdmin
    .from("leads")
    .update({ 
        status: "enriched" 
    })
    .eq("id", lead.id);

  if (error) {
    console.log("DB ERROR:", error);
  } else {
    console.log("SUCCESS! DB accepts 'enriched' status.");
  }
}

testDBUpdate();
