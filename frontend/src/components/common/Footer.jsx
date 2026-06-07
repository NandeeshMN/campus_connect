import React from 'react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo iconSize={20} className="scale-90 origin-left" />
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs text-center md:text-left">
              Fostering connection and collegiate excellence across 200+ universities.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <a href="#about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About</a>
            <a href="#privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms</a>
            <a href="#help" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Help</a>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-200/50 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} CampusConnect. All rights reserved.</p>
          <p>Handcrafted for future leaders.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
