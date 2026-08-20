# Load testing

`npm run load-test` boots the real `server.js` against an isolated,
ephemeral in-memory MongoDB (never touches production/Atlas data) and hits
a few unauthenticated, high-traffic GET endpoints with
[autocannon](https://github.com/mcollina/autocannon):

- `GET /healthz` — trivial handler, baseline for the HTTP layer itself
- `GET /api/p2p/offers` — public ad listing (DB query)
- `GET /api/p2p/public` — public P2P summary (heavier DB query)

```bash
npm run load-test                          # default: 50 connections, 15s
npm run load-test -- --connections=200 --duration=15
```

## Why synthetic IPs

The app rate-limits by `req.ip` at 2000 requests / 15 minutes per IP (see
`middleware/security.js`) — correct behavior in production, since every real
user has their own IP. A single-machine load test would hit that limit
almost instantly and end up measuring "how fast does the rate limiter
reject requests" instead of "how fast is the app." The script works around
this by expanding each scenario into 500 request variants, each carrying a
distinct synthetic `X-Forwarded-For` value, so load spreads across many
rate-limit buckets the way real concurrent users would. (`app.set('trust
proxy', 1)` in `server.js` makes this work locally the same way it would
behind Render's real proxy.)

## What this does and doesn't tell you

This is a **code-level baseline**, not an infra test — it runs on your
laptop against localhost and an in-process Mongo, so the numbers are much
higher than what real users would see through Render's network + Atlas
round-trip latency. What it *does* verify:

- The app doesn't crash, hang, or throw under concurrent load
- No errors/timeouts appear even at 200 concurrent connections
- Latency degrades gracefully (not exponentially) as concurrency increases
- The rate limiter itself works correctly per-IP (verified separately —
  2500 requests across 5 synthetic IPs at 500 each all succeeded; the same
  volume from one IP would 429 after 2000)

## Baseline results (2026-08-20, local M-series Mac)

| Scenario | 30 connections | 200 connections |
|---|---|---|
| `GET /healthz` | 18,026 req/s, p99 3ms | 16,258 req/s, p99 22ms |
| `GET /api/p2p/offers` | 9,432 req/s, p99 5ms | 8,789 req/s, p99 29ms |
| `GET /api/p2p/public` | 6,371 req/s, p99 7ms | 5,508 req/s, p99 47ms |

Zero errors, zero timeouts, zero non-2xx responses at either concurrency
level. This doesn't predict Render's exact production capacity, but it
rules out the app code itself being the bottleneck for realistic traffic —
if production ever falls over under load, look at Render's plan/instance
size or Atlas tier next, not this code path.
