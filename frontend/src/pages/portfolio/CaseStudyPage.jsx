import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, Cpu, Sparkles, Quote } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InteractiveModel from '../../components/3d/InteractiveModel';
import { getProjectBySlug, getServices } from '../../lib/api';

export const CaseStudyPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getProjectBySlug(slug), getServices()]).then(([projData, svcData]) => {
      setProject(projData);
      setAllServices(svcData);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner label="Loading Case Study Architecture..." />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-black text-center">
        <Container>
          <h2 className="text-3xl font-bold text-white mb-4">Case Study Not Found</h2>
          <p className="text-slate-400 mb-6">The requested case study could not be located in our records.</p>
          <Button to="/portfolio" variant="primary">
            Return to Portfolio
          </Button>
        </Container>
      </div>
    );
  }

  const relatedServices = allServices.filter((s) => project.relatedServices?.includes(s.slug));

  return (
    <div className="pt-28 pb-24 bg-black min-h-screen">
      <Container size="wide">
        {/* Back Link */}
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Case Studies</span>
        </Link>

        {/* Case Study Hero */}
        <div className="space-y-6 mb-16">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
              {project.industry}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Client: <strong className="text-white font-medium">{project.client}</strong>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed">
            {project.summary}
          </p>

          {/* Results Metric Callouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {project.results?.map((res, i) => (
              <div key={i} className="glass-card p-5 rounded-2xl border-gold-500/20 text-center">
                <p className="text-3xl font-black text-gradient-gold">{res.metric}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{res.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Interactive Model Showcase or Hero Image */}
        <div className="mb-20">
          {project.featured3d ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  Interactive 3D Digital Twin Representation
                </span>
                <span className="text-xs text-slate-400 font-mono">Real-time WebGL Engine</span>
              </div>
              <InteractiveModel
                modelType={project.modelType || 'geometric-nodes'}
                title={`${project.title} 3D Asset`}
              />
            </div>
          ) : (
            <div className="h-[440px] md:h-[520px] rounded-3xl overflow-hidden glass-card relative border-gold-500/20">
              <img
                src={project.visuals[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>
          )}
        </div>

        {/* Challenge vs Solution Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card p-8 rounded-3xl border-red-500/20 bg-red-950/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">The Engineering Challenge</h3>
            </div>
            <p className="text-slate-300 text-base leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border-emerald-500/20 bg-emerald-950/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">The Riyadvi Technical Solution</h3>
            </div>
            <p className="text-slate-300 text-base leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Technologies Implemented & Client Testimonial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
          {/* Tech Stack */}
          <div className="lg:col-span-6 glass-card p-8 rounded-3xl border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-gold-400" />
                Technologies &amp; Architecture Implemented
              </h4>
              <p className="text-slate-400 text-xs mb-6">
                Modular full-stack technologies utilized to guarantee 99.98% uptime and rapid conversion.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {project.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-2 rounded-xl bg-black/80 border border-gold-500/20 text-xs font-mono text-gold-300 font-semibold shadow-gold-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-xs text-slate-400">
              Validated on production edge clusters with automated synthetic testing.
            </div>
          </div>

          {/* Testimonial Quote */}
          {project.testimonial && (
            <div className="lg:col-span-6 glass-card p-8 rounded-3xl border-gold-500/30 bg-gradient-to-br from-obsidian-900 to-black space-y-4 flex flex-col justify-between">
              <Quote className="w-10 h-10 text-gold-500/40" />
              <p className="text-slate-200 text-base sm:text-lg italic leading-relaxed">
                "{project.testimonial.quote}"
              </p>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-sm font-bold text-white">{project.testimonial.author}</p>
                <p className="text-xs text-gold-400 font-mono">{project.testimonial.designation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mb-20">
            <h3 className="text-xl font-bold text-white mb-6">Related Disciplines Used in this Project</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedServices.map((svc) => (
                <Link
                  key={svc.slug}
                  to={`/services/${svc.slug}`}
                  className="glass-card p-6 rounded-2xl border-slate-800 glass-card-hover group"
                >
                  <h4 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors mb-1">
                    {svc.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{svc.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="glass-card p-10 md:p-12 rounded-3xl border-gold-500/40 text-center space-y-5 max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
            Ready for Similar Results in Your Business?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Let our senior architects analyze your requirements and build a production roadmap tailored to your growth goals.
          </p>
          <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>
            Book a Free Consultation
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default CaseStudyPage;
