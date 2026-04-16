import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const LEAD_TOOL = {
  name: "save_lead",
  description: "Save client lead information.",
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

const SYSTEM_PROMPT = `
You are GrowX AI, the intelligent assistant for GrowX Labs. 
Your goal is to assist clients, explain our services, and collect lead information professionally.

SERVICES:
1. Web Engineering: Specialized in Next.js, React, and high-performance ecosystems.
2. AI & Automation: Custom n8n workflows and AI logic systems.
3. Systems SEO: Data-driven search excellence.
4. Cloud Hosting: Premium managed infrastructure.

RULES:
- DO NOT finalize pricing or promise delivery timelines.
- DO NOT agree to contracts.
- BE professional, concise, and cinematic.

LEAD COLLECTION:
Collect Name, Email, and Requirement accurately. Once collected, trigger the 'save_lead' tool.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. PRIMARY: GEMINI
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ functionDeclarations: [LEAD_TOOL] }] as any
        });

        // Formulate history correctly for Gemini
        // Filter out system or empty messages
        const history = messages.slice(0, -1)
          .filter((m: any) => m.role === "user" || m.role === "assistant")
          .map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content || "" }]
          }));

        // Gemini history MUST NOT start with Model (Assistant)
        while (history.length > 0 && history[0].role === "model") {
          history.shift();
        }

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const call = response.functionCalls()?.[0];

        if (call && call.name === "save_lead") {
          return NextResponse.json({ 
            message: "I've noted your architectural requirements and our team will contact you shortly. Is there anything else you'd like to verify?",
            isLeadSaved: true,
            leadData: call.args
          });
        }

        const text = response.text();
        if (text) return NextResponse.json({ message: text });
      } catch (geminiError) {
        console.error("Gemini Failure:", geminiError);
      }
    }

    // 2. FALLBACK A: OPENAI (Standard)
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          tools: [{ type: "function", function: LEAD_TOOL }],
          tool_choice: "auto"
        });

        const msg = completion.choices[0].message;
        if (msg.tool_calls?.[0] && 'function' in msg.tool_calls[0] && msg.tool_calls[0].function.name === "save_lead") {
          return NextResponse.json({ 
            message: "Project details secured. An agent will be assigned to your case shortly. How else can I assist?", 
            isLeadSaved: true, 
            leadData: JSON.parse(msg.tool_calls[0].function.arguments) 
          });
        }
        return NextResponse.json({ message: msg.content });
      } catch (openaiError) {
        console.error("OpenAI Fallback Failure:", openaiError);
      }
    }

    // 3. FALLBACK B: OPENROUTER
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const openrouter = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: process.env.OPENROUTER_API_KEY
        });
        const completion = await openrouter.chat.completions.create({
          model: "anthropic/claude-3-haiku",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages]
        });
        return NextResponse.json({ message: completion.choices[0].message.content });
      } catch (orError) {
        console.error("OpenRouter Failure:", orError);
      }
    }

    // FINAL EMERGENCY FALLBACK
    return NextResponse.json({ 
      message: "Communication uplink unstable. System is running in safe mode. Please ensure your API keys (GEMINI_API_KEY or OPENAI_API_KEY) are configured in .env.local." 
    });

  } catch (error: any) {
    console.error("Critical Chat Handler Error:", error);
    return NextResponse.json({ message: "Intelligence system in re-calibration. Please try again." }, { status: 500 });
  }
}
