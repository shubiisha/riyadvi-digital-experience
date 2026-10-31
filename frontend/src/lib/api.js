// ---------------------------------------------------------------------------
// API client
// ---------------------------------------------------------------------------
// Design rule: the network layer must never invent data.
//
// Earlier revisions returned hardcoded arrays (and fabricated "success"
// responses with fake scores) whenever a request failed, which made the site
// look identical with or without a backend. That is gone. Every call now:
//
//   1. attempts the real request against the REST API,
//   2. records the observed connection state (live / degraded / offline),
//   3. falls back to the bundled snapshot ONLY for read-only catalogue content,
//      and marks the data as `offline` so the UI can say so honestly.
//
// Mutations (contact, applications, admin writes) never receive a fake success.
// If the API is unreachable the caller gets a real error and shows a real error.
import { servicesData } from '../data/services';
import { projectsData } from '../data/projects';
import { blogPostsData } from '../data/blogPosts';
import { jobsData } from '../data/jobs';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ---------------------------------------------------------------------------
// Observable connection state
// ---------------------------------------------------------------------------
// Components subscribe to this to render an honest "Live API" / "Offline
// snapshot" indicator instead of silently pretending everything is fine.
const listeners = new Set();

let connectionState = {
  status: 'unknown', // 'unknown' | 'live' | 'offline'
  apiBase: API_BASE,
  latencyMs: null,
  lastCheckedAt: null,
  lastError: null,
};

const setConnectionState = (patch) => {
  connectionState = { ...connectionState, ...patch, lastCheckedAt: new Date().toISOString() };
  listeners.forEach((listener) => {
    try {
      listener(connectionState);
    } catch {
      /* a broken subscriber must not break data loading */
    }
  });
};

export function getConnectionState() {
  return connectionState;
}

export function subscribeConnection(handler) {
  listeners.add(handler);
  handler(connectionState);
  return () => listeners.delete(handler);
}

// ---------------------------------------------------------------------------
// Admin authentication
// The admin secret is never bundled into the frontend build. It is entered by
// the operator at runtime and kept in localStorage for the session only.
// ---------------------------------------------------------------------------
const ADMIN_KEY_STORAGE = 'riyadvi_admin_key';

export function getAdminKey() {
  try {
    return window.localStorage.getItem(ADMIN_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setAdminKey(key) {
  try {
    window.localStorage.setItem(ADMIN_KEY_STORAGE, key);
  } catch {
    /* storage unavailable (private mode) - key stays in memory only */
  }
}

export function clearAdminKey() {
  try {
    window.localStorage.removeItem(ADMIN_KEY_STORAGE);
  } catch {
    /* noop */
  }
}

// ---------------------------------------------------------------------------
// Core request
// ---------------------------------------------------------------------------
export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

/**
 * Executes a real HTTP request and returns the parsed JSON body.
 * Throws ApiError on network failure or a non-2xx response — callers decide
 * what to do; nothing is silently swallowed.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const started = typeof performance !== 'undefined' ? performance.now() : Date.now();

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const durationMs = Math.round(
      (typeof performance !== 'undefined' ? performance.now() : Date.now()) - started
    );

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      setConnectionState({ status: 'live', latencyMs: durationMs, lastError: `HTTP ${res.status}` });
      throw new ApiError(
        (body && body.message) || `Request failed with status ${res.status}`,
        res.status一家人
      );
    }

    setConnectionState({ status: 'live', latencyMs: durationMs, lastError: null });
    return body;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    const durationMs = Math.round(
      (typeof performance !== 'undefined' ? performance.now() : Date.now()) - started
    );
    setConnectionState({
      status: 'offline',
      latencyMs: durationMs,
      lastError: error.message || 'Network request failed',
    });
    throw new ApiError(
      `Cannot reach the API at ${API_BASE}. ${error.message || ''}`.trim(),
      0,
      null
    );
  }
}

/**
 * Read-only catalogue fetch with an explicit, labelled offline fallback.
 * Returns `{ items, source }` where source is 'api' or 'offline'.
 */
async function readCollection(endpoint, fallbackItems) {
  try {
    const body = await request(endpoint);
    const items = body && Array.isArray(body.data) ? body.data : [];
    // An empty array from a working API is a real answer — do not mask it with
    // stale local content, otherwise "0 documents" can never be observed.
    return { items, source: 'api' };
  } catch (error) {
    console.warn(`[API] ${endpoint} unavailable — serving offline snapshot.`, error.message);
    return { items: fallbackItems, source: 'offline' };
  }
}

// ---------------------------------------------------------------------------
// Public catalogue (read-only)
// ---------------------------------------------------------------------------
export async function getServices() {
  const { items } = await readCollection('/services', servicesData);
  return items;
}

export async function getServiceBySlug(slug) {
  try {
    const body = await request(`/services/${slug}`);
    return (body && body.data) || null;
  } catch {
    return servicesData.find((s) => s.slug === slug) || null;
  }
}

export async function getProjects() {
  const { items } = await readCollection('/projects', projectsData);
  return items;
}

export async function getProjectBySlug(slug) {
  try {
    const body = await request(`/projects/${slug}`);
    return (body && body.data) || null;
  } catch {
    return projectsData.find((p) => p.slug === slug) || null;
  }
}

export async function getBlogPosts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const { items } = await readCollection(`/blogs${query ? `?${query}` : ''}`, blogPostsData);
  return items;
}

export async function getBlogPostBySlug(slug) {
  try {
    const body = await request(`/blogs/${slug}`);
    return (body && body.data) || null;
  } catch {
    const post = blogPostsData.find((b) => b.slug === slug) || null;
    const related = blogPostsData.filter((b) => b.slug !== slug).slice(0, 3);
    return { post, related };
  }
}

export async function getJobs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const { items } = await readCollection(`/jobs${query ? `?${query}` : ''}`, jobsData);
  return items;
}

export async function getJobBySlug(slug) {
  try {
    const body = await request(`/jobs/${slug}`);
    return (body && body.data) || null;
  } catch {
    return jobsData.find((j) => j.slug === slug) || null;
  }
}

// ---------------------------------------------------------------------------
// Mutation endpoints — real writes, real errors, no fabricated success
// ---------------------------------------------------------------------------
export async function postContact(data) {
  return request('/contact', { method: 'POST', body: JSON.stringify(data) });
}

export async function postConsultation(data) {
  return request('/consultation', { method: 'POST', body: JSON.stringify(data) });
}

export async function postHealthCheckup(data) {
  return request('/health-checkup', { method: 'POST', body: JSON.stringify(data) });
}

export async function postLeadMagnet(data) {
  return request('/lead-magnet', { method: 'POST', body: JSON.stringify(data) });
}

export async function postJobApplication(data) {
  return request('/applications', { method: 'POST', body: JSON.stringify(data) });
}

// ---------------------------------------------------------------------------
// Live stack introspection (public)
// ---------------------------------------------------------------------------
export async function getStackInfo() {
  const body = await request('/stack');
  return (body && body.data) || null;
}

export async function getHealth() {
  const body = await request('/health');
  return body || null;
}

/**
 * Fires an arbitrary GET against the API and reports real status + timing +
 * body. Used by the interactive API explorer so a reviewer can watch the live
 * service answer, rather than read a claim about it.
 */
export async function exploreEndpoint(path) {
  const started = typeof performance !== 'undefined' ? performance.now() : Date.now();
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const durationMs = Math.round(
      (typeof performance !== 'undefined' ? performance.now() : Date.now()) - started
    );
    const text = await res.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    return { ok: res.ok, status: res.status, durationMs, body: parsed, raw: text.slice(0, 4000) };
  } catch (error) {
    const durationMs = Math.round(
      (typeof performance !== 'undefined' ? performance.now() : Date.now()) - started
    );
    return { ok: false, status: 0, durationMs, body: null, raw: error.message };
  }
}

