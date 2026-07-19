import { EnterpriseHrmsService } from "@/services/enterprise-hrms";

export async function testPayrollCalculations() {
  console.log("Running Payroll Calculation Tests...");

  let passed = 0;
  let failed = 0;

  // Test 1: Standard payslip calculation
  const basic = 50000;
  const allowances = 20000;
  const result = EnterpriseHrmsService.calculateNetPayslip(basic, allowances);

  // PF = 12% of basic = 6000
  if (result.pf_deduction === 6000) {
    console.log("  ✓ PF deduction = 12% of basic");
    passed++;
  } else {
    console.log(`  ✗ PF deduction expected 6000, got ${result.pf_deduction}`);
    failed++;
  }

  // ESI = 1.75% of basic = 875
  if (result.esi_deduction === 875) {
    console.log("  ✓ ESI deduction = 1.75% of basic");
    passed++;
  } else {
    console.log(`  ✗ ESI deduction expected 875, got ${result.esi_deduction}`);
    failed++;
  }

  // TDS = 10% of (basic + allowances) = 7000
  if (result.tds_withheld === 7000) {
    console.log("  ✓ TDS withholding = 10% of gross");
    passed++;
  } else {
    console.log(`  ✗ TDS expected 7000, got ${result.tds_withheld}`);
    failed++;
  }

  // Net = basic + allowances - total deductions
  const expectedNet = basic + allowances - (6000 + 875 + 7000);
  if (result.net_payable === expectedNet) {
    console.log("  ✓ Net payable calculation correct");
    passed++;
  } else {
    console.log(`  ✗ Net expected ${expectedNet}, got ${result.net_payable}`);
    failed++;
  }

  // Test 2: Zero allowances
  const result2 = EnterpriseHrmsService.calculateNetPayslip(30000, 0);
  if (result2.net_payable > 0) {
    console.log("  ✓ Zero allowances produces positive net");
    passed++;
  } else {
    console.log(`  ✗ Zero allowances net should be positive, got ${result2.net_payable}`);
    failed++;
  }

  console.log(`\nPayroll Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}
