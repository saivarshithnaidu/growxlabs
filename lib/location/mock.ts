import "server-only";

// Local-development stand-in for growx-loc /admin/v1, so the Location admin UI can be seen and clicked
// through without the Worker. Enabled only when NODE_ENV !== "production" AND GROWX_LOC_ADMIN_URL is unset.
// State lives in memory and resets when the dev server restarts. Responses mirror the real API shapes.

export function isLocationMockMode(): boolean {
  return process.env.NODE_ENV !== "production" && !process.env.GROWX_LOC_ADMIN_URL;
}

type Tenant = { id: string; name: string; slug: string; status: "active" | "suspended" | "archived"; created_at: string; updated_at: string };
type Key = {
  id: string; tenant_id: string; name: string; key_prefix: string; permissions: string[]; status: "active" | "revoked";
  expires_at: string | null; last_used_at: string | null; created_at: string; updated_at: string;
};
type Audit = {
  id: string; actor_id: string; actor_email: string; action: string; tenant_id: string | null; target_type: string;
  target_id: string | null; metadata: Record<string, unknown>; request_id: string; created_at: string;
};
type Usage = { api_key_id: string; tenant_id: string; usage_date: string; request_count: number };

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
const ahead = (ms: number) => new Date(Date.now() + ms).toISOString();
const uuid = () => crypto.randomUUID();
const hex = (n: number) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, "0")).join("");

const READ = ["locations:read", "service-areas:read"];
const FULL = ["locations:read", "locations:write", "imports:read", "imports:write", "service-areas:read", "service-areas:write"];

function seed() {
  const t = (name: string, slug: string, status: Tenant["status"], days: number): Tenant => ({
    id: uuid(), name, slug, status, created_at: ago(days * DAY), updated_at: ago(Math.min(days, 3) * DAY),
  });
  const growx = t("GrowX Labs", "growxlabs", "active", 18);
  const acme = t("Acme Motors", "acme-motors", "active", 12);
  const sai = t("Sri Sai Agro Dealers", "sri-sai-agro", "active", 9);
  const metro = t("Metro Pharmacy Chain", "metro-pharmacy", "suspended", 30);
  const pilot = t("Pilot - Coastal Logistics", "coastal-logistics-pilot", "archived", 60);
  const tenants = [growx, acme, sai, metro, pilot];

  const k = (tenant: Tenant, name: string, permissions: string[], extra: Partial<Key> = {}): Key => ({
    id: uuid(), tenant_id: tenant.id, name, key_prefix: `gx_loc_${hex(6).slice(0, 11)}`, permissions, status: "active",
    expires_at: null, last_used_at: ago(Math.random() * 6 * HOUR), created_at: ago(10 * DAY), updated_at: ago(2 * DAY), ...extra,
  });
  const keys: Key[] = [
    k(growx, "Production API key", FULL),
    k(growx, "Staging", FULL, { last_used_at: ago(2 * DAY) }),
    k(acme, "Dealer locator website", READ),
    k(acme, "ERP sync", FULL, { expires_at: ahead(20 * HOUR) }),
    k(acme, "Old website key", READ, { status: "revoked", last_used_at: ago(9 * DAY) }),
    k(sai, "Delivery check app", ["service-areas:read", "locations:read"], { expires_at: ahead(120 * DAY) }),
    k(sai, "Trial key", READ, { expires_at: ago(3 * DAY), last_used_at: ago(4 * DAY) }),
    k(metro, "Store finder", READ, { last_used_at: ago(6 * DAY) }),
    k(pilot, "Pilot key", READ, { status: "revoked", last_used_at: ago(45 * DAY) }),
  ];

  // Deterministic-looking daily traffic with a weekday rhythm.
  const usage: Usage[] = [];
  const weights: Record<string, number> = {};
  keys.forEach((key, i) => { weights[key.id] = key.status === "revoked" ? 0 : [2400, 180, 900, 650, 0, 320, 40, 0, 0][i] ?? 0; });
  for (let d = 0; d < 90; d++) {
    const date = new Date(Date.now() - d * DAY);
    const weekday = date.getUTCDay();
    const rhythm = weekday === 0 ? 0.45 : weekday === 6 ? 0.6 : 1;
    for (const key of keys) {
      const base = weights[key.id];
      if (!base) continue;
      if (key.expires_at && new Date(key.expires_at).getTime() < date.getTime()) continue;
      const tenant = tenants.find((x) => x.id === key.tenant_id)!;
      if (tenant.status === "suspended" && d < 6) continue;
      const growth = 0.7 + 0.3 * (1 - d / 90);
      const noise = 0.8 + ((d * 7919 + base) % 40) / 100;
      usage.push({ api_key_id: key.id, tenant_id: key.tenant_id, usage_date: date.toISOString().slice(0, 10), request_count: Math.round(base * rhythm * growth * noise) });
    }
  }

  const a = (action: string, tenant: Tenant, targetType: string, targetId: string, metadata: Record<string, unknown>, at: number, email = "admin@growxlabs.tech"): Audit => ({
    id: uuid(), actor_id: "mock-admin", actor_email: email, action, tenant_id: tenant.id, target_type: targetType, target_id: targetId,
    metadata, request_id: uuid(), created_at: ago(at),
  });
  const audit: Audit[] = [
    a("tenant.create", pilot, "tenant", pilot.id, { name: pilot.name, slug: pilot.slug }, 60 * DAY),
    a("tenant.update", pilot, "tenant", pilot.id, { from: { name: pilot.name, status: "active" }, to: { status: "archived" } }, 40 * DAY),
    a("tenant.create", metro, "tenant", metro.id, { name: metro.name, slug: metro.slug }, 30 * DAY, "ops@growxlabs.tech"),
    a("tenant.create", growx, "tenant", growx.id, { name: growx.name, slug: growx.slug }, 18 * DAY),
    a("tenant.create", acme, "tenant", acme.id, { name: acme.name, slug: acme.slug }, 12 * DAY, "ops@growxlabs.tech"),
    a("api_key.create", acme, "api_key", keys[2].id, { name: keys[2].name, keyPrefix: keys[2].key_prefix, permissions: READ }, 10 * DAY, "ops@growxlabs.tech"),
    a("tenant.create", sai, "tenant", sai.id, { name: sai.name, slug: sai.slug }, 9 * DAY),
    a("api_key.revoke", acme, "api_key", keys[4].id, { name: keys[4].name, keyPrefix: keys[4].key_prefix }, 8 * DAY),
    a("tenant.update", metro, "tenant", metro.id, { from: { name: metro.name, status: "active" }, to: { status: "suspended" } }, 6 * DAY, "ops@growxlabs.tech"),
    a("api_key.rotate", acme, "api_key", keys[3].id, { newKeyId: keys[3].id, newKeyPrefix: keys[3].key_prefix, oldKeyPrefix: `gx_loc_${hex(6).slice(0, 11)}`, graceHours: 24 }, 4 * HOUR),
  ].sort((x, y) => y.created_at.localeCompare(x.created_at));

  return { tenants, keys, usage, audit };
}

