import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const SYSTEM_INSTRUCTION = `You are the GrowX Labs Project Architect AI. Your job is to consult with prospective clients, refine their ideas, classify their project, and live-generate a development roadmap.

Keep your response friendly, professional, and consultative. Do not be overly verbose. Ask 1 clarifying question at a time to keep the conversation focused.

Based on the client's raw inputs, you must:
1. Identify the core "service":
   - "website" (Next.js development, e-commerce, portfolios, dashboards)
   - "automation" (n8n workflow automation, scrapers, API integrations)
   - "hosting" (deployment, cloud setup, maintenance)
   - "ai" (custom LLM workflows, agents, integrations)
   - "bundle" (multi-service projects)
2. Estimate the "budget" range:
   - "under-15k" (basic landing pages or single automation scripts, <15,000 INR)
   - "15k-35k" (standard small business websites, mid-tier workflow setups, 15,000 - 35,000 INR)
   - "35k-70k" (custom web apps, complex CRM integrations, portals, 35,000 - 70,000 INR)
   - "above-70k" (large enterprise web portals, advanced full-stack SaaS, >70,000 INR)
   - "overseas" (international clients outside India desiring USD billing)
3. Live-generate a checklist of 3-4 custom milestones (Tasks) with specific Subtasks tailored to their exact project brief. Make these milestones realistic for what they explained.

Return ONLY a JSON response conforming strictly to the following TypeScript interface structure. Do not wrap it in markdown block tags, return plain raw JSON:

interface Subtask {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  priority: "high" | "medium" | "low";
  tools?: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  priority: "high" | "medium" | "low";
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}

interface AIResponse {
  response: string; // Your direct, friendly answer or follow-up question to the user.
  service: "website" | "automation" | "hosting" | "ai" | "bundle" | ""; // Auto-detected service class (leave empty if not clear yet).
  budget: "under-15k" | "15k-35k" | "35k-70k" | "above-70k" | "overseas" | ""; // Auto-detected budget class (leave empty if not clear yet).
  tasks: Task[]; // Custom roadmap list. Provide a clean set of tasks that gets refined as they explain more.
  isReady: boolean; // Set to true if you have a clear picture of their scope, service, and budget, and they are ready to finalize.
}`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages history" }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OpenRouter API Key not configured" }, { status: 500 });
    }

    // Format prompt from history
    const historyText = messages
      .map((m: any) => `${m.role === "user" ? "Client" : "Architect"}: ${m.content}`)
      .join("\n");

    const prompt = `Analyze the user's latest inputs and respond with the updated JSON.
    
=== CONVERSATION HISTORY ===
${historyText}`;

    // Call OpenRouter
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-lite-preview-02-05:free",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const jsonText = completion.choices[0].message.content;
    if (!jsonText) throw new Error("AI failed to generate response content");

    try {
      const parsed = JSON.parse(jsonText);
      return NextResponse.json(parsed);
    } catch (parseErr) {
      console.error("OpenRouter JSON parse failure:", jsonText, parseErr);
      return NextResponse.json({
        response: "I've processed your idea. Could you tell me more about your requirements or what budget range you're targetting?",
        service: "",
        budget: "",
        tasks: [],
        isReady: false
      });
    }

  } catch (error: any) {
    console.error("Contact Conversational OpenRouter API Error:", error);
    return NextResponse.json({ error: "Architect agent is temporarily offline. Please try the traditional form." }, { status: 500 });
  }
}
