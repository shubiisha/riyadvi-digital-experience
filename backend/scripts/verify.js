/**
 * Focused regression check for the two hardening fixes:
 *   1. Admin authentication (401 without a valid key, 200 with the correct key).
 *   2. Durable fallback datastore (records survive a process restart).
 *
 * Usage:
 *   node scripts/verify.js          -> runs the full check (spawns a child writer process)
 *   node scripts/verify.js --seed   -> writes one record and exits (used by the parent)
 *
 * Exits non-zero on the first failed assertion.
 */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');

const ADMIN_KEY = 'verify_admin_key_123';
// Never override an inherited DATA_STORE_PATH (the restart probe relies on it).
const STORE_FILE =
  process.env.DATA_STORE_PATH || path.join(os.tmpdir(), `riyadvi-verify-${process.pid}.json`);

process.env.ADMIN_SECRET_KEY = ADMIN_KEY;
process.env.DATA_STORE_PATH = STORE_FILE;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/riyadvi_verify_db';
process.env.NODE_ENV = 'test';

let failures = 0;
const assert = (condition, message) => {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${message}`);
  }
};

const post = async (base, path, body) => {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
};

const get = async (base, path, headers = {}) => {
  const res = await fetch(`${base}${path}`, { headers });
  return { status: res.status, json: await res.json().catch(() => ({})) };
};

const startServer = async () => {
  const app = require('../src/app');
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const { port } = server.address();
  return { server, base: `http://127.0.0.1:${port}` };
};

