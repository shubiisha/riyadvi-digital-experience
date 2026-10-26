import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, MapPin, MessageCircle, Github, Linkedin, Twitter } from 'lucide-react';
import Container from '../common/Container';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Web Development', path: '/services/web-development' },
    { name: 'App Development', path: '/services/app-development' },
    { name: 'Digital Marketing', path: '/services/digital-marketing' },
    { name: 'AR / VR Solutions', path: '/services/ar-vr' },
    { name: '3D Modeling & Visuals', path: '/services/3d-modeling' },
    { name: 'UI / UX Design', path: '/services/ui-ux-design' },
  ];

  const quickLinks = [
    { name: 'About Riyadvi', path: '/about' },
    { name: 'Portfolio & Case Studies', path: '/portfolio' },
    { name: 'Business Health Checkup', path: '/business-health-checkup' },
    { name: 'Project Planning Guide', path: '/software-project-planning-guide' },
    { name: 'Tech Insights & Blog', path: '/blog' },
    { name: 'Careers (We Are Hiring!)', path: '/careers' },
    { name: 'Admin Portal', path: '/admin' },
  ];

  return (
    <footer className="bg-black border-t border-gold-500/15 pt-20 pb-12 relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold-glow pointer-events-none opacity-40" />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-700 p-[1px] shadow-gold-sm">
                <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
                  <span className="font-extrabold text-lg text-gradient-gold">R</span>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold tracking-wider text-white">RIYADVI</span>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase block font-medium">Software Technologies</span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              A Technology & Digital Solutions Partner – not simply a vendor. We architect immersive 3D digital experiences, scalable enterprise web systems, and high-ROI growth platforms for visionary enterprises worldwide.
            </p>

            <div className="space-y-2.5 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Bengaluru & Hyderabad, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="mailto:contact@riyadvisoftwaretechnologies.com" className="hover:text-gold-400 transition-colors">
                  contact@riyadvisoftwaretechnologies.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="tel:+919845012890" className="hover:text-gold-400 transition-colors">
                  +91 98450 12890
                </a>
              </div>
            </div>

            {/* WhatsApp direct CTA */}
            <a
              href="https://wa.me/919845012890?text=Hi%20Riyadvi%20Team%2C%20I%20would%20like%20to%20discuss%20a%20digital%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat on WhatsApp Directly
            </a>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Solutions & Services
            </h4>
            <ul className="space-y-3 text-sm">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Company & Growth
            </h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Diagnostic Box */}
          <div className="glass-card p-6 rounded-2xl border-gold-500/20 space-y-4">
            <span className="px-2.5 py-1 rounded bg-gold-500/10 text-gold-400 text-[10px] uppercase font-bold tracking-wider border border-gold-500/20">
              Interactive Diagnostic
            </span>
            <h5 className="text-white font-bold text-base leading-snug">
              Is Your Business Ready for Digital Acceleration?
            </h5>
            <p className="text-slate-400 text-xs leading-relaxed">
              Take our 2-minute diagnostic audit and receive an instant digital score and roadmap.
            </p>
            <Link
              to="/business-health-checkup"
              className="block text-center py-2.5 px-4 rounded-xl bg-gold-500 text-black text-xs font-semibold hover:bg-gold-400 transition-colors"
            >
              Start Free Health Checkup →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Riyadvi Software Technologies (Est. 2021). All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-gold-400 transition-colors">Security Audit</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
