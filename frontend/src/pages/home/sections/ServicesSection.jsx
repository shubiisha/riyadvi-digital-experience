import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Smartphone, TrendingUp, Layers, Box, Layout, ArrowRight, Check } from 'lucide-react';
import Container from '../../../components/common/Container';
import SectionHeading from '../../../components/common/SectionHeading';
import Button from '../../../components/common/Button';
import { servicesData } from '../../../data/services';

export const ServicesSection = () => {
  const iconMap = {
    Globe,
    Smartphone,
    TrendingUp,
    Layers,
    Box,
    Figma: Layout,
  };

  // Visual treatments tailored to each service
  const visualTreatments = {
    'web-development': (
      <div className="w-full h-36 bg-obsidian-950 rounded-xl border border-slate-800 p-2.5 font-mono text-[10px] text-slate-400 overflow-hidden relative group-hover:border-gold-500/40 transition-colors">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800/80 mb-2">
          <span className="w-2 h-2 rounded-full bg-red-500/80" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <span className="w-2 h-2 rounded-full bg-green-500/80" />
          <span className="text-[9px] text-slate-500 ml-2">riyadvi-edge-runtime.jsx</span>
        </div>
        <p className="text-emerald-400">const enterpriseApp = await Riyadvi.deploy({`{`}</p>
        <p className="pl-3 text-slate-300">speed: "0.4s", uptime: 99.99, secure: true</p>
        <p className="text-emerald-400">{`}`});</p>
        <div className="absolute bottom-2 right-2 text-[10px] text-gold-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
          60 FPS Edge Web
        </div>
      </div>
    ),
    'app-development': (
      <div className="w-full h-36 bg-obsidian-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden group-hover:border-gold-500/40 transition-colors">
        {/* Stylized Smartphone Frame */}
        <div className="w-28 h-32 rounded-2xl border-2 border-gold-500/40 bg-black/90 p-1.5 relative shadow-gold-sm flex flex-col justify-between">
          <div className="w-6 h-1 rounded-full bg-slate-700 mx-auto" />
          <div className="space-y-1">
            <div className="w-full h-2 rounded bg-gold-500/30 animate-pulse" />
            <div className="w-4/5 h-2 rounded bg-slate-800" />
            <div className="w-3/5 h-2 rounded bg-slate-800" />
          </div>
          <div className="w-full py-1 rounded bg-gold-500 text-black text-[8px] font-bold text-center">
            iOS &amp; Android
          </div>
        </div>
      </div>
    ),
    'digital-marketing': (
      <div className="w-full h-36 bg-obsidian-950 rounded-xl border border-slate-800 p-3 flex flex-col justify-between relative group-hover:border-gold-500/40 transition-colors">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-400 font-mono">Conversion Velocity</span>
          <span className="text-emerald-400 font-bold">+340%</span>
        </div>
        {/* Animated Bar Chart */}
        <div className="flex items-end gap-2 h-16 pt-2">
          <div className="w-full bg-slate-800 rounded-t h-[30%]" />
          <div className="w-full bg-slate-700 rounded-t h-[45%]" />
          <div className="w-full bg-gold-500/50 rounded-t h-[70%]" />
          <div className="w-full bg-gold-500 rounded-t h-[95%] shadow-gold-sm" />
        </div>
        <p className="text-[9px] text-slate-500 font-mono">Continuous Multi-Variant Optimization</p>
      </div>
    ),
    'ar-vr': (
      <div className="w-full h-36 bg-obsidian-950 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:border-gold-500/40 transition-colors">
        {/* Spatial 3D Wireframe Rings */}
        <div className="w-24 h-24 rounded-full border border-dashed border-gold-400/60 animate-spin-slow flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-gold-500/80 animate-ping opacity-30" />
          <Layers className="w-6 h-6 text-gold-400" />
        </div>
        <span className="absolute bottom-2 text-[9px] uppercase tracking-widest text-gold-300 font-mono">
          WebXR Zero-Install
        </span>
      </div>
    ),
    '3d-modeling': (
      <div className="w-full h-36 bg-obsidian-950 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:border-gold-500/40 transition-colors">
        {/* Rotating 3D Crystal Gem Wireframe */}
        <div className="w-20 h-20 relative flex items-center justify-center animate-float-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gold-400">
            <polygon points="50,10 90,35 90,65 50,90 10,65 10,35" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="50,10 50,90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <polygon points="10,35 90,65" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <polygon points="10,65 90,35" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
        <span className="absolute bottom-2 text-[9px] uppercase tracking-widest text-gold-300 font-mono">
          PBR Photorealistic 4K
        </span>
      </div>
    ),
    'ui-ux-design': (
      <div className="w-full h-36 bg-obsidian-950 rounded-xl border border-slate-800 p-2.5 flex items-center justify-center gap-2 relative overflow-hidden group-hover:border-gold-500/40 transition-colors">
        {/* Floating Design Component Tiles */}
        <div className="p-2 rounded-lg bg-black border border-gold-500/30 text-[9px] text-white shadow-gold-sm">
          <div className="w-12 h-1.5 rounded bg-gold-400 mb-1" />
          <div className="w-8 h-1 rounded bg-slate-700" />
        </div>
        <div className="p-2.5 rounded-lg bg-gold-500 text-black text-[9px] font-bold shadow-gold-md animate-float-slow">
          Button.primary
        </div>
        <div className="p-2 rounded-lg bg-black border border-slate-800 text-[9px] text-slate-400">
          Modal.open()
        </div>
      </div>
    ),
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <Container size="wide">
        <SectionHeading
          badge="Core Competencies"
          title="Architected For"
          highlight="Unmatched Impact"
          description="Explore our six core engineering and design disciplines, each engineered to transform digital bottlenecks into scalable growth engines."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesData.map((svc) => {
            const Icon = iconMap[svc.icon] || Globe;
            const visual = visualTreatments[svc.slug];

            return (
              <div
                key={svc.slug}
                className="glass-card p-6 sm:p-8 rounded-3xl border-gold-500/15 flex flex-col justify-between group glass-card-hover relative"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    {svc.badge && (
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400">
                        {svc.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {svc.tagline}
                  </p>

                  {/* Dynamic interactive visual treatment */}
                  <div className="mb-6">
                    {visual}
                  </div>

                  {/* Core Features preview */}
                  <div className="space-y-2 mb-6">
                    {svc.keyFeatures.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Link CTA */}
                <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                  <Link
                    to={`/services/${svc.slug}`}
                    className="text-xs font-semibold text-gold-400 hover:text-white inline-flex items-center gap-1.5 transition-colors group/link"
                  >
                    <span>Explore Architecture &amp; Case Studies</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center">
          <Button to="/services" variant="outline" size="lg" icon={ArrowRight}>
            View All Services &amp; Tech Specifications
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ServicesSection;
