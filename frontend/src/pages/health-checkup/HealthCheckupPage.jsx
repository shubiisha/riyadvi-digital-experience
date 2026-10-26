import React from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, Award, ArrowDown } from 'lucide-react';
import Container from '../../components/common/Container';
import SectionHeading from '../../components/common/SectionHeading';
import HealthCheckupForm from '../../components/forms/HealthCheckupForm';

export const HealthCheckupPage = () => {
  return (
    <div className="pt-32 pb-24 bg-black min-h-screen relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gold-glow opacity-35 blur-3xl pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Proprietary Enterprise Assessment
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Is Your Business Ready for Its Next{' '}
            <span className="text-gradient-gold">Digital Growth Stage?</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Complete our 6-step diagnostic audit to uncover hidden technical bottlenecks, optimize conversion velocity, and receive a tailored architectural roadmap.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Free &amp; Confidential
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Takes Only 2 Minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Instant Score &amp; Recommendations
            </span>
          </div>
        </div>

        {/* 6-Step Multi-Stage Form */}
        <HealthCheckupForm />
      </Container>
    </div>
  );
};

export default HealthCheckupPage;
