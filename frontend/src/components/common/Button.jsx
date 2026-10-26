import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className,
  icon: Icon,
  iconPosition = 'right',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-3 gap-2',
    lg: 'text-base px-8 py-4 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-gold-500 text-black hover:bg-gold-400 shadow-gold-sm hover:shadow-gold-md font-semibold active:scale-[0.98]',
    outline: 'border border-gold-500/60 text-gold-400 hover:text-white hover:border-gold-400 hover:bg-gold-500/10 active:scale-[0.98]',
    secondary: 'bg-obsidian-800 text-slate-200 border border-slate-700/60 hover:border-gold-500/40 hover:text-white active:scale-[0.98]',
    ghost: 'text-slate-300 hover:text-gold-400 hover:bg-white/5 active:scale-[0.98]',
  };

  const content = (
    <>
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
    </>
  );

  const mergedClasses = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

  if (to) {
    return (
      <Link to={to} className={mergedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={mergedClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={mergedClasses} disabled={disabled || loading} onClick={onClick} {...props}>
      {content}
    </button>
  );
};

export default Button;
