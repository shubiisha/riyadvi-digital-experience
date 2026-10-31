import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import Container from '../common/Container';
import MobileMenu from './MobileMenu';
import { cn } from '../../lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/careers' },
    { name: 'Live Stack', path: '/live-stack' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-black/80 backdrop-blur-lg border-b border-gold-500/15 py-3 shadow-lg shadow-black/50'
            : 'bg-transparent py-5'
        )}
      >
        <Container size="wide" className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 p-[1px] shadow-gold-sm group-hover:shadow-gold-md transition-all">
              <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-lg text-gradient-gold tracking-tighter">R</span>
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider text-white flex items-center gap-1">
                RIYADVI
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase block font-medium -mt-0.5">
                Software Technologies
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-gold-400 relative py-1',
                    isActive ? 'text-gold-400 font-semibold' : 'text-slate-300'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-gradient rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Business Health Checkup highlight link */}
            <Link
              to="/business-health-checkup"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                location.pathname === '/business-health-checkup'
                  ? 'border-gold-400 bg-gold-500/20 text-gold-300 shadow-gold-sm'
                  : 'border-gold-500/30 bg-gold-500/10 text-gold-400 hover:border-gold-400 hover:bg-gold-500/15'
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Health Checkup
            </Link>
          </nav>

          {/* Actions & Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500/70" />
              <span className="font-mono">Admin</span>
            </Link>

            <Button
              to="/contact"
              variant="primary"
              size="sm"
              icon={ArrowRight}
              className="hidden sm:inline-flex"
            >
              Book Consultation
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg border border-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gold-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
        currentPath={location.pathname}
      />
    </>
  );
};

export default Navbar;
