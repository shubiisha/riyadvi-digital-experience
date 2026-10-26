import React, { useState } from 'react';
import { Target, Compass, Palette, Code2, Rocket, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import Container from '../../../components/common/Container';
import SectionHeading from '../../../components/common/SectionHeading';
import Button from '../../../components/common/Button';

export const TransformationSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'challenge',
      number: '01',
      title: 'Business Challenge',
      icon: Target,
      tagline: 'Deconstructing Bottlenecks & Identifying Growth Arbitrage',
      description: 'We begin with an exhaustive diagnostic of your legacy workflows, user drop-off points, and market competition. We quantify what technical or operational frictions are preventing exponential growth.',
      deliverables: ['Technical Debt Audit', 'User Friction Heatmaps', 'Market Opportunity Matrix', 'ROI Feasibility Blueprint'],
    },
    {
      id: 'strategy',
      number: '02',
      title: 'Strategy & Architecture',
      icon: Compass,
      tagline: 'Precision Blueprints Built for Scale & Longevity',
      description: 'Our senior solutions architects formulate a multi-tier roadmap. We determine cloud topology, database schema partitioning, API contracts, and technology stack selection aligned with business milestones.',
      deliverables: ['System Architecture Diagram', 'Security & Compliance Blueprint', 'Sprint Milestones & Gantt', 'Cost-to-Scale Forecast'],
    },
    {
      id: 'design',
      number: '03',
      title: 'Luxury UX / UI & 3D Spatial Design',
      icon: Palette,
      tagline: 'Emotional Engagement Meets Conversion Science',
      description: 'Design is not cosmetic decoration; it is conversion velocity. We craft intuitive spatial wireframes, design tokens, and interactive 3D assets that distinguish your brand as an undisputed industry leader.',
      deliverables: ['Interactive Figma High-Fidelity Prototype', 'Design System & Component Specs', '3D Asset Retopology & Shaders', 'WCAG AAA Accessibility Audit'],
    },
    {
      id: 'technology',
      number: '04',
      title: 'Full-Stack Engineering & AI Acceleration',
      icon: Code2,
      tagline: '60 FPS Frontends Powered by Bulletproof Backends',
      description: 'Leveraging modern React, Node.js, WebGL, and microservices architectures, our developers build clean, modular, and fully tested codebases. We integrate AI pipelines to automate mundane operational loops.',
      deliverables: ['Modular React / Vite Frontends', 'REST & GraphQL Cloud Microservices', 'Three.js / WebGL 3D Engines', 'Automated Test Coverage Suites'],
    },
    {
      id: 'launch',
      number: '05',
      title: 'Zero-Downtime Launch & Telemetry',
      icon: Rocket,
      tagline: 'Battle-Tested Deployment with Continuous Edge Telemetry',
      description: 'We orchestrate zero-downtime CI/CD container deployments to edge CDNs with comprehensive synthetic load testing, automated database migrations, and real-time error telemetry.',
      deliverables: ['Automated CI/CD Pipeline', 'Synthetic 100K User Concurrency Test', 'Edge CDN Optimization', 'Instant Rollback Failsafes'],
    },
    {
      id: 'growth',
      number: '06',
      title: 'Compounding Growth & Continuous Optimization',
      icon: TrendingUp,
      tagline: 'Evolving Your Digital Asset into an Unstoppable Growth Machine',
      description: 'Launch is day one. We analyze behavioral funnels, run multi-variant conversion rate optimization (CRO) tests, and execute performance marketing campaigns to turn visitors into lifetime brand advocates.',
      deliverables: ['Cohort Retention Dashboards', 'Continuous A/B Experimentation', 'Organic SEO Domination Strategy', 'Quarterly Scale Upgrades'],
    },
  ];

  const current = steps[activeStep];
  const IconComponent = current.icon;

  return (
    <section className="py-24 bg-gradient-to-b from-black via-obsidian-900 to-black relative overflow-hidden">
      <Container size="wide">
        <SectionHeading
          badge="End-to-End Methodology"
          title="The Digital"
          highlight="Transformation Journey"
          description="How Riyadvi Software Technologies guides visionary enterprises from core business friction to market-dominating digital scale."
        />

        {/* Step Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {steps.map((step, idx) => {
            const isCurrent = idx === activeStep;
            const StepIcon = step.icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                  isCurrent
                    ? 'border-gold-400 bg-gold-500/15 shadow-gold-sm'
                    : 'border-slate-800 bg-obsidian-850/80 hover:border-gold-500/30'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-xs font-bold ${isCurrent ? 'text-gold-400' : 'text-slate-500'}`}>
                    {step.number}
                  </span>
                  <StepIcon className={`w-4 h-4 ${isCurrent ? 'text-gold-400' : 'text-slate-500 group-hover:text-gold-400 transition-colors'}`} />
                </div>
                <h4 className={`text-xs font-bold leading-snug line-clamp-1 ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Card */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border-gold-500/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left detail */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono">
                STAGE {current.number} OF 06
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
                  <IconComponent className="w-5 h-5" />
                </span>
                {current.title}
              </h3>

              <p className="text-gold-300 text-sm font-medium">
                {current.tagline}
              </p>

              <p className="text-slate-300 text-base leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2">
                <Button to="/business-health-checkup" variant="primary" size="sm" icon={ArrowRight}>
                  Audit This Stage For Your Company
                </Button>
              </div>
            </div>

            {/* Right deliverables box */}
            <div className="lg:col-span-5 bg-obsidian-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400" />
                Key Riyadvi Deliverables:
              </p>

              <div className="space-y-3">
                {current.deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/50 border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TransformationSection;
