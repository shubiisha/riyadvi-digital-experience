import React from 'react';
import { cn } from '../../lib/utils';

export const LoadingSpinner = ({ size = 'md', className, label }) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-6 gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-gold-500/20 border-t-gold-500 animate-spin',
          sizeMap[size]
        )}
      />
      {label && <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
