/*
 * GrowX cron dispatcher (Cloudflare Worker).
 *
 * Replaces the Vercel cron jobs. One Cloudflare trigger fires every minute; the worker runs
 * whichever jobs are due that minute (UTC, same schedules Vercel used) by calling the app's
 * cron routes with `Authorization: Bearer <CRON_SECRET>`, exactly as Vercel did.
 * Note: the jobs themselves still run on the app's host; only the scheduling moved here.
 */

interface Env {
  APP_URL: string;
  CRON_SECRET: string;
}

interface ScheduledEvent {
  scheduledTime: number;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

// minute hour day-of-month month day-of-week, UTC
const JOBS: Array<{ path: string; schedule: string }> = [
  { path: "/api/cron/hrms/attendance/close-days", schedule: "30 20 * * *" },
  { path: "/api/cron/hrms/leave/accrual", schedule: "5 0 1 * *" },
  { path: "/api/cron/hrms/leave/carry-forward", schedule: "15 0 1 1 *" },
  { path: "/api/cron/hrms/documents/expiry", schedule: "0 1 * * *" },
  { path: "/api/cron/hrms/assets/warranty", schedule: "15 1 * * *" },
  { path: "/api/cron/hrms/learning/reminders", schedule: "30 1 * * *" },
  { path: "/api/cron/hrms/release05/outbox", schedule: "45 1 * * *" },
  { path: "/api/cron/command-center/expire-approvals", schedule: "5 2 * * *" },
  { path: "/api/cron/command-center/process-audit-outbox", schedule: "20 2 * * *" },
  { path: "/api/cron/command-center/process-events", schedule: "30 2 * * *" },
  { path: "/api/cron/command-center/process-notifications", schedule: "40 2 * * *" },
  { path: "/api/cron/command-center/compact-memory", schedule: "50 2 * * *" },
  { path: "/api/cron/command-center/expire-memory", schedule: "0 3 * * *" },
  { path: "/api/cron/command-center/clean-artifacts", schedule: "10 3 * * *" },
  { path: "/api/cron/command-center/recover-execution", schedule: "20 3 * * *" },
  { path: "/api/cron/reconcile-job-statuses", schedule: "0 3 * * *" },
];

/** Matches "*", a number, or a comma list of numbers. */
function fieldMatches(field: string, value: number): boolean {
  if (field === "*") return true;
  return field.split(",").some((part) => Number(part) === value);
}

export function isDue(schedule: string, at: Date): boolean {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = schedule.trim().split(/\s+/);
  return (
    fieldMatches(minute, at.getUTCMinutes()) &&
    fieldMatches(hour, at.getUTCHours()) &&
    fieldMatches(dayOfMonth, at.getUTCDate()) &&
    fieldMatches(month, at.getUTCMonth() + 1) &&
    fieldMatches(dayOfWeek, at.getUTCDay())
  );
}

async function runJob(env: Env, path: string): Promise<void> {
  const url = `${env.APP_URL.replace(/\/$/, "")}${path}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { authorization: `Bearer ${env.CRON_SECRET}`, "user-agent": "growx-cron-worker" },
    });
    console.log(JSON.stringify({ job: path, status: response.status }));
  } catch (error) {
    console.error(JSON.stringify({ job: path, error: error instanceof Error ? error.message : String(error) }));
  }
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    if (!env.APP_URL || !env.CRON_SECRET) {
      console.error("APP_URL and CRON_SECRET must be set.");
      return;
    }
    const at = new Date(event.scheduledTime);
    for (const job of JOBS) {
      if (isDue(job.schedule, at)) ctx.waitUntil(runJob(env, job.path));
    }
  },

  // No public endpoint: the worker only acts on its schedule.
  async fetch(): Promise<Response> {
    return new Response("Not found", { status: 404 });
  },
};
