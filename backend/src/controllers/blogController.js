const BlogPost = require('../models/BlogPost');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getBlogPosts = asyncHandler(async (req, res) => {
  const { category, search, tag } = req.query;
  let posts = await BlogPost.find();

  if (category && category !== 'All') {
    posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (tag) {
    posts = posts.filter((p) => Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.content && p.content.toLowerCase().includes(q))
    );
  }

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const post = await BlogPost.findOne({ slug });

  if (!post) {
    throw new ApiError(404, `Blog post with slug '${slug}' not found`);
  }

  // Related posts
  const allPosts = await BlogPost.find();
  const related = allPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);

  res.status(200).json({
    success: true,
    data: {
      post,
      related,
    },
  });
});

module.exports = {
  getBlogPosts,
  getBlogPostBySlug,
};
