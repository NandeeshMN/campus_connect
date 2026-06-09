import React, { useRef } from 'react';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Logo = ({ className = '', iconSize = 24, showText = true }) => {
  const navigate = useNavigate();
  const clicksRef = useRef([]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    // Keep only clicks within the last 3 seconds
    clicksRef.current = clicksRef.current.filter(t => now - t < 3000);
    clicksRef.current.push(now);

    if (clicksRef.current.length >= 5) {
      clicksRef.current = []; // Reset counter
      toast('Admin Access Triggered', { icon: '🔐' });
      navigate('/admin/login');
    } else {
      // Normal single click → go home (or stay on landing)
      navigate('/');
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex items-center gap-2 font-bold font-sans tracking-tight select-none cursor-pointer ${className}`}
      onClick={handleLogoClick}
      onKeyDown={(e) => e.key === 'Enter' && handleLogoClick(e)}
    >
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
