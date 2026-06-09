import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, BookOpen, AlertTriangle, Bell, LogOut, ShieldCheck, CalendarDays, X } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminSidebar = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/posts', icon: MessageSquare, label: 'Posts' },
    { to: '/admin/resources', icon: BookOpen, label: 'Resources' },
    { to: '/admin/events', icon: CalendarDays, label: 'Events' },
    { to: '/admin/reports', icon: AlertTriangle, label: 'Reports' },
    { to: '/admin/announcements', icon: Bell, label: 'Announcements' },
  ];

  return (
    <>
      <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0">
        
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold tracking-tight">
            <ShieldCheck size={24} className="text-brand-500" />
            <span>Admin Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>

      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <LogOut size={26} className="text-red-500" />
              </div>
            </div>

            {/* Text */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-1">
              Sign out of Admin Portal?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
              You will be redirected to the home page. Any unsaved changes will be lost.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 disabled:opacity-70"
              >
                {isLoggingOut ? 'Signing out...' : 'Yes, Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
