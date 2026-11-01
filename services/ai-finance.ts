import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const ai = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export class AiFinanceService {
  /**
   * AI Expense receipt scanning and automatic chart of accounts category classification.
   */
  static async categorizeExpenseReceipt(receiptText: string) {
    // No invented results: without a model there is nothing to classify.
    if (!ai) throw new Error("AI is not configured (GEMINI_API_KEY is missing).");

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are an AI Accountant. Analyze the receipt text below:
      "${receiptText}"
      
      Determine the best accounting category mapping code from the Chart of Accounts:
      - '5010': Employee Salaries
      - '5020': Cloud Infrastructure (GCP, AWS, Hosting)
      - '5030': Travel & Entertainment (Meals, Flights, Hotels)
      
      Return results strictly as a JSON object matching this model:
      {
        "category_code": "5010|5020|5030",
        "category_name": "...",
        "confidence": number,
        "extracted_amount": number,
        "detected_vendor": "..."
      }`;

      const response = await model.generateContent(prompt);
      const cleanJson = response.response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Cash Flow and Revenue yielding forecasting.
   */
  static async predictCashFlowTrajectory(transactions: any[]) {
    if (!ai) throw new Error("AI is not configured (GEMINI_API_KEY is missing).");

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Analyze these transaction records: ${JSON.stringify(transactions)}
      Predict inflows and outflows for the next 2 months.
      
      Return as a JSON matching this model:
      {
        "forecasts": [{ "month": "...", "inflow": number, "outflow": number, "net": number }]
      }`;

      const response = await model.generateContent(prompt);
      const cleanJson = response.response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
