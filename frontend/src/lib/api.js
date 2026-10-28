import { servicesData } from '../data/services';
import { projectsData } from '../data/projects';
import { blogPostsData } from '../data/blogPosts';
import { jobsData } from '../data/jobs';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    // If backend isn't running or network error, return null to trigger fallback
    console.warn(`[API] Endpoint '${endpoint}' request warning:`, error.message);
    return null;
  }
}

// Services
export async function getServices() {
  const response = await request('/services');
  if (response && response.data) return response.data;
  return servicesData;
}

export async function getServiceBySlug(slug) {
  const response = await request(`/services/${slug}`);
  if (response && response.data) return response.data;
  return servicesData.find((s) => s.slug === slug) || null;
}

// Projects
export async function getProjects() {
  const response = await request('/projects');
  if (response && response.data) return response.data;
  return projectsData;
}

export async function getProjectBySlug(slug) {
  const response = await request(`/projects/${slug}`);
  if (response && response.data) return response.data;
  return projectsData.find((p) => p.slug === slug) || null;
}

// Blog
export async function getBlogPosts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await request(`/blogs${query ? '?' + query : ''}`);
  if (response && response.data) return response.data;
  return blogPostsData;
}

export async function getBlogPostBySlug(slug) {
  const response = await request(`/blogs/${slug}`);
  if (response && response.data) return response.data;
  const post = blogPostsData.find((b) => b.slug === slug) || null;
  const related = blogPostsData.filter((b) => b.slug !== slug).slice(0, 3);
  return { post, related };
}

// Jobs
export async function getJobs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await request(`/jobs${query ? '?' + query : ''}`);
  if (response && response.data) return response.data;
  return jobsData;
}

export async function getJobBySlug(slug) {
  const response = await request(`/jobs/${slug}`);
  if (response && response.data) return response.data;
  return jobsData.find((j) => j.slug === slug) || null;
}

// Submissions
export async function postContact(data) {
  const response = await request('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (response) return response;
  // Local fallback response
  return {
    success: true,
    message: 'Thank you for contacting Riyadvi! Our enterprise team will connect within 24 hours.',
    data: { id: 'local_' + Date.now(), ...data },
  };
}

export async function postConsultation(data) {
  const response = await request('/consultation', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (response) return response;
  return {
    success: true,
    message: 'Free consultation booked! Calendar confirmation has been simulated.',
    data,
  };
}

export async function postHealthCheckup(data) {
  const response = await request('/health-checkup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (response) return response;
  return {
    success: true,
    message: 'Digital Health Checkup evaluated successfully!',
    data: {
      id: 'chk_' + Date.now(),
      companyName: data.companyName,
      digitalReadinessScore: 84,
      readinessLevel: 'Accelerated Growth Ready',
      recommendedServices: ['Next-Gen Web Architecture', '3D Interactive Experience', 'Performance Marketing'],
    },
  };
}

export async function postLeadMagnet(data) {
  const response = await request('/lead-magnet', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (response) return response;
  return {
    success: true,
    message: 'Planning guide unlocked! Your download has started.',
    data: {
      downloadUrl: '#download-guide-pdf',
      resourceName: 'Riyadvi Software Project Planning Guide 2025',
    },
  };
}

export async function postJobApplication(data) {
  const response = await request('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (response) return response;
  return {
    success: true,
    message: `Thank you, ${data.name}! Your application for '${data.position}' has been logged.`,
  };
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

async function adminFetch(endpoint) {
  const key = getAdminKey();
  if (!key) {
    emitUnauthorized();
    return { status: 'unauthorized', data: null };
  }
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
    });
    if (res.status === 401 || res.status === 403) {
      emitUnauthorized();
      return { status: 'unauthorized', data: null };
    }
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn(`[API] Admin endpoint '${endpoint}' failed:`, errData.message || res.status);
      return { status: 'error', data: null };
    }
    const json = await res.json();
    return { status: 'ok', data: json.data };
  } catch (error) {
    console.warn(`[API] Admin endpoint '${endpoint}' unreachable:`, error.message);
    return { status: 'offline', data: null };
  }
}

const PREVIEW_METRICS = {
  metrics: {
    totalEnquiries: 14,
    totalConsultations: 8,
    totalHealthCheckups: 19,
    totalLeadMagnets: 42,
    totalApplications: 11,
    overallLeads: 83,
  },
  system: { connected: false, fallbackMode: true, type: 'Standalone Preview Store' },
  recentEnquiries: [],
  recentApplications: [],
};

export async function getAdminMetrics() {
  const { status, data } = await adminFetch('/admin/metrics');
  if (status === 'ok' && data) return data;
  // Unauthorised callers never receive sample data.
  if (status === 'unauthorized') return null;
  return PREVIEW_METRICS;
}

export async function getAdminEnquiries() {
  const { status, data } = await adminFetch('/admin/enquiries');
  if (status === 'ok' && data) return data;
  if (status === 'unauthorized') return null;
  return [];
}

export async function getAdminApplications() {
  const { status, data } = await adminFetch('/admin/applications');
  if (status === 'ok' && data) return data;
  if (status === 'unauthorized') return null;
  return [];
}
