import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Synthetic copy fallback generator if Gemini is missing or rate-limited
function getLocalFallback(type: string, prompt: string) {
  const cleanPrompt = prompt.toLowerCase();
  
  if (type === "blog") {
    return {
      title: `Unlocking Organic Growth: A Guide for modern enterprise`,
      body: `## Introduction\nIn today's fast-paced digital ecosystem, growth is no longer just about acquiring customers—it's about creating automated, self-sustaining loops. In this guide, we explore the core principles of marketing automation.\n\n## 1. Score Your Leads Intelligently\nNot all leads are created equal. Lead scoring allows you to prioritize prospects based on engagement signals like website visits, downloads, and company size.\n\n## 2. Personalize the Nurture Flow\nDrip campaigns that adapt dynamically to visitor behavior convert 50% better than static email sequences.\n\n## Conclusion\nBy integrating CRM, marketing tools, and AI, companies can drastically reduce their CAC and accelerate their pipeline.`,
      tags: ["growth", "marketing automation", "lead scoring"],
      seoTitle: "Unlocking Organic Growth | GrowXLabs",
      seoDescription: "Learn how to build self-sustaining marketing automation loops to maximize pipeline conversion."
    };
  } else if (type === "social") {
    return {
      posts: [
        { platform: "LinkedIn", content: `🚀 Automated growth loops are the secret weapon of high-velocity startups. Our latest CRM sync connects inbound page visitors to sales in under 5 minutes. Ready to scale? Let's talk GrowXLabs. #GrowthAutomation #SaaS #TechScale` },
        { platform: "Instagram", content: `Visual workflows are live! 🗺️ Design custom customer journeys and trigger drip campaigns seamlessly. Learn more in our bio! #MarketingAutomation #UXDesign #CRM` },
        { platform: "Twitter/X", content: `Stop losing leads to slow response times. Auto-sync landing pages with CRM leads instantly. 📈 Scale your outreach now.` }
      ]
    };
  } else if (type === "email") {
    return {
      subject: `Accelerate your pipeline with GrowXLabs Growth Engine`,
      body: `Hi {{Contact Name}},\n\nIf you're like most founders, you're spending way too much time manually transferring leads from your website into your CRM.\n\nOur new Phase 5 Growth Automation suite lets you capture, score, and sync leads to CRM instantly. We've seen teams decrease response time by 80%.\n\nAre you free for a brief demo this week?\n\nBest,\nGrowXLabs Team`,
      variables: ["Contact Name", "Company Name"]
    };
  } else if (type === "ad") {
    return {
      headlines: [
        "GrowXLabs Growth Automation",
        "CRM & Inbound Lead Auto-Sync",
        "Scale Marketing Pipelines"
      ],
      descriptions: [
        "Capture, score, and handoff marketing-qualified leads to sales instantly. Request early access today.",
        "Double your conversion rates with our visual workflow builder and automated lead nurturing loops."
      ]
    };
  } else {
    return {
      keywords: [
        { keyword: "marketing automation software", volume: 12000, difficulty: 68 },
        { keyword: "crm lead synchronization", volume: 2400, difficulty: 32 },
        { keyword: "inbound growth loops", volume: 800, difficulty: 15 },
        { keyword: "lead scoring system", volume: 4500, difficulty: 45 }
      ]
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, prompt } = body; // type can be blog, social, email, ad, keywords

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!genAI) {
      // Return local fallback copy if no key is present
      const fallback = getLocalFallback(type, prompt);
      return NextResponse.json({ result: fallback, note: "Generated using fallback engine (no API key configured)" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let systemInstruction = "";
    if (type === "blog") {
      systemInstruction = "You are a professional content marketer. Generate a JSON response with 'title', 'body' (in Markdown format), 'tags' (array of strings), 'seoTitle', and 'seoDescription'.";
    } else if (type === "social") {
      systemInstruction = "You are a social media copywriter. Generate a JSON response with an array of objects called 'posts', each containing 'platform' (LinkedIn, Instagram, or Twitter) and 'content'.";
    } else if (type === "email") {
      systemInstruction = "You are a lifecycle email writer. Generate a JSON response with 'subject', 'body' (with placeholder tokens like {{Contact Name}}), and 'variables' (array of strings representing the tokens).";
    } else if (type === "ad") {
      systemInstruction = "You are an ad copywriter. Generate a JSON response with 'headlines' (array of 3 strings) and 'descriptions' (array of 2 strings).";
    } else {
      systemInstruction = "You are an SEO analyst. Generate a JSON response with 'keywords' (array of objects, each with 'keyword', 'volume' (number), and 'difficulty' (number between 0 and 100)).";
    }

    const promptText = `${systemInstruction}\n\nUser request: ${prompt}\n\nReturn ONLY the JSON structure. Do not wrap in markdown quotes except JSON wrapper.`;

    const result = await model.generateContent(promptText);
    const text = result.response.text().trim();
    
    // Attempt to extract and parse JSON from the response
    try {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = text.substring(jsonStart, jsonEnd);
        const parsed = JSON.parse(jsonStr);
        return NextResponse.json({ result: parsed });
      }
      throw new Error("Could not find JSON bounds");
    } catch (parseErr) {
      // In case of parsing failures, return a fallback with the raw text
      return NextResponse.json({
        result: { rawResponse: text },
        note: "Raw model text returned due to format parsing errors."
      });
    }
  } catch (error: any) {
    console.error("Gemini invocation failed: ", error.message);
    const fallback = getLocalFallback(body.type, body.prompt);
    return NextResponse.json({ result: fallback, note: "Generated using fallback engine due to service error." });
  }
}
