const { createModelWrapper } = require('./_store');

const schema = {
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  keyFeatures: [{ type: String }],
  industryUseCases: [{ type: String }],
  technologyStack: [{ type: String }],
  process: [
    {
      step: Number,
      name: String,
      desc: String,
    },
  ],
  relatedPortfolioSlugs: [{ type: String }],
};

module.exports = createModelWrapper('Service', schema);
