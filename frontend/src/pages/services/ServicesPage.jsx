import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Smartphone, TrendingUp, Layers, Box, Layout, ArrowRight, CheckCircle2 } from 'lucide-react';
import Container from '../../components/common/Container';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getServices } from '../../lib/api';

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    Globe,
    Smartphone,
    TrendingUp,
    Layers,
    Box,
    Figma: Layout,
  };

  useEffect(() => {
    getServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <Container size="wide">
        <SectionHeading
          badge="Enterprise Solutions Directory"
          title="Full-Spectrum Digital"
          highlight="Capabilities"
          description="We engineer cutting-edge digital experiences and enterprise architectures that unlock unfair competitive advantages for our partners."
        />

        {loading ? (
          <LoadingSpinner label="Loading Services Architecture..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => {
              const Icon = iconMap[svc.icon] || Globe;
              return (
                <div
                  key={svc.slug}
                  className="glass-card p-8 rounded-3xl border-gold-500/15 glass-card-hover flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all duration-300">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-mono text-gold-400">0{services.indexOf(svc) + 1}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white group-hover:text-gold-300 transition-colors">
                      {svc.title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed">
                      {svc.tagline}
                    </p>

                    <div className="pt-2 border-t border-slate-900 space-y-2">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Key Capabilities:</p>
                      {svc.keyFeatures?.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-900/80 flex items-center justify-between">
                    <Link
                      to={`/services/${svc.slug}`}
                      className="text-xs font-bold text-gold-400 hover:text-white inline-flex items-center gap-1.5 transition-colors group/link"
                    >
                      <span>Explore Service Architecture</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Bar */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl glass-card border-gold-500/30 text-center max-w-4xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Need a Bespoke Technical Architecture?</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Book a complimentary 30-minute scoping session with our lead architects to review your technical requirements.
          </p>
          <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>
            Get a Custom Quote
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default ServicesPage;
