import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const CONFIRMATION_MESSAGE = `Thank you. Your project requirements have been successfully recorded. 

Our engineering team will review your details and contact you shortly to discuss the next steps for your GrowX Labs partnership.`;

const SYSTEM_PROMPT = `You are the GrowX Labs AI Agent. You are a high-performance specialist representing a premium engineering agency.

### MISSION:
Collect project requirements and convert prospective clients into leads for GrowX Labs.

### STRICT OPERATING RULES:
1. DOMAIN RESTRICTION: You ONLY assist with GrowX Labs services:
   - Custom Website & Platform Development
   - Automation Systems (n8n, Custom Logic)
   - Search Engine Optimization (SEO)
   - Premium Infrastructure & Hosting
   - AI Strategy & System Integrations

2. REJECT UNRELATED QUERIES: You are NOT a general-purpose assistant. If a user asks for jokes, general facts, or anything unrelated to our business services, you MUST politely redirect them.
   - Response Tone: "I focus on helping businesses grow through high-performance websites and automation. Let me know what you're looking to build."

3. LEAD CONVERSION: Always guide the conversation toward active project requirements.
   - Required Data: Name, Email, Phone Number, and Project Requirement.
   - Action: Once all fields are collected, call the 'save_lead' tool immediately.

4. FORBIDDEN BEHAVIOR:
   - Never say "I am just an AI" or "I am an AI assistant".
   - Never say "I can help with anything" or "Ask me anything".
   - Never say "I am not authorized" to collect data.

### TONE:
- Confident & Authoritative
- Business-focused
- Direct & Expert`;

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
    const { error } = await supabase.from("leads").insert([{
      name: data.name,
      email: data.email,
      phone: data.phone,
      requirement: data.requirement,
      message: data.requirement, // Map requirement to message to satisfy DB constraint
      status: "NEW"
    }]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return { success: false, error: error.message };
    }
    console.log("Lead Successfully Persisted:", data.email);
    return { success: true };
  } catch (e: any) {
    console.error("Persist Function Failure:", e);
    return { success: false, error: e.message };
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
          model: "gemini-1.5-flash-latest",
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
          const saveResult = await persistLead(calls[0].args);
          if (saveResult.success) {
            return NextResponse.json({ message: CONFIRMATION_MESSAGE, isLeadSaved: true });
          } else {
            return NextResponse.json({ message: "We have captured your details, but encountered a brief synchronization issue. We will manually verify your submission." });
          }
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
          const saveResult = await persistLead(leadData);
          if (saveResult.success) {
            return NextResponse.json({ message: CONFIRMATION_MESSAGE, isLeadSaved: true });
          } else {
            return NextResponse.json({ message: "We have captured your details, but encountered a brief synchronization issue. We will manually verify your submission." });
          }
        }
        if (msg.content) return NextResponse.json({ message: msg.content });
      } catch (e) {
        console.error("OpenRouter Failure:", e);
      }
    }

    return NextResponse.json({ message: "We are currently experiencing a high volume of inquiries. Please try again in a few moments." });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "The strategy assistant is currently being updated. Please check back shortly." }, { status: 500 });
  }
}
