import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { businessDescription, companyName, presenterName } = await request.json();

    if (!businessDescription) {
      return NextResponse.json({ error: "Business description / outline is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = `You are a world-class venture capitalist and pitch deck designer.
Your job is to take a business description or raw text, and extract the content to populate a premium 10-slide investor pitch deck structure.

Guidelines:
* Extract relevant details from the text to fit each slide.
* For missing details, extrapolate smart, realistic, and highly compelling business details that fit the industry.
* Keep slide texts concise, punchy, and formatted as short bullet points or brief paragraphs.
* The company name is: ${companyName || 'GrowX Labs'}
* The presenter is: ${presenterName || 'Alfredo Torres'}
* Today's Date is: ${new Date().toLocaleDateString()}

You MUST return a JSON object following this exact schema:
{
  "slide1": {
    "title": "INVESTOR PITCH DECK",
    "companyName": "string",
    "presenter": "string",
    "date": "string",
    "badges": ["string", "string", "string"]
  },
  "slide2": {
    "title": "COMPANY OVERVIEW",
    "aboutUs": "string (1 concise paragraph)",
    "keyStrengths": ["string (max 4 words)", "string", "string", "string"]
  },
  "slide3": {
    "title": "THE PROBLEM",
    "challenges": ["string (max 5 words)", "string", "string", "string"],
    "problemDescription": "string (1 concise paragraph)"
  },
  "slide4": {
    "title": "OUR SOLUTION",
    "subtitle": "string (one-line summary of what the platform is designed to do)",
    "solutions": ["string (max 5 words)", "string", "string", "string"]
  },
  "slide5": {
    "title": "MARKET OPPORTUNITY",
    "marketDescription": "string (1 concise paragraph explaining digital expansion/need)",
    "tam": "string (e.g. 'Large and continuously growing')",
    "sam": "string (e.g. 'Mid-size and enterprise-level clients')",
    "drivers": "string (comma separated list of 3 market tailwinds)",
    "insight": "string (one-line summary of long-term potential)"
  },
  "slide6": {
    "title": "BUSINESS MODEL",
    "subtitle": "A stable and scalable revenue structure:",
    "models": [
      { "id": "01", "text": "string (e.g. Subscription pricing)" },
      { "id": "02", "text": "string (e.g. Tiered custom scaling)" },
      { "id": "03", "text": "string (e.g. Consulting & support packages)" }
    ]
  },
  "slide7": {
    "title": "KEY PRODUCT FEATURES",
    "features": ["string", "string", "string", "string", "string"],
    "description": "string (1 concise paragraph detailing tech capabilities)"
  },
  "slide8": {
    "title": "COMPETITIVE ADVANTAGE",
    "subtitle": "We outperform competitors through:",
    "advantages": ["string", "string", "string", "string", "string"],
    "description": "string (1 concise paragraph explaining your moat)"
  },
  "slide9": {
    "title": "TRACTION & GROWTH INDICATORS",
    "subtitle": "Key Achievements:",
    "indicators": [
      { "id": "01", "text": "string (traction metric 1)" },
      { "id": "02", "text": "string (traction metric 2)" },
      { "id": "03", "text": "string (traction metric 3)" },
      { "id": "04", "text": "string (traction metric 4)" },
      { "id": "05", "text": "string (traction metric 5)" }
    ]
  },
  "slide10": {
    "title": "USE OF FUNDS & CONTACT",
    "funds": [
      { "item": "Advanced product development", "percentage": 40 },
      { "item": "Marketing and sales expansion", "percentage": 30 },
      { "item": "Talent recruitment and operations", "percentage": 20 },
      { "item": "Research and new technology exploration", "percentage": 10 }
    ],
    "contact": {
      "phone": "string (formatted phone number)",
      "email": "string (business email)",
      "website": "string (business website)"
    }
  }
}`;

    const prompt = `${systemPrompt}\n\nBusiness Input Details:\n"${businessDescription}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error("Gemini failed to generate pitch deck content.");
    }

    const pitchDeckData = JSON.parse(responseText);
    return NextResponse.json(pitchDeckData);

  } catch (error: any) {
    console.error("AI Pitch Deck Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
