import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, FileText, Phone, Mail, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import { cn } from '../../lib/utils';

export const MobileMenu = ({ isOpen, onClose, links, currentPath }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden flex flex-col justify-between bg-black/95 backdrop-blur-2xl px-6 pt-24 pb-8 overflow-y-auto animate-fadeIn">
      {/* Top Links */}
      <div className="space-y-4">
        <p className="text-[11px] uppercase tracking-widest text-gold-500 font-semibold mb-2">Navigation</p>
        <div className="flex flex-col space-y-3">
          {links.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={onClose}
                className={cn(
                  'text-2xl font-bold py-1.5 transition-colors flex items-center justify-between',
                  isActive ? 'text-gradient-gold' : 'text-slate-200 hover:text-gold-400'
                )}
              >
                <span>{link.name}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-gold-400" />}
              </Link>
            );
          })}
        </div>

        {/* Feature Badges */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            to="/business-health-checkup"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span className="font-semibold text-sm">Business Health Checkup</span>
            </div>
            <span className="text-xs bg-gold-500/20 px-2 py-0.5 rounded text-gold-300">Free Audit</span>
          </Link>

          <Link
            to="/software-project-planning-guide"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-obsidian-850 text-slate-300"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-gold-400" />
              <span className="font-medium text-sm">Project Planning Guide</span>
            </div>
            <span className="text-xs text-slate-400">PDF Guide</span>
          </Link>

          <Link
            to="/admin"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-obsidian-850 text-slate-300"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
              <span className="font-medium text-sm">Admin Portal</span>
            </div>
            <span className="text-xs text-slate-400">Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Bottom Info & CTA */}
      <div className="pt-6 border-t border-slate-800/80 space-y-4">
        <Button to="/contact" variant="primary" size="lg" icon={ArrowRight} className="w-full" onClick={onClose}>
          Book a Free Consultation
        </Button>

        <div className="text-xs text-slate-400 flex items-center justify-between pt-2">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gold-500" />
            contact@riyadvi.com
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gold-500" />
            +91 98450 12890
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
