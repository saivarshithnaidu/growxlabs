// Project Management Unit Test Suite Runner
import { testPmDatabaseSchema } from "./database-pm.test";
import { testSprintBurndown } from "./agile-sprint.test";
import { testTimesheetTracking } from "./time-logs.test";

async function runAllPmTests() {
  console.log("=== STARTING ENTERPRISE PROJECT MANAGEMENT TEST SUITE ===\n");

  const schemaOk = await testPmDatabaseSchema();
  const sprintOk = await testSprintBurndown();
  const timesheetOk = await testTimesheetTracking();

  console.log("\n=== TEST RUN SUMMARY ===");
  console.log(`PM Database Schema:   ${schemaOk ? "PASSED" : "FAILED"}`);
  console.log(`Agile Sprint Math:    ${sprintOk ? "PASSED" : "FAILED"}`);
  console.log(`Timesheet Actuals:    ${timesheetOk ? "PASSED" : "FAILED"}`);

  if (schemaOk && sprintOk && timesheetOk) {
    console.log("\n✓ All Project Management test suites passed successfully!");
    process.exit(0);
  } else {
    console.error("\n❌ Some Project Management test cases failed.");
    process.exit(1);
  }
}

runAllPmTests().catch(err => {
  console.error("Test execution exception:", err);
  process.exit(1);
});
