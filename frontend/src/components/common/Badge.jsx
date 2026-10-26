import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({ children, variant = 'gold', className }) => {
  const variantStyles = {
    gold: 'border-gold-500/30 bg-gold-500/10 text-gold-400',
    silver: 'border-slate-700 bg-slate-800/60 text-slate-300',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide', variantStyles[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
