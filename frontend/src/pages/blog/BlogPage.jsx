import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight, Tag, BookOpen } from 'lucide-react';
import Container from '../../components/common/Container';
import SectionHeading from '../../components/common/SectionHeading';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getBlogPosts } from '../../lib/api';

export const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Technology & 3D', 'Backend & Cloud', 'Business Strategy'];

  useEffect(() => {
    setLoading(true);
    getBlogPosts({ search, category }).then((data) => {
      setPosts(data || []);
      setLoading(false);
    });
  }, [search, category]);

  const featured = posts.find((p) => p.featured) || posts[0];
  const regularPosts = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <Container size="wide">
        <SectionHeading
          badge="Engineering Insights & Strategy"
          title="The Riyadvi"
          highlight="Tech Journal"
          description="In-depth analysis, architectural teardowns, 3D web insights, and enterprise growth strategies from our engineering team."
        />

        {/* Search and Category Filter Bar */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl border-slate-800 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  category === cat
                    ? 'border-gold-500 bg-gold-500 text-black font-semibold'
                    : 'border-slate-800 bg-black/40 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles & tech..."
              className="w-full px-4 py-2 pl-9 rounded-xl bg-black/60 border border-slate-800 text-white placeholder-slate-500 text-xs focus:border-gold-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading Publications..." />
        ) : (
          <div className="space-y-12">
            {/* Featured Article Card */}
            {featured && category === 'All' && !search && (
              <div className="glass-card rounded-3xl overflow-hidden border-gold-500/30 glass-card-hover group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                  <div className="lg:col-span-7 h-72 lg:h-[400px] overflow-hidden relative bg-obsidian-950">
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold-500 text-black text-[10px] font-bold uppercase tracking-wider shadow-gold-sm">
                      Featured Publication
                    </span>
                  </div>

                  <div className="lg:col-span-5 p-8 lg:p-12 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="text-gold-400">{featured.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featured.readTime}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-gold-300 transition-colors leading-tight">
                      <Link to={`/blog/${featured.slug}`}>
                        {featured.title}
                      </Link>
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={featured.author.avatar} alt={featured.author.name} className="w-7 h-7 rounded-full object-cover border border-gold-500/30" />
                        <span className="text-xs text-slate-300 font-medium">{featured.author.name}</span>
                      </div>

                      <Link
                        to={`/blog/${featured.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-white transition-colors"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(category === 'All' && !search ? regularPosts : posts).map((post) => (
                <div
                  key={post.slug}
                  className="glass-card rounded-2xl overflow-hidden border-slate-800 glass-card-hover flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative bg-obsidian-950">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                      <span className="absolute bottom-3 left-4 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 border border-slate-800 text-gold-400">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <Clock className="w-3 h-3 text-gold-500" />
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.publishedAt}</span>
                      </div>

                      <h4 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors leading-snug">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h4>

                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-900 mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{post.author.name}</span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gold-400 hover:text-white transition-colors"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="glass-card p-12 text-center rounded-2xl border-slate-800 space-y-3">
                <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-lg font-bold text-white">No Articles Match Your Search</h4>
                <p className="text-xs text-slate-400">Try modifying your query or selecting another category.</p>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogPage;
