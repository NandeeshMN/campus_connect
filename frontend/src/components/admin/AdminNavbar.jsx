import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldAlert } from 'lucide-react';

const AdminNavbar = () => {
  const { admin } = useAdminAuth();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
      
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
        {/* Placeholder for page title, or breadcrumbs if we want */}
        Welcome back, <span className="text-slate-900 dark:text-white font-bold">{admin?.full_name || 'Admin'}</span>
      </div>

      <div className="flex items-center gap-4">
        
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full text-xs font-bold border border-red-100 dark:border-red-900/30">
          <ShieldAlert size={14} />
          Super Admin
        </div>

        <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/30 border-2 border-white dark:border-slate-800">
          A
        </div>

      </div>

    </header>
  );
};

export default AdminNavbar;
