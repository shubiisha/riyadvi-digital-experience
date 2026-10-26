import React from 'react';
import { cn } from '../../lib/utils';

export const Container = ({ children, className, size = 'default', ...props }) => {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8 w-full', sizeClasses[size], className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
