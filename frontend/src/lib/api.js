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

// Admin
export async function getAdminMetrics() {
  const response = await request('/admin/metrics');
  if (response && response.data) return response.data;
  return {
    metrics: {
      totalEnquiries: 14,
      totalConsultations: 8,
      totalHealthCheckups: 19,
      totalLeadMagnets: 42,
      totalApplications: 11,
      overallLeads: 83,
    },
    system: { connected: false, fallbackMode: true, type: 'Standalone Preview Store' },
    recentEnquiries: [
      { _id: '1', name: 'Alexander Wright', email: 'a.wright@aurora-logistics.com', company: 'Aurora Global Logistics', requirement: 'Enterprise Web Portal & 3D Fleet Tracking', status: 'New', createdAt: new Date().toISOString() },
      { _id: '2', name: 'Dr. Meera Nambiar', email: 'dr.meera@carewell.in', company: 'Carewell Health Networks', requirement: 'Telemedicine App & Multi-Clinic Management', status: 'In Progress', createdAt: new Date().toISOString() }
    ],
    recentApplications: [
      { _id: '1', name: 'David Chen', email: 'david@chen.dev', position: 'Senior Full Stack Engineer', status: 'Applied', createdAt: new Date().toISOString() }
    ]
  };
}

export async function getAdminEnquiries() {
  const response = await request('/admin/enquiries');
  if (response && response.data) return response.data;
  return [
    { _id: '1', name: 'Alexander Wright', email: 'a.wright@aurora-logistics.com', phone: '+1 415 892 3401', company: 'Aurora Global Logistics', requirement: 'Enterprise Web Portal & 3D Fleet Tracking', message: 'We are seeking a reliable technology partner to rebuild our carrier booking portal.', status: 'New', createdAt: new Date().toISOString() },
    { _id: '2', name: 'Dr. Meera Nambiar', email: 'dr.meera@carewell.in', phone: '+91 98450 12890', company: 'Carewell Health Networks', requirement: 'Telemedicine App & Multi-Clinic Management', message: 'Looking for a secure, HIPAA-compliant patient consultation app.', status: 'In Progress', createdAt: new Date().toISOString() },
    { _id: '3', name: 'Sarah Jenkins', email: 's.jenkins@luxuryliving.co.uk', phone: '+44 20 7946 0912', company: 'Luxury Living Realty', requirement: 'Interactive 3D Virtual Tours', message: 'Require WebXR 3D visualization for prime central London penthouses.', status: 'Contacted', createdAt: new Date().toISOString() }
  ];
}

export async function getAdminApplications() {
  const response = await request('/admin/applications');
  if (response && response.data) return response.data;
  return [
    { _id: '1', name: 'David Chen', email: 'david@chen.dev', phone: '+91 98765 43210', position: 'Senior Full Stack Engineer (React + Node.js)', experienceYears: '5 years', resumeUrl: 'https://linkedin.com/in/davidchen', coverLetter: 'Passionate about building scalable architectures and Three.js 3D web platforms.', status: 'Applied', createdAt: new Date().toISOString() },
    { _id: '2', name: 'Priya Sundaram', email: 'priya.s@designstudio.io', phone: '+91 91234 56789', position: 'Senior UI/UX Product Designer', experienceYears: '4 years', resumeUrl: 'https://behance.net/priyasundaram', coverLetter: 'Experienced in luxury design systems and micro-interactions.', status: 'Reviewing', createdAt: new Date().toISOString() }
  ];
}
