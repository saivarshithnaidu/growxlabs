import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { roughDraft, recipientName, businessName, senderName } = await request.json();

    if (!roughDraft) {
      return NextResponse.json({ error: "Rough draft or prompt is required" }, { status: 400 });
    }

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

    const userMessage = `Rough input / points:
"${roughDraft}"`;

    // Call OpenRouter with the Gemini model
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("AI failed to generate copy");
    }

    const aiOutreach = JSON.parse(content);
    return NextResponse.json(aiOutreach);

  } catch (error: any) {
    console.error("AI Outreach Improve Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