const run = async () => {
  console.log('\n[verify] Admin authentication');
  const { server, base } = await startServer();

  try {
    const noKey = await get(base, '/api/admin/metrics');
    assert(noKey.status === 401, `GET /api/admin/metrics without key -> 401 (got ${noKey.status})`);
    assert(
      noKey.json && noKey.json.success === false && Array.isArray(noKey.json.errors),
      'Unauthorized response uses the { success:false, errors[] } contract'
    );

    const badKey = await get(base, '/api/admin/metrics', { 'x-admin-key': 'wrong-key' });
    assert(badKey.status === 401, `GET /api/admin/metrics with wrong key -> 401 (got ${badKey.status})`);

    const goodKey = await get(base, '/api/admin/metrics', { 'x-admin-key': ADMIN_KEY });
    assert(goodKey.status === 200, `GET /api/admin/metrics with valid key -> 200 (got ${goodKey.status})`);
    assert(goodKey.json && goodKey.json.success === true, 'Authorized metrics response has success:true');

    const bearer = await get(base, '/api/admin/enquiries', { Authorization: `Bearer ${ADMIN_KEY}` });
    assert(bearer.status === 200, `Authorization: Bearer <key> is also accepted (got ${bearer.status})`);

    console.log('\n[verify] Public write endpoints');
    const contact = await post(base, '/api/contact', {
      name: 'Verify Tester',
      email: 'verify@example.com',
      requirement: 'Verification enquiry',
      message: 'Automated regression check.',
    });
    assert(contact.json && contact.json.success === true, `POST /api/contact -> success:true (status ${contact.status})`);

    const invalid = await post(base, '/api/contact', { email: 'not-an-email' });
    assert(
      invalid.status === 400 && invalid.json.success === false && invalid.json.errors?.length > 0,
      `POST /api/contact with invalid payload -> 400 + errors[] (got ${invalid.status})`
    );

    const health = await post(base, '/api/health-checkup', {
      companyName: 'Verify Co',
      contactPerson: 'Verify Tester',
      email: 'verify@example.com',
      phone: '+91 9000000000',
    });
    assert(health.json && health.json.success === true, `POST /api/health-checkup -> success:true (status ${health.status})`);

    const consultation = await post(base, '/api/consultation', {
      name: 'Verify Tester',
      email: 'verify@example.com',
      company: 'Verify Co',
      date: '2026-01-15',
      slot: '10:00',
    });
    assert(consultation.json && consultation.json.success === true, `POST /api/consultation -> success:true (status ${consultation.status})`);

    const lead = await post(base, '/api/lead-magnet', {
      name: 'Verify Tester',
      company: 'Verify Co',
      email: 'verify@example.com',
      phone: '+91 9000000000',
    });
    assert(lead.json && lead.json.success === true, `POST /api/lead-magnet -> success:true (status ${lead.status})`);

    const application = await post(base, '/api/applications', {
      name: 'Verify Tester',
      email: 'verify@example.com',
      phone: '+91 9000000000',
      position: 'Senior Full Stack Engineer',
      jobSlug: 'senior-full-stack-engineer',
    });
    assert(application.json && application.json.success === true, `POST /api/applications -> success:true (status ${application.status})`);

    console.log('\n[verify] Live stack introspection (/api/stack)');
    const stack = await get(base, '/api/stack');
    assert(stack.status === 200, `GET /api/stack -> 200 (got ${stack.status})`);
    const info = (stack.json && stack.json.data) || {};
    assert(
      info.database && typeof info.database.totalDocuments === 'number',
      `Stack reports a real datastore with ${info.database && info.database.totalDocuments} document(s)`
    );
    assert(
      Array.isArray(info.database && info.database.collections) && info.database.collections.length >= 9,
      `Stack exposes ${info.database && info.database.collections ? info.database.collections.length : 0} collection count(s)`
    );
    assert(
      Array.isArray(info.api && info.api.surface) && info.api.surface.length >= 15,
      `Stack documents ${info.api && info.api.surface ? info.api.surface.length : 0} API endpoint(s)`
    );
    assert(
      info.runtime && typeof info.runtime.requests === 'number' && info.runtime.requests > 0,
      `Runtime telemetry recorded ${info.runtime && info.runtime.requests} request(s)`
    );

    console.log('\n[verify] Authenticated content CRUD (CMS)');
    const CRUD_SLUG = `verify-service-${process.pid}`;
    const created = await fetch(`${base}/api/admin/content/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify({
        slug: CRUD_SLUG,
        title: 'Verify Service',
        summary: 'Created by the automated verification run.',
      }),
    }).then(async (res) => ({ status: res.status, json: await res.json().catch(() => ({})) }));

    assert(created.status === 201, `POST /api/admin/content/services -> 201 (got ${created.status})`);
    const createdId = created.json && created.json.data && created.json.data._id;
    assert(Boolean(createdId), `Created document has an id (${createdId})`);

    const duplicate = await fetch(`${base}/api/admin/content/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify({ slug: CRUD_SLUG, title: 'Duplicate' }),
    }).then(async (res) => ({ status: res.status, json: await res.json().catch(() => ({})) }));
    assert(duplicate.status === 409, `Duplicate slug rejected with 409 (got ${duplicate.status})`);

    const noKey = await get(base, '/api/admin/content/services');
    assert(noKey.status === 401, `Content listing without an admin key -> 401 (got ${noKey.status})`);

    // Public API must serve the document that was just written — this is the
    // proof that content is dynamic rather than bundled into the frontend.
    const publicAfterCreate = await get(base, '/api/services');
    const publicSlugs = ((publicAfterCreate.json && publicAfterCreate.json.data) || []).map((item) => item.slug);
    assert(publicSlugs.includes(CRUD_SLUG), 'Public /api/services serves the newly created document');

    const patched = await fetch(`${base}/api/admin/content/services/${createdId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify({ title: 'Verify Service (edited)' }),
    }).then(async (res) => ({ status: res.status, json: await res.json().catch(() => ({})) }));
    assert(patched.status === 200, `PATCH admin content -> 200 (got ${patched.status})`);
    assert(
      patched.json && patched.json.data && patched.json.data.title === 'Verify Service (edited)',
      'PATCH returned the updated document'
    );

    const removed = await fetch(`${base}/api/admin/content/services/${createdId}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': ADMIN_KEY },
    }).then(async (res) => ({ status: res.status, json: await res.json().catch(() => ({})) }));
    assert(removed.status === 200, `DELETE admin content -> 200 (got ${removed.status})`);

    const publicAfterDelete = await get(base, '/api/services');
    const remainingSlugs = ((publicAfterDelete.json && publicAfterDelete.json.data) || []).map((item) => item.slug);
    assert(!remainingSlugs.includes(CRUD_SLUG), 'Deleted document is no longer served by the public API');
  } finally {
    server.close();
  }

  console.log('\n[verify] Durable fallback datastore');
  assert(fs.existsSync(STORE_FILE), `Fallback datastore file written to ${STORE_FILE}`);
  const stored = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
  const enquiryCount = (stored.ContactEnquiry || []).length;
  assert(enquiryCount > 0, `Contact enquiries persisted to disk (${enquiryCount} record(s))`);

  // Simulate a process restart: a brand new node process must hydrate the record.
  const child = spawnSync(process.execPath, [__filename, '--seed'], {
    env: { ...process.env, DATA_STORE_PATH: STORE_FILE },
    encoding: 'utf8',
  });
  assert(child.status === 0, `Restart probe exited cleanly (status ${child.status}) ${child.stderr || ''}`);
  assert(
    /RESTORED:[1-9]/.test(child.stdout || ''),
    `Records restored after restart (stdout: ${(child.stdout || '').trim() || 'empty'})`
  );

  try {
    fs.unlinkSync(STORE_FILE);
  } catch {
    /* best effort cleanup */
  }

  if (failures > 0) {
    console.error(`\n[verify] ${failures} assertion(s) failed.`);
    process.exit(1);
  }
  console.log('\n[verify] All assertions passed.');
};

if (process.argv.includes('--seed')) {
  const ContactEnquiry = require('../src/models/ContactEnquiry');
  ContactEnquiry.find()
    .then((items) => {
      console.log(`RESTORED:${items.length}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
} else {
  run().catch((error) => {
    console.error('[verify] Fatal:', error);
    process.exit(1);
  });
}
