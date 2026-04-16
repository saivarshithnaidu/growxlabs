import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Initialize AI Providers
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const SYSTEM_PROMPT = `
You are GrowX Labs AI Agent.
You are not a generic AI assistant. You represent GrowX Labs and act as a real business assistant.

YOUR RESPONSIBILITIES:
- Talk to clients professionally and act as a company representative.
- Collect client information: Name, Email, Phone, and Project Requirement.
- Help convert visitors into qualified leads.
- Guide users through our engineering and automation services.

IMPORTANT RULES:
- You ARE allowed and encouraged to collect user details (name, phone, email).
- You WILL pass this data to the GrowX Labs team via our backend systems.
- You MUST NOT say: "I am not authorized", "I cannot collect data", or "I cannot share information".
- If a user asks to share details (like their phone number), respond enthusiastically: "Yes, absolutely! You can share your phone number here. I’ll securely pass your details to our team so they can reach out to you directly."

RESTRICTIONS:
- Do NOT finalize pricing.
- Do NOT guarantee timelines.
- Do NOT make legal commitments.

TONE: Friendly, Professional, Sales-focused.
GOAL: Convert conversation into a qualified lead using the 'save_lead' capability.
`;

const LEAD_TOOL = {
  name: "save_lead",
  description: "Save client lead information to the GrowX database.",
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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    // 1. PRIMARY: GEMINI 1.5 FLASH
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash-latest",
          tools: [{ functionDeclarations: [LEAD_TOOL] }] as any
        });
        
        // Construct a contextual prompt including history for single-turn GenerateContent
        const historyText = messages.slice(0, -1).map((m: any) => `${m.role === 'user' ? 'Client' : 'GrowX AI'}: ${m.content}`).join('\n');
        const fullPrompt = `${SYSTEM_PROMPT}\n\nCONVERSATION HISTORY:\n${historyText}\n\nClient: ${lastUserMessage}\nGrowX AI:`;
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        
        const call = response.functionCalls()?.[0];
        if (call && call.name === "save_lead") {
          return NextResponse.json({ 
            message: "Details secured. I've passed your requirements to the engineering team. They will contact you shortly to finalize the strategy.",
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

    // 2. FALLBACK: OPENROUTER (Claude-3 Haiku)
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const completion = await openrouter.chat.completions.create({
          model: "anthropic/claude-3-haiku",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ],
          max_tokens: 800,
          tools: [{ type: "function", function: LEAD_TOOL }],
          tool_choice: "auto"
        });

        const msg = completion.choices[0].message;
        if (msg.tool_calls?.[0] && 'function' in msg.tool_calls[0] && msg.tool_calls[0].function.name === "save_lead") {
          return NextResponse.json({ 
            message: "Information captured successfully. Our growth team will reach out to you within 24 hours.", 
            isLeadSaved: true, 
            leadData: JSON.parse(msg.tool_calls[0].function.arguments) 
          });
        }

        if (msg.content) return NextResponse.json({ message: msg.content });
      } catch (orError) {
        console.error("OpenRouter Failure:", orError);
      }
    }

    return NextResponse.json({ 
      message: "Communication uplink unstable. Please try again or visit our contact page." 
    });

  } catch (error: any) {
    console.error("Critical Chat Handler Error:", error);
    return NextResponse.json({ message: "Network intelligence unstable." }, { status: 500 });
  }
}