// ---------------------------------------------------------------------------
// Admin
// Every admin request carries the operator-supplied secret in the `x-admin-key`
// header. The backend rejects requests without a valid key with HTTP 401.
// ---------------------------------------------------------------------------
const ADMIN_UNAUTHORIZED_EVENT = 'riyadvi:admin-unauthorized';

export function onAdminUnauthorized(handler) {
  window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, handler);
  return () => window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, handler);
}

const emitUnauthorized = () => {
  window.dispatchEvent(new CustomEvent(ADMIN_UNAUTHORIZED_EVENT));
};

/**
 * Validates an admin key without persisting it.
 * @returns {Promise<{ ok: boolean, reason: 'invalid'|'error'|'network'|'ok' }>}
 */
export async function validateAdminKey(key) {
  if (!key) return { ok: false, reason: 'invalid' };
  try {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
    });
    if (res.status === 401 || res.status === 403) return { ok: false, reason: 'invalid' };
    if (!res.ok) return { ok: false, reason: 'error' };
    return { ok: true, reason: 'ok' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}

async function adminFetch(endpoint, options = {}) {
  const key = getAdminKey();
  if (!key) {
    emitUnauthorized();
    return { status: 'unauthorized', data: null };
  }
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': key,
        ...options.headers,
      },
    });
    if (res.status === 401 || res.status === 403) {
      emitUnauthorized();
      return { status: 'unauthorized', data: null };
    }
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn(`[API] Admin endpoint '${endpoint}' failed:`, errData.message || res.status);
      return { status: 'error', data: null, message: errData.message || `HTTP ${res.status}` };
    }
    const json = await res.json();
    return { status: 'ok', data: json.data, message: json.message };
  } catch (error) {
    console.warn(`[API] Admin endpoint '${endpoint}' unreachable:`, error.message);
    return { status: 'offline', data: null, message: error.message };
  }
}

// No sample data: an unreachable backend reports unreachable, never invented
// lead counts.
export async function getAdminMetrics() {
  const { status, data } = await adminFetch('/admin/metrics');
  if (status === 'ok' && data) return data;
  return null;
}

export async function getAdminEnquiries() {
  const { status, data } = await adminFetch('/admin/enquiries');
  return status === 'ok' && data ? data : null;
}

export async function getAdminApplications() {
  const { status, data } = await adminFetch('/admin/applications');
  return status === 'ok' && data ? data : null;
}

// ---------------------------------------------------------------------------
// Admin content studio (CRUD over live site content)
// ---------------------------------------------------------------------------
export const CONTENT_COLLECTIONS = [
  { key: 'services', label: 'Services' },
  { key: 'projects', label: 'Case Studies' },
  { key: 'blogs', label: 'Articles' },
  { key: 'jobs', label: 'Open Roles' },
];

export async function getAdminContent(collection) {
  const { status, data } = await adminFetch(`/admin/content/${collection}`);
  return { status, items: status === 'ok' && Array.isArray(data) ? data : [] };
}

export async function createAdminContent(collection, payload) {
  return adminFetch(`/admin/content/${collection}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminContent(collection, id, payload) {
  return adminFetch(`/admin/content/${collection}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminContent(collection, id) {
  return adminFetch(`/admin/content/${collection}/${id}`, { method: 'DELETE' });
}
