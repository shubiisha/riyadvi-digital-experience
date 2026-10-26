const { createModelWrapper } = require('./_store');

const schema = {
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String },
  resourceName: { type: String, default: 'Software Project Planning Guide 2025' },
  downloadLinkSent: { type: Boolean, default: true },
  status: { type: String, enum: ['Active', 'Nurturing', 'Converted'], default: 'Active' },
};

module.exports = createModelWrapper('LeadMagnet', schema);
