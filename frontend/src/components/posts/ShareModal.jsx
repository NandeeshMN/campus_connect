import React, { useState, useEffect } from 'react';
import { X, Search, Check, Send } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ShareModal = ({ post, onClose }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/users/search?q=' + encodeURIComponent(query));
        if (data.success) {
          // Exclude the current user from results ideally. Handled backend/frontend.
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error('Failed to fetch users for sharing:', err);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleShare = async () => {
    if (selectedIds.length === 0) return;
    setSending(true);
    try {
      const { data } = await api.post(`/posts/${post.id}/share`, {
        receiverIds: selectedIds
      });
      if (data.success) {
        toast.success('Post shared successfully!');
        onClose();
      }
    } catch (err) {
      toast.error('Failed to share post.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Share Post</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="text-center py-6 text-xs text-slate-500">Searching...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">No users found.</div>
          ) : (
            users.map(u => {
              const isSelected = selectedIds.includes(u.id);
              return (
                <button
                  key={u.id}
                  onClick={() => toggleSelect(u.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {u.profile_image ? (
                      <img src={u.profile_image} alt={u.full_name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold">
                        {u.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{u.full_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">@{u.username}</p>
                    </div>
                  </div>
                  <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                    {isSelected && <Check size={14} />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Action */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleShare}
            disabled={selectedIds.length === 0 || sending}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
          >
            {sending ? 'Sending...' : 'Send'} <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;
