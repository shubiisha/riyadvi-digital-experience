import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import Container from '../../../components/common/Container';
import SectionHeading from '../../../components/common/SectionHeading';
import Button from '../../../components/common/Button';
import { projectsData } from '../../../data/projects';

export const PortfolioSection = () => {
  const featured = projectsData.slice(0, 4);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <Container size="wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <SectionHeading
            badge="Selected Case Studies"
            title="Measurable Impact,"
            highlight="Proven Milestones"
            description="Explore how Riyadvi re-engineers digital platforms for global enterprises, consumer brands, and venture-backed innovators."
            align="left"
            className="mb-0"
          />

          <Button to="/portfolio" variant="outline" size="md" icon={ArrowRight}>
            View All 10 Case Studies
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((p) => (
            <div
              key={p.slug}
              className="glass-card rounded-3xl overflow-hidden border-gold-500/15 glass-card-hover flex flex-col justify-between group"
            >
              {/* Visual preview */}
              <div className="relative h-64 overflow-hidden bg-obsidian-950">
                <img
                  src={p.visuals[0]}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* 3D badge if featured */}
                {p.featured3d && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 border border-gold-500/40 text-[10px] font-mono text-gold-400 flex items-center gap-1.5 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-gold-400" />
                    Interactive 3D Available
                  </div>
                )}

                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
                    {p.industry}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-gold-300 transition-colors">
                    {p.title}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-grow flex flex-col justify-between">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {p.summary}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-900">
                  {p.results.slice(0, 2).map((res, i) => (
                    <div key={i} className="p-3 rounded-xl bg-obsidian-900/90 border border-slate-800">
                      <p className="text-xl font-black text-gradient-gold">{res.metric}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{res.label}</p>
                    </div>
                  ))}
                </div>

                {/* Action Link */}
                <div className="pt-4 border-t border-slate-900/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {p.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-black/80 border border-slate-800 text-slate-400 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/portfolio/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-white transition-colors"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PortfolioSection;
