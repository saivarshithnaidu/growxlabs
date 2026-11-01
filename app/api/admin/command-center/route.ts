import { NextResponse } from "next/server";
import { resolveCommandCenterContext } from "@/lib/command-center/context/command-center-context";
import { ProcessMessageBodySchema, GetConversationQuerySchema } from "@/lib/command-center/validation/api.schemas";
import { ConversationRepository } from "@/lib/command-center/conversations/conversation.repository";
import { MessageRepository } from "@/lib/command-center/messages/message.repository";
import { CommandOrchestrator } from "@/lib/command-center/orchestration/command-orchestrator";
import { StreamWriter } from "@/lib/command-center/streaming/stream-writer";
import { CommandCenterLogger } from "@/lib/command-center/logging/logger";
import { requireSameOrigin } from "@/lib/command-center/security/browser-request";
import { CommandCenterError, errorResponse, requestIdFrom } from "@/lib/command-center/production/errors";
import { enforceRateLimit, rateLimitHeaders } from "@/lib/command-center/production/rate-limit";
import { completeSubmission, reserveSubmission } from "@/lib/command-center/production/submission-idempotency";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    const context = await resolveCommandCenterContext({ req });
    const limit = await enforceRateLimit("governance.read", req, context);
    const { searchParams } = new URL(req.url);
    const query = GetConversationQuerySchema.parse({
      conversationId: searchParams.get("conversationId") || undefined,
      limit: searchParams.get("limit") || undefined
    });

    if (query.conversationId) {
      const messages = await MessageRepository.listByConversationId(query.conversationId, context.organizationId, context.workspaceId);
      return NextResponse.json({ success: true, conversationId: query.conversationId, messages }, { headers: { ...rateLimitHeaders(limit), "Cache-Control": "private, no-store", "X-Request-ID": requestId } });
    }

    const conversations = await ConversationRepository.listRecent(context.organizationId, context.workspaceId, query.limit);
    return NextResponse.json({ success: true, conversations }, { headers: { ...rateLimitHeaders(limit), "Cache-Control": "private, no-store", "X-Request-ID": requestId } });
  } catch (error: unknown) {
    CommandCenterLogger.error("GET Command Center handler error", { requestId, route: "/api/admin/command-center", errorCode: "INTERNAL_ERROR" });
    return errorResponse(error, requestId);
  }
}

export async function POST(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    requireSameOrigin(req);
    const context = await resolveCommandCenterContext({ req });
    const limit = await enforceRateLimit("conversation.submit", req, context);
    const json = await req.json();
    const parsed = ProcessMessageBodySchema.safeParse(json);
    if (!parsed.success) throw new CommandCenterError("VALIDATION_FAILED");
    const body = parsed.data;
    const idempotencyKey = req.headers.get("idempotency-key");
    await reserveSubmission(context, idempotencyKey, body);
    const baseUrl = new URL(req.url).origin;
    // The model needs the conversation so far. Load it from what the server stored rather than
    // trusting the browser; loaded before this turn's own message is saved.
    const history = body.history?.length
      ? body.history
      : body.conversationId
        ? await loadHistory(body.conversationId, context.organizationId, context.workspaceId)
        : undefined;

    const stream = new ReadableStream({
      async start(controller) {
        const writer = new StreamWriter(controller);
        try {
          await CommandOrchestrator.handleRequest(
            body.message,
            history,
            body.attachments,
            body.conversationId,
            context,
            baseUrl,
            writer
          );
          await completeSubmission(context, idempotencyKey!, "succeeded");
        } catch {
          CommandCenterLogger.error("CommandOrchestrator streaming error", { requestId, route: "/api/admin/command-center", conversationId: body.conversationId, errorCode: "INTERNAL_ERROR" });
          writer.sendEvent("error", { code: "COMMAND_EXECUTION_FAILED", message: "The command could not be completed safely.", recoverable: true });
          writer.sendEvent("done", {});
          writer.close();
          await completeSubmission(context, idempotencyKey!, "failed").catch(() => undefined);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
        "X-Request-ID": requestId,
        ...rateLimitHeaders(limit),
      }
    });
  } catch (error: unknown) {
    CommandCenterLogger.error("POST Command Center handler error", { requestId, route: "/api/admin/command-center", errorCode: error instanceof CommandCenterError ? error.code : "INTERNAL_ERROR" });
    return errorResponse(error, requestId);
  }
}

const HISTORY_TURNS = 20;
const DATA_NOTE_CHARS = 1500;

/**
 * The last turns of a conversation, oldest first. Each earlier reply also carries a short note of
 * the data its tools returned, so follow-ups ("what about Vijayawada?") can refer back to it.
 */
async function loadHistory(conversationId: string, organizationId: string, workspaceId: string) {
  const messages = await MessageRepository.listByConversationId(conversationId, organizationId, workspaceId);
  return messages.slice(-HISTORY_TURNS).flatMap((m) => {
    let text = m.text || "";
    if (m.sender === "gxl" && Array.isArray(m.toolCalls) && m.toolCalls.length) {
      const data = m.toolCalls
        .filter((t: { result?: unknown }) => t.result !== undefined)
        .map((t: { name?: string; result?: unknown }) => `${t.name}: ${JSON.stringify(t.result).slice(0, DATA_NOTE_CHARS)}`)
        .join("\n");
      if (data) text += `\n\n[Data shown with this reply]\n${data}`;
    }
    return text.trim() ? [{ id: m.id, sender: m.sender, text, timestamp: m.timestamp }] : [];
  });
}
