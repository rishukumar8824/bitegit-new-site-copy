#!/usr/bin/env node
// Boots the real server.js against an isolated, ephemeral MongoDB (never
// touches production data) and hammers a handful of unauthenticated,
// high-traffic GET endpoints with autocannon to get a baseline for how the
// app behaves under concurrency. This is a code-level baseline, not an
// infra/network test — it won't tell you how Render's box or Atlas itself
// hold up, only whether the Node process and its DB queries scale.
//
// Usage: npm run load-test [-- --connections=100 --duration=20]

const { spawn } = require('child_process');
const path = require('path');
const autocannon = require('autocannon');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

function parseArg(name, fallback) {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!arg) return fallback;
  return Number(arg.split('=')[1]) || fallback;
}

const CONNECTIONS = parseArg('connections', 50);
const DURATION = parseArg('duration', 15);
const PORT = 17321;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${url}/healthz`);
      if (res.ok) return true;
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server did not become healthy within ${timeoutMs}ms`);
}

async function seedData(mongoUri, dbName) {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  await db.collection('p2p_offers').insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      id: `loadtest_ad_${i}`,
      status: 'ACTIVE',
      type: i % 2 === 0 ? 'SELL' : 'BUY',
      asset: 'USDT',
      price: 90 + i,
      availableAmount: 1000,
      available: 1000,
      minLimit: 500,
      maxLimit: 50000,
      createdByUserId: `seed_merchant_${i}`,
      createdByUsername: `merchant_${i}`,
      payments: ['UPI'],
      isDemo: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
  await client.close();
}

function runServer(mongoUri) {
  const child = spawn(
    process.execPath,
    [path.join(__dirname, '..', 'server.js')],
    {
      env: {
        ...process.env,
        NODE_ENV: 'test',
        PORT: String(PORT),
        MONGODB_URI: mongoUri,
        MONGODB_DB_NAME: 'loadtest',
        ALLOW_LOCAL_MONGO: 'true',
        JWT_SECRET: 'load-test-secret-not-for-production-use-only',
        ADMIN_EMAIL: '',
        RESEND_API_KEY: '',
        FCM_SERVICE_ACCOUNT_JSON: ''
      },
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );
  child.stdout.on('data', () => {});
  child.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    if (/error/i.test(text)) process.stderr.write(`[server] ${text}`);
  });
  return child;
}

// The app rate-limits by req.ip (2000 req/15min per IP — see
// middleware/security.js), which is correct behavior in production where
// every real user has their own IP. A single-machine load test hits that
// limit almost instantly and would otherwise measure "how fast does the
// rate limiter reject requests" instead of "how fast is the app". Expanding
// each scenario into one request variant per distinct synthetic
// X-Forwarded-For value (autocannon round-robins a connection's assigned
// requests) simulates many distinct real users instead, which is what a
// concurrency test should measure. (Tried mutating headers via
// `setupRequest` first — those mutations don't reliably take effect across
// autocannon's pooled/pipelined connections, so static per-variant headers
// are used instead.)
const SYNTHETIC_IP_COUNT = 500;
function withSyntheticIps(request) {
  return Array.from({ length: SYNTHETIC_IP_COUNT }, (_, i) => ({
    ...request,
    headers: {
      ...(request.headers || {}),
      'x-forwarded-for': `10.${(i >> 16) % 255}.${(i >> 8) % 255}.${i % 255}`
    }
  }));
}

async function runScenario(title, opts) {
  console.log(`\n=== ${title} ===`);
  const result = await autocannon({
    url: BASE_URL,
    connections: CONNECTIONS,
    duration: DURATION,
    ...opts,
    requests: (opts.requests || []).flatMap(withSyntheticIps)
  });
  console.log(
    `requests/sec: ${result.requests.average.toFixed(1)} | ` +
    `latency avg: ${result.latency.average.toFixed(1)}ms p99: ${result.latency.p99}ms | ` +
    `errors: ${result.errors} | timeouts: ${result.timeouts} | non-2xx: ${result.non2xx}`
  );
  return result;
}

async function main() {
  console.log(`Spinning up an isolated in-memory MongoDB...`);
  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await seedData(mongoUri, 'loadtest');

  console.log(`Booting server.js on ${BASE_URL} against the isolated DB...`);
  const server = runServer(mongoUri);

  try {
    await waitForServer(BASE_URL);
    console.log(`Server healthy. Running load scenarios: ${CONNECTIONS} connections, ${DURATION}s each.\n`);

    if (process.env.LOAD_TEST_DEBUG) {
      for (const p of ['/api/p2p/offers', '/api/p2p/public']) {
        const res = await fetch(`${BASE_URL}${p}`);
        console.log(`[debug] ${p} -> ${res.status}:`, (await res.text()).slice(0, 300));
      }
    }

    const results = [];
    results.push(await runScenario('GET /healthz', { requests: [{ method: 'GET', path: '/healthz' }] }));
    results.push(
      await runScenario('GET /api/p2p/offers (public ad listing)', {
        requests: [{ method: 'GET', path: '/api/p2p/offers' }]
      })
    );
    results.push(
      await runScenario('GET /api/p2p/public (public P2P summary)', {
        requests: [{ method: 'GET', path: '/api/p2p/public' }]
      })
    );

    console.log('\n=== Summary ===');
    for (const r of results) {
      const bad = r.errors > 0 || r.timeouts > 0 || r.non2xx > 0;
      console.log(
        `${bad ? '⚠️ ' : '✓ '}${r.title || ''}${r.requests.average.toFixed(0)} req/s, p99 ${r.latency.p99}ms` +
        (bad ? ` — ${r.errors} errors, ${r.timeouts} timeouts, ${r.non2xx} non-2xx` : '')
      );
    }
  } finally {
    server.kill('SIGKILL');
    await mongod.stop();
  }
}

main().catch((error) => {
  console.error('Load test failed:', error);
  process.exit(1);
});
