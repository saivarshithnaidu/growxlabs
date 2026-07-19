import { NextResponse } from "next/server";
import { AiFinanceService } from "@/services/ai-finance";

export async function POST(request: Request) {
  try {
    const { action, receiptText, transactions } = await request.json();

    if (action === "categorize_receipt") {
      const category = await AiFinanceService.categorizeExpenseReceipt(receiptText);
      return NextResponse.json({ category });
    } else if (action === "predict_cashflow") {
      const prediction = await AiFinanceService.predictCashFlowTrajectory(transactions || []);
      return NextResponse.json({ prediction });
    } else {
      throw new Error("Invalid finance AI action");
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "AI Finance service failed" }, { status: 400 });
  }
}
