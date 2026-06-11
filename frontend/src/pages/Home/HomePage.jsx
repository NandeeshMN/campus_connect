import React, { useState, useEffect } from 'react';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Image as ImageIcon, Smile, TrendingUp, X, Trash2, Edit2, Globe, Users
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

// ─── Static sidebar data ───────────────────────────────────────────────────────
const trendingHashtags = [
  { tag: '#Hackathon2024', posts: '1.2k posts today' },
  { tag: '#ArtInTheQuad',  posts: '856 posts today'  },
  { tag: '#FinalsWeekPrep',posts: '542 posts today'  },
  { tag: '#CampusEats',    posts: '320 posts today'  },
];

const suggestedStudents = [
  { id: 1, name: 'Priya Sharma', major: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80' },
  { id: 2, name: 'Jordan Lee',   major: 'Data Science',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=80&h=80' },
  { id: 3, name: 'Linda Yao',    major: 'UX Design',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80&h=80' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fileToDataUri = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload  = (e) => resolve(e.target.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const formatDate = (ts) => {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
};

const visibilityLabel = (v) => (v === 'public' ? <Globe size={12} /> : <Users size={12} />);

// ─── PostCard ──────────────────────────────────────────────────────────────────
const PostCard = ({ post, onEdit, onDelete, currentUserId }) => {
  const [liked,    setLiked]    = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [likes,    setLikes]    = useState(post?.like_count    || 0);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!post || !post.id) return null;   // ← null-safety guard

  const isOwner = String(post.user_id) === String(currentUserId);

  const toggleLike = () => {
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-5 relative">

        {/* Author row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {post.profile_image
              ? <img src={post.profile_image} alt={post.full_name || ''} className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
              : <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {(post.full_name || 'U').charAt(0)}
                </div>
            }
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {post.full_name || 'Unknown'}
                <span className="text-slate-400">{visibilityLabel(post.visibility)}</span>
              </p>
              <p className="text-xs text-slate-400">
                {formatDate(post.created_at)}{post.edited ? ' · Edited' : ''}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 py-1">
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(post); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(post); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Caption */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-3">
          {post.caption || ''}
        </p>

        {/* Hashtags */}
        {post.hashtags && (
          <div className="flex gap-2 flex-wrap mb-3">
            {post.hashtags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
              <span key={tag} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">
                #{tag.replace(/^#/, '')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full max-h-96 object-cover bg-slate-100 dark:bg-slate-800" />
      )}

      {/* Action bar */}
      <div className="px-5 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${liked ? 'text-red-500' : 'text-slate-500 hover:text-red-400 dark:text-slate-400'}`}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            {likes.toLocaleString()}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-500 dark:text-slate-400 transition-colors">
            <MessageCircle size={16} />
            {post.comment_count || 0}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-green-500 dark:text-slate-400 transition-colors">
            <Share2 size={16} />
            {post.share_count || 0}
          </button>
        </div>
        <button
          onClick={() => setSaved(p => !p)}
          className={`transition-colors ${saved ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-brand-500'}`}
        >
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

// ─── PostCard skeleton ─────────────────────────────────────────────────────────
const PostSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
    <div className="h-40 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
  </div>
);

// ─── HomePage ──────────────────────────────────────────────────────────────────
const HomePage = () => {
  const { user } = useAuth();

  const [posts,       setPosts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [feedError,   setFeedError]   = useState(null);

  // Edit state
  const [editingPost, setEditingPost] = useState(null);
  const [isEditing,   setIsEditing]   = useState(false);

  // Delete state
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDeleting,   setIsDeleting]   = useState(false);

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchPosts();

    // Listen for newly created posts from the global modal
    const onNewPost = (e) => {
      if (e.detail && e.detail.id) {
        setPosts(prev => [e.detail, ...prev]);
      }
    };
    window.addEventListener('postCreated', onNewPost);
    return () => window.removeEventListener('postCreated', onNewPost);
  }, []);

  // ── Fetch feed ─────────────────────────────────────────────────────────────
  const fetchPosts = async () => {
    setLoading(true);
    setFeedError(null);
    try {
      const { data } = await api.get('/posts');
      if (data.success) {
        // Filter out any null / malformed rows
        setPosts((data.posts || []).filter(p => p && p.id));
      }
    } catch (err) {
      console.error('fetchPosts error:', err);
      setFeedError('Could not load the feed. Please refresh.');
      toast.error('Failed to load feed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Edit post ──────────────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (!editingPost?.caption?.trim()) return;
    setIsEditing(true);

    const payload = {
      caption:    editingPost.caption,
      hashtags:   editingPost.hashtags || '',
      visibility: editingPost.visibility || 'public',
    };
    if (editingPost.newImage)    payload.image       = editingPost.newImage;
    else if (editingPost.removeImage) payload.removeImage = true;

    try {
      const { data } = await api.put(`/posts/${editingPost.id}`, payload);
      if (data.success) {
        toast.success('Post updated!');
        setPosts(prev => prev.map(p => p.id === editingPost.id ? data.post : p));
        setEditingPost(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update post.');
    } finally {
      setIsEditing(false);
    }
  };

  // ── Delete post ────────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);
    try {
      const { data } = await api.delete(`/posts/${deletingPost.id}`);
      if (data.success) {
        toast.success('Post deleted.');
        setPosts(prev => prev.filter(p => p.id !== deletingPost.id));
        setDeletingPost(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Feed Column ── */}
          <div className="lg:col-span-8 space-y-4">

            {/* Create Post Trigger */}
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              onClick={() => window.dispatchEvent(new CustomEvent('openCreatePostModal'))}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {(user?.full_name || 'U').charAt(0)}
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-400">
                  What's on your mind, {user?.full_name?.split(' ')[0] || 'there'}?
                </div>
              </div>
              <div className="flex gap-4 pl-13">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 ml-13 hover:text-brand-500 transition-colors">
                  <ImageIcon size={16} /> Photo
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-yellow-500 transition-colors">
                  <Smile size={16} /> Feeling
                </span>
              </div>
            </div>

            {/* Feed */}
            {loading ? (
              [1, 2, 3].map(k => <PostSkeleton key={k} />)
            ) : feedError ? (
              <div className="py-10 text-center">
                <p className="text-slate-500 text-sm mb-3">{feedError}</p>
                <button
                  onClick={fetchPosts}
                  className="text-sm font-semibold text-brand-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-500 text-sm">No posts yet.</p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openCreatePostModal'))}
                  className="mt-3 text-sm font-bold text-brand-600 hover:underline"
                >
                  Be the first to post!
                </button>
              </div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                  onEdit={setEditingPost}
                  onDelete={setDeletingPost}
                />
              ))
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <div className="lg:col-span-4 space-y-4">

            {/* Trending */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-600" /> Trending Today
              </h3>
              <div className="space-y-3">
                {trendingHashtags.map(({ tag, posts: count }) => (
                  <div key={tag} className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{tag}</p>
                      <p className="text-xs text-slate-400">{count}</p>
                    </div>
                    <TrendingUp size={14} className="text-brand-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Students */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Suggested Students</h3>
              <div className="space-y-3">
                {suggestedStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={student.avatar} alt={student.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{student.name}</p>
                        <p className="text-xs text-slate-400">{student.major}</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950/30 px-3 py-1 rounded-lg transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Edit Post</h2>

            <textarea
              value={editingPost.caption || ''}
              onChange={e => setEditingPost({ ...editingPost, caption: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-400 mb-3 resize-none"
              rows={4}
            />

            {/* Image section */}
            {(editingPost.image_url && !editingPost.removeImage) || editingPost.newImage ? (
              <div className="relative w-fit mb-3">
                <img
                  src={editingPost.newImage || editingPost.image_url}
                  alt="Preview"
                  className="h-32 rounded-lg object-cover border border-slate-200"
                />
                <button
                  onClick={() => setEditingPost({ ...editingPost, removeImage: true, newImage: null })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  id="edit-img-upload"
                  onChange={async e => {
                    const file = e.target.files[0];
                    if (file) {
                      const uri = await fileToDataUri(file);
                      setEditingPost({ ...editingPost, newImage: uri, removeImage: false });
                    }
                  }}
                />
                <label htmlFor="edit-img-upload" className="cursor-pointer text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 w-fit">
                  <ImageIcon size={14} /> Add / Replace Image
                </label>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Hashtags"
                value={editingPost.hashtags || ''}
                onChange={e => setEditingPost({ ...editingPost, hashtags: e.target.value })}
                className="flex-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none"
              />
              <select
                value={editingPost.visibility || 'public'}
                onChange={e => setEditingPost({ ...editingPost, visibility: e.target.value })}
                className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none"
              >
                <option value="public">Public</option>
                <option value="college_only">College Only</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isEditing || !editingPost?.caption?.trim()}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-60"
              >
                {isEditing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={24} className="text-red-500" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-center text-slate-900 dark:text-white mb-2">Delete Post?</h2>
            <p className="text-sm text-center text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingPost(null)}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-70"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default HomePage;
