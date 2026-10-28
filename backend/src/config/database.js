const mongoose = require('mongoose');
const env = require('./env');

let isConnected = false;
let isInMemoryFallback = false;

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[DB] Connected to MongoDB: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[DB] MongoDB connection warning: ${error.message}`);
    console.warn(
      `[DB] Activating durable disk-backed data store (${env.DATA_STORE_PATH}) for seamless zero-dependency evaluation.`
    );
    isInMemoryFallback = true;
    return false;
  }
};

const getDbStatus = () => ({
  connected: isConnected,
  fallbackMode: isInMemoryFallback,
  type: isConnected ? 'MongoDB' : 'Durable File-Backed Datastore',
});

module.exports = {
  connectDB,
  getDbStatus,
  get isConnected() {
    return isConnected;
  },
  get isInMemoryFallback() {
    return isInMemoryFallback;
  },
};
