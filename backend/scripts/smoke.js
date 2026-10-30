// Production smoke test: boots the real production server (built SPA + API on a
// single origin) on a scratch port and asserts the observable HTTP contract.
//
// This exists because the deployed container's own runtime cannot be probed
// reliably from outside; this proves the exact production code path works.
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = process.env.SMOKE_PORT || 8123;
const BASE = `http://127.0.0.1:${PORT}`;
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'riyadvi_admin_super_secret_2025';
const STORE = path.join(require('os').tmpdir(), `riyadvi-smoke-${process.pid}.json`);

const dist = path.resolve(__dirname, '../../frontend/dist');
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error(`[smoke] FATAL: ${dist}/index.html missing — run the frontend build first.`);
  process.exit(1);
}

let passed = 0;
const failures = [];

const check = (name, ok, detail = '') => {
  if (ok) {
    passed += 1;
    console.log(`  ✓ ${name}${detail ? ` (${detail})` : ''}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  ✗ ${name}${detail ? ` (${detail})` : ''}`);
  }
};

const get = async (route, headers = {}) => {
  const res = await fetch(`${BASE}${route}`, { headers });
  const body = await res.text();
  return { status: res.status, body, headers: res.headers };
};

const waitForServer = async () => {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`${BASE}/healthz`);
      if (res.status === 200) return true;
    } catch (error) {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
};

(async () => {
  const server = spawn(process.execPath, [path.resolve(__dirname, '../src/server.js')], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(PORT),
      HOST: '0.0.0.0',
      // Mongo is unreachable in CI/eval, so exercise the durable fallback path.
      MONGODB_URI: 'mongodb://127.0.0.1:27017/riyadvi_smoke_unreachable',
      DATA_STORE_PATH: STORE,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let out = '';
  server.stdout.on('data', (d) => { out += d.toString(); });
  server.stderr.on('data', (d) => { out += d.toString(); });

  const cleanup = () => {
    try { server.kill('SIGKILL'); } catch (error) { /* already gone */ }
    try { fs.unlinkSync(STORE); } catch (error) { /* absent */ }
  };

  try {
    const up = await waitForServer();
    if (!up) {
      console.error('[smoke] server never became ready. Output:\n' + out);
      cleanup();
      process.exit(1);
    }

    console.log('\n[smoke] Liveness & API');
    const healthz = await get('/healthz');
    check('GET /healthz -> 200', healthz.status === 200, `got ${healthz.status}`);
    let parsed = {};
    try { parsed = JSON.parse(healthz.body); } catch (error) { /* handled below */ }
    check('Liveness body is JSON status:ok', parsed.status === 'ok');

    const health = await get('/api/health');
    check('GET /api/health -> 200', health.status === 200, `got ${health.status}`);
    let healthBody = {};
    try { healthBody = JSON.parse(health.body); } catch (error) { /* handled below */ }
    check('Health reports healthy', healthBody.status === 'healthy');
    check(
      'Health reports a datastore type',
      typeof healthBody.database?.type === 'string' && healthBody.database.type.length > 0,
      healthBody.database?.type
    );

    console.log('\n[smoke] SPA delivery on the same origin');
    const root = await get('/');
    check('GET / -> 200', root.status === 200, `got ${root.status}`);
    check('Root serves the built index.html', root.body.includes('<div id="root">'));
    check(
      'Root is HTML, not an error page',
      (root.headers.get('content-type') || '').includes('text/html') &&
        !/AppJet\s*-\s*Error/i.test(root.body)
    );
    const deep = await get('/services');
    check('Deep SPA route falls back to index.html', deep.status === 200 && deep.body.includes('<div id="root">'));

    console.log('\n[smoke] Catalogue API');
    const services = await get('/api/services');
    check('GET /api/services -> 200', services.status === 200, `got ${services.status}`);
    let servicesBody = {};
    try { servicesBody = JSON.parse(services.body); } catch (error) { /* handled below */ }
    check('Services payload has data array', Array.isArray(servicesBody.data) && servicesBody.data.length > 0,
      `${servicesBody.data?.length ?? 0} service(s)`);

    console.log('\n[smoke] Admin authorization boundary');
    const anon = await get('/api/admin/metrics');
    check('Admin without key -> 401', anon.status === 401, `got ${anon.status}`);
    const authed = await get('/api/admin/metrics', { 'x-admin-key': ADMIN_KEY });
    check('Admin with key -> 200', authed.status === 200, `got ${authed.status}`);

    console.log('\n[smoke] Lead capture writes durably');
    const post = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Tester',
        email: 'smoke@example.com',
        phone: '+91 90000 00000',
        company: 'Smoke Co',
        service: 'Web Development',
        message: 'Production smoke test enquiry.',
      }),
    });
    check('POST /api/contact -> 201', post.status === 201, `got ${post.status}`);
    await new Promise((r) => setTimeout(r, 200));
    const persisted = fs.existsSync(STORE) && fs.readFileSync(STORE, 'utf8').includes('smoke@example.com');
    check('Enquiry persisted to the datastore file', persisted);
  } catch (error) {
    failures.push(`unexpected error: ${error.message}`);
    console.error('[smoke] Unexpected error:', error);
  } finally {
    cleanup();
  }

  console.log(`\n[smoke] ${passed} assertion(s) passed, ${failures.length} failed.`);
  if (failures.length) {
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
  console.log('[smoke] All production smoke assertions passed.');
  process.exit(0);
})();
