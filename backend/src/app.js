const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const env = require('./config/env');
const { generalLimiter } = require('./middleware/rateLimiter');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { getDbStatus } = require('./config/database');

// Route imports
const contactRoutes = require('./routes/contactRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const healthCheckupRoutes = require('./routes/healthCheckupRoutes');
const leadMagnetRoutes = require('./routes/leadMagnetRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// The app sits behind a reverse proxy in production, so trust the first proxy hop
// for X-Forwarded-For (otherwise express-rate-limit cannot identify clients).
app.set('trust proxy', 1);

// Security and utility middleware
// frameguard is disabled so the app can be embedded inside preview iframes.
app.use(helmet({ crossOriginResourcePolicy: false, frameguard: false }));
// CORS: allow the configured frontend origin, the app's own origin (the built
// SPA is served from this same server) and local dev ports. No wildcard.
const allowedOrigins = new Set(
  [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173']
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim().replace(/\/$/, ''))
    .filter(Boolean)
);

app.use(cors((req, callback) => {
  const origin = req.headers.origin;
  const selfOrigin = `${req.protocol}://${req.headers.host}`;
  const isAllowed =
    !origin ||
    allowedOrigins.has(origin.replace(/\/$/, '')) ||
    origin.replace(/\/$/, '') === selfOrigin;

  callback(null, {
    // `false` omits the CORS headers so the browser blocks the cross-origin call.
    origin: isAllowed ? origin || true : false,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
  });
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for simulated uploads/downloads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve the built frontend (single-origin deployment) -----------------------
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist, {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
    },
  }));
}

// General rate limiter
app.use('/api', generalLimiter);

// Health & Status check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Riyadvi Software Technologies Backend API',
    database: getDbStatus(),
    version: '1.0.0',
  });
});

// Primary API Endpoints
app.use('/api/contact', contactRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/health-checkup', healthCheckupRoutes);
app.use('/api/lead-magnet', leadMagnetRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// SPA fallback: serve index.html for client-side routes --------------------
if (fs.existsSync(frontendDist)) {
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
