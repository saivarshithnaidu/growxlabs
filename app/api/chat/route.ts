import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const SYSTEM_PROMPT = `
You are GrowX AI, the intelligent assistant for GrowX Labs. 
Your goal is to assist clients, explain our services, and collect lead information professionally.

SERVICES:
- Web Development: Specialized in Next.js, React, and high-performance ecosystems.
- AI & Automation: Custom n8n workflows and AI logic systems to reduce operational overhead.
- Performance SEO: Data-driven search excellence.
- Systems Hosting: Premium managed cloud infrastructure.

RULES:
1. DO NOT finalize pricing or promise specific delivery dates.
2. DO NOT agree to contracts or negotiate final deals.
3. BE professional, concise, and cinematic in your tone.

LEAD COLLECTION:
Try to naturally collect: Name, Email, Business, and Requirement.
Once you have Name, Email, and Requirement, trigger the 'save_lead' tool/function.
`;

const LEAD_TOOL = {
  name: "save_lead",
  description: "Save client lead information to the GrowX database.",
  parameters: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      business: { type: "string" },
      requirement: { type: "string" },
      budget: { type: "string" }
    },
    required: ["name", "email", "requirement"]
  }
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. ATTEMPT PRIMARY: GEMINI
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: [LEAD_TOOL] }] as any
      });

      // Convert messages to Gemini format (simplification for demo)
      const chat = model.startChat({
        history: messages.slice(0, -1).map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }))
      });

      const result = await chat.sendMessage(messages[messages.length - 1].content);
      const response = result.response;
      const call = response.functionCalls()?.[0];

      if (call && call.name === "save_lead") {
        return NextResponse.json({ 
          message: "I've noted your architectural requirements and our team will contact you shortly. Is there anything else you'd like to verify?",
          isLeadSaved: true,
          leadData: call.args
        });
      }

      const text = response.text();
      if (text) return NextResponse.json({ message: text, provider: "gemini" });
      
    } catch (geminiError) {
      console.error("Gemini Failure, Falling back to OpenRouter:", geminiError);
    }

    // 2. FALLBACK: OPENROUTER (Claude/GPT)
    if (process.env.OPENROUTER_API_KEY) {
      const completion = await openrouter.chat.completions.create({
        model: "anthropic/claude-3-haiku",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        tools: [{ type: "function", function: LEAD_TOOL }],
        tool_choice: "auto"
      });

      const message = completion.choices[0].message;

      if (message.tool_calls) {
        const toolCall = message.tool_calls[0];
        if ('function' in toolCall && toolCall.function.name === "save_lead") {
          return NextResponse.json({ 
            message: "I've noted your architectural requirements and our team will contact you shortly. Is there anything else you'd like to verify?",
            isLeadSaved: true,
            leadData: JSON.parse(toolCall.function.arguments)
          });
        }
      }

      return NextResponse.json({ message: message.content, provider: "openrouter" });
    }

    throw new Error("All AI providers exhausted");

  } catch (error: any) {
    console.error("Critical Chat Error:", error);
    return NextResponse.json({ message: "Communication uplink unstable. Systems are re-balancing." }, { status: 500 });
  }
}
