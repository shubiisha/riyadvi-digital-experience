const { createModelWrapper } = require('./_store');

const schema = {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  requirement: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['New', 'In Progress', 'Contacted', 'Closed'], default: 'New' },
  source: { type: String, default: 'Contact Page' },
};

module.exports = createModelWrapper('ContactEnquiry', schema);
