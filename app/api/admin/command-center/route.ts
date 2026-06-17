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
Additionally, you have tools to query the blogs database and one wish willow game telemetry/subscriber data.

When a user asks you a question, you should analyze it and execute any necessary tools to fetch data or perform operations.
Then, you must synthesize the outputs and respond directly to the user.

### YOUR AGENTS & PERSONAS:
- **Research Agent**: Conducts web searches and market research.
- **Sales Agent**: Handles querying and inserting leads.
- **CFO Agent**: Analyzes pricing, margins, packages, and corporate stats.
- **Proposal Agent**: Drafts scopes of work (SOW) and creates proposals.
- **CEO Agent**: Makes strategic recommendations and sets company vision.
- **Content / SEO Agent**: Writes editorial briefs and social copy. Exposes blog posts metrics and subscriber newsletter topics.
- **CTO / Engineering Agent**: Analyzes codebase, tech specs, and performance.

### OPERATING POLICIES:
1. **Tool Invocation**: If you need information you don't have (e.g. lead count, specific lead details, real-time web info), use the appropriate tool immediately.
2. **Real-time Stats**: Always use 'get_company_stats' or 'query_leads' when asked about leads, numbers, or performance. Do not guess.
3. **Proposal Creation**: If the user asks for a proposal or SOW (e.g. "create a proposal for ABC Hospital"), call the 'generate_proposal' tool. Then, summarize the generated proposal using markdown in your final response.
4. **Blogs & Telemetry**: If the user asks about blog posts, newsletter dispatches, subscriber pools, or wish telemetry, call 'get_blog_posts_stats' or 'query_wish_game_data'.
5. **Email/Newsletter Dispatch**: If the user says "send a blog", "dispatch newsletter", "email blog", etc., check if they specified *which* blog. If not, CALL 'get_blog_posts_stats' to retrieve all posts, present the list of blog posts to the user (highlighting which ones are sent or pending), and ask them to pick which one to send. Once they specify or confirm the blog, call 'send_blog_to_subscribers' with the corresponding UUID of the selected blog post to dispatch it.
6. **Markdown Formatting**: Use clean Notion-like markdown formatting. Use tables, bold headers, and structured bullets.

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
  },
  {
    name: "spawn_subagent",
    description: "Spawn a specialized subagent to perform focused background research, data gathering, or analysis on a specific topic.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Descriptive name of the subagent, e.g. 'Real Estate Growth Agent'" },
        focus: { type: "string", description: "The specific topic or search query the subagent should research" },
        mission: { type: "string", description: "The specific mission or goal, e.g. 'Identify top real estate agencies in Miami'" }
      },
      required: ["name", "focus", "mission"]
    }
  },
  {
    name: "get_blog_posts_stats",
    description: "Retrieve all blog posts from the database including their title, slug, sent status, and published date.",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Maximum number of records to return (default 20)" }
      },
      required: []
    }
  },
  {
    name: "query_wish_game_data",
    description: "Query the wish game subscribers and telemetry logs from the database.",
    parameters: {
      type: "object",
      properties: {
        searchQuery: { type: "string", description: "Search by name, email, or wish text" },
        limit: { type: "number", description: "Maximum number of records to return (default 20)" }
      },
      required: []
    }
  },
  {
    name: "send_blog_to_subscribers",
    description: "Send/dispatch a specific blog post to all active subscribers via email newsletter.",
    parameters: {
      type: "object",
      properties: {
        blogPostId: { type: "string", description: "The UUID of the blog post to dispatch to subscribers." }
      },
      required: ["blogPostId"]
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
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      throw new Error("SERPER_API_KEY is not configured");
    }

    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ q: query })
    });

    if (!res.ok) throw new Error(`Serper returned status ${res.status}`);
    const data = await res.json();
    
    if (!data.organic || !Array.isArray(data.organic) || data.organic.length === 0) {
      return "No search results found. Try another query.";
    }

    const snippets = data.organic.slice(0, 5).map((item: any, idx: number) => {
      return `[${idx + 1}] ${item.title}\nSource: ${item.link}\nSnippet: ${item.snippet}`;
    });

    return snippets.join("\n\n");
  } catch (e: any) {
    console.error("Serper API error:", e);
    return `Search failed: ${e.message}. Using offline knowledge base.`;
  }
}

