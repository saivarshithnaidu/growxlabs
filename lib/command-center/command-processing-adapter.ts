import { CommandCenterContext } from "./context/command-center-context";
import { ToolRegistry } from "./tools/registry/tool-registry";
import { StreamWriter } from "./streaming/stream-writer";
import { GeminiProvider } from "./models/gemini.provider";
import { OpenRouterProvider } from "./models/openrouter.provider";
import { MessageRepository } from "./messages/message.repository";
import { ConversationRepository } from "./conversations/conversation.repository";
import { CommandCenterLogger } from "./logging/logger";

import { routeCommandIntent } from "./routing/intent-router";
import { cleanReply } from "./reply/clean-reply";

const SYSTEM_PROMPT = `You are GXL, the operations assistant inside GrowX Labs’ admin. You work for one person, the founder, who runs the company from this chat.

You have real tools for leads, company statistics, consulting billing, proposals, blogs, the wish game and web search. Use them whenever the answer depends on company data. Use the smallest set of tools needed.

The earlier messages in this conversation are part of the context. Read short follow-ups ("in Vijayawada", "and the other one?") together with what came before, and never claim this is a first conversation when earlier messages exist.

Honesty rules (these override everything else):
- Every number, name or record you state about the company must come from a tool result in this conversation. If you have no tool result for it, say you can’t see that data. Never estimate or invent company figures.
- Never write tool names, "Tool used:", JSON, or code blocks that imitate tool output. The app shows what ran and the data it returned, directly under your reply.
- Never say an action happened unless a tool result says so. Write tools (issue_consulting_invoice, decide_consulting_payment, create_milestone_invoice) only return an approval request: when a result has status "approval_required", say in one short line that it is ready to approve on the card below.

How to write:
- Plain, short answers. Lead with the answer itself, in a sentence or two.
- The tool data is already shown as a table under your reply, so don’t repeat it row by row. Point out what matters: totals, what is overdue, what needs action.
- No persona or agent announcements, no report headings for simple questions, no emoji.
- Use a markdown table only for something the user asked to compare that isn’t already shown as tool data.
- Offer a next step only when there is an obvious one, as a single question at the end.
- Refer to records by their numbers (GXL-INV-..., GXL-PAY-..., GXL-MSA-...).

Specific jobs:
- Proposals: when asked for a proposal or SOW, call generate_proposal, then summarise it briefly.
- Blogs: for blog, newsletter or subscriber questions use get_blog_posts_stats. To send a blog, confirm which post first, then call send_blog_to_subscribers with its id.
- Uploaded lead files (CSV, Excel, text): parse the rows and call create_leads_batch, then report how many were inserted.
- Greetings, thanks and general knowledge questions need no tools.`;

async function streamAndPersistResponse(params: {
  text: string;
  conversationId: string;
  context: CommandCenterContext;
  writer: StreamWriter;
}): Promise<void> {
  const words = params.text.split(" ");
  for (let i = 0; i < words.length; i++) {
    const delta = (i === 0 ? "" : " ") + words[i];
    params.writer.sendEvent("text_delta", { text: delta });
    await new Promise(r => setTimeout(r, 10));
  }

  await MessageRepository.createMessage({
    conversationId: params.conversationId,
    organizationId: params.context.organizationId,
    workspaceId: params.context.workspaceId,
    sender: "gxl",
    text: params.text,
    toolCalls: []
  });

  params.writer.sendEvent("done", {});
  params.writer.close();
}

