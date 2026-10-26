const { createModelWrapper } = require('./_store');

const schema = {
  // Step 1: Business Information
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  industry: { type: String },
  companySize: { type: String },

  // Step 2: Website & Digital Presence
  hasWebsite: { type: String },
  websiteUrl: { type: String },
  websiteAge: { type: String },
  isMobileFriendly: { type: String },

  // Step 3: Marketing & Sales
  currentMarketingChannels: [{ type: String }],
  monthlyAdSpend: { type: String },
  monthlyVisitors: { type: String },

  // Step 4: Technology & Infrastructure
  techStack: [{ type: String }],
  cloudHosting: { type: String },
  usesCrm: { type: String },

  // Step 5: Challenges & Goals
  biggestPainPoint: { type: String },
  growthTarget: { type: String },
  timeline: { type: String },

  // Computed Analysis
  digitalReadinessScore: { type: Number, default: 75 },
  readinessLevel: { type: String, default: 'Scaling Accelerator' },
  recommendedServices: [{ type: String }],
  status: { type: String, enum: ['New', 'Reviewed', 'Audit Sent', 'Closed'], default: 'New' },
};

module.exports = createModelWrapper('HealthCheckup', schema);