async function execute_spawn_subagent(
  args: { name: string; focus: string; mission: string },
  sendEvent: (event: string, data: any) => void
) {
  const subagentId = "sub-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  // 1. Notify spawn
  sendEvent("subagent_spawn", {
    id: subagentId,
    name: args.name,
    focus: args.focus,
    mission: args.mission,
    status: "running"
  });

  await new Promise(r => setTimeout(r, 800));

  // 2. Logs and execution
  sendEvent("subagent_log", {
    id: subagentId,
    log: `Initializing agent workspace for "${args.name}"...`
  });
  await new Promise(r => setTimeout(r, 800));

  sendEvent("subagent_log", {
    id: subagentId,
    log: `Executing deep-dive search for query: "${args.focus}"`
  });

  const searchResults = await searchWeb(args.focus);
  await new Promise(r => setTimeout(r, 800));

  sendEvent("subagent_log", {
    id: subagentId,
    log: `Search completed. Analyzing retrieved snippets...`
  });
  await new Promise(r => setTimeout(r, 1200));

  sendEvent("subagent_log", {
    id: subagentId,
    log: `Synthesizing intelligence report for mission: "${args.mission}"`
  });
  await new Promise(r => setTimeout(r, 1000));

  const findings = `Intelligence Summary for subagent [${args.name}]:\n` +
    `Mission: ${args.mission}\n` +
    `Focus: ${args.focus}\n` +
    `Findings: ${searchResults.substring(0, 1000)}...`;

  // 3. Complete
  sendEvent("subagent_complete", {
    id: subagentId,
    status: "completed",
    result: findings
  });

  return {
    subagentId,
    status: "SUCCESS",
    findings
  };
}

