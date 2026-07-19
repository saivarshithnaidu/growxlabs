// Database Schema Integrity Tests
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function testDatabaseSchema() {
  console.log("Running Schema Validation Tests...");
  
  const tables = [
    "companies",
    "contacts",
    "deals",
    "deal_stages",
    "activities",
    "tasks",
    "meetings",
    "meeting_attendees",
    "products",
    "quotations",
    "quotation_items",
    "documents",
    "document_versions",
    "attachments",
    "tags",
    "tag_mappings",
    "comments",
    "notifications",
    "automation_rules",
    "automation_runs",
    "timeline_events",
    "custom_fields",
    "custom_field_values"
  ];

  const results: any[] = [];

  for (const table of tables) {
    try {
      const { data, error } = await supabaseAdmin.from(table).select("*").limit(1);
      if (error) {
        results.push({ table, status: "FAILED", error: error.message });
      } else {
        results.push({ table, status: "PASSED" });
      }
    } catch (e: any) {
      results.push({ table, status: "FAILED", error: e.message });
    }
  }

  console.log("\n--- Schema Check Results ---");
  console.table(results);
  
  const failed = results.filter(r => r.status === "FAILED");
  if (failed.length > 0) {
    console.error(`⚠️ Schema test failed with ${failed.length} errors.`);
    return false;
  }
  
  console.log("✓ All tables registered successfully in Supabase PostgreSQL.");
  return true;
}
