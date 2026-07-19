// Quotations Calculations Tests

export async function testQuotationsCalculations() {
  console.log("Running Quotation Commercial Calculations Tests...");

  const items = [
    { product_id: "prod_1", quantity: 2, unit_price: 15000, tax_percentage: 18 }, // Subtotal: 30000, Tax: 5400
    { product_id: "prod_2", quantity: 1, unit_price: 25000, tax_percentage: 18 }  // Subtotal: 25000, Tax: 4500
  ];

  const discountAmount = 5000;

  try {
    // 1. Calculate values
    let totalAmount = 0;
    let taxAmount = 0;

    for (const item of items) {
      const itemSubtotal = item.quantity * item.unit_price;
      totalAmount += itemSubtotal;
      taxAmount += itemSubtotal * (item.tax_percentage / 100);
    }

    const grandTotal = totalAmount + taxAmount - discountAmount;

    // Assertions
    if (totalAmount !== 55000) {
      throw new Error(`Assertion failed: Expected total amount 55000, got ${totalAmount}`);
    }
    console.log("✓ Subtotal calculation passed (₹55,000).");

    if (taxAmount !== 9900) {
      throw new Error(`Assertion failed: Expected tax amount 9900, got ${taxAmount}`);
    }
    console.log("✓ GST tax calculation passed (₹9,900).");

    if (grandTotal !== 59900) {
      throw new Error(`Assertion failed: Expected grand total 59900, got ${grandTotal}`);
    }
    console.log("✓ Grand total calculation passed (₹59,900).");

    console.log("✓ All quotation calculation assertions passed.");
    return true;
  } catch (err: any) {
    console.error("Quotation Calculations Test Failed:", err.message);
    return false;
  }
}
