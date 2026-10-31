import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { contextFromSession, type CommandCenterContext } from "./session-scope";

export { contextFromSession, type CommandCenterContext } from "./session-scope";

export interface ResolveContextOptions {
  req?: Request;
  customOrgId?: string;
  customWorkspaceId?: string;
  customUserId?: string;
  customPermissions?: string[];
  internalServiceAuthenticated?: boolean;
}

export async function resolveCommandCenterContext(options: ResolveContextOptions = {}): Promise<CommandCenterContext> {
  const requestId = options.req?.headers.get("x-request-id") ?? crypto.randomUUID();
  if (options.customOrgId || options.customWorkspaceId || options.customUserId) {
    if (!options.internalServiceAuthenticated || !options.req?.headers.get("authorization")?.startsWith("Bearer ") || !options.customOrgId || !options.customWorkspaceId || !options.customUserId) {
      throw new Error("Authenticated internal scope is required.");
    }
    return {
      userId: options.customUserId,
      organizationId: options.customOrgId,
      workspaceId: options.customWorkspaceId,
      role: "employee",
      permissions: [...new Set(options.customPermissions ?? [])],
      requestId,
    };
  }

  // No fallback identity: a missing session is a 401, never an admin.
  const session = await getServerSession(authOptions);
  return contextFromSession(session?.user, requestId);
}
