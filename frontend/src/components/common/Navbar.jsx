import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Bell, Mail, Compass, Settings } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const activeStyle = ({ isActive }) => 
    `text-sm font-semibold transition-colors duration-200 ${
      isActive 
        ? 'text-brand-600 dark:text-brand-400' 
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo link */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={activeStyle}>Home</NavLink>
            <NavLink to="/explore" className="text-sm font-semibold text-slate-400 cursor-not-allowed">Explore</NavLink>
            <NavLink to="/events" className="text-sm font-semibold text-slate-400 cursor-not-allowed">Events</NavLink>
            <NavLink to="/resources" className="text-sm font-semibold text-slate-400 cursor-not-allowed">Resources</NavLink>
          </div>

          {/* Actions & Profiles */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Inbox, Alerts mock buttons */}
                <button className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100">
                  <Mail size={20} />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100">
                  <Bell size={20} />
                </button>
                
                {/* Avatar / Username */}
                <Link to="/profile" className="flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-slate-800 hover:opacity-80 transition-opacity">
                  <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {user?.username}
                  </span>
                </Link>
                <div className="flex items-center gap-1 border-l border-slate-200 pl-4 dark:border-slate-800">
                  <Link 
                    to="/settings"
                    className="p-1.5 text-slate-400 hover:text-brand-500 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings size={16} />
                  </Link>
                  <button 
                    onClick={logout} 
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Log out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="rounded-xl px-4 py-2 text-xs">Join Now</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white px-4 py-4 space-y-3 dark:border-slate-800 dark:bg-slate-950 animate-slide-in">
          <div className="flex flex-col space-y-2">
            <NavLink to="/" onClick={toggleMenu} className="px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-lg dark:hover:bg-slate-900">Home</NavLink>
            <span className="px-3 py-2 text-sm font-medium text-slate-300 dark:text-slate-700 cursor-not-allowed">Explore (Future)</span>
            <span className="px-3 py-2 text-sm font-medium text-slate-300 dark:text-slate-700 cursor-not-allowed">Events (Future)</span>
            <span className="px-3 py-2 text-sm font-medium text-slate-300 dark:text-slate-700 cursor-not-allowed">Resources (Future)</span>
          </div>
          
          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400 flex items-center justify-center font-bold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.full_name}</p>
                    <p className="text-xs text-slate-500">@{user?.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); toggleMenu(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50/50 rounded-lg dark:hover:bg-red-950/20"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-3">
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button variant="primary" className="w-full">Join CampusConnect</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
