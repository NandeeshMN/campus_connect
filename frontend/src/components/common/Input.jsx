import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none dark:text-slate-500">
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={`w-full px-4 py-3 text-slate-900 bg-slate-50/70 border rounded-xl transition-all duration-200 outline-none text-base
            dark:bg-slate-900/40 dark:text-white
            ${Icon ? 'pl-11' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-slate-200/80 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-slate-800 dark:focus:border-brand-500 dark:focus:bg-slate-900'
            }`}
          {...props}
        />
      </div>
      
      {error && (
        <span className="text-xs font-medium text-red-500 animate-slide-in">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
