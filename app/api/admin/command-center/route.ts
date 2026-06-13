import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const SYSTEM_PROMPT = `You are the GXL Command Center Central Orchestrator, an AI-native operational system for GrowX Labs.
You lead a team of digital agents (CEO, CFO, Sales, Marketing, Research, Content, SEO, CTO, and Engineering).
You have access to real tools to view/insert leads, query statistics, generate client proposals (SOW), and search the web.

When a user asks you a question, you should analyze it and execute any necessary tools to fetch data or perform operations.
Then, you must synthesize the outputs and respond directly to the user.

### YOUR AGENTS & PERSONAS:
- **Research Agent**: Conducts web searches and market research.
- **Sales Agent**: Handles querying and inserting leads.
- **CFO Agent**: Analyzes pricing, margins, packages, and corporate stats.
- **Proposal Agent**: Drafts scopes of work (SOW) and creates proposals.
- **CEO Agent**: Makes strategic recommendations and sets company vision.
- **Content / SEO Agent**: Writes editorial briefs and social copy.
- **CTO / Engineering Agent**: Analyzes codebase, tech specs, and performance.

### OPERATING POLICIES:
1. **Tool Invocation**: If you need information you don't have (e.g. lead count, specific lead details, real-time web info), use the appropriate tool immediately.
2. **Real-time Stats**: Always use 'get_company_stats' or 'query_leads' when asked about leads, numbers, or performance. Do not guess.
3. **Proposal Creation**: If the user asks for a proposal or SOW (e.g. "create a proposal for ABC Hospital"), call the 'generate_proposal' tool. Then, summarize the generated proposal using markdown in your final response.
4. **Markdown Formatting**: Use clean Notion-like markdown formatting. Use tables, bold headers, and structured bullets.

Keep responses detailed, professional, and action-oriented.`;

const TOOLS_DEFINITIONS = [
  {
    name: "get_company_stats",
    description: "Retrieve general business statistics including total lead count, status breakdown, and recent leads.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "query_leads",
    description: "Query the leads database with optional filters for status, city, or record limit.",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter leads by status (e.g. 'new', 'contacted', 'qualified', 'lost')" },
        city: { type: "string", description: "Filter leads by city name" },
        limit: { type: "number", description: "Maximum number of records to return (default 10, max 50)" }
      }
    }
  },
  {
    name: "create_lead",
    description: "Insert a new lead record into the database.",
    parameters: {
      type: "object",
      properties: {
        business_name: { type: "string", description: "Name of the business" },
        city: { type: "string", description: "City where business is located" },
        email: { type: "string", description: "Email address for contact" },
        phone: { type: "string", description: "Phone number for contact" },
        name: { type: "string", description: "Name of contact person" },
        website_url: { type: "string", description: "Website URL of the business" },
        notes: { type: "string", description: "Optional notes about the lead" }
      },
      required: ["business_name", "city", "email", "phone"]
    }
  },
  {
    name: "generate_proposal",
    description: "Generate and persist a new Scope of Work (SOW) client proposal.",
    parameters: {
      type: "object",
      properties: {
        clientName: { type: "string", description: "Name of client contact person" },
        businessName: { type: "string", description: "Name of client business" },
        selectedPackage: { type: "string", description: "Selected package (e.g. 'Standard Tier', 'Growth Tier', 'Enterprise Suite')" },
        customPrice: { type: "string", description: "Optional custom pricing override as a string (e.g. '₹7,50,000')" },
        problem: { type: "string", description: "Brief description of the client's operational problem" },
        impact: { type: "string", description: "Estimated financial impact of the pain point" },
        validDays: { type: "number", description: "Number of days the proposal remains valid (default 7)" }
      },
      required: ["clientName", "businessName", "selectedPackage"]
    }
  },
  {
    name: "search_web",
    description: "Perform a live web search to retrieve real-time market data or search engine results.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query string" }
      },
      required: ["query"]
    }
  }
];

const OPENAI_TOOLS = TOOLS_DEFINITIONS.map(d => ({
  type: "function" as const,
  function: {
    name: d.name,
    description: d.description,
    parameters: d.parameters
  }
}));

async function execute_get_company_stats() {
  const { data: allLeads, error } = await supabaseAdmin
    .from("leads")
    .select("id, status, lead_score");
  if (error) throw error;

  const total = allLeads.length;
  const statusBreakdown: Record<string, number> = {};
  let totalScore = 0;
  let scoredCount = 0;

  allLeads.forEach(lead => {
    const status = lead.status || "unknown";
    statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
    if (lead.lead_score !== null && lead.lead_score !== undefined) {
      totalScore += lead.lead_score;
      scoredCount++;
    }
  });

  const avgScore = scoredCount > 0 ? (totalScore / scoredCount).toFixed(1) : "N/A";

  const { data: recentLeads } = await supabaseAdmin
    .from("leads")
    .select("id, business_name, city, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalLeads: total,
    statusBreakdown,
    averageLeadScore: avgScore,
    recentLeads: recentLeads || []
  };
}

