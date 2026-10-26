import React from 'react';

export const SceneFallback = ({ title = 'Digital Ecosystem' }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-obsidian-900/40 via-black to-black p-6">
      {/* Decorative ambient gold ring */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-gold-500/20 animate-spin-slow pointer-events-none" />
      <div className="absolute w-[240px] h-[240px] rounded-full border border-gold-400/30 animate-pulse pointer-events-none" />

      {/* Futuristic SVG Node constellation */}
      <svg className="w-full max-w-[420px] h-auto relative z-10" viewBox="0 0 400 400" fill="none">
        <defs>
          <linearGradient id="fallbackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F5E6A7" />
            <stop offset="50%" stop-color="#D4AF37" />
            <stop offset="100%" stop-color="#94721D" />
          </linearGradient>
        </defs>

        {/* Central Core */}
        <polygon points="200,140 250,170 250,230 200,260 150,230 150,170" stroke="url(#fallbackGrad)" stroke-width="2" fill="rgba(212,175,55,0.08)" />
        <circle cx="200" cy="200" r="14" fill="url(#fallbackGrad)" />

        {/* Orbital nodes and connection lines */}
        <line x1="200" y1="140" x2="200" y2="70" stroke="rgba(212,175,55,0.4)" stroke-dasharray="3 3" />
        <line x1="250" y1="170" x2="320" y2="140" stroke="rgba(212,175,55,0.4)" stroke-dasharray="3 3" />
        <line x1="250" y1="230" x2="310" y2="280" stroke="rgba(212,175,55,0.4)" stroke-dasharray="3 3" />
        <line x1="200" y1="260" x2="200" y2="330" stroke="rgba(212,175,55,0.4)" stroke-dasharray="3 3" />
        <line x1="150" y1="230" x2="90" y2="280" stroke="rgba(212,175,55,0.4)" stroke-dasharray="3 3" />
        <line x1="150" y1="170" x2="80" y2="140" stroke="rgba(212,175,55,0.4)" stroke-dasharray="3 3" />

        <circle cx="200" cy="70" r="7" fill="#D4AF37" />
        <circle cx="320" cy="140" r="8" fill="#F5E6A7" />
        <circle cx="310" cy="280" r="6" fill="#D4AF37" />
        <circle cx="200" cy="330" r="7" fill="#F5E6A7" />
        <circle cx="90" cy="280" r="8" fill="#D4AF37" />
        <circle cx="80" cy="140" r="6" fill="#F5E6A7" />
      </svg>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-gold-500/20 text-[10px] uppercase tracking-widest text-gold-400 font-mono">
        Optimized Mode Active • {title}
      </div>
    </div>
  );
};

export default SceneFallback;
