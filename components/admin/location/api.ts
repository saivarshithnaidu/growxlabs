"use client";

// Browser-side client for /api/admin/location/* (proxied to growx-loc /admin/v1 on the server).

export type TenantStatus = "active" | "suspended" | "archived";

export type LocationTenant = {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
  activeKeyCount?: number;
  totalKeyCount?: number;
  requestsLast30Days?: number;
};

export type LocationApiKey = {
  id: string;
  tenantId: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  status: "active" | "revoked";
  usable: boolean;
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LocationOverview = {
  tenants: Record<TenantStatus, number>;
  activeApiKeys: number;
  requestsToday: number;
  requestsLast30Days: number;
};

export type LocationUsage = {
  tenantId: string;
  keyId: string | null;
  days: number;
  totalRequests: number;
  daily: { date: string; requests: number }[];
  byKey: { keyId: string; requests: number }[];
};

export type LocationAuditEntry = {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  tenantId: string | null;
  targetType: string;
  targetId: string | null;
  metadata: Record<string, unknown>;
  requestId: string | null;
  createdAt: string;
};

/** Returned once by create and rotate. The raw key is never available again. */
export type IssuedKey = { key: LocationApiKey; rawKey: string; previousKey?: LocationApiKey | null };

export class LocationApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export async function locationApi<T>(path: string, init: { method?: "GET" | "POST" | "PATCH"; body?: unknown } = {}): Promise<T> {
  const response = await fetch(`/api/admin/location/${path}`, {
    method: init.method ?? "GET",
    headers: init.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = payload?.error ?? {};
    const detail = Array.isArray(error.details) && error.details[0] ? `${error.details[0].path || "Request"}: ${error.details[0].message}` : null;
    throw new LocationApiError(response.status, error.code ?? "ERROR", detail ?? error.message ?? "Request failed.");
  }
  return payload as T;
}

export const PERMISSIONS = [
  { value: "locations:read", label: "Read locations", description: "List, search and nearby lookups, global places and divisions" },
  { value: "locations:write", label: "Write locations", description: "Create, update and deactivate locations" },
  { value: "service-areas:read", label: "Read service areas", description: "List service areas and run delivery coverage checks" },
  { value: "service-areas:write", label: "Write service areas", description: "Create, update and deactivate service areas" },
  { value: "imports:read", label: "Read imports", description: "View bulk import status" },
  { value: "imports:write", label: "Write imports", description: "Upload bulk location CSV imports" },
] as const;

export const READ_ONLY_PERMISSIONS = ["locations:read", "service-areas:read"];

export type KeyState = "active" | "expiring" | "expired" | "revoked";

/** What /v1 auth will do with this key right now. "expiring" = active but ends within 7 days (e.g. rotation grace). */
export function keyState(key: LocationApiKey, now = Date.now()): KeyState {
  if (key.status === "revoked") return "revoked";
  if (!key.usable) return "expired";
  if (key.expiresAt && new Date(key.expiresAt).getTime() - now < 7 * 24 * 60 * 60 * 1000) return "expiring";
  return "active";
}

export const KEY_STATE_BADGE = {
  active: { label: "Active", variant: "success" },
  expiring: { label: "Expiring", variant: "warning" },
  expired: { label: "Expired", variant: "neutral" },
  revoked: { label: "Revoked", variant: "danger" },
} as const;

export const TENANT_STATUS_BADGE = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "warning" },
  archived: { label: "Archived", variant: "neutral" },
} as const;

export const AUDIT_ACTION_LABEL: Record<string, string> = {
  "tenant.create": "Tenant created",
  "tenant.update": "Tenant updated",
  "api_key.create": "API key created",
  "api_key.revoke": "API key revoked",
  "api_key.rotate": "API key rotated",
};

export function auditTone(action: string): "danger" | "warning" | "neutral" {
  return action === "api_key.revoke" ? "danger" : action === "api_key.rotate" ? "warning" : "neutral";
}

/** One-line summary of an audit entry. Metadata never contains raw keys or hashes. */
export function describeAudit(entry: LocationAuditEntry): string | undefined {
  const m = entry.metadata as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
  switch (entry.action) {
    case "api_key.create":
    case "api_key.revoke":
      return `${str(m.name) || "Key"} · ${str(m.keyPrefix)}…`;
    case "api_key.rotate":
      return `${str(m.oldKeyPrefix)}… → ${str(m.newKeyPrefix)}… · ${m.graceHours ? `${str(m.graceHours)}h grace` : "old key revoked"}`;
    case "tenant.update": {
      const from = (m.from ?? {}) as Record<string, unknown>;
      const to = (m.to ?? {}) as Record<string, unknown>;
      return Object.entries(to).map(([k, v]) => `${k}: ${str(from[k]) || "—"} → ${str(v)}`).join(" · ") || undefined;
    }
    case "tenant.create":
      return m.slug ? `Slug ${str(m.slug)}` : undefined;
    default:
      return undefined;
  }
}

export function formatCount(value: number | null | undefined) {
  return new Intl.NumberFormat("en-IN").format(value ?? 0);
}
