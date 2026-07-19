// HRMS Unit Test Suite Runner
import { testHrmsDatabaseSchema } from "./database-hrms.test";
import { testPayrollCalculations } from "./payroll-calc.test";

async function runAllHrmsTests() {
  console.log("═══════════════════════════════════════════");
  console.log("  GrowXLabs Enterprise HRMS Test Suite");
  console.log("═══════════════════════════════════════════\n");

  let totalPassed = 0;
  let totalFailed = 0;

  // Test 1: Database Schema
  console.log("─── Test 1: Database Schema ───");
  const schema = await testHrmsDatabaseSchema();
  totalPassed += schema.passed;
  totalFailed += schema.failed;

  console.log("");

  // Test 2: Payroll Calculations
  console.log("─── Test 2: Payroll Calculations ───");
  const payroll = await testPayrollCalculations();
  totalPassed += payroll.passed;
  totalFailed += payroll.failed;

  console.log("\n═══════════════════════════════════════════");
  console.log(`  FINAL: ${totalPassed} passed, ${totalFailed} failed`);
  console.log("═══════════════════════════════════════════");

  process.exit(totalFailed > 0 ? 1 : 0);
}

runAllHrmsTests().catch(e => {
  console.error("Test suite error:", e);
  process.exit(1);
});
