import React from 'react';
import { GraduationCap } from 'lucide-react';

const Logo = ({ className = '', iconSize = 24, showText = true }) => {
  return (
    <div className={`flex items-center gap-2 font-bold font-sans tracking-tight select-none ${className}`}>
      <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/20">
        <GraduationCap size={iconSize} className="animate-pulse" />
      </div>
      {showText && (
        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
          CampusConnect
        </span>
      )}
    </div>
  );
};

export default Logo;
