import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Settings } from 'lucide-react';

const StubPage = ({ title }) => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title} Management</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage platform {title.toLowerCase()}.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <Settings size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Module Under Construction</h2>
        <p className="text-slate-500 max-w-md">
          The {title} management module architecture is prepared, but the detailed UI tables and operations will be built in the next iteration.
        </p>
      </div>
    </AdminLayout>
  );
};

export default StubPage;
