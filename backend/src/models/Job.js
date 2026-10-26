const { createModelWrapper } = require('./_store');

const schema = {
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, default: 'Bengaluru, India (Hybrid)' },
  type: { type: String, default: 'Full-time' },
  salaryRange: { type: String },
  overview: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  perks: [{ type: String }],
  isActive: { type: Boolean, default: true },
};

module.exports = createModelWrapper('Job', schema);
