const { createModelWrapper } = require('./_store');

const schema = {
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    name: { type: String, default: 'Riyadvi Editorial Team' },
    role: { type: String, default: 'Technology Strategist' },
    avatar: { type: String },
  },
  category: { type: String, required: true },
  tags: [{ type: String }],
  readTime: { type: String, default: '5 min read' },
  publishedAt: { type: String },
  featured: { type: Boolean, default: false },
  coverImage: { type: String },
};

module.exports = createModelWrapper('BlogPost', schema);
