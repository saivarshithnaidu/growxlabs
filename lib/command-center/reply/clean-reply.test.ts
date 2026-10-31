import test from "node:test";
import assert from "node:assert";
import { cleanReply } from "./clean-reply.ts";

test("cleanReply strips an imitated tool block and persona line", () => {
  const raw = [
    "Using my CFO Agent, let me retrieve the lead statistics for this month.",
    "",
    "**Tool Used**: get_company_stats",
    "",
    "```json",
    '{"current_leads": 120, "leads_month_to_date": 120}',
    "```",
    "",
    "Here are the lead statistics for the current month:",
  ].join("\n");
  const out = cleanReply(raw, "Lead stats this month");
  assert.ok(!/tool used/i.test(out));
  assert.ok(!/CFO Agent/.test(out));
  assert.ok(!out.includes("current_leads"));
  assert.ok(out.startsWith("Let me retrieve"));
  assert.ok(out.includes("Here are the lead statistics"));
});

test("cleanReply keeps JSON when the user asked for JSON", () => {
  const raw = 'Here it is:\n\n```json\n{"a": 1}\n```';
  assert.ok(cleanReply(raw, "give me the json").includes('"a": 1'));
});

test("cleanReply leaves ordinary prose alone", () => {
  const raw = "You have 3 unpaid invoices. GXL-INV-2026-000001 is overdue by 12 days.";
  assert.strictEqual(cleanReply(raw), raw);
});
