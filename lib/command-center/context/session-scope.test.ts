import test from "node:test";
import assert from "node:assert";
import { contextFromSession } from "./session-scope.ts";

test("no session is refused, never treated as admin", () => {
  assert.throws(() => contextFromSession(undefined, "r"), (e: any) => e.code === "AUTHENTICATION_REQUIRED" && e.status === 401);
  assert.throws(() => contextFromSession({ id: "" }, "r"), (e: any) => e.status === 401);
});

test("clients cannot use the command center", () => {
  assert.throws(() => contextFromSession({ id: "c1", role: "CLIENT" }, "r"), (e: any) => e.code === "PERMISSION_DENIED" && e.status === 403);
});

test("a signed-in user with no role gets no admin permissions", () => {
  const ctx = contextFromSession({ id: "u1" }, "r");
  assert.strictEqual(ctx.role, "employee");
  assert.ok(!ctx.permissions.includes("invoices:write"));
});

test("admins and co-admins get admin permissions under their own id", () => {
  for (const role of ["ADMIN", "co_admin"]) {
    const ctx = contextFromSession({ id: "a1", role }, "r");
    assert.strictEqual(ctx.role, "admin");
    assert.strictEqual(ctx.userId, "a1");
    assert.ok(ctx.permissions.includes("invoices:write"));
  }
});

test("other roles keep only the permissions on their session", () => {
  const ctx = contextFromSession({ id: "e1", role: "crm_agent", permissions: ["leads:read"] }, "r");
  assert.strictEqual(ctx.role, "employee");
  assert.deepStrictEqual(ctx.permissions, ["leads:read"]);
});
