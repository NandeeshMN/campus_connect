import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';
import { Plus, Pin, PinOff } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'general', is_pinned: false });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await adminApi.get('/admin/announcements');
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      toast.error('Failed to fetch announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error('Title and content are required');
      return;
    }
    
    setIsCreating(true);
    try {
      const { data } = await adminApi.post('/admin/announcements', newAnnouncement);
      if (data.success) {
        toast.success('Announcement created');
        setAnnouncements([data.announcement, ...announcements]);
        setCreateModalOpen(false);
        setNewAnnouncement({ title: '', content: '', type: 'general', is_pinned: false });
      }
    } catch (error) {
      toast.error('Failed to create announcement');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Title', render: (row) => <div className="font-semibold">{row.title}</div> },
    { header: 'Type', render: (row) => (
      <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold uppercase">
        {row.type}
      </span>
    )},
    { header: 'Pinned', render: (row) => (
      row.is_pinned ? <Pin size={18} className="text-brand-500" /> : <PinOff size={18} className="text-slate-300" />
    )},
    { header: 'Date', render: (row) => <span className="text-slate-500">{new Date(row.created_at).toLocaleDateString()}</span> }
  ];

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Announcements</h1>
          <p className="text-slate-500 mt-1">Manage global platform announcements.</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-md shadow-brand-500/20"
        >
          <Plus size={18} />
          New Announcement
        </button>
      </div>

      <AdminTable 
        columns={columns}
        data={filteredAnnouncements}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search announcements..."
      />

      {/* Create Modal - Inline simple implementation for brevity */}
      {createModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Create Announcement</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" 
                  placeholder="E.g., System Maintenance"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <textarea 
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[100px]" 
                  placeholder="Details..."
                  required
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="pin" 
                  checked={newAnnouncement.is_pinned}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, is_pinned: e.target.checked})}
                />
                <label htmlFor="pin" className="text-sm text-slate-700 dark:text-slate-300">Pin to top</label>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-colors disabled:opacity-70"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Announcements;
