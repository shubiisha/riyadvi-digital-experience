import React from 'react';
import { cn } from '../../lib/utils';

export const SectionHeading = ({
  badge,
  title,
  highlight,
  description,
  align = 'center',
  className,
}) => {
  const isCenter = align === 'center';

  return (
    <div className={cn('mb-12 md:mb-16', isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl', className)}>
      {badge && (
        <div className={cn('inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-medium uppercase tracking-widest mb-4', isCenter ? 'mx-auto' : '')}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
          {badge}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
        {title}{' '}
        {highlight && (
          <span className="text-gradient-gold block sm:inline mt-1 sm:mt-0">
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
