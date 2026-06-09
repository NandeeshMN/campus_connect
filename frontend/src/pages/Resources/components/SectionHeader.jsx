import React from 'react';
import { ChevronRight } from 'lucide-react';

const SectionHeader = ({ title, icon: Icon, onViewAll, count }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={20} className="text-brand-600 dark:text-brand-400" />}
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </h2>
      </div>
      
      {onViewAll && (
        <button 
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
        >
          View All <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
