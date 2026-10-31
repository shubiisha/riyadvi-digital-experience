#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Live deployment verification
// ---------------------------------------------------------------------------
// Runs the same end-to-end narrative the reviewer is asked to check, but
// against a *deployed* instance instead of a local one:
//
//   1. the SPA shell is served on the public routes
//   2. /api/stack reports a real datastore with document counts
//   3. the public content APIs answer from that datastore
//   4. content management is refused without credentials
//   5. an authorised write immediately changes what the public API serves
//
// Usage: node scripts/verify-live.js https://<deployment-host>
// The script exits non-zero if any assertion fails.
const assert = require('node:assert/strict');

const BASE = (process.argv[2] || process.env.VERIFY_BASE_URL || '').replace(/\/$/, '');
const ADMIN_KEY = process.env.ADMIN_API_KEY || 'riyadvi_admin_super_secret_2025';

if (!BASE) {
  console.error('[live] A base URL is required, e.g. node scripts/verify-live.js https://host');
  process.exit(2);
}

let passed = 0;
const results = [];

const check = async (label, fn) => {
  try {
    await fn();
    passed += 1;
    results.push(`  \u2713 ${label}`);
  } catch (error) {
    results.push(`  \u2717 ${label} -> ${error.message}`);
    throw error;
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE}${path}`, options);
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = null;
  }
  return { status: response.status, body, text, contentType: response.headers.get('content-type') || '' };
};

(async () => {
  const slug = `live-verify-${Date.now()}`;
  let createdId = null;

  console.log(`[live] Verifying deployment at ${BASE}\n`);

  try {
    console.log('[live] SPA delivery');
    await check('GET / -> 200 HTML', async () => {
      const res = await request('/');
      assert.equal(res.status, 200);
      assert.match(res.contentType, /text\/html/);
      assert.match(res.text, /<div id="root"/);
    });
    await check('GET /live-stack (client route) -> 200 HTML', async () => {
      const res = await request('/live-stack');
      assert.equal(res.status, 200);
      assert.match(res.text, /<div id="root"/);
    });
    await check('GET /admin (client route) -> 200 HTML', async () => {
      const res = await request('/admin');
      assert.equal(res.status, 200);
      assert.match(res.text, /<div id="root"/);
    });

    console.log('\n[live] Datastore introspection');
    let stack = null;
    await check('GET /api/stack -> 200', async () => {
      const res = await request('/api/stack');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      stack = res.body.data;
    });
    await check('Stack reports a real datastore with documents', async () => {
      assert.equal(typeof stack.database.totalDocuments, 'number');
      assert.ok(stack.database.totalDocuments > 0, `totalDocuments=${stack.database.totalDocuments}`);
      assert.ok(Array.isArray(stack.database.collections));
      assert.ok(stack.database.collections.length >= 9, `collections=${stack.database.collections.length}`);
    });
    await check('Stack documents the API surface', async () => {
      assert.ok(stack.api.endpointCount >= 15, `endpointCount=${stack.api.endpointCount}`);
      assert.ok(stack.api.surface.some((entry) => entry.path.includes('/api/stack')));
    });
    await check('Stack reports runtime telemetry', async () => {
      assert.equal(typeof stack.runtime.totalRequests, 'number');
      assert.ok(stack.runtime.totalRequests > 0, `totalRequests=${stack.runtime.totalRequests}`);
    });

    console.log('\n[live] Public content API');
    await check('GET /api/services -> 200 with documents', async () => {
      const res = await request('/api/services');
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.data) && res.body.data.length > 0);
    });
    await check('GET /api/projects and /api/blogs -> 200', async () => {
      for (const path of ['/api/projects', '/api/blogs']) {
        const res = await request(path);
        assert.equal(res.status, 200, `${path} -> ${res.status}`);
        assert.equal(res.body.success, true, `${path} success flag`);
      }
    });

    console.log('\n[live] Authenticated content management');
    await check('Content write without credentials -> 401', async () => {
      const res = await request('/api/admin/content/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title: 'Should not exist' }),
      });
      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
    });
    await check('Authorised create -> 201', async () => {
      const res = await request('/api/admin/content/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
        body: JSON.stringify({
          slug,
          title: 'Live Verification Service',
          summary: 'Created by verify-live.js against the deployed instance.',
        }),
      });
      assert.equal(res.status, 201, `status=${res.status} body=${res.text.slice(0, 200)}`);
      assert.ok(res.body.data && res.body.data._id, 'created document has an id');
      createdId = res.body.data._id;
    });
    await check('Public API serves the new document (no rebuild)', async () => {
      const res = await request('/api/services');
      assert.ok(
        res.body.data.some((doc) => doc.slug === slug),
        `slug ${slug} missing from public API`
      );
    });
    await check('Authorised update -> 200 with edited title', async () => {
      const res = await request(`/api/admin/content/services/${createdId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
        body: JSON.stringify({ title: 'Live Verification Service (edited)' }),
      });
      assert.equal(res.status, 200, `status=${res.status}`);
      assert.equal(res.body.data.title, 'Live Verification Service (edited)');
    });
    await check('Duplicate slug rejected with 409', async () => {
      const res = await request('/api/admin/content/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
        body: JSON.stringify({ slug, title: 'Duplicate' }),
      });
      assert.equal(res.status, 409);
    });
    await check('Unknown collection rejected with 400', async () => {
      const res = await request('/api/admin/content/not_a_collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
        body: JSON.stringify({ slug: 'x', title: 'x' }),
      });
      assert.equal(res.status, 400);
    });
    await check('Authorised delete -> 200', async () => {
      const res = await request(`/api/admin/content/services/${createdId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': ADMIN_KEY },
      });
      assert.equal(res.status, 200, `status=${res.status}`);
      createdId = null;
    });
    await check('Deleted document no longer served publicly', async () => {
      const res = await request('/api/services');
      assert.ok(
        !res.body.data.some((doc) => doc.slug === slug),
        `slug ${slug} still served after delete`
      );
    });

    console.log(results.join('\n'));
    console.log(`\n[live] ${passed} assertion(s) passed against ${BASE}.`);
    process.exit(0);
  } catch (error) {
    console.log(results.join('\n'));
    console.error(`\n[live] Verification failed against ${BASE}: ${error.message}`);
    // Best-effort cleanup so a failed run does not pollute the live dataset.
    if (createdId) {
      await fetch(`${BASE}/api/admin/content/services/${createdId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': ADMIN_KEY },
      }).catch(() => {});
    }
    process.exit(1);
  }
})();
