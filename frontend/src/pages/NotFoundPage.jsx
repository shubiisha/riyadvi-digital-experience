import React from 'react';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] bg-gold-glow opacity-30 rounded-full blur-3xl pointer-events-none" />

      <Container size="narrow" className="relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Error 404 • Coordinate Offline
        </div>

        <h1 className="text-7xl sm:text-9xl font-black text-gradient-gold tracking-tighter">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Digital Entity Not Located
        </h2>

        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          The requested coordinate or resource does not exist in our digital architecture or has been transitioned to a new endpoint.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button to="/" variant="primary" size="lg" icon={Home} iconPosition="left">
            Return to Homepage
          </Button>
          <Button to="/services" variant="outline" size="lg">
            Explore Services
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
