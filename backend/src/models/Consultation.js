const { createModelWrapper } = require('./_store');

const schema = {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  preferredDate: { type: String },
  preferredTime: { type: String },
  serviceInterested: { type: String, default: 'General Consultation' },
  budgetRange: { type: String },
  projectOverview: { type: String },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'Pending'], default: 'Pending' },
};

module.exports = createModelWrapper('Consultation', schema);
