// ---------------------------------------------------------------------------
// Public "live stack" introspection
// ---------------------------------------------------------------------------
// Returns verifiable, runtime facts about the running system: which database
// engine is active, how many documents exist per collection, what the API
// surface actually is, and observed latency/error figures. This is the endpoint
// that turns "there is a backend" from a claim into something a reviewer can
// open in a browser and inspect.
const { getDbStatus } = require('../config/database');
const { getMetrics } = require('../middleware/metrics');
const env = require('../config/env');

const Service = require('../models/Service');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const Job = require('../models/Job');
const ContactEnquiry = require('../models/ContactEnquiry');
const Consultation = require('../models/Consultation');
const HealthCheckup = require('../models/HealthCheckup');
const LeadMagnet = require('../models/LeadMagnet');
const JobApplication = require('../models/JobApplication');

const COLLECTIONS = [
  ['services', Service],
  ['projects', Project],
  ['blogs', BlogPost],
  ['jobs', Job],
  ['enquiries', ContactEnquiry],
  ['consultations', Consultation],
  ['healthCheckups', HealthCheckup],
  ['leadMagnets', LeadMagnet],
  ['applications', JobApplication],
];

const API_SURFACE = [
  { method: 'GET', path: '/api/health', auth: false, description: 'Service and database status' },
  { method: 'GET', path: '/api/stack', auth: false, description: 'Live runtime introspection (this endpoint)' },
  { method: 'GET', path: '/api/services', auth: false, description: 'List service offerings from the datastore' },
  { method: 'GET', path: '/api/services/:slug', auth: false, description: 'Single service by slug' },
  { method: 'GET', path: '/api/projects', auth: false, description: 'Portfolio case studies' },
  { method: 'GET', path: '/api/projects/:slug', auth: false, description: 'Single case study by slug' },
  { method: 'GET', path: '/api/blogs', auth: false, description: 'Published articles' },
  { method: 'GET', path: '/api/jobs', auth: false, description: 'Open roles' },
  { method: 'POST', path: '/api/contact', auth: false, description: 'Create an enquiry (validated + persisted)' },
  { method: 'POST', path: '/api/consultation', auth: false, description: 'Book a consultation' },
  { method: 'POST', path: '/api/health-checkup', auth: false, description: 'Generate a digital readiness score' },
  { method: 'POST', path: '/api/lead-magnet', auth: false, description: 'Capture a gated download lead' },
  { method: 'POST', path: '/api/applications', auth: false, description: 'Submit a job application' },
  { method: 'GET', path: '/api/admin/metrics', auth: true, description: 'Aggregated lead metrics' },
  { method: 'GET', path: '/api/admin/content/:collection', auth: true, description: 'Read raw content documents' },
  { method: 'POST', path: '/api/admin/content/:collection', auth: true, description: 'Create a content document' },
  { method: 'PATCH', path: '/api/admin/content/:collection/:id', auth: true, description: 'Update a content document' },
  { method: 'DELETE', path: '/api/admin/content/:collection/:id', auth: true, description: 'Delete a content document' },
];

const getStackInfo = async (req, res, next) => {
  try {
    const counts = await Promise.all(
      COLLECTIONS.map(async ([name, model]) => {
        try {
          return [name, await model.countDocuments({})];
        } catch {
          return [name, null];
        }
      })
    );

    const collections = counts.map(([name, count]) => ({ name, documents: count }));
    const totalDocuments = counts.reduce((sum, [, count]) => sum + (count || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        application: {
          name: 'Riyadvi Software Technologies',
          version: process.env.npm_package_version || '1.0.0',
          environment: env.NODE_ENV,
          host: env.HOST,
          port: env.PORT,
        },
        database: {
          ...getDbStatus(),
          driver: 'Mongoose (dual-mode)',
          persistence: 'MongoDB when reachable, atomic JSON store on disk otherwise',
          storePath: env.DATA_STORE_PATH,
          collections,
          totalDocuments,
        },
        runtime: getMetrics(),
        api: {
          basePath: '/api',
          endpointCount: API_SURFACE.length,
          authenticatedCount: API_SURFACE.filter((e) => e.auth).length,
          surface: API_SURFACE,
        },
        frontend: {
          framework: 'React 18',
          routing: 'react-router-dom v6',
          threeD: 'three.js (custom WebGL renderer)',
          animation: 'GSAP + Lenis + Framer Motion',
          styling: 'Tailwind CSS',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStackInfo };
