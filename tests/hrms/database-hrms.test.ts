import { supabaseAdmin } from "@/lib/supabase/admin";

export async function testHrmsDatabaseSchema() {
  console.log("Running HRMS Schema Validation Tests...");
  
  const tables = [
    "departments",
    "designations",
    "employees",
    "employee_documents",
    "attendance",
    "leave_requests",
    "leave_balances",
    "payroll",
    "payroll_items",
    "recruitment_jobs",
    "candidates",
    "candidate_interviews",
    "offers",
    "training_courses",
    "training_assignments",
    "hrms_goals",
    "employee_assets",
    "employee_exit",
    "hrms_audit_logs"
  ];

  let passed = 0;
  let failed = 0;

  for (const table of tables) {
    try {
      const { error } = await supabaseAdmin.from(table).select("id").limit(1);
      if (error) {
        console.log(`  ✗ Table "${table}" - ERROR: ${error.message}`);
        failed++;
      } else {
        console.log(`  ✓ Table "${table}" - EXISTS`);
        passed++;
      }
    } catch (e: any) {
      console.log(`  ✗ Table "${table}" - EXCEPTION: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nSchema Results: ${passed} passed, ${failed} failed out of ${tables.length} tables`);
  return { passed, failed, total: tables.length };
}
