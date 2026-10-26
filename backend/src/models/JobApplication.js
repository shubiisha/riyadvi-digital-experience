const { createModelWrapper } = require('./_store');

const schema = {
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  experienceYears: { type: String },
  portfolioUrl: { type: String },
  resumeUrl: { type: String },
  coverLetter: { type: String },
  status: { type: String, enum: ['Applied', 'Reviewing', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'], default: 'Applied' },
};

module.exports = createModelWrapper('JobApplication', schema);
