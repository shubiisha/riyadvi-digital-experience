// Dual-mode wrapper ensuring full Mongoose capability with resilient fallback
const mongoose = require('mongoose');

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

const createModelWrapper = (collectionName, schemaDef) => {
  const Schema = new mongoose.Schema(schemaDef, { timestamps: true });
  const MongoModel = mongoose.models[collectionName] || mongoose.model(collectionName, Schema);

  const wrapper = {
    schema: Schema,
    mongoModel: MongoModel,

    async find(filter = {}) {
      if (mongoose.connection.readyState === 1) {
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
      if (mongoose.connection.readyState === 1) {
        return MongoModel.findOne(filter);
      }
      const list = memoryDB[collectionName] || [];
      return list.find((item) => {
        for (const [key, val] of Object.entries(filter)) {
          if (item[key] !== val) return false;
        }
        return true;
      }) || null;
    },

    async findById(id) {
      if (mongoose.connection.readyState === 1) {
        return MongoModel.findById(id);
      }
      const list = memoryDB[collectionName] || [];
      return list.find((item) => item._id === id || item.id === id) || null;
    },

    async create(data) {
      if (mongoose.connection.readyState === 1) {
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
      return doc;
    },

    async findByIdAndUpdate(id, update, options = {}) {
      if (mongoose.connection.readyState === 1) {
        return MongoModel.findByIdAndUpdate(id, update, options);
      }
      const list = memoryDB[collectionName] || [];
      const item = list.find((i) => i._id === id || i.id === id);
      if (item) {
        Object.assign(item, update, { updatedAt: new Date().toISOString() });
        return item;
      }
      return null;
    },

    async countDocuments(filter = {}) {
      if (mongoose.connection.readyState === 1) {
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
};
