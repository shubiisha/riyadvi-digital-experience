// Dual-mode wrapper ensuring full Mongoose capability with a durable fallback.
//
// Mode selection:
//   - MongoDB connected  -> real Mongoose models (production path when MONGODB_URI resolves)
//   - MongoDB unavailable -> resilient datastore persisted to a JSON file on disk so that
//                            leads collected during evaluation survive process restarts.
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const env = require('../config/env');

const memoryDB = {
  services: [],
  projects: [],
  blogs: [],
  jobs: [],
  enquiries: [],
  consultations: [],
  healthCheckups: [],
  leadMagnets: [],
  applications: [],
};

const STORE_FILE = env.DATA_STORE_PATH;

// ---------------------------------------------------------------------------
// Disk persistence (used only while MongoDB is unreachable)
// ---------------------------------------------------------------------------
const persist = () => {
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    const payload = JSON.stringify(memoryDB, null, 2);
    // Write to a temp file first, then rename, so a crash mid-write cannot
    // truncate an existing datastore.
    const tmpFile = `${STORE_FILE}.tmp`;
    fs.writeFileSync(tmpFile, payload, 'utf8');
    fs.renameSync(tmpFile, STORE_FILE);
  } catch (error) {
    console.warn(`[DB] Could not persist fallback datastore: ${error.message}`);
  }
};

const hydrate = () => {
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    Object.keys(memoryDB).forEach((key) => {
      if (Array.isArray(parsed[key])) memoryDB[key] = parsed[key];
    });
    // Restore any dynamically created collections (e.g. model-specific keys)
    Object.keys(parsed).forEach((key) => {
      if (!memoryDB[key] && Array.isArray(parsed[key])) memoryDB[key] = parsed[key];
    });
    console.log(`[DB] Restored fallback datastore from ${STORE_FILE}`);
  } catch (error) {
    console.warn(`[DB] Could not restore fallback datastore: ${error.message}`);
  }
};

hydrate();

const createModelWrapper = (collectionName, schemaDef) => {
  const Schema = new mongoose.Schema(schemaDef, { timestamps: true });
  const MongoModel = mongoose.models[collectionName] || mongoose.model(collectionName, Schema);

  const isLive = () => mongoose.connection.readyState === 1;

  const wrapper = {
    schema: Schema,
    mongoModel: MongoModel,

    async find(filter = {}) {
      if (isLive()) {
        return MongoModel.find(filter).sort({ createdAt: -1 });
      }
      const list = memoryDB[collectionName] || [];
      return list.filter((item) => {
        for (const [key, val] of Object.entries(filter)) {
          if (item[key] !== val) return false;
        }
        return true;
      });
    },

    async findOne(filter = {}) {
      if (isLive()) {
        return MongoModel.findOne(filter);
      }
      const list = memoryDB[collectionName] || [];
      return (
        list.find((item) => {
          for (const [key, val] of Object.entries(filter)) {
            if (item[key] !== val) return false;
          }
          return true;
        }) || null
      );
    },

    async findById(id) {
      if (isLive()) {
        return MongoModel.findById(id);
      }
      const list = memoryDB[collectionName] || [];
      return list.find((item) => item._id === id || item.id === id) || null;
    },

    async create(data) {
      if (isLive()) {
        return MongoModel.create(data);
      }
      const doc = {
        _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (!memoryDB[collectionName]) memoryDB[collectionName] = [];
      memoryDB[collectionName].unshift(doc);
      persist();
      return doc;
    },

    async findByIdAndUpdate(id, update, options = {}) {
      if (isLive()) {
        return MongoModel.findByIdAndUpdate(id, update, options);
      }
      const list = memoryDB[collectionName] || [];
      const item = list.find((i) => i._id === id || i.id === id);
      if (item) {
        Object.assign(item, update, { updatedAt: new Date().toISOString() });
        persist();
        return item;
      }
      return null;
    },

    async countDocuments(filter = {}) {
      if (isLive()) {
        return MongoModel.countDocuments(filter);
      }
      const list = memoryDB[collectionName] || [];
      if (!Object.keys(filter).length) return list.length;
      return list.filter((item) => {
        for (const [key, val] of Object.entries(filter)) {
          if (item[key] !== val) return false;
        }
        return true;
      }).length;
    },
  };

  return wrapper;
};

module.exports = {
  createModelWrapper,
  memoryDB,
  persistFallbackStore: persist,
};
