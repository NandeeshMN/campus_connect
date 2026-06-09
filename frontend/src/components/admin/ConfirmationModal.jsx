import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isLoading = false, isDanger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
            {isDanger && <AlertTriangle className="text-red-500" size={20} />}
            {title}
          </div>
          <button onClick={onClose} disabled={isLoading} className="text-slate-400 hover:text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 text-slate-600 dark:text-slate-400 text-sm">
          {message}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-b-2xl border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md transition-colors disabled:opacity-70 ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' 
                : 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/20'
            }`}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : confirmText}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ConfirmationModal;
