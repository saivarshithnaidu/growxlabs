import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * A write the orchestrator wants to make, waiting for the user's click.
 * The model never holds the authority to act: it only gets a signed description of the action,
 * and the action runs when the signed-in user approves it in the chat.
 */
export interface PendingAction {
  tool: string;
  args: Record<string, unknown>;
  userId: string;
  /** One line shown on the approval card, e.g. "Verify ₹10,000 UPI payment GXL-PAY-2026-000003". */
  summary: string;
  expiresAt: number;
}

export interface ApprovalRequired {
  status: "approval_required";
  token: string;
  summary: string;
  tool: string;
  /** Detail rows for the card: label and value. */
  details: Array<{ label: string; value: string }>;
}

const TTL_MS = 30 * 60 * 1000;

function secret(): string {
  const value = process.env.NEXTAUTH_SECRET || process.env.COMMAND_CENTER_APPROVAL_SECRET;
  if (!value) throw new Error("Approvals are unavailable: NEXTAUTH_SECRET is not configured.");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createApproval(
  input: Omit<PendingAction, "expiresAt">,
  details: ApprovalRequired["details"] = []
): ApprovalRequired {
  const action: PendingAction = { ...input, expiresAt: Date.now() + TTL_MS };
  const payload = Buffer.from(JSON.stringify(action)).toString("base64url");
  return { status: "approval_required", token: `${payload}.${sign(payload)}`, summary: input.summary, tool: input.tool, details };
}

/** Returns the action when the token is genuine, unexpired and was issued to this user; otherwise throws. */
export function readApproval(token: string, userId: string): PendingAction {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) throw new Error("This approval is not valid.");
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) throw new Error("This approval is not valid.");
  const action = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as PendingAction;
  if (action.userId !== userId) throw new Error("This approval was created for a different user.");
  if (Date.now() > action.expiresAt) throw new Error("This approval has expired. Ask again to get a fresh one.");
  return action;
}
