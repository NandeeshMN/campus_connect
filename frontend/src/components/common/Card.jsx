import React from 'react';

const Card = ({
  children,
  variant = 'default', // 'default' | 'glass' | 'outline'
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'rounded-2xl p-6 transition-all duration-300';
  
  const variants = {
    default: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium',
    glass: 'glassmorphic-card shadow-glass',
    outline: 'border border-slate-200 dark:border-slate-800 bg-transparent',
  };

  const hoverStyle = hoverEffect 
    ? 'hover:shadow-premium-hover hover:scale-[1.01]' 
    : '';

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
