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

// Security and utility middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key', 'x-bypass-admin'],
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
