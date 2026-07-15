import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("=== USERS TABLE ===");
  const { data: users, error: userError } = await supabase
    .from("users")
    .select("id, email, name, role");
  
  if (userError) {
    console.error("Error reading users:", userError.message);
  } else {
    console.log(JSON.stringify(users, null, 2));
  }

  console.log("\n=== TEAM MEMBERS TABLE ===");
  const { data: team, error: teamError } = await supabase
    .from("team_members")
    .select("id, email, name, role, is_active");
  
  if (teamError) {
    console.error("Error reading team_members:", teamError.message);
  } else {
    console.log(JSON.stringify(team, null, 2));
  }
}

run();
