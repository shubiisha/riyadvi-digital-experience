import React from 'react';
import { BookOpen, CheckCircle2, Download, ShieldCheck, FileText, Sparkles, Star } from 'lucide-react';
import Container from '../../components/common/Container';
import SectionHeading from '../../components/common/SectionHeading';
import LeadMagnetForm from '../../components/forms/LeadMagnetForm';

export const ProjectGuidePage = () => {
  const chapters = [
    { num: '01', title: 'Technical Feasibility & Scope Definition', desc: 'How to avoid scope creep and define verifiable engineering milestones.' },
    { num: '02', title: 'Modern Tech Stack Evaluation (2025 Matrix)', desc: 'Direct comparison: React vs Next.js vs Monoliths, Node.js microservices, and DB partitioning.' },
    { num: '03', title: 'Interactive 3D & WebGL Integration Guide', desc: 'When to adopt Three.js / React Three Fiber without sacrificing mobile performance.' },
    { num: '04', title: 'Cost & Budget Estimation Framework', desc: 'Real-world budget models for startups vs mid-market scaleups vs enterprises.' },
    { num: '05', title: 'Vetting Software Partners & Avoiding Traps', desc: 'Critical technical questions to ask prospective agencies before signing.' },
    { num: '06', title: 'CI/CD, Cloud Hosting & Security Protocols', desc: 'Zero-downtime deployment pipelines, edge CDN caching, and role-based access control.' },
  ];

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gold-glow opacity-30 blur-3xl pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Column: Guide Overview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Resource • 2025 Edition
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Download the{' '}
              <span className="text-gradient-gold">Software Project Planning Guide</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              A comprehensive 48-page executive blueprint crafted by the senior architects at Riyadvi Software Technologies to help CTOs, Founders, and Product Leaders architect, estimate, and launch high-impact digital solutions.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="glass-card p-4 rounded-2xl border-slate-800 space-y-1">
                <p className="text-2xl font-black text-gradient-gold">48 Pages</p>
                <p className="text-xs text-slate-400">Actionable Architecture Checklists</p>
              </div>
              <div className="glass-card p-4 rounded-2xl border-slate-800 space-y-1">
                <p className="text-2xl font-black text-gradient-gold">5.0 ★★★★★</p>
                <p className="text-xs text-slate-400">Rated by 200+ Tech Leaders</p>
              </div>
            </div>

            {/* Guide Highlights */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs uppercase font-mono tracking-wider text-slate-400">Inside the Guide:</p>
              {[
                'Step-by-step RFP and software architecture blueprint templates',
                'Performance benchmarks for React 18, Node.js, and WebGL rendering',
                'Budget estimation worksheets and timeline risk mitigation matrices',
              ].map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Lead Capture Form */}
          <div className="lg:col-span-5">
            <LeadMagnetForm />
          </div>
        </div>

        {/* Table of Contents Section */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border-slate-800 mt-16">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">Syllabus Overview</span>
            <h3 className="text-2xl font-bold text-white mt-1">What You Will Learn Across 6 Core Chapters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((ch) => (
              <div key={ch.num} className="p-6 rounded-2xl bg-obsidian-850 border border-slate-800/80 space-y-2">
                <span className="font-mono text-xs font-bold text-gold-400">CHAPTER {ch.num}</span>
                <h4 className="text-base font-bold text-white leading-snug">{ch.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{ch.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProjectGuidePage;
