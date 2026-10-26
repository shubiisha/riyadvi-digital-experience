import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';
import Container from '../../components/common/Container';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getProjects } from '../../lib/api';

export const PortfolioPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', 'CleanTech', 'Luxury Fragrance', 'AI & Astrology', 'Healthcare', 'Real Estate', 'Wellness'];

  const filteredProjects = projects.filter((p) => {
    if (filter === 'All') return true;
    return p.industry.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <Container size="wide">
        <SectionHeading
          badge="Selected Works & Case Studies"
          title="Engineered for"
          highlight="Quantifiable Impact"
          description="Explore how Riyadvi re-engineers digital experiences, cloud backends, and 3D web applications for global visionary enterprises."
        />

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                filter === cat
                  ? 'border-gold-500 bg-gold-500 text-black font-semibold shadow-gold-sm'
                  : 'border-slate-800 bg-obsidian-850 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner label="Loading Enterprise Case Studies..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((p) => (
              <div
                key={p.slug}
                className="glass-card rounded-3xl overflow-hidden border-gold-500/15 glass-card-hover flex flex-col justify-between group"
              >
                <div>
                  {/* Visual preview */}
                  <div className="relative h-56 overflow-hidden bg-obsidian-950">
                    <img
                      src={p.visuals[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {p.featured3d && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 border border-gold-500/40 text-[10px] font-mono text-gold-400 flex items-center gap-1 backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-gold-400" />
                        3D View
                      </span>
                    )}

                    <span className="absolute bottom-3 left-4 text-[11px] font-mono uppercase text-gold-400 tracking-wider">
                      {p.industry}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                      {p.title}
                    </h3>

                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {p.summary}
                    </p>

                    {/* Results metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {p.results?.slice(0, 2).map((res, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-black/60 border border-slate-800/80">
                          <p className="text-base font-black text-gradient-gold">{res.metric}</p>
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 truncate">{res.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer link */}
                <div className="p-6 pt-0 border-t border-slate-900/80 mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Client: {p.client.split(' ')[0]}</span>
                  <Link
                    to={`/portfolio/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-white transition-colors"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Box */}
        <div className="mt-20 glass-card p-10 rounded-3xl border-gold-500/30 text-center max-w-4xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Have a Project Requiring Elite Execution?</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Review your challenge with our engineers and receive a formal architectural estimation.
          </p>
          <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>
            Initiate Project Scoping
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default PortfolioPage;