async function execute_get_blog_posts_stats(args: { limit?: number }) {
  const limit = args.limit || 20;
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id, title, slug, excerpt, published_at, sent_to_subscribers")
    .order("published_at", { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  return data;
}

async function execute_query_wish_game_data(args: { searchQuery?: string; limit?: number }) {
  const limit = args.limit || 20;
  let telemetryQuery = supabaseAdmin.from("wish_game_data").select("*");
  
  if (args.searchQuery) {
    telemetryQuery = telemetryQuery.or(
      `name.ilike.%${args.searchQuery}%,email.ilike.%${args.searchQuery}%,wish.ilike.%${args.searchQuery}%`
    );
  }
  
  const { data: telemetry, error: telemetryError } = await telemetryQuery
    .order("created_at", { ascending: false })
    .limit(limit);
    
  if (telemetryError) throw telemetryError;
  
  let subscribersQuery = supabaseAdmin.from("wish_subscribers").select("*");
  if (args.searchQuery) {
    subscribersQuery = subscribersQuery.or(
      `name.ilike.%${args.searchQuery}%,email.ilike.%${args.searchQuery}%`
    );
  }
  
  const { data: subscribers, error: subsError } = await subscribersQuery
    .order("created_at", { ascending: false })
    .limit(limit);
    
  if (subsError) throw subsError;
  
  return {
    telemetryLogs: telemetry || [],
    activeSubscribers: subscribers || []
  };
}

async function execute_send_blog_to_subscribers(args: { blogPostId: string }, baseUrl: string) {
  if (!args.blogPostId) {
    return { error: "blogPostId is required." };
  }
  
  try {
    const res = await fetch(`${baseUrl}/api/send-blog-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blog_post_id: args.blogPostId })
    });
    
    if (!res.ok) {
      const errText = await res.text();
      return { error: `Server returned error ${res.status}: ${errText}` };
    }
    
    return await res.json();
  } catch (error: any) {
    console.error("Error sending blog email via tool:", error);
    return { error: error.message || "Failed to send email." };
  }
}

async function handleToolCall(name: string, args: any, sendEvent?: (event: string, data: any) => void, baseUrl?: string) {
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
    case "spawn_subagent":
      if (sendEvent) {
        return await execute_spawn_subagent(args, sendEvent);
      }
      return { error: "Streaming context unavailable for spawning subagent" };
    case "get_blog_posts_stats":
      return await execute_get_blog_posts_stats(args);
    case "query_wish_game_data":
      return await execute_query_wish_game_data(args);
    case "send_blog_to_subscribers":
      return await execute_send_blog_to_subscribers(args, baseUrl || "http://localhost:3000");
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id?: string): boolean {
  return !!id && uuidRegex.test(id);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      const { data: messages, error } = await supabaseAdmin
        .from("command_center_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return NextResponse.json({ messages });
    } else {
      const { data: conversations, error } = await supabaseAdmin
        .from("command_center_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ conversations });
    }
  } catch (error: any) {
    console.error("GET Command Center error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    let { message, conversationId, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Determine active conversation UUID
    if (!isValidUuid(conversationId)) {
      const { data: newConvo, error: createError } = await supabaseAdmin
        .from("command_center_conversations")
        .insert({ title: "New conversation" })
        .select()
        .single();

      if (createError) throw createError;
      conversationId = newConvo.id;
    }

    // Save the user's message
    const { error: userMsgError } = await supabaseAdmin
      .from("command_center_messages")
      .insert({
        conversation_id: conversationId,
        sender: "user",
        text: message
      });
    if (userMsgError) throw userMsgError;

    // Update conversation title from first user message if it was default
    const titleText = message.length > 45 ? message.slice(0, 42) + "..." : message;
    await supabaseAdmin
      .from("command_center_conversations")
      .update({ 
        title: titleText,
        updated_at: new Date().toISOString()
      })
      .eq("id", conversationId)
      .eq("title", "New conversation");

    // Always bump updated_at timestamp
    await supabaseAdmin
      .from("command_center_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // Send conversation ID to client immediately
          sendEvent("conversation_id", { conversationId });

          let proposalData: any = null;
          let chartData: any = null;
          let accumulatedText = "";
          const executedToolCalls: any[] = [];

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
                  const toolCallId = call.name + "-" + Date.now();
                  
                  executedToolCalls.push({
                    id: toolCallId,
                    name: call.name,
                    args: call.args,
                    status: "calling"
                  });

                  sendEvent("tool_call", { name: call.name, args: call.args });

                  let toolResult;
                  try {
                    toolResult = await handleToolCall(call.name, call.args, sendEvent, baseUrl);
                  } catch (e: any) {
                    toolResult = { error: e.message };
                  }

                  const tcIndex = executedToolCalls.findIndex(tc => tc.name === call.name && tc.status === "calling");
                  if (tcIndex !== -1) {
                    executedToolCalls[tcIndex].status = "complete";
                    executedToolCalls[tcIndex].result = toolResult;
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
                    const delta = (i === 0 ? "" : " ") + words[i];
                    accumulatedText += delta;
                    sendEvent("text_delta", { text: delta });
                    await new Promise(r => setTimeout(r, 10));
                  }
                  finalResponseGenerated = true;
                }
              }

              // Save GXL message in DB
              const { error: aiMsgError } = await supabaseAdmin
                .from("command_center_messages")
                .insert({
                  conversation_id: conversationId,
                  sender: "gxl",
                  text: accumulatedText,
                  tool_calls: executedToolCalls,
                  proposal: proposalData,
                  chart: chartData
                });
              if (aiMsgError) throw aiMsgError;

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
                  const toolCallId = call.function.name + "-" + Date.now();

                  executedToolCalls.push({
                    id: toolCallId,
                    name: call.function.name,
                    args: parsedArgs,
                    status: "calling"
                  });

                  sendEvent("tool_call", { name: call.function.name, args: parsedArgs });

                  let toolResult;
                  try {
                    toolResult = await handleToolCall(call.function.name, parsedArgs, sendEvent, baseUrl);
                  } catch (e: any) {
                    toolResult = { error: e.message };
                  }

                  const tcIndex = executedToolCalls.findIndex(tc => tc.name === call.function.name && tc.status === "calling");
                  if (tcIndex !== -1) {
                    executedToolCalls[tcIndex].status = "complete";
                    executedToolCalls[tcIndex].result = toolResult;
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
                  const delta = (i === 0 ? "" : " ") + words[i];
                  accumulatedText += delta;
                  sendEvent("text_delta", { text: delta });
                  await new Promise(r => setTimeout(r, 10));
                }
                finalResponseGenerated = true;
              }
            }

            // Save GXL message in DB
            const { error: aiMsgError } = await supabaseAdmin
              .from("command_center_messages")
              .insert({
                conversation_id: conversationId,
                sender: "gxl",
                text: accumulatedText,
                tool_calls: executedToolCalls,
                proposal: proposalData,
                chart: chartData
              });
            if (aiMsgError) throw aiMsgError;
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
