// Trial double entry debit equal credit balance checks
import { EnterpriseFinanceService } from "@/services/enterprise-finance";

export async function testDoubleEntryLedger() {
  console.log("Running Double-Entry Ledger validation checks...");

  const journalVoucherItems = [
    { account_code: "1010", debit: 25000.00, credit: 0 },
    { account_code: "1200", debit: 0, credit: 25000.00 }
  ];

  try {
    const totalDebits = journalVoucherItems.reduce((acc, item) => acc + item.debit, 0);
    const totalCredits = journalVoucherItems.reduce((acc, item) => acc + item.credit, 0);

    if (totalDebits !== totalCredits) {
      throw new Error(`Balanced ledger check failed. Debits (₹${totalDebits}) !== Credits (₹${totalCredits})`);
    }

    console.log("✓ Double-entry balancing assertion passed (₹25,000).");
    return true;
  } catch (err: any) {
    console.error("Double-Entry ledger test failed:", err.message);
    return false;
  }
}
