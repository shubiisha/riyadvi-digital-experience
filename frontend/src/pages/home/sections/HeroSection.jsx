import React from 'react';
import { ArrowRight, Sparkles, Shield, Cpu, Flame } from 'lucide-react';
import Button from '../../../components/common/Button';
import Container from '../../../components/common/Container';
import DigitalEcosystem from '../../../components/3d/DigitalEcosystem';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-glow pointer-events-none opacity-50 blur-3xl" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 pointer-events-none rounded-full blur-3xl" />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
              <span>Technology & Digital Solutions Partner</span>
            </div>

            {/* Headline as mandated by Assignment */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Custom Software &amp;{' '}
              <span className="text-gradient-gold block mt-1">
                Digital Solutions
              </span>{' '}
              to Grow Your Business
            </h1>

            {/* Supporting Text as mandated by Assignment */}
            <p className="text-slate-300 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
              Web &amp; App Development, UI/UX Design, and Business Strategy – all tailored to your needs.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                to="/contact"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                className="shadow-gold-md"
              >
                Book a Free Consultation
              </Button>

              <Button
                to="/services"
                variant="outline"
                size="lg"
              >
                Explore Our Solutions
              </Button>
            </div>

            {/* Quick Proof Badges */}
            <div className="pt-6 border-t border-slate-900/80 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="text-2xl font-black text-white flex items-center gap-1">
                  2021<span className="text-gold-400 text-lg font-normal">+</span>
                </p>
                <p className="text-xs text-slate-400 font-medium">Pioneering Solutions</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white flex items-center gap-1">
                  100<span className="text-gold-400 text-lg font-normal">%</span>
                </p>
                <p className="text-xs text-slate-400 font-medium">Enterprise Delivery</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white flex items-center gap-1">
                  3D<span className="text-gold-400 text-lg font-normal">&amp;AI</span>
                </p>
                <p className="text-xs text-slate-400 font-medium">Next-Gen Stack</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Hero Experience */}
          <div className="lg:col-span-5 relative w-full h-full flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[540px] flex items-center justify-center">
              <DigitalEcosystem />

              {/* Floating Cyber Badge */}
              <div className="absolute bottom-4 right-2 sm:right-6 glass-card px-4 py-2.5 rounded-2xl border-gold-500/30 flex items-center gap-3 backdrop-blur-xl shadow-gold-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-left text-xs">
                  <p className="font-semibold text-white">Real-Time WebGL 3D</p>
                  <p className="text-slate-400 text-[10px]">React Three Fiber &amp; Three.js</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
