import React, { useState } from 'react';
import { Award, ShieldCheck, HeartHandshake, Zap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Container from '../../../components/common/Container';
import SectionHeading from '../../../components/common/SectionHeading';
import Button from '../../../components/common/Button';

export const WhyRiyadviSection = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(3);

  const milestones = [
    {
      year: '2021',
      title: 'Foundation & Core Vision',
      desc: 'Founded with the mission to eliminate the gap between superficial agency design and robust full-stack enterprise architecture.',
    },
    {
      year: '2022',
      title: 'Global Client Expansion',
      desc: 'Delivered mission-critical platforms for international clients including Puratap Australia and specialized e-commerce brands.',
    },
    {
      year: '2023',
      title: 'Immersive 3D & WebXR Lab',
      desc: 'Established our in-house 3D studio integrating Three.js, React Three Fiber, and WebGL photorealism for luxury brands.',
    },
    {
      year: '2024',
      title: 'AI Engineering & Scale',
      desc: 'Pioneered custom AI prediction pipelines (Laxmi Astro AI) and enterprise document intelligence suites (VisDoc).',
    },
    {
      year: '2025+',
      title: 'Spatial Web & Enterprise Growth Partner',
      desc: 'Positioned as an end-to-end technology partner for high-scale digital transformations and spatial web experiences.',
    },
  ];

  const pillars = [
    {
      icon: Award,
      title: 'True Partnership Mindset',
      desc: 'We do not operate as disposable code contractors. We immerse ourselves in your unit economics, customer acquisition loops, and long-term valuation.',
    },
    {
      icon: Zap,
      title: 'Hyper-Optimized Performance',
      desc: 'Sub-second Core Web Vitals, 60 FPS hardware-accelerated 3D rendering, and resilient microservices designed to scale seamlessly under surge loads.',
    },
    {
      icon: ShieldCheck,
      title: 'Architectural Rigor',
      desc: 'Zero-downtime CI/CD deployment pipelines, automated security validation, and clean documented codebases that your team can confidently own.',
    },
    {
      icon: HeartHandshake,
      title: 'Transparent Collaboration',
      desc: 'Bi-weekly sprint demos, direct Slack/Discord architecture channels, and transparent Jira progress tracking with zero surprise billing.',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black via-obsidian-900 to-black relative overflow-hidden">
      <Container size="wide">
        <SectionHeading
          badge="Why Visionary Companies Choose Us"
          title="A Technology & Solutions Partner –"
          highlight="Not Just A Vendor"
          description="Since 2021, Riyadvi has combined elite engineering, 3D spatial innovation, and rigorous business strategy to build lasting enterprise equity."
        />

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="glass-card p-6 sm:p-8 rounded-3xl border-gold-500/15 glass-card-hover space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">{p.title}</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Interactive Company Timeline: Since 2021 */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border-gold-500/25 mb-20 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-gold-400">Company Trajectory</span>
              <h3 className="text-2xl font-bold text-white mt-1">Our Journey Since 2021</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Click year to explore milestone</span>
          </div>

          {/* Timeline Bar */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-8">
            {milestones.map((m, idx) => {
              const isActive = idx === selectedMilestone;
              return (
                <button
                  key={m.year}
                  type="button"
                  onClick={() => setSelectedMilestone(idx)}
                  className={`py-3 px-2 sm:px-4 rounded-xl text-center border transition-all ${
                    isActive
                      ? 'border-gold-400 bg-gold-500/20 text-gold-300 shadow-gold-sm'
                      : 'border-slate-800 bg-black/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-base sm:text-xl font-black">{m.year}</p>
                  <p className="text-[10px] hidden sm:block truncate mt-0.5">{m.title}</p>
                </button>
              );
            })}
          </div>

          {/* Active Milestone Card */}
          <div className="p-6 rounded-2xl bg-obsidian-850 border border-slate-800 animate-fadeIn">
            <span className="text-xs font-mono text-gold-400">{milestones[selectedMilestone].year} Milestone</span>
            <h4 className="text-xl font-bold text-white mt-1 mb-2">
              {milestones[selectedMilestone].title}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {milestones[selectedMilestone].desc}
            </p>
          </div>
        </div>

        {/* Business Health Checkup Callout */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border-gold-500/40 bg-gradient-to-r from-obsidian-900 via-black to-obsidian-900 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Proprietary Growth Diagnostic
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Evaluate Your Technical Readiness With Our{' '}
                <span className="text-gradient-gold">Business Health Checkup</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Take our 6-step interactive assessment to evaluate your digital footprint, technology debt, and conversion opportunities. Instant report generated and stored in our database.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button to="/business-health-checkup" variant="primary" size="lg" icon={ArrowRight}>
                Start Free Health Checkup
              </Button>
              <Button to="/software-project-planning-guide" variant="secondary" size="md">
                Download Planning Guide
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyRiyadviSection;
