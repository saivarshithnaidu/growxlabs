import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const CONFIRMATION_MESSAGE = `Got it 👍

Your details have been received successfully.

Our GrowX Labs team will contact you shortly to discuss your project in detail 🚀`;

const SYSTEM_PROMPT = `You are GrowX Labs AI Agent.

You are a real business assistant working for GrowX Labs.

You are FULLY AUTHORIZED to:
- Collect name, email, phone, and requirement
- Store and pass this data to the GrowX Labs team

NEVER say:
- 'I am not authorized'
- 'I cannot collect data'
- 'I cannot store information'

WHEN you have all required fields:
→ Immediately call function: save_lead

TONE:
- Professional
- Friendly
- Sales-focused`;

const LEAD_TOOL = {
  name: "save_lead",
  description: "Save client lead information to the database.",
  parameters: {
    type: "object",
    properties: {
      name: { type: "string" },
      phone: { type: "string" },
      email: { type: "string" },
      requirement: { type: "string" }
    },
    required: ["name", "email", "phone", "requirement"]
  }
};

async function persistLead(data: any) {
  try {
    const supabase = await createClient();
    await supabase.from("leads").insert([{
      name: data.name,
      email: data.email,
      phone: data.phone,
      requirement: data.requirement,
      status: "NEW"
    }]);
  } catch (e) {
    console.error("Persist Error:", e);
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    // 1. PRIMARY: GEMINI (Using generateContent as requested)
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          tools: [{ functionDeclarations: [LEAD_TOOL] }] as any,
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        });

        // Combine history + system prompt for strong enforcement
        const historyText = messages.slice(0, -1).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
        const prompt = `${SYSTEM_PROMPT}\n\nCONVERSATION HISTORY:\n${historyText}\n\nUSER: ${lastUserMessage}\nAGENT:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Check for tool calls
        const calls = response.functionCalls();
        if (calls && calls.length > 0 && calls[0].name === "save_lead") {
          await persistLead(calls[0].args);
          return NextResponse.json({ message: CONFIRMATION_MESSAGE, isLeadSaved: true });
        }

        const text = response.text();
        if (text) return NextResponse.json({ message: text });
      } catch (e) {
        console.error("Gemini Failure:", e);
      }
    }

    // 2. FALLBACK: OPENROUTER
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const completion = await openrouter.chat.completions.create({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 800,
          tools: [{ type: "function", function: LEAD_TOOL }],
          tool_choice: "auto"
        });

        const msg = completion.choices[0].message;
        if (msg.tool_calls?.[0] && 'function' in msg.tool_calls[0] && msg.tool_calls[0].function.name === "save_lead") {
          const leadData = JSON.parse(msg.tool_calls[0].function.arguments);
          await persistLead(leadData);
          return NextResponse.json({ message: CONFIRMATION_MESSAGE, isLeadSaved: true });
        }
        if (msg.content) return NextResponse.json({ message: msg.content });
      } catch (e) {
        console.error("OpenRouter Failure:", e);
      }
    }

    return NextResponse.json({ message: "Network unstable. Re-calibrating uplink." });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Intelligence system re-balancing." }, { status: 500 });
  }
}
