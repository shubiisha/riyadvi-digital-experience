const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ---------------------------------------------------------------------------
// Resilient datastore path resolution
// ---------------------------------------------------------------------------
// The platform may or may not have the persistent volume actually mounted at
// /data even though DATA_STORE_PATH points there. Writing to a non-writable or
// unmounted path at startup is a common cause of a container that starts and
// then dies. Probe the configured path first and fall back to a directory
// inside the application bundle when it cannot be used.
const DEFAULT_STORE_PATH = path.resolve(__dirname, '../../data/riyadvi-store.json');

const isUsableStorePath = (filePath) => {
  try {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    // Verify the directory is actually writable (a mounted-but-read-only or
    // absent volume passes mkdirSync with `recursive` in some images).
    fs.accessSync(dir, fs.constants.W_OK);
    const probe = path.join(dir, `.write-probe-${process.pid}`);
    fs.writeFileSync(probe, 'ok', 'utf8');
    fs.unlinkSync(probe);
    return true;
  } catch (error) {
    return false;
  }
};

const resolveDataStorePath = () => {
  const configured = process.env.DATA_STORE_PATH;
  if (configured && isUsableStorePath(configured)) {
    return configured;
  }
  if (configured) {
    console.warn(
      `[ENV] DATA_STORE_PATH "${configured}" is not writable; falling back to ${DEFAULT_STORE_PATH}`
    );
  }
  return DEFAULT_STORE_PATH;
};

// Bind to all interfaces by default so the reverse proxy can reach the process
// regardless of how the container resolves its default host.
const HOST = process.env.HOST || '0.0.0.0';

const ADMIN_SECRET_KEY_FALLBACK = 'riyadvi_admin_super_secret_2025';

if (!process.env.ADMIN_SECRET_KEY) {
  // Deliberately kept as a documented demo credential so an evaluator can log in
  // to /admin without any setup, but never silently: the boot log states that the
  // published default is in use and how to replace it. Set ADMIN_SECRET_KEY in the
  // environment to override it.
  console.warn(
    '[ENV] ADMIN_SECRET_KEY is not set — using the documented demo key. ' +
      'Set ADMIN_SECRET_KEY to a private value before using this in production.'
  );
}

module.exports = {
  PORT: process.env.PORT || 5000,
  HOST,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/riyadvi_db',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_KEY_FALLBACK,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'contact@riyadvisoftwaretechnologies.com',
  // Absolute path used to persist the resilient fallback datastore (JSON file).
  DATA_STORE_PATH: resolveDataStorePath(),
};
