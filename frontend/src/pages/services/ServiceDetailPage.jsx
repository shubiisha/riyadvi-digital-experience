import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, Cpu, Briefcase, Sparkles, Layers } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InteractiveModel from '../../components/3d/InteractiveModel';
import { getServiceBySlug, getProjects } from '../../lib/api';

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getServiceBySlug(slug), getProjects()]).then(([svcData, projData]) => {
      setService(svcData);
      setAllProjects(projData);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner label="Loading Service Architecture..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-black text-center">
        <Container>
          <h2 className="text-3xl font-bold text-white mb-4">Service Not Found</h2>
          <p className="text-slate-400 mb-6">The requested service discipline could not be located.</p>
          <Button to="/services" variant="primary">
            Return to All Services
          </Button>
        </Container>
      </div>
    );
  }

  const relatedProjects = allProjects.filter((p) =>
    service.relatedPortfolioSlugs?.includes(p.slug) || (p.relatedServices && p.relatedServices.includes(service.slug))
  );

  return (
    <div className="pt-28 pb-24 bg-black min-h-screen">
      <Container size="wide">
        {/* Back Link */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </Link>

        {/* Interactive Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Specialized Engineering Discipline
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {service.title}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>
                Get a Quote for this Service
              </Button>
              <Button to="/business-health-checkup" variant="outline" size="lg">
                Run Diagnostic Audit
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <InteractiveModel
              modelType="geometric-nodes"
              title={`${service.title} 3D Visualizer`}
            />
          </div>
        </div>

        {/* Problem vs Solution Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Problem */}
          <div className="glass-card p-8 rounded-3xl border-red-500/20 bg-red-950/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">The Business Challenge</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {service.problem}
            </p>
          </div>

          {/* Solution */}
          <div className="glass-card p-8 rounded-3xl border-emerald-500/20 bg-emerald-950/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">The Riyadvi Engineering Solution</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {service.solution}
            </p>
          </div>
        </div>

        {/* Key Features & Industry Use Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Key Features */}
          <div className="lg:col-span-7 glass-card p-8 rounded-3xl border-gold-500/20 space-y-5">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              Architectural Capabilities &amp; Key Features
            </h3>
            <div className="space-y-3">
              {service.keyFeatures?.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Use Cases & Tech Stack */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-800 space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gold-400" />
                Industry Applications
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.industryUseCases?.map((u, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-obsidian-850 border border-gold-500/20 text-xs text-slate-300 font-medium">
                    {u}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-800 space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-gold-400" />
                Specialized Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.technologyStack?.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-black border border-slate-800 text-xs text-gold-400 font-mono font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Delivery Process */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-mono">Execution Protocol</span>
            <h3 className="text-3xl font-extrabold text-white mt-1">Our Delivery Process</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process?.map((proc) => (
              <div key={proc.step} className="glass-card p-6 rounded-2xl border-slate-800 space-y-3 relative">
                <span className="text-2xl font-black text-gradient-gold">0{proc.step}</span>
                <h4 className="text-base font-bold text-white">{proc.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{proc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Case Studies */}
        {relatedProjects.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400">Proven Results</span>
                <h3 className="text-2xl font-bold text-white mt-1">Related Client Case Studies</h3>
              </div>
              <Button to="/portfolio" variant="outline" size="sm">
                View All Case Studies
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <Link
                  key={p.slug}
                  to={`/portfolio/${p.slug}`}
                  className="glass-card rounded-2xl overflow-hidden border-slate-800 glass-card-hover group flex flex-col justify-between"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img src={p.visuals[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-xs font-mono text-gold-400">{p.industry}</span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA: Get a Quote */}
        <div className="glass-card p-10 md:p-14 rounded-3xl border-gold-500/40 text-center space-y-6 max-w-4xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Build Your <span className="text-gradient-gold">{service.title}</span> Solution?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Partner with Riyadvi to design, engineer, and deploy high-concurrency systems that stand out.
          </p>
          <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>
            Get a Quote
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default ServiceDetailPage;
