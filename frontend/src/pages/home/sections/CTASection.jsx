import React from 'react';
import { ArrowRight, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';

export const CTASection = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gold-glow opacity-25 blur-3xl pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <div className="glass-card p-10 md:p-16 rounded-3xl border-gold-500/40 text-center max-w-5xl mx-auto space-y-8 relative overflow-hidden">
          {/* Inner ambient glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Ready for Digital Transformation?
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Let's Architect Your{' '}
            <span className="text-gradient-gold">Digital Future</span> Together
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you need a full-scale web ecosystem, a photorealistic 3D interactive experience, or a mobile platform built for millions, Riyadvi is ready to partner with you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              className="shadow-gold-md w-full sm:w-auto"
            >
              Book a Free Consultation
            </Button>

            <Button
              to="/software-project-planning-guide"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Download Project Planning Guide
            </Button>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              Non-Disclosure Agreement (NDA) Protected
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-gold-400" />
              Guaranteed Response Within 24 Hours
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
