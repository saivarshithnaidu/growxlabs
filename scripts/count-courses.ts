import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { count, error } = await supabase.from("courses").select("*", { count: "exact", head: true });
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Total courses in DB:", count);
  }
  const { data } = await supabase.from("courses").select("id, title");
  console.log("Courses:", data);
}
run();
