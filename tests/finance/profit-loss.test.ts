// Profit & Loss calculations unit checks
export async function testProfitLossCalculation() {
  console.log("Running Profit & Loss net income checks...");

  const revenuesList = [
    { code: "4010", balance: 150000.00 },
    { code: "4020", balance: 25000.00 }
  ];

  const expensesList = [
    { code: "5010", balance: 20000.00 },
    { code: "5020", balance: 15000.00 },
    { code: "5030", balance: 5000.00 }
  ];

  try {
    const totalRevenues = revenuesList.reduce((acc, curr) => acc + curr.balance, 0);
    const totalExpenses = expensesList.reduce((acc, curr) => acc + curr.balance, 0);
    const netProfit = totalRevenues - totalExpenses;

    if (totalRevenues !== 175000.00) {
      throw new Error(`Expected total revenue of 175000.00, got ${totalRevenues}`);
    }
    console.log("✓ Operating revenues summary passed (₹175,000).");

    if (totalExpenses !== 40000.00) {
      throw new Error(`Expected total expenses of 40000.00, got ${totalExpenses}`);
    }
    console.log("✓ Operating expenses summary passed (₹40,000).");

    if (netProfit !== 135000.00) {
      throw new Error(`Expected net profit of 135000.00, got ${netProfit}`);
    }
    console.log("✓ Net earnings calculation passed (₹135,000).");

    console.log("✓ All Profit & Loss accounting checks passed.");
    return true;
  } catch (err: any) {
    console.error("Profit & Loss calculation test failed:", err.message);
    return false;
  }
}
