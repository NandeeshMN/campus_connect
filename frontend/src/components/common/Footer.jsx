import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';
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

        <div className="mt-8 border-t border-slate-200/50 dark:border-slate-800/80 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 text-center">
          <div className="md:text-left">
            <p>Your Campus. Your Community. Your Network.</p>
          </div>
          <div className="md:text-center">
            <p>© {currentYear} CampusConnect. All rights reserved.</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">
                Designed And Developed By
              </span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold">
                Nandeesh M N
              </span>
              <div className="flex items-center gap-4 mt-0.5">
                <a 
                  href="https://github.com/NandeeshMN/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <Github size={16} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/nandeeshmn/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Linkedin size={16} />
                </a>
                <a 
                  href="https://nandeeshmn.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <Globe size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
