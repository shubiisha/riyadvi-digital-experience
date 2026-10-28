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
    assert(contact.status === 200 && contact.json.success === true, 'POST /api/contact -> success:true');

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
    assert(health.status === 200 && health.json.success === true, 'POST /api/health-checkup -> success:true');

    const consultation = await post(base, '/api/consultation', {
      name: 'Verify Tester',
      email: 'verify@example.com',
      company: 'Verify Co',
      date: '2026-01-15',
      slot: '10:00',
    });
    assert(consultation.status === 200 && consultation.json.success === true, 'POST /api/consultation -> success:true');

    const lead = await post(base, '/api/lead-magnet', {
      name: 'Verify Tester',
      company: 'Verify Co',
      email: 'verify@example.com',
      phone: '+91 9000000000',
    });
    assert(lead.status === 200 && lead.json.success === true, 'POST /api/lead-magnet -> success:true');

    const application = await post(base, '/api/applications', {
      name: 'Verify Tester',
      email: 'verify@example.com',
      position: 'Senior Full Stack Engineer',
      jobSlug: 'senior-full-stack-engineer',
    });
    assert(application.status === 200 && application.json.success === true, 'POST /api/applications -> success:true');
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
