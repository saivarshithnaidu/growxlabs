import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { resolveCommandCenterContext } from "@/lib/command-center/context/command-center-context";
import { requireSameOrigin } from "@/lib/command-center/security/browser-request";
import { readApproval } from "@/lib/command-center/approvals/pending-action";
import { ToolRegistry } from "@/lib/command-center/tools/registry/tool-registry";
import { CommandCenterLogger } from "@/lib/command-center/logging/logger";

export const dynamic = "force-dynamic";

/** Runs a write the orchestrator proposed, after the signed-in user clicks Approve on its card. */
export async function POST(req: Request) {
  try {
    requireSameOrigin(req);
  } catch {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  // A real session is required here; the context resolver's admin fallback must never approve writes.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in to approve actions." }, { status: 401 });

  let token = "";
  try {
    token = String(((await req.json()) as { token?: unknown }).token || "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const action = readApproval(token, session.user.id);
    const commandContext = await resolveCommandCenterContext({ req });
    if (commandContext.userId !== session.user.id) return NextResponse.json({ error: "Session mismatch." }, { status: 403 });

    const result = await ToolRegistry.executeTool(action.tool, action.args, { commandContext, approved: true });
    CommandCenterLogger.info("Command center action approved", { requestId: commandContext.requestId, tool: action.tool, userId: session.user.id });
    return NextResponse.json({ success: true, summary: action.summary, result }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The action could not be completed.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