export class LegacyCommandProcessor {
  static async processStream(
    message: string,
    history: any[] | undefined,
    attachments: any[] | undefined,
    conversationIdInput: string | undefined,
    commandContext: CommandCenterContext,
    baseUrl: string,
    writer: StreamWriter
  ): Promise<void> {
    const conversationId = conversationIdInput || "convo_" + Math.random().toString(36).substring(2, 9);

    CommandCenterLogger.info("Processing Command Center Stream", {
      requestId: commandContext.requestId,
      conversationId,
      userId: commandContext.userId
    });

    // Ensure conversation header exists
    await ConversationRepository.create(
      conversationId,
      message.slice(0, 40),
      commandContext.organizationId,
      commandContext.workspaceId,
    );

    // Save User message
    await MessageRepository.createMessage({
      conversationId,
      organizationId: commandContext.organizationId,
      workspaceId: commandContext.workspaceId,
      sender: "user",
      text: message
    });

    // 1. INTENT ROUTING (Deterministic pre-router)
    const intentDecision = routeCommandIntent({
      message,
      history,
      attachments
    });

    if (intentDecision.intent === "greeting") {
      await streamAndPersistResponse({
        text: "Hi! What would you like GXL to help with today?",
        conversationId,
        context: commandContext,
        writer
      });
      return;
    }

    if (intentDecision.intent === "courtesy") {
      await streamAndPersistResponse({
        text: "You’re welcome.",
        conversationId,
        context: commandContext,
        writer
      });
      return;
    }

    if (intentDecision.intent === "small_talk") {
      await streamAndPersistResponse({
        text: "I am doing great! Ready to help you orchestrate GrowX Labs operations. What are we working on?",
        conversationId,
        context: commandContext,
        writer
      });
      return;
    }

    if (intentDecision.intent === "product_help") {
      await streamAndPersistResponse({
        text: "I can help with sales data, recruitment, research, proposals, content and operational reporting. Tell me what you’re working on.",
        conversationId,
        context: commandContext,
        writer
      });
      return;
    }

    const executedToolCalls: any[] = [];
    let accumulatedText = "";
    let proposalData: any = null;
    let chartData: any = null;

    // 2. TRY GEMINI WITH TOOL FILTERING
    if (GeminiProvider.isConfigured() && intentDecision.requiresModel) {
      try {
        const model = GeminiProvider.getModel(intentDecision.allowedTools);
        const currentContents: any[] = [
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

        const userParts: any[] = [{ text: message }];
        if (attachments && attachments.length > 0) {
          attachments.forEach((file: any) => {
            if (file.base64 && file.base64.includes(",")) {
              const base64Data = file.base64.split(",")[1];
              const mime = (file.type || "").toLowerCase();
              const fileName = (file.name || "").toLowerCase();
              const isTextFile = mime.startsWith("text/") || 
                mime.includes("csv") || 
                mime.includes("excel") || 
                mime.includes("json") ||
                /\.(csv|tsv|txt|json|md)$/i.test(fileName);

              if (isTextFile) {
                try {
                  const textContent = Buffer.from(base64Data, "base64").toString("utf-8");
                  userParts.push({
                    text: `\n\n[Uploaded File Attachment: ${file.name}]\n${textContent.slice(0, 100_000)}\n[End of File Attachment]\n`
                  });
                } catch {
                  userParts.push({
                    inlineData: {
                      mimeType: file.type || "text/plain",
                      data: base64Data
                    }
                  });
                }
              } else {
                userParts.push({
                  inlineData: {
                    mimeType: file.type || "image/png",
                    data: base64Data
                  }
                });
              }
            }
          });
        }

        currentContents.push({ role: "user", parts: userParts });

        let loopCount = 0;
        const maxLoops = 15;
        let finalResponseGenerated = false;

        while (loopCount < maxLoops && !finalResponseGenerated) {
          const result = await model.generateContent({ contents: currentContents });
          const response = await result.response;
          const functionCalls = response.functionCalls();

          if (functionCalls && functionCalls.length > 0 && intentDecision.requiresTools) {
            const call = functionCalls[0];
            const toolCallId = call.name + "-" + Date.now();

            executedToolCalls.push({
              id: toolCallId,
              name: call.name,
              args: call.args,
              status: "calling"
            });

            writer.sendEvent("tool_call", { name: call.name, args: call.args });

            let toolResult: any;
            try {
              toolResult = await ToolRegistry.executeTool(call.name, call.args as Record<string, unknown>, {
                commandContext,
                sendEvent: (e, d) => writer.sendEvent(e as any, d),
                baseUrl
              });
            } catch (e: any) {
              toolResult = { error: e.message };
            }

            const tcIndex = executedToolCalls.findIndex(tc => tc.name === call.name && tc.status === "calling");
            if (tcIndex !== -1) {
              executedToolCalls[tcIndex].status = "complete";
              executedToolCalls[tcIndex].result = toolResult;
            }

            writer.sendEvent("tool_result", { name: call.name, result: toolResult });

            if (call.name === "generate_proposal" && !toolResult.error) {
              proposalData = toolResult;
            }

            currentContents.push({ role: "model", parts: [{ functionCall: call }] });
            currentContents.push({
              role: "user",
              parts: [{ functionResponse: { name: call.name, response: { result: toolResult } } }]
            });

            loopCount++;
          } else {
            const text = cleanReply(response.text() || "", message);
            const words = text.split(" ");
            for (let i = 0; i < words.length; i++) {
              const delta = (i === 0 ? "" : " ") + words[i];
              accumulatedText += delta;
              writer.sendEvent("text_delta", { text: delta });
            }
            finalResponseGenerated = true;
          }
        }

        await MessageRepository.createMessage({
          conversationId,
          organizationId: commandContext.organizationId,
          workspaceId: commandContext.workspaceId,
          sender: "gxl",
          text: accumulatedText,
          toolCalls: executedToolCalls,
          proposal: proposalData,
          chart: chartData
        });

        if (proposalData) writer.sendEvent("proposal", proposalData);
        if (chartData) writer.sendEvent("chart", chartData);
        writer.sendEvent("done", {});
        writer.close();
        return;
      } catch (e: any) {
        CommandCenterLogger.warn("Gemini flow failed, falling back to OpenRouter:", { error: e.message });
      }
    }

    // 3. TRY OPENROUTER WITH TOOL FILTERING
    if (OpenRouterProvider.isConfigured() && intentDecision.requiresModel) {
      try {
        const openrouter = OpenRouterProvider.getClient();
        const openRouterMessages: any[] = [
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
        let openRouterMessageContent = message;
        if (attachments && attachments.length > 0) {
          attachments.forEach((file: any) => {
            if (file.base64 && file.base64.includes(",")) {
              const base64Data = file.base64.split(",")[1];
              const mime = (file.type || "").toLowerCase();
              const fileName = (file.name || "").toLowerCase();
              const isTextFile = mime.startsWith("text/") || 
                mime.includes("csv") || 
                mime.includes("excel") || 
                mime.includes("json") ||
                /\.(csv|tsv|txt|json|md)$/i.test(fileName);

              if (isTextFile) {
                try {
                  const textContent = Buffer.from(base64Data, "base64").toString("utf-8");
                  openRouterMessageContent += `\n\n[Uploaded File Attachment: ${file.name}]\n${textContent.slice(0, 100_000)}\n[End of File Attachment]\n`;
                } catch {}
              }
            }
          });
        }
        openRouterMessages.push({ role: "user", content: openRouterMessageContent });

        const modelChoice = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
        let loopCount = 0;
        const maxLoops = 15;
        let finalResponseGenerated = false;

        while (loopCount < maxLoops && !finalResponseGenerated) {
          const response = await openrouter.chat.completions.create({
            model: modelChoice,
            messages: openRouterMessages,
            max_tokens: 2048,
            tools: intentDecision.requiresTools && intentDecision.allowedTools.length > 0 ? OpenRouterProvider.getTools(intentDecision.allowedTools) as any : undefined,
            tool_choice: intentDecision.requiresTools && intentDecision.allowedTools.length > 0 ? "auto" : "none"
          });

          const choice = response.choices[0];
          const msg = choice.message;

          if (msg.tool_calls && msg.tool_calls.length > 0 && intentDecision.requiresTools) {
            openRouterMessages.push(msg);

            for (const tc of msg.tool_calls) {
              const fn = (tc as any).function || {};
              const fnName = fn.name || "";
              let parsedArgs = {};
              try {
                parsedArgs = JSON.parse(fn.arguments || "{}");
              } catch (err) {
                console.error("Error parsing tool arguments:", err);
              }

              const toolCallId = fnName + "-" + Date.now();
              executedToolCalls.push({
                id: toolCallId,
                name: fnName,
                args: parsedArgs,
                status: "calling"
              });

              writer.sendEvent("tool_call", { name: fnName, args: parsedArgs });

              let toolResult: any;
              try {
                toolResult = await ToolRegistry.executeTool(fnName, parsedArgs as Record<string, unknown>, {
                  commandContext,
                  sendEvent: (e, d) => writer.sendEvent(e as any, d),
                  baseUrl
                });
              } catch (e: any) {
                toolResult = { error: e.message };
              }

              const tcIndex = executedToolCalls.findIndex(t => t.name === fnName && t.status === "calling");
              if (tcIndex !== -1) {
                executedToolCalls[tcIndex].status = "complete";
                executedToolCalls[tcIndex].result = toolResult;
              }

              writer.sendEvent("tool_result", { name: fnName, result: toolResult });

              if (fnName === "generate_proposal" && !toolResult.error) {
                proposalData = toolResult;
              }

              openRouterMessages.push({
                role: "tool",
                tool_call_id: tc.id,
                content: JSON.stringify(toolResult)
              });
            }
            loopCount++;
          } else {
            const text = cleanReply(msg.content || "", message);
            const words = text.split(" ");
            for (let i = 0; i < words.length; i++) {
              const delta = (i === 0 ? "" : " ") + words[i];
              accumulatedText += delta;
              writer.sendEvent("text_delta", { text: delta });
            }
            finalResponseGenerated = true;
          }
        }

        await MessageRepository.createMessage({
          conversationId,
          organizationId: commandContext.organizationId,
          workspaceId: commandContext.workspaceId,
          sender: "gxl",
          text: accumulatedText,
          toolCalls: executedToolCalls,
          proposal: proposalData,
          chart: chartData
        });

        if (proposalData) writer.sendEvent("proposal", proposalData);
        if (chartData) writer.sendEvent("chart", chartData);
        writer.sendEvent("done", {});
        writer.close();
        return;
      } catch (e: any) {
        CommandCenterLogger.error("OpenRouter fallback failed:", { error: e.message });
      }
    }

    // 4. DYNAMIC DATABASE DISPATCHER & SYNTHESIZER FALLBACK
    const lowerMsg = message.toLowerCase();
    let responseMarkdown = "";

    // Execute real tools to fetch dynamic database data ONLY if explicitly requested in query
    let companyStats: any = {};
    if (
      intentDecision.allowedTools.includes("get_company_stats") &&
      (lowerMsg.includes("stat") || lowerMsg.includes("metric") || lowerMsg.includes("telemetry") || lowerMsg.includes("overview") || lowerMsg.includes("brief") || lowerMsg.includes("report"))
    ) {
      const statsId = "get_company_stats-" + Date.now();
      executedToolCalls.push({ id: statsId, name: "get_company_stats", args: {}, status: "calling" });
      writer.sendEvent("tool_call", { name: "get_company_stats", args: {} });

      try {
        companyStats = await ToolRegistry.executeTool("get_company_stats", {}, { commandContext, sendEvent: (e, d) => writer.sendEvent(e as any, d), baseUrl });
      } catch (_e) {}

      const sIdx = executedToolCalls.findIndex(t => t.id === statsId);
      if (sIdx !== -1) {
        executedToolCalls[sIdx].status = "complete";
        executedToolCalls[sIdx].result = companyStats;
      }
      writer.sendEvent("tool_result", { name: "get_company_stats", result: companyStats });
    }

    let leadsData: any = [];
    if (
      intentDecision.allowedTools.includes("query_leads") &&
      (lowerMsg.includes("lead") || lowerMsg.includes("customer") || lowerMsg.includes("pipeline") || lowerMsg.includes("crm") || lowerMsg.includes("prospect"))
    ) {
      const leadsId = "query_leads-" + Date.now();
      executedToolCalls.push({ id: leadsId, name: "query_leads", args: { query: message }, status: "calling" });
      writer.sendEvent("tool_call", { name: "query_leads", args: { query: message } });

      try {
        leadsData = await ToolRegistry.executeTool("query_leads", { query: message, limit: 15 }, { commandContext, sendEvent: (e, d) => writer.sendEvent(e as any, d), baseUrl });
      } catch (_e) {}

      const lIdx = executedToolCalls.findIndex(t => t.id === leadsId);
      if (lIdx !== -1) {
        executedToolCalls[lIdx].status = "complete";
        executedToolCalls[lIdx].result = leadsData;
      }
      writer.sendEvent("tool_result", { name: "query_leads", result: leadsData });
    }

    let blogStats: any = {};
    if (
      intentDecision.allowedTools.includes("get_blog_posts_stats") &&
      (lowerMsg.includes("blog") || lowerMsg.includes("article") || lowerMsg.includes("newsletter") || lowerMsg.includes("post"))
    ) {
      const blogId = "get_blog_posts_stats-" + Date.now();
      executedToolCalls.push({ id: blogId, name: "get_blog_posts_stats", args: {}, status: "calling" });
      writer.sendEvent("tool_call", { name: "get_blog_posts_stats", args: {} });

      try {
        blogStats = await ToolRegistry.executeTool("get_blog_posts_stats", {}, { commandContext, sendEvent: (e, d) => writer.sendEvent(e as any, d), baseUrl });
      } catch (_e) {}

      const bIdx = executedToolCalls.findIndex(t => t.id === blogId);
      if (bIdx !== -1) {
        executedToolCalls[bIdx].status = "complete";
        executedToolCalls[bIdx].result = blogStats;
      }
      writer.sendEvent("tool_result", { name: "get_blog_posts_stats", result: blogStats });
    }

    if (intentDecision.allowedTools.includes("get_billing_overview")) {
      const billingId = "get_billing_overview-" + Date.now();
      executedToolCalls.push({ id: billingId, name: "get_billing_overview", args: {}, status: "calling" });
      writer.sendEvent("tool_call", { name: "get_billing_overview", args: {} });
      let billing: unknown = {};
      try {
        billing = await ToolRegistry.executeTool("get_billing_overview", {}, { commandContext, sendEvent: (e, d) => writer.sendEvent(e as any, d), baseUrl });
      } catch (e: any) {
        billing = { error: e.message };
      }
      const bIdx = executedToolCalls.findIndex(t => t.id === billingId);
      if (bIdx !== -1) {
        executedToolCalls[bIdx].status = "complete";
        executedToolCalls[bIdx].result = billing;
      }
      writer.sendEvent("tool_result", { name: "get_billing_overview", result: billing });
    }

    // No model answered. Say so plainly; any data the tools returned is rendered by the UI under this line.
    responseMarkdown = executedToolCalls.length
      ? "The AI model isn’t reachable right now, so here is the data directly."
      : "The AI model isn’t reachable right now. Try again in a moment.";

    const words = responseMarkdown.split(" ");
    for (let i = 0; i < words.length; i++) {
      const delta = (i === 0 ? "" : " ") + words[i];
      accumulatedText += delta;
      writer.sendEvent("text_delta", { text: delta });
      await new Promise(r => setTimeout(r, 10));
    }

    await MessageRepository.createMessage({
      conversationId,
      organizationId: commandContext.organizationId,
      workspaceId: commandContext.workspaceId,
      sender: "gxl",
      text: accumulatedText,
      toolCalls: executedToolCalls,
    });

    writer.sendEvent("done", {});
    writer.close();
  }
}
