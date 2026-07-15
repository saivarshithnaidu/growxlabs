import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const reshwanthId = "d1a1506c-caaf-4203-8759-ada2a12ac4b2";

  console.log("=== INSPECTING TEAM SESSIONS ===");
  const { data: sessions, error } = await supabase
    .from("team_sessions")
    .select("*, team_members(name, email, role)")
    .order("login_at", { ascending: false })
    .limit(10);
  
  if (error) {
    console.error("Error fetching sessions:", error.message);
  } else {
    console.log("Recent Team Sessions in Database:");
    console.log(JSON.stringify(sessions, null, 2));
  }
}

run();
