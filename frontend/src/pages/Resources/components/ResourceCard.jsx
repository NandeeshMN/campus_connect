import React from 'react';
import { Download, Eye, FileText, FileBadge, FileArchive, FileVideo, LayoutTemplate } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import toast from 'react-hot-toast';

const getFileIcon = (type) => {
  switch (type) {
    case 'pdf':
    case 'notes':
      return <FileText size={20} className="text-red-500" />;
    case 'guide':
    case 'lab_manuals':
    case 'assignments':
      return <FileBadge size={20} className="text-indigo-500" />;
    case 'video':
      return <FileVideo size={20} className="text-purple-500" />;
    case 'template':
      return <LayoutTemplate size={20} className="text-green-500" />;
    case 'archive':
      return <FileArchive size={20} className="text-yellow-600" />;
    default:
      return <FileText size={20} className="text-blue-500" />;
  }
};

const ResourceCard = ({ resource, onDownload, onView }) => {
  const {
    title,
    description,
    category,
    subcategory,
    department,
    semester,
    resource_type,
    downloads_count,
    uploaded_by,
    created_at
  } = resource;

  const handleDownload = () => {
    if (onDownload) onDownload(resource);
    else toast.success(`Starting download: ${title}`);
  };

  const handleView = () => {
    if (onView) onView(resource);
    else toast.success(`Opening preview for: ${title}`);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow group">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
            {getFileIcon(resource_type)}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 px-2.5 py-1 rounded-full">
            {subcategory || category || department}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
          {description}
        </p>

        <div className="mt-auto space-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {(department || semester) && (
            <p>For: {department} {semester && `• ${semester}`}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <p>By {uploaded_by}</p>
            <p>{new Date(created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <Download size={14} />
          {downloads_count.toLocaleString()} Downloads
        </span>
        <div className="flex gap-2">
          <button 
            onClick={handleView}
            className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            title="Preview"
          >
            <Eye size={18} />
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            title="Download"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ResourceCard;
