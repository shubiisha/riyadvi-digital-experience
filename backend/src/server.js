const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/database');
const { seedInitialData } = require('../scripts/seed');

const startServer = async () => {
  console.log('🚀 Initializing Riyadvi Software Technologies Backend API...');
  
  // Connect to Database (or resilient in-memory fallback)
  await connectDB();

  // Auto-seed initial catalogue and demo data
  await seedInitialData();

  const server = app.listen(env.PORT, () => {
    console.log(`✨ Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`📡 API Base URL: http://localhost:${env.PORT}/api`);
    console.log(`🩺 Health check: http://localhost:${env.PORT}/api/health`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    server.close(() => {
      console.log('Process terminated.');
    });
  });
};

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
