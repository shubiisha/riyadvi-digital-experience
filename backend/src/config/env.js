const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/riyadvi_db',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || 'riyadvi_admin_super_secret_2025',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'contact@riyadvisoftwaretechnologies.com',
  // Absolute path used to persist the resilient fallback datastore (JSON file).
  DATA_STORE_PATH:
    process.env.DATA_STORE_PATH || path.resolve(__dirname, '../../data/riyadvi-store.json'),
};
