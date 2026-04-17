import { supabaseAdmin } from "../lib/supabase/admin";

async function checkCols() {
  const { data, error } = await supabaseAdmin.from("leads").select("*").limit(1);
  if (data && data.length > 0) {
    console.log("COLUMNS:", Object.keys(data[0]));
  } else {
    console.log("No data found or error:", error);
  }
}

checkCols();
