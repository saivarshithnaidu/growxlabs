import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { data: quotations, error } = await supabaseAdmin
      .from("quotations")
      .select("*, company:companies(name), deal:deals(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ quotations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch quotations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { items, ...quotationData } = await request.json();

    // 1. Calculate values
    let totalAmount = 0;
    let taxAmount = 0;

    if (Array.isArray(items)) {
      for (const item of items) {
        totalAmount += Number(item.quantity) * Number(item.unit_price);
        taxAmount += (Number(item.quantity) * Number(item.unit_price)) * ((item.tax_percentage || 18.00) / 100);
      }
    }

    const discountAmount = quotationData.discount_amount || 0;
    const grandTotal = totalAmount + taxAmount - discountAmount;

    // 2. Insert Quotation Header
    const { data: quotation, error: qError } = await supabaseAdmin
      .from("quotations")
      .insert({
        ...quotationData,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        grand_total: grandTotal
      })
      .select()
      .single();

    if (qError) throw qError;

    // 3. Insert Line Items
    if (Array.isArray(items) && items.length > 0) {
      const lineItems = items.map((item: any) => {
        const itemTotal = Number(item.quantity) * Number(item.unit_price);
        const itemTax = itemTotal * ((item.tax_percentage || 18.00) / 100);
        return {
          quotation_id: quotation.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_amount: itemTax,
          total_price: itemTotal + itemTax
        };
      });

      const { error: itemsError } = await supabaseAdmin.from("quotation_items").insert(lineItems);
      if (itemsError) throw itemsError;
    }

    return NextResponse.json({ quotation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to build quotation" }, { status: 400 });
  }
}
