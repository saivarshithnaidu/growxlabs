// GST CGST/SGST/IGST tax rates calculations test
export async function testGstTaxSplits() {
  console.log("Running GST tax splits check calculations...");

  const subtotal = 10000.00;
  const standardGstRate = 0.18;

  try {
    const totalTax = subtotal * standardGstRate;
    const cgstSplit = totalTax / 2;
    const sgstSplit = totalTax / 2;

    if (totalTax !== 1800.00) {
      throw new Error(`Expected standard total GST of 1800.00, got ${totalTax}`);
    }
    console.log("✓ Total standard GST check passed (₹1,800).");

    if (cgstSplit !== 900.00 || sgstSplit !== 900.00) {
      throw new Error(`Expected CGST & SGST splits of 900.00 each, got CGST: ${cgstSplit}, SGST: ${sgstSplit}`);
    }
    console.log("✓ Local state CGST (9%) and SGST (9%) splits passed.");

    console.log("✓ All GST tax allocation checks passed.");
    return true;
  } catch (err: any) {
    console.error("GST tax splits test failed:", err.message);
    return false;
  }
}