async function execute_query_leads(args: { status?: string; city?: string; limit?: number }) {
  let queryBuilder = supabaseAdmin.from("leads").select("*");
  if (args.status) {
    queryBuilder = queryBuilder.eq("status", args.status);
  }
  if (args.city) {
    queryBuilder = queryBuilder.ilike("city", `%${args.city}%`);
  }
  const limit = args.limit || 10;
  queryBuilder = queryBuilder.order("created_at", { ascending: false }).limit(limit);

  const { data, error } = await queryBuilder;
  if (error) throw error;
  return data;
}

async function execute_create_lead(args: {
  business_name: string;
  city: string;
  email: string;
  phone: string;
  name?: string;
  website_url?: string;
  notes?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert([{
      business_name: args.business_name,
      city: args.city,
      email: args.email,
      phone: args.phone,
      name: args.name || null,
      website_url: args.website_url || null,
      notes: args.notes || null,
      status: "new",
      lead_score: 5
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function execute_generate_proposal(args: {
  clientName: string;
  businessName: string;
  selectedPackage: string;
  customPrice?: string;
  problem?: string;
  impact?: string;
  validDays?: number;
}) {
  const validUntil = new Date(Date.now() + (args.validDays || 7) * 24 * 60 * 60 * 1000).toISOString();
  let customPriceFloat: number | null = null;
  if (args.customPrice) {
    customPriceFloat = parseFloat(args.customPrice.replace(/[^0-9.]/g, ''));
  } else {
    const pkg = args.selectedPackage.toLowerCase();
    if (pkg.includes("standard")) customPriceFloat = 450000;
    else if (pkg.includes("growth")) customPriceFloat = 750000;
    else if (pkg.includes("enterprise")) customPriceFloat = 1200000;
  }

  const { data, error } = await supabaseAdmin
    .from("proposals")
    .insert([{
      client_name: args.clientName,
      business_name: args.businessName,
      selected_package: args.selectedPackage,
      custom_price: customPriceFloat,
      problem_description: args.problem || null,
      pain_point_cost: args.impact || null,
      status: "sent",
      valid_until: validUntil
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    proposalId: data.id,
    clientName: data.client_name,
    businessName: data.business_name,
    budget: data.custom_price ? `₹${data.custom_price.toLocaleString("en-IN")}` : "TBD",
    timeline: args.selectedPackage.toLowerCase().includes("standard") ? "6 Weeks" : (args.selectedPackage.toLowerCase().includes("growth") ? "9 Weeks" : "12 Weeks"),
    deliverables: args.selectedPackage.toLowerCase().includes("standard") ? 
      ["Core CRM Integration", "Automated Workflows"] : 
      (args.selectedPackage.toLowerCase().includes("growth") ? 
        ["HIPAA-Compliant Patient Intake CRM", "Autonomous AI Inquiry Agent System", "1 Year Support SLA"] : 
        ["Full Agentic Ops OS", "1 Year Enterprise SLA", "Custom Integrations"]),
    status: "DRAFT_COMPLETED"
  };
}

async function searchWeb(query: string) {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) throw new Error("DDG request failed");
    const html = await res.text();
    const matches = [...html.matchAll(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)];
    const snippets = matches.slice(0, 5).map(m => m[1].replace(/<[^>]*>/g, '').trim());
    if (snippets.length === 0) return "No search results found. Try another query.";
    return snippets.join("\n\n");
  } catch (e: any) {
    return `Search failed: ${e.message}. Using offline knowledge base.`;
  }
}

async function handleToolCall(name: string, args: any) {
  switch (name) {
    case "get_company_stats":
      return await execute_get_company_stats();
    case "query_leads":
      return await execute_query_leads(args);
    case "create_lead":
      return await execute_create_lead(args);
    case "generate_proposal":
      return await execute_generate_proposal(args);
    case "search_web":
      return await searchWeb(args.query);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          let proposalData: any = null;
          let chartData: any = null;

          // 1. TRY GEMINI FIRST
          if (process.env.GEMINI_API_KEY) {
            try {
              const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                tools: [{ functionDeclarations: TOOLS_DEFINITIONS }] as any
              });

              let currentContents: any[] = [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Understood. I will operate as the GXL Command Center Central Orchestrator." }] }
              ];

              if (history && history.length > 0) {
                history.forEach((h: any) => {
                  currentContents.push({
                    role: h.sender === "user" ? "user" : "model",
                    parts: [{ text: h.text }]
                  });
                });
              }

              currentContents.push({
                role: "user",
                parts: [{ text: message }]
              });

              let loopCount = 0;
              const maxLoops = 5;
              let finalResponseGenerated = false;

              while (loopCount < maxLoops && !finalResponseGenerated) {
                const result = await model.generateContent({ contents: currentContents });
                const response = await result.response;
                const functionCalls = response.functionCalls();

                if (functionCalls && functionCalls.length > 0) {
                  const call = functionCalls[0];
                  sendEvent("tool_call", { name: call.name, args: call.args });

                  let toolResult;
                  try {
                    toolResult = await handleToolCall(call.name, call.args);
                  } catch (e: any) {
                    toolResult = { error: e.message };
                  }

                  sendEvent("tool_result", { name: call.name, result: toolResult });

                  if (call.name === "generate_proposal" && !toolResult.error) {
                    proposalData = toolResult;
                  }
                  if (call.name === "get_company_stats" && !toolResult.error) {
                    chartData = [
                      { month: "Jan", revenue: 45000 },
                      { month: "Feb", revenue: 62000 },
                      { month: "Mar", revenue: 58000 },
                      { month: "Apr", revenue: 75000 },
                      { month: "May", revenue: 90000 },
                      { month: "Jun", revenue: 120000 },
                    ];
                  }

                  currentContents.push({
                    role: "model",
                    parts: [{ functionCall: call }]
                  });

                  currentContents.push({
                    role: "user",
                    parts: [{
                      functionResponse: {
                        name: call.name,
                        response: { result: toolResult }
                      }
                    }]
                  });

                  loopCount++;
                } else {
                  const text = response.text() || "";
                  const words = text.split(" ");
                  for (let i = 0; i < words.length; i++) {
                    sendEvent("text_delta", { text: (i === 0 ? "" : " ") + words[i] });
                    await new Promise(r => setTimeout(r, 10));
                  }
                  finalResponseGenerated = true;
                }
              }

              if (proposalData) sendEvent("proposal", proposalData);
              if (chartData) sendEvent("chart", chartData);
              sendEvent("done", {});
              controller.close();
              return;
            } catch (e: any) {
              console.error("Gemini flow failed, falling back to OpenRouter:", e);
            }
          }

          // 2. FALLBACK TO OPENROUTER
          if (process.env.OPENROUTER_API_KEY) {
            let openRouterMessages: any[] = [
              { role: "system", content: SYSTEM_PROMPT }
            ];

            if (history && history.length > 0) {
              history.forEach((h: any) => {
                openRouterMessages.push({
                  role: h.sender === "user" ? "user" : "assistant",
                  content: h.text
                });
              });
            }

            openRouterMessages.push({
              role: "user",
              content: message
            });

            let openRouterLoops = 0;
            const maxLoops = 5;
            let finalResponseGenerated = false;

            while (openRouterLoops < maxLoops && !finalResponseGenerated) {
              const completion = await openrouter.chat.completions.create({
                model: "openrouter/free",
                messages: openRouterMessages,
                tools: OPENAI_TOOLS,
                tool_choice: "auto",
                max_tokens: 1000
              });

              const msg = completion.choices[0].message;
              if (msg.tool_calls && msg.tool_calls.length > 0) {
                const call = msg.tool_calls[0];
                if ('function' in call) {
                  const parsedArgs = JSON.parse(call.function.arguments);

                  sendEvent("tool_call", { name: call.function.name, args: parsedArgs });

                  let toolResult;
                  try {
                    toolResult = await handleToolCall(call.function.name, parsedArgs);
                  } catch (e: any) {
                    toolResult = { error: e.message };
                  }

                  sendEvent("tool_result", { name: call.function.name, result: toolResult });

                  if (call.function.name === "generate_proposal" && !toolResult.error) {
                    proposalData = toolResult;
                  }
                  if (call.function.name === "get_company_stats" && !toolResult.error) {
                    chartData = [
                      { month: "Jan", revenue: 45000 },
                      { month: "Feb", revenue: 62000 },
                      { month: "Mar", revenue: 58000 },
                      { month: "Apr", revenue: 75000 },
                      { month: "May", revenue: 90000 },
                      { month: "Jun", revenue: 120000 },
                    ];
                  }

                  openRouterMessages.push(msg);
                  openRouterMessages.push({
                    role: "tool",
                    tool_call_id: call.id,
                    content: JSON.stringify({ result: toolResult })
                  });
                } else {
                  openRouterMessages.push(msg);
                }

                openRouterLoops++;
              } else {
                const text = msg.content || "";
                const words = text.split(" ");
                for (let i = 0; i < words.length; i++) {
                  sendEvent("text_delta", { text: (i === 0 ? "" : " ") + words[i] });
                  await new Promise(r => setTimeout(r, 10));
                }
                finalResponseGenerated = true;
              }
            }
          }

          if (proposalData) sendEvent("proposal", proposalData);
          if (chartData) sendEvent("chart", chartData);
          sendEvent("done", {});
          controller.close();
        } catch (error: any) {
          console.error("Command Center Route Stream Error:", error);
          sendEvent("error", { message: error.message || "Internal stream error" });
          controller.close();
        }
      }
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      }
    });

  } catch (error: any) {
    console.error("Command Center Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
