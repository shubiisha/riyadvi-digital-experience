const { createModelWrapper } = require('./_store');

const schema = {
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  client: { type: String, required: true },
  industry: { type: String, required: true },
  summary: { type: String, required: true },
  challenge: { type: String, required: true },
  solution: { type: String, required: true },
  technologies: [{ type: String }],
  results: [{ metric: String, label: String }],
  visuals: [{ type: String }],
  featured3d: { type: Boolean, default: false },
  modelType: { type: String, default: 'geometric-nodes' },
  relatedServices: [{ type: String }],
  testimonial: {
    quote: String,
    author: String,
    designation: String,
  },
};

module.exports = createModelWrapper('Project', schema);
