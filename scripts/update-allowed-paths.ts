import { supabaseAdmin } from "../lib/supabase/admin";

async function updateAllowedPaths() {
  console.log("Fetching all team members to update allowed_paths...");

  const { data: members, error } = await supabaseAdmin
    .from("team_members")
    .select("id, email, allowed_paths");

  if (error || !members) {
    console.error("Failed to fetch team members:", error);
    process.exit(1);
  }

  console.log(`Found ${members.length} team members.`);

  for (const member of members) {
    const currentPaths = member.allowed_paths || [];
    const newPaths = [...new Set([
      ...currentPaths,
      "/admin/pm/projects",
      "/admin/pm/sprints",
      "/admin/pm/workload",
      "/admin/pm/timesheets",
      "/admin/pm/bugs",
      "/admin/pm/ai-copilot",
      "/admin/finance/dashboard",
      "/admin/finance/invoices",
      "/admin/finance/expenses",
      "/admin/finance/accounts",
      "/admin/finance/reports",
      "/admin/finance/ai-helper"
    ])];

    console.log(`Updating ${member.email} allowed_paths...`);
    const { error: updateErr } = await supabaseAdmin
      .from("team_members")
      .update({ allowed_paths: newPaths })
      .eq("id", member.id);

    if (updateErr) {
      console.error(`Failed to update ${member.email}:`, updateErr.message);
    } else {
      console.log(`✓ Updated ${member.email} successfully.`);
    }
  }

  console.log("\nAll allowed_paths updated successfully!");
  process.exit(0);
}

updateAllowedPaths().catch(err => {
  console.error(err);
  process.exit(1);
});
