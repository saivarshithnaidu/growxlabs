# GrowX cron worker (Cloudflare)

Runs the scheduled jobs that used to be Vercel crons. The schedules are in `src/index.ts` (UTC).

## Deploy

From this folder, signed in to your Cloudflare account:

```bash
npx wrangler login
npx wrangler secret put CRON_SECRET
npx wrangler deploy
```

`CRON_SECRET` must match the app's `CRON_SECRET` environment variable.

## Check it ran

```bash
npx wrangler tail
```

Each run logs `{"job": "/api/cron/...", "status": 200}`.

The jobs still execute on the app's host; this worker only triggers them.
