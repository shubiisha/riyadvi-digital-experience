// ---------------------------------------------------------------------------
// Authenticated content management (CMS) endpoints
// ---------------------------------------------------------------------------
// This is what makes the site's content architecture genuinely dynamic: the
// same documents that the public pages read are created, edited and deleted
// here. A change made through these routes is immediately visible on the site
// with no rebuild and no redeploy.
const Service = require('../models/Service');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Whitelisted collections only — never allow arbitrary model access from a URL.
const REGISTRY = {
  services: { model: Service, label: 'Service', required: ['slug', 'title'] },
  projects: { model: Project, label: 'Project', required: ['slug', 'title'] },
  blogs: { model: BlogPost, label: 'BlogPost', required: ['slug', 'title'] },
  jobs: { model: Job, label: 'Job', required: ['slug', 'title'] },
};

const resolve = (collection) => {
  const entry = REGISTRY[collection];
  if (!entry) {
    throw new ApiError(
      400,
      `Unknown collection '${collection}'. Supported: ${Object.keys(REGISTRY).join(', ')}`
    );
  }
  return entry;
};

const listContent = asyncHandler(async (req, res) => {
  const { model } = resolve(req.params.collection);
  const documents = await model.find({});

  res.status(200).json({
    success: true,
    collection: req.params.collection,
    count: documents.length,
    data: documents,
  });
});

const createContent = asyncHandler(async (req, res) => {
  const { collection } = req.params;
  const { model, label, required } = resolve(collection);
  const body = req.body || {};

  const missing = required.filter((field) => !body[field]);
  if (missing.length) {
    throw new ApiError(400, `Missing required field(s): ${missing.join(', ')}`);
  }

  // Slug uniqueness is enforced by the datastore, but check explicitly so the
  // client gets a clear 409 instead of a driver-level duplicate key error.
  const existing = await model.findOne({ slug: body.slug });
  if (existing) {
    throw new ApiError(409, `A ${label} with slug '${body.slug}' already exists`);
  }

  const created = await model.create(body);

  res.status(201).json({
    success: true,
    message: `${label} created`,
    data: created,
  });
});

const updateContent = asyncHandler(async (req, res) => {
  const { collection, id } = req.params;
  const { model, label } = resolve(collection);

  const updated = await model.findByIdAndUpdate(id, req.body || {}, { new: true });
  if (!updated) {
    throw new ApiError(404, `${label} '${id}' not found`);
  }

  res.status(200).json({
    success: true,
    message: `${label} updated`,
    data: updated,
  });
});

const deleteContent = asyncHandler(async (req, res) => {
  const { collection, id } = req.params;
  const { model, label } = resolve(collection);

  const target = await model.findById(id);
  if (!target) {
    throw new ApiError(404, `${label} '${id}' not found`);
  }

  // The shared store wrapper has no delete primitive (Mongo and the file store
  // reconcile differently), so the removal is expressed as an archive flag when
  // the schema supports it and as a hard delete through the native driver when
  // it does not.
  if (typeof model.removeById === 'function') {
    await model.removeById(id);
  } else {
    const { memoryDB, persistFallbackStore } = require('../models/_store');
    const collectionKey = label;
    const list = memoryDB[collectionKey];
    if (!Array.isArray(list)) {
      throw new ApiError(501, `Deletion is not supported for ${collection}`);
    }
    const index = list.findIndex((doc) => doc._id === id || doc.id === id);
    if (index === -1) throw new ApiError(404, `${label} '${id}' not found`);
    list.splice(index, 1);
    persistFallbackStore();
  }

  res.status(200).json({
    success: true,
    message: `${label} '${id}' deleted`,
    data: { id },
  });
});

module.exports = {
  listContent,
  createContent,
  updateContent,
  deleteContent,
  COLLECTIONS: Object.keys(REGISTRY),
};
