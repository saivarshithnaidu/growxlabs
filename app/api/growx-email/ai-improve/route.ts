import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { roughDraft, recipientName, businessName, senderName } = await request.json();

    if (!roughDraft) {
      return NextResponse.json({ error: "Rough draft or prompt is required" }, { status: 400 });
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

    const systemPrompt = `You are an elite corporate copywriter and sales executive at a premium digital agency (GrowX Labs).
Your task is to take a rough email draft or set of bullet points, and polish it into a highly professional, premium corporate-style email.

Guidelines:
* Keep the tone polished, premium, and business-corporate.
* Use clean paragraph spacing.
* Retain all specific details, contact info, names, and call-to-action from the rough draft.
* Address the recipient as: ${recipientName || 'Team'}
* Mention the business name if available: ${businessName || ''}
* Sign off from: ${senderName || 'GrowX Labs Team'}

Return ONLY a JSON object with this exact structure:
{
  "subject": "Compelling and professional subject line",
  "body": "The polished email body paragraphs (do not include the subject line here, start with the salutation like 'Hi [Name],')"
}`;

    const prompt = `${systemPrompt}\n\nRough input / points:\n"${roughDraft}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error("AI failed to generate copy");
    }

    const aiOutreach = JSON.parse(responseText);
    return NextResponse.json(aiOutreach);

  } catch (error: any) {
    console.error("AI Outreach Improve Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
