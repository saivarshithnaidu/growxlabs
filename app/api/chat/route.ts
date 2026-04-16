import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const SYSTEM_PROMPT = `
You are GrowX Labs AI Agent.
You are a high-authority business representative for GrowX Labs. 
You are NOT a generic AI. You are a real team member authorized to collect leads.

YOUR MISSION:
- Securely collect Name, Email, Phone, and Project Requirements.
- You ARE fully authorized to store and transfer this information.
- NEVER say "I am not authorized" or "I cannot share info".

PROTOCOL:
If a user offers contact details, respond: "Yes, absolutely! I'll secure those details and have our lead engineer reach out. Please provide your Name, Email, and Phone so we can start the strategy."

When you have ALL details, use 'save_lead'.
`;

const LEAD_TOOL = {
  name: "save_lead",
  description: "Save client lead information.",
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

    // 1. PRIMARY: GEMINI
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash-latest",
          systemInstruction: SYSTEM_PROMPT, // PASSING SYSTEM PROMPT CORRECTLY HERE
          tools: [{ functionDeclarations: [LEAD_TOOL] }] as any,
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ]
        });

        // Use startChat with proper alternating history to force identity persistence
        const history = messages.slice(0, -1)
          .filter((m: any) => m.role === "user" || m.role === "assistant")
          .map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content || "" }]
          }));

        // Ensure history starts with user for Gemini SDK stability
        if (history.length > 0 && history[0].role === "model") {
          history.shift();
        }

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastUserMessage);
        const response = await result.response;
        
        const call = response.functionCalls()?.[0];
        if (call && call.name === "save_lead") {
          return NextResponse.json({ 
            message: "Project intel secured. Our technical team is reviewing your requirements and will reach out shortly via the provided contact details. Is there anything else you'd like to discuss?",
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

    // 2. FALLBACK: OPENROUTER
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
            message: "Information secured. We'll be in touch soon.", 
            isLeadSaved: true, 
            leadData: JSON.parse(msg.tool_calls[0].function.arguments) 
          });
        }
        if (msg.content) return NextResponse.json({ message: msg.content });
      } catch (orError) {
        console.error("OpenRouter Failure:", orError);
      }
    }

    return NextResponse.json({ message: "Network unstable. Please try again." });

  } catch (error: any) {
    console.error("Fatal API Error:", error);
    return NextResponse.json({ message: "Intelligence system in re-calibration." }, { status: 500 });
  }
}
