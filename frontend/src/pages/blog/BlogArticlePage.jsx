import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag, Share2, BookOpen } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getBlogPostBySlug } from '../../lib/api';

export const BlogArticlePage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogPostBySlug(slug).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner label="Loading Article..." />
      </div>
    );
  }

  if (!data || !data.post) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-black text-center">
        <Container>
          <h2 className="text-3xl font-bold text-white mb-4">Article Not Found</h2>
          <p className="text-slate-400 mb-6">The requested publication could not be found.</p>
          <Button to="/blog" variant="primary">
            Back to Tech Journal
          </Button>
        </Container>
      </div>
    );
  }

  const { post, related } = data;

  return (
    <div className="pt-28 pb-24 bg-black min-h-screen">
      <Container size="narrow">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tech Journal</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-gold-500" />
              {post.readTime}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-gold-500" />
              {post.publishedAt}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>

          {/* Author Byline */}
          <div className="flex items-center gap-3 pt-2 pb-6 border-b border-slate-900">
            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover border border-gold-500/30" />
            <div>
              <p className="text-sm font-bold text-white">{post.author.name}</p>
              <p className="text-xs text-slate-400 font-mono">{post.author.role}</p>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="rounded-3xl overflow-hidden glass-card border-slate-800 mb-12 h-72 sm:h-96">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert prose-gold max-w-none text-slate-300 space-y-6 text-base leading-relaxed mb-16">
          <p className="text-lg font-medium text-slate-200 border-l-2 border-gold-500 pl-4 italic">
            {post.excerpt}
          </p>

          <div className="whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-900 flex flex-wrap gap-2 items-center mb-16">
            <Tag className="w-4 h-4 text-gold-400" />
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-obsidian-850 border border-slate-800 text-slate-300 font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {related && related.length > 0 && (
          <div className="pt-12 border-t border-slate-800 space-y-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold-400" />
              Related Publications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/blog/${rel.slug}`}
                  className="glass-card p-6 rounded-2xl border-slate-800 glass-card-hover group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gold-400 uppercase">{rel.category}</span>
                    <h4 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
                    <span>{rel.readTime}</span>
                    <span className="text-gold-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogArticlePage;
