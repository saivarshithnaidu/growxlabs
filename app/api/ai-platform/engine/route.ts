import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function getLocalEngineFallback(type: string, inputData: any) {
  if (type === "document-intelligence") {
    return {
      documentType: inputData?.fileType || "Vendor Invoice",
      extractedMetadata: {
        vendorName: "Acme Cloud Services Inc",
        invoiceNumber: "INV-90812",
        subtotalAmount: 14500,
        taxAmount: 2610,
        totalAmount: 17110,
        currency: "USD",
        dueDate: "2026-08-15"
      },
      summary: "Invoice for Q3 Enterprise Cloud Hosting Services. Payment terms: Net 30."
    };
  } else if (type === "voice-summary") {
    return {
      transcript: inputData?.transcript || "Product strategy sync meeting discussing sprint 14 deliverables.",
      meetingSummary: "Team aligned on sprint 14 commitments: 1. Deploy Phase 9 AI Platform, 2. Finalize RBAC matrix integration, 3. Complete user acceptance testing.",
      actionItems: [
        "Alex: Deploy Phase 9 AI Command Center UI",
        "Elena: Verify Gemini API key rate limits",
        "David: Complete security audit scan"
      ]
    };
  } else {
    return {
      recommendations: [
        { module: "CRM", action: "Follow up with Acme Corp (Deal score 92%)" },
        { module: "Finance", action: "Approve pending invoice INV-90812" },
        { module: "Support", action: "Reassign urgent ticket TICK-9082" }
      ]
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, inputData } = body;

    if (!genAI) {
      const fallback = getLocalEngineFallback(type, inputData);
      return NextResponse.json({ result: fallback, note: "Generated using local AI platform fallback engine" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let promptInstruction = "";
    if (type === "document-intelligence") {
      promptInstruction = "You are an Enterprise Document Intelligence AI. Parse the provided document text/metadata and return JSON with 'documentType', 'extractedMetadata' (object), and 'summary'.";
    } else if (type === "voice-summary") {
      promptInstruction = "You are a Voice AI & Meeting Summarizer. Parse the meeting transcript and return JSON with 'transcript', 'meetingSummary', and 'actionItems' (array of strings).";
    } else {
      promptInstruction = "You are an Enterprise Recommendation AI Engine. Analyze cross-module metrics and return JSON with 'recommendations' (array of objects with 'module' and 'action').";
    }

    const fullPrompt = `${promptInstruction}\n\nInput Context: ${JSON.stringify(inputData || {})}\n\nReturn ONLY valid JSON.`;

    const response = await model.generateContent(fullPrompt);
    const text = response.response.text().trim();

    try {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = text.substring(jsonStart, jsonEnd);
        const parsed = JSON.parse(jsonStr);
        return NextResponse.json({ result: parsed });
      }
      throw new Error("Could not parse JSON bounds");
    } catch (parseErr) {
      const fallback = getLocalEngineFallback(type, inputData);
      return NextResponse.json({ result: fallback, note: "Fallback response returned" });
    }
  } catch (error: any) {
    const fallback = getLocalEngineFallback(body.type, body.inputData);
    return NextResponse.json({ result: fallback, note: "Generated using fallback engine due to connection error" });
  }
}
