import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Edit2, Trash2, Globe, Users } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ShareModal from './ShareModal';

const visibilityLabel = (v) => (v === 'public' ? <Globe size={12} /> : <Users size={12} />);

const formatDate = (ts) => {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
};

const PostCard = ({ post, onEdit, onDelete, currentUserId }) => {
  const [liked, setLiked] = useState(post?.is_liked || false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(parseInt(post?.like_count) || 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    setLiked(post?.is_liked || false);
    setLikes(parseInt(post?.like_count) || 0);
  }, [post?.is_liked, post?.like_count]);

  if (!post || !post.id) return null;

  const isOwner = String(post.user_id) === String(currentUserId);

  const toggleLike = async () => {
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);

    try {
      const { data } = await api.post(`/posts/${post.id}/like`);
      if (data.success) {
        setLiked(data.is_liked);
      }
    } catch (err) {
      setLiked(p => !p);
      setLikes(p => !liked ? p - 1 : p + 1);
      toast.error('Failed to like post.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-5 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {post.profile_image ? (
              <img src={post.profile_image} alt={post.full_name || ''} className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {(post.full_name || 'U').charAt(0)}
              </div>
            )}
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
              <button onClick={() => setMenuOpen(v => !v)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 py-1">
                  <button onClick={() => { setMenuOpen(false); onEdit?.(post); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => { setMenuOpen(false); onDelete?.(post); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-3">
          {post.caption || ''}
        </p>

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

      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full max-h-96 object-cover bg-slate-100 dark:bg-slate-800" />
      )}

      <div className="px-5 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${liked ? 'text-red-500' : 'text-slate-500 hover:text-red-400 dark:text-slate-400'}`}>
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            {likes.toLocaleString()}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-500 dark:text-slate-400 transition-colors">
            <MessageCircle size={16} />
            {post.comment_count || 0}
          </button>
          <button onClick={() => setShareModalOpen(true)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-green-500 dark:text-slate-400 transition-colors">
            <Share2 size={16} />
            {post.share_count || 0}
          </button>
        </div>
        <button onClick={() => setSaved(p => !p)} className={`transition-colors ${saved ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-brand-500'}`}>
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {shareModalOpen && <ShareModal post={post} onClose={() => setShareModalOpen(false)} />}
    </div>
  );
};

export default PostCard;
