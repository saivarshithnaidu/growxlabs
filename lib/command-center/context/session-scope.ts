import { CommandCenterError } from "../production/errors.ts";

export interface CommandCenterContext {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: "admin" | "manager" | "employee" | "client";
  permissions: string[];
  requestId: string;
}

export const ADMIN_PERMISSIONS = [
  "leads:read", "leads:write", "proposals:read", "proposals:write",
  "invoices:read", "invoices:write", "projects:read", "projects:write",
  "users:read", "blogs:read", "blogs:dispatch",
  "governance.approvals.read", "governance.approvals.decide",
  "governance.policies.read", "governance.policies.manage", "governance.audit.read",
];

/**
 * Builds the command center scope for a signed-in user. There is no fallback identity:
 * no session means no access, clients are refused, and only an explicit ADMIN or CO_ADMIN
 * role gets admin permissions (a missing role gets none).
 */
export function contextFromSession(
  user: { id?: string | null; role?: string | null; organisation_id?: string | null; permissions?: string[] | null } | null | undefined,
  requestId: string
): CommandCenterContext {
  if (!user?.id) throw new CommandCenterError("AUTHENTICATION_REQUIRED");

  const rawRole = String(user.role || "").toUpperCase();
  if (rawRole === "CLIENT") throw new CommandCenterError("PERMISSION_DENIED");

  const role: CommandCenterContext["role"] = rawRole === "ADMIN" || rawRole === "CO_ADMIN" ? "admin" : rawRole.includes("MANAGER") ? "manager" : "employee";
  const permissions = role === "admin"
    ? [...new Set([...ADMIN_PERMISSIONS, ...(user.permissions ?? [])])]
    : [...new Set(user.permissions ?? [])];
  const organizationId = user.organisation_id ?? process.env.DEFAULT_ORGANISATION_ID ?? "00000000-0000-0000-0000-000000000000";
  const workspaceId = process.env.DEFAULT_WORKSPACE_ID ?? "00000000-0000-0000-0000-000000000000";

  return { userId: user.id, organizationId, workspaceId, role, permissions, requestId };
}