type Store = ReturnType<typeof seed>;
const globalStore = globalThis as unknown as { __growxLocMock?: Store };
const store = (): Store => (globalStore.__growxLocMock ??= seed());

/* ── Response helpers (same shapes as growx-loc) ──────────────────── */

const json = (status: number, body: unknown) => ({ status, body });
const err = (status: number, code: string, message: string) => json(status, { error: { code, message, requestId: "mock" } });

const toTenant = (t: Tenant) => ({ id: t.id, name: t.name, slug: t.slug, status: t.status, createdAt: t.created_at, updatedAt: t.updated_at });
const usableKey = (k: Key) => k.status === "active" && !(k.expires_at && new Date(k.expires_at).getTime() <= Date.now());
const toKey = (k: Key) => ({
  id: k.id, tenantId: k.tenant_id, name: k.name, keyPrefix: k.key_prefix, permissions: k.permissions, status: k.status,
  usable: usableKey(k), expiresAt: k.expires_at, lastUsedAt: k.last_used_at, createdAt: k.created_at, updatedAt: k.updated_at,
});
const toAudit = (e: Audit) => ({
  id: e.id, actorId: e.actor_id, actorEmail: e.actor_email, action: e.action, tenantId: e.tenant_id, targetType: e.target_type,
  targetId: e.target_id, metadata: e.metadata, requestId: e.request_id, createdAt: e.created_at,
});
const since = (days: number) => new Date(Date.now() - days * DAY).toISOString().slice(0, 10);
const slugify = (s: string) => s.normalize("NFKD").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);

