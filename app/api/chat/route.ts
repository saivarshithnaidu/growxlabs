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
You are GrowX AI, the intelligent assistant for GrowX Labs. 
Your goal is to assist clients, explain our services, and collect lead information professionally.

SERVICES:
- Web Development: Specialized in Next.js, React, and high-performance ecosystems.
- AI & Automation: Custom n8n workflows and AI logic systems.
- Systems SEO: Data-driven search excellence.
- Cloud Hosting: Premium managed infrastructure.

RULES:
- DO NOT finalize pricing or promise delivery timelines.
- DO NOT agree to contracts.
- BE professional, concise, and cinematic.

LEAD COLLECTION:
Collect Name, Email, and Requirement accurately.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    // 1. PRIMARY: GEMINI FIX
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        // Construct the prompt with system instructions as per GenerateContent requirements
        const fullPrompt = `${SYSTEM_PROMPT}\n\nClient: ${lastUserMessage}\nGrowX AI:`;
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        
        if (text) {
          return NextResponse.json({ message: text });
        }
      } catch (geminiError) {
        console.error("Gemini 1.5 Flash Failure:", geminiError);
        // Silently proceed to fallback
      }
    }

    // 2. FALLBACK: OPENROUTER FIX
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const completion = await openrouter.chat.completions.create({
          model: "anthropic/claude-3-haiku",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ],
          max_tokens: 800, // Reduced to fix 402/token limit issues
        });

        const reply = completion.choices[0].message.content;
        if (reply) {
          return NextResponse.json({ message: reply });
        }
      } catch (orError) {
        console.error("OpenRouter Fallback Failure:", orError);
      }
    }

    // FINAL EMERGENCY FALLBACK
    return NextResponse.json({ 
      message: "Our intelligence systems are undergoing a high-speed update. Please try again in 30 seconds." 
    });

  } catch (error: any) {
    console.error("Critical Chat Handler Error:", error);
    return NextResponse.json({ message: "Network intelligence unstable. Re-calibrating." }, { status: 500 });
  }
}
