import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';
import { EyeOff, Eye } from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await adminApi.get('/admin/posts');
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisibilityToggle = async () => {
    setIsActionLoading(true);
    const newVisibility = !selectedPost.is_hidden;
    try {
      const { data } = await adminApi.patch(`/admin/posts/${selectedPost.id}/visibility`, { is_hidden: newVisibility });
      if (data.success) {
        toast.success(newVisibility ? 'Post hidden from feed' : 'Post restored to feed');
        setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, is_hidden: newVisibility } : p));
        setModalOpen(false);
      }
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredPosts = posts.filter(p => 
    (p.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Author', render: (row) => <div className="font-semibold">{row.first_name} {row.last_name}</div> },
    { header: 'Content Preview', render: (row) => (
      <div className="max-w-xs truncate text-slate-600">{row.content}</div>
    )},
    { header: 'Visibility', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
        row.is_hidden ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
      }`}>
        {row.is_hidden ? 'HIDDEN' : 'VISIBLE'}
      </span>
    )},
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => { setSelectedPost(row); setModalOpen(true); }} 
          className={`p-1.5 rounded-lg transition-colors ${
            row.is_hidden 
              ? 'text-emerald-500 hover:bg-emerald-50' 
              : 'text-amber-500 hover:bg-amber-50'
          }`}
          title={row.is_hidden ? 'Restore Post' : 'Hide Post'}
        >
          {row.is_hidden ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    )}
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Post Management</h1>
        <p className="text-slate-500 mt-1">Monitor and moderate content posted by users.</p>
      </div>

      <AdminTable 
        columns={columns}
        data={filteredPosts}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search content or author..."
      />

      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleVisibilityToggle}
        isLoading={isActionLoading}
        title={selectedPost?.is_hidden ? 'Restore Post' : 'Hide Post'}
        message={`Are you sure you want to ${selectedPost?.is_hidden ? 'restore this post to' : 'hide this post from'} the public feed?`}
        confirmText={selectedPost?.is_hidden ? 'Restore' : 'Hide'}
        isDanger={!selectedPost?.is_hidden}
      />
    </AdminLayout>
  );
};

export default Posts;
