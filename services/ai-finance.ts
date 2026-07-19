import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const ai = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export class AiFinanceService {
  /**
   * AI Expense receipt scanning and automatic chart of accounts category classification.
   */
  static async categorizeExpenseReceipt(receiptText: string) {
    if (!ai) {
      // Mock local fallback
      return {
        category_code: "5020",
        category_name: "Cloud Infrastructure",
        confidence: 95,
        extracted_amount: 12500.00,
        detected_vendor: "AWS Cloud Services"
      };
    }

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
    if (!ai) {
      return {
        forecasts: [
          { month: "Aug", inflow: 150000, outflow: 80000, net: 70000 },
          { month: "Sep", inflow: 180000, outflow: 85000, net: 95000 }
        ]
      };
    }

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
