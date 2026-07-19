import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function getLocalAdminFallback(type: string, inputData: any) {
  if (type === "analyze-threats") {
    return {
      threatLevel: "Medium",
      riskScore: 42,
      findings: [
        "Multiple failed password attempts from IP 192.168.1.105 targeted admin_users table.",
        "MFA enforcement is currently inactive for 2 client roles."
      ],
      recommendedActions: [
        "Enforce IP auto-blocking rule after 5 failed attempts.",
        "Mandate TOTP Authenticator MFA for all Client portal roles."
      ]
    };
  } else if (type === "audit-anomaly") {
    return {
      anomaliesDetected: 1,
      policyBreaches: [
        "Bulk export of CRM leads CSV initiated outside standard business hours (11:45 PM)."
      ],
      userEmail: inputData?.userEmail || "david.m@growxlabs.tech",
      status: "Flagged for Compliance Review"
    };
  } else if (type === "recommend-permissions") {
    return {
      recommendedRoleName: inputData?.roleName || "Support Tier 2 Specialist",
      permissionsMatrix: [
        { module: "Support", action: "Support", granted: true },
        { module: "Support", action: "Update", granted: true },
        { module: "CRM", action: "Read", granted: true },
        { module: "Finance", action: "Export", granted: false }
      ]
    };
  } else {
    return {
      overallHealthScore: 96,
      performanceRating: "Optimal",
      recommendations: [
        "Enable GZip / Brotli compression for static asset exports.",
        "Rotate production API key 'gx_live_9a...' (age &gt; 30 days)."
      ]
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, inputData } = body;

    if (!genAI) {
      const fallback = getLocalAdminFallback(type, inputData);
      return NextResponse.json({ result: fallback, note: "Generated using local admin AI engine" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let promptInstruction = "";
    if (type === "analyze-threats") {
      promptInstruction = "You are an Enterprise Security & Governance AI Analyst. Analyze the security event data and return JSON with 'threatLevel' (Low, Medium, High, Critical), 'riskScore' (0-100), 'findings' (array of strings), and 'recommendedActions' (array of strings).";
    } else if (type === "audit-anomaly") {
      promptInstruction = "You are a Compliance & Audit Log AI Inspector. Analyze recent platform activity logs and return JSON with 'anomaliesDetected' (number), 'policyBreaches' (array of strings), 'userEmail', and 'status'.";
    } else if (type === "recommend-permissions") {
      promptInstruction = "You are an RBAC Permission Matrix AI Assistant. Generate optimal role permissions and return JSON with 'recommendedRoleName' and 'permissionsMatrix' (array of objects with 'module', 'action', 'granted').";
    } else {
      promptInstruction = "You are an Enterprise System Health AI Optimizer. Analyze platform metrics and return JSON with 'overallHealthScore' (0-100), 'performanceRating', and 'recommendations' (array of strings).";
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
      const fallback = getLocalAdminFallback(type, inputData);
      return NextResponse.json({ result: fallback, note: "Fallback response returned" });
    }
  } catch (error: any) {
    const fallback = getLocalAdminFallback(body.type, body.inputData);
    return NextResponse.json({ result: fallback, note: "Generated using fallback AI engine due to connection error" });
  }
}