function issueKey(s: Store, tenantId: string, name: string, permissions: string[], expiresAt: string | null) {
  const rawKey = `gx_loc_${hex(32)}`;
  const key: Key = {
    id: uuid(), tenant_id: tenantId, name, key_prefix: rawKey.slice(0, 18), permissions, status: "active",
    expires_at: expiresAt, last_used_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  s.keys.unshift(key);
  return { key, rawKey };
}

function audit(s: Store, actorEmail: string, action: string, tenantId: string, targetType: string, targetId: string, metadata: Record<string, unknown>) {
  s.audit.unshift({
    id: uuid(), actor_id: "mock", actor_email: actorEmail, action, tenant_id: tenantId, target_type: targetType, target_id: targetId,
    metadata, request_id: uuid(), created_at: new Date().toISOString(),
  });
}

/* ── Router ───────────────────────────────────────────────────────── */

export function handleLocationMock(
  { method, path, search, body }: { method: string; path: string; search: string; body?: string },
  actorEmail: string,
): { status: number; body: unknown } {
  const s = store();
  const q = new URLSearchParams(search);
  const input = body ? (JSON.parse(body) as Record<string, unknown>) : {};
  const parts = path.split("/");

  if (method === "GET" && path === "overview") {
    const today = since(0);
    const thirty = since(30);
    return json(200, {
      data: {
        tenants: {
          active: s.tenants.filter((t) => t.status === "active").length,
          suspended: s.tenants.filter((t) => t.status === "suspended").length,
          archived: s.tenants.filter((t) => t.status === "archived").length,
        },
        activeApiKeys: s.keys.filter(usableKey).length,
        requestsToday: s.usage.filter((u) => u.usage_date === today).reduce((n, u) => n + u.request_count, 0),
        requestsLast30Days: s.usage.filter((u) => u.usage_date > thirty).reduce((n, u) => n + u.request_count, 0),
      },
    });
  }

  if (method === "GET" && path === "audit-logs") {
    const limit = Number(q.get("limit") ?? 50);
    let rows = s.audit;
    if (q.get("tenantId")) rows = rows.filter((e) => e.tenant_id === q.get("tenantId"));
    if (q.get("before")) rows = rows.filter((e) => e.created_at < q.get("before")!);
    const page = rows.slice(0, limit);
    return json(200, { data: page.map(toAudit), nextBefore: page.length === limit ? page[page.length - 1].created_at : null });
  }

  if (parts[0] === "tenants" && parts.length === 1) {
    if (method === "GET") {
      const limit = Number(q.get("limit") ?? 50);
      const offset = Number(q.get("offset") ?? 0);
      const term = (q.get("q") ?? "").toLowerCase();
      let rows = [...s.tenants].sort((x, y) => y.created_at.localeCompare(x.created_at));
      if (q.get("status")) rows = rows.filter((t) => t.status === q.get("status"));
      if (term) rows = rows.filter((t) => t.name.toLowerCase().includes(term) || t.slug.includes(term));
      return json(200, {
        data: rows.slice(offset, offset + limit).map((t) => ({ ...toTenant(t), activeKeyCount: s.keys.filter((k) => k.tenant_id === t.id && usableKey(k)).length })),
        total: rows.length, limit, offset,
      });
    }
    if (method === "POST") {
      const name = String(input.name ?? "").trim();
      if (!name) return err(400, "VALIDATION_ERROR", "name: Required.");
      const slug = String(input.slug ?? "") || slugify(name);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return err(400, "VALIDATION_ERROR", "slug: Use lowercase letters, numbers and single hyphens.");
      if (s.tenants.some((t) => t.slug === slug)) return err(409, "SLUG_TAKEN", "A tenant with this slug already exists.");
      const now = new Date().toISOString();
      const tenant: Tenant = { id: uuid(), name, slug, status: "active", created_at: now, updated_at: now };
      s.tenants.push(tenant);
      audit(s, actorEmail, "tenant.create", tenant.id, "tenant", tenant.id, { name, slug });
      return json(201, { data: toTenant(tenant) });
    }
  }

  if (parts[0] === "tenants" && parts[1]) {
    const tenant = s.tenants.find((t) => t.id === parts[1]);
    if (!tenant) return err(404, "TENANT_NOT_FOUND", "Tenant not found.");

    if (parts.length === 2 && method === "GET") {
      const keys = s.keys.filter((k) => k.tenant_id === tenant.id);
      return json(200, {
        data: {
          ...toTenant(tenant), activeKeyCount: keys.filter(usableKey).length, totalKeyCount: keys.length,
          requestsLast30Days: s.usage.filter((u) => u.tenant_id === tenant.id && u.usage_date > since(30)).reduce((n, u) => n + u.request_count, 0),
        },
      });
    }

    if (parts.length === 2 && method === "PATCH") {
      const from = { name: tenant.name, status: tenant.status };
      const to: Record<string, string> = {};
      if (typeof input.name === "string" && input.name.trim()) { tenant.name = input.name.trim(); to.name = tenant.name; }
      if (input.status === "active" || input.status === "suspended" || input.status === "archived") { tenant.status = input.status; to.status = input.status; }
      if (!Object.keys(to).length) return err(400, "VALIDATION_ERROR", "Provide at least one field to update.");
      tenant.updated_at = new Date().toISOString();
      audit(s, actorEmail, "tenant.update", tenant.id, "tenant", tenant.id, { from, to });
      return json(200, { data: toTenant(tenant) });
    }

    if (parts[2] === "keys" && method === "GET") {
      return json(200, { data: s.keys.filter((k) => k.tenant_id === tenant.id).sort((x, y) => y.created_at.localeCompare(x.created_at)).map(toKey) });
    }

    if (parts[2] === "keys" && method === "POST") {
      if (tenant.status !== "active") return err(409, "TENANT_NOT_ACTIVE", "Keys can only be created for active tenants.");
      const name = String(input.name ?? "").trim();
      const permissions = Array.isArray(input.permissions) ? (input.permissions as string[]) : [];
      if (!name || permissions.length === 0) return err(400, "VALIDATION_ERROR", "name and permissions are required.");
      const { key, rawKey } = issueKey(s, tenant.id, name, permissions, (input.expiresAt as string) ?? null);
      audit(s, actorEmail, "api_key.create", tenant.id, "api_key", key.id, { name, keyPrefix: key.key_prefix, permissions, expiresAt: key.expires_at });
      return json(201, { data: { key: toKey(key), rawKey } });
    }

    if (parts[2] === "usage" && method === "GET") {
      const days = Number(q.get("days") ?? 30);
      const keyId = q.get("keyId");
      const rows = s.usage.filter((u) => u.tenant_id === tenant.id && u.usage_date > since(days) && (!keyId || u.api_key_id === keyId));
      const byDate = new Map<string, number>();
      const byKey = new Map<string, number>();
      for (const u of rows) {
        byDate.set(u.usage_date, (byDate.get(u.usage_date) ?? 0) + u.request_count);
        byKey.set(u.api_key_id, (byKey.get(u.api_key_id) ?? 0) + u.request_count);
      }
      return json(200, {
        data: {
          tenantId: tenant.id, keyId, days, totalRequests: rows.reduce((n, u) => n + u.request_count, 0),
          daily: [...byDate.entries()].sort().map(([date, requests]) => ({ date, requests })),
          byKey: [...byKey.entries()].map(([id, requests]) => ({ keyId: id, requests })).sort((x, y) => y.requests - x.requests),
        },
      });
    }
  }

  if (parts[0] === "keys" && parts[1]) {
    const key = s.keys.find((k) => k.id === parts[1]);
    if (!key) return err(404, "API_KEY_NOT_FOUND", "API key not found.");

    if (parts[2] === "revoke" && method === "POST") {
      if (key.status !== "revoked") {
        key.status = "revoked";
        key.updated_at = new Date().toISOString();
        audit(s, actorEmail, "api_key.revoke", key.tenant_id, "api_key", key.id, { name: key.name, keyPrefix: key.key_prefix });
      }
      return json(200, { data: toKey(key) });
    }

    if (parts[2] === "rotate" && method === "POST") {
      if (!usableKey(key)) return err(409, "API_KEY_NOT_ACTIVE", "Only active, unexpired keys can be rotated.");
      const graceHours = Number(input.graceHours ?? 24);
      const { key: next, rawKey } = issueKey(s, key.tenant_id, key.name, key.permissions, key.expires_at);
      if (graceHours <= 0) key.status = "revoked";
      else key.expires_at = new Date(Math.min(key.expires_at ? new Date(key.expires_at).getTime() : Infinity, Date.now() + graceHours * HOUR)).toISOString();
      key.updated_at = new Date().toISOString();
      audit(s, actorEmail, "api_key.rotate", key.tenant_id, "api_key", key.id, { newKeyId: next.id, newKeyPrefix: next.key_prefix, oldKeyPrefix: key.key_prefix, graceHours });
      return json(200, { data: { key: toKey(next), rawKey, previousKey: toKey(key) } });
    }
  }

  return err(404, "NOT_FOUND", "Route not found.");
}
