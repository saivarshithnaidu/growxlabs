// Main CRM Test Suite Runner
import { testDatabaseSchema } from "./database-schema.test";
import { testWorkflowEngine } from "./workflow-automation.test";
import { testQuotationsCalculations } from "./quotations-invoice.test";

async function runAllTests() {
  console.log("=== STARTING ENTERPRISE CRM TEST SUITE ===\n");
  
  // Note: Database schema test requires active Supabase connection.
  // In pure unit test environment we can mock it, or run assertions locally.
  const schemaOk = await testDatabaseSchema();
  const workflowOk = await testWorkflowEngine();
  const quoteOk = await testQuotationsCalculations();

  console.log("\n=== TEST RUN SUMMARY ===");
  console.log(`Schema Tests:     ${schemaOk ? "PASSED" : "FAILED"}`);
  console.log(`Workflow Engine:  ${workflowOk ? "PASSED" : "FAILED"}`);
  console.log(`Quotations Calc:  ${quoteOk ? "PASSED" : "FAILED"}`);
  
  if (schemaOk && workflowOk && quoteOk) {
    console.log("\n✓ All tests passed successfully!");
    process.exit(0);
  } else {
    console.error("\n❌ Some test cases failed.");
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error("Test execution exception:", err);
  process.exit(1);
});
