const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/database');
const { seedInitialData } = require('../scripts/seed');

// ---------------------------------------------------------------------------
// Process-level safety nets
// ---------------------------------------------------------------------------
// A single unhandled rejection or stray exception must not take the whole
// container down: an exiting process makes the platform's proxy return errors
// for every request until the container is restarted. Log instead of dying.
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL-GUARD] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[FATAL-GUARD] Uncaught exception:', error);
});

const startServer = async () => {
  console.log('🚀 Initializing Riyadvi Software Technologies Backend API...');

  // Connect to Database (or resilient in-memory fallback)
  await connectDB();

  // Auto-seed initial catalogue and demo data
  await seedInitialData();

  const server = app.listen(env.PORT, env.HOST, () => {
    console.log(`✨ Server running in ${env.NODE_ENV} mode on ${env.HOST}:${env.PORT}`);
    console.log(`📡 API Base URL: http://${env.HOST}:${env.PORT}/api`);
    console.log(`🩺 Health check: http://${env.HOST}:${env.PORT}/api/health`);
  });

  // Surface listener errors (e.g. EADDRINUSE) in the platform logs instead of
  // failing silently behind the proxy.
  server.on('error', (error) => {
    console.error('[SERVER] Listener error:', error);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    server.close(() => {
      console.log('Process terminated.');
    });
  });

  return server;
};

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
