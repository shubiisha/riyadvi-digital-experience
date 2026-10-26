import React from 'react';
import { Award, Target, Compass, Users, Sparkles, ShieldCheck, HeartHandshake, Zap, ArrowRight } from 'lucide-react';
import Container from '../../components/common/Container';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';
import InteractiveModel from '../../components/3d/InteractiveModel';

export const AboutPage = () => {
  const values = [
    {
      title: 'Architectural Excellence',
      desc: 'We never cut corners on codebase integrity, security protocols, or scalability standards. Every line of code is structured for enterprise longevity.',
      icon: ShieldCheck,
    },
    {
      title: 'Radical Innovation',
      desc: 'We actively explore the bleeding edge of WebGL, 3D spatial computing, and AI workflow acceleration to give our partners unassailable market moats.',
      icon: Zap,
    },
    {
      title: 'Obsessive Partnership',
      desc: 'We measure our success strictly by our clients’ revenue expansion, user retention, and system reliability—not merely hours billed.',
      icon: HeartHandshake,
    },
    {
      title: 'Human-Centric Precision',
      desc: 'Behind high-performance backends and complex shaders sits human psychology. We craft intuitive tools that empower users effortlessly.',
      icon: Users,
    },
  ];

  const milestones = [
    { year: '2021', title: 'Company Inception', desc: 'Riyadvi Software Technologies incorporated with a focus on full-stack web and mobile engineering.' },
    { year: '2022', title: 'International Expansion', desc: 'Onboarded enterprise clients across Australia, the UAE, and the United States.' },
    { year: '2023', title: '3D Spatial & WebXR Division', desc: 'Pioneered browser-based WebGL product customizers for luxury goods and real estate.' },
    { year: '2024', title: 'AI Acceleration & Telemedicine', desc: 'Scaled mission-critical predictive AI systems and HIPAA-compliant healthcare applications.' },
    { year: '2025+', title: 'Next-Gen Digital Partner', desc: 'Expanding enterprise transformation cohorts and pioneering generative 3D web systems.' },
  ];

  const awards = [
    { title: 'Best Enterprise Web Architecture 2024', issuer: 'Tech Excellence Summit' },
    { title: 'Top 3D Web & Creative Agency Finalist', issuer: 'Global Digital Awards' },
    { title: 'Excellence in CleanTech Innovation (Puratap)', issuer: 'APAC Tech Forum' },
    { title: 'Top Mobile Healthcare Delivery (VisDoc)', issuer: 'HealthTech Innovators' },
  ];

  const team = [
    {
      name: 'Shubham Sharma',
      role: 'Founder & Chief Technology Officer',
      bio: 'Ex-enterprise cloud architect with 10+ years specializing in distributed systems, Three.js, and high-concurrency Node.js microservices.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Arjun Mehta',
      role: 'Head of 3D & Creative Engineering',
      bio: 'WebGL pioneer and procedural shader artist crafting real-time spatial experiences for global luxury brands.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Priya Sundaram',
      role: 'VP of Product & Experience Design',
      bio: 'Leading our Obsidian & Gold design system, cognitive user journey mapping, and conversion rate optimization.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <Container size="wide">
        <SectionHeading
          badge="About Riyadvi Software Technologies"
          title="Bridging Visionary Strategy &"
          highlight="Bespoke Engineering"
          description="Founded in 2021, Riyadvi Software Technologies has evolved from a boutique engineering team into a premier full-stack and 3D digital solutions partner."
        />

        {/* Story & Interactive 3D Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-24">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">Our Origin Story</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              We Reject Mediocre Templates in Favor of{' '}
              <span className="text-gradient-gold">Digital Masterpieces</span>
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              In 2021, our founders noticed a persistent flaw in the technology consulting industry: design agencies delivered gorgeous prototypes that backend teams couldn't scale, while traditional software vendors produced robust backends wrapped in uninspiring, slow user interfaces.
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              Riyadvi was created to obliterate this division. We fuse cinematic 3D visual storytelling with resilient, event-driven cloud architectures. Today, we partner with industry leaders to transform digital touchpoints into predictable growth engines.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button to="/contact" variant="primary" size="md" icon={ArrowRight}>
                Work With Us
              </Button>
              <Button to="/portfolio" variant="outline" size="md">
                View Proven Results
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <InteractiveModel
              modelType="planetary-orbit"
              title="Riyadvi Dynamic Core"
            />
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="glass-card p-8 md:p-10 rounded-3xl border-gold-500/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To empower visionary enterprises with custom software architectures and immersive 3D digital experiences that maximize customer delight, operational velocity, and sustainable business valuation.
            </p>
          </div>

          <div className="glass-card p-8 md:p-10 rounded-3xl border-gold-500/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To become the global benchmark for 3D spatial computing and high-scale full-stack systems, proving that software can be mathematically resilient, lightning fast, and aesthetically breathtaking.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <SectionHeading
            badge="Guiding Principles"
            title="Our Non-Negotiable"
            highlight="Core Values"
            description="The engineering and ethical standards that govern every sprint, architectural decision, and client relationship."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="glass-card p-6 rounded-2xl border-slate-800 glass-card-hover space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{v.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border-gold-500/20 mb-24">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold-400" />
            Company Milestones Since 2021
          </h3>

          <div className="space-y-6">
            {milestones.map((m, idx) => (
              <div key={m.year} className="flex flex-col sm:flex-row gap-4 sm:gap-8 pb-6 border-b border-slate-800/80 last:border-0 last:pb-0">
                <span className="text-2xl font-black text-gradient-gold font-mono shrink-0 w-24">
                  {m.year}
                </span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">{m.title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-24">
          <SectionHeading
            badge="Industry Recognition"
            title="Honors &"
            highlight="Awards"
            description="Accolades celebrating our relentless focus on design excellence and technical execution."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl border-gold-500/15 space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-400 mx-auto flex items-center justify-center border border-gold-500/25">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{award.title}</h4>
                <p className="text-xs text-gold-400 font-mono">{award.issuer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-20">
          <SectionHeading
            badge="Executive Leadership"
            title="The Minds Behind"
            highlight="Riyadvi"
            description="Engineers, creative technologists, and digital transformation strategists leading our disciplines."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden border-slate-800 glass-card-hover">
                <div className="h-64 overflow-hidden bg-obsidian-950">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="p-6 space-y-2">
                  <h4 className="text-lg font-bold text-white">{member.name}</h4>
                  <p className="text-xs font-mono text-gold-400">{member.role}</p>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="glass-card p-10 rounded-3xl border-gold-500/30 text-center max-w-4xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Let's Build Something Exceptional</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Ready to partner with a team that treats your digital infrastructure with the seriousness it deserves?
          </p>
          <Button to="/contact" variant="primary" size="lg" icon={ArrowRight}>
            Connect With Our Leadership
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
