import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Edit2, Trash2, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  // Comments states
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const { data } = await api.get(`/posts/${post.id}/comments`);
      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    setCommentsOpen(prev => {
      const nextVal = !prev;
      if (nextVal) {
        fetchComments();
      }
      return nextVal;
    });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    try {
      const { data } = await api.post(`/posts/${post.id}/comment`, { comment_text: newCommentText });
      if (data.success) {
        setComments(prev => [...prev, data.comment]);
        setNewCommentText('');
        toast.success('Comment posted successfully');
        if (post) {
          post.comment_count = (parseInt(post.comment_count) || 0) + 1;
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await api.delete(`/posts/comment/${commentId}`);
      if (data.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        toast.success('Comment deleted');
        if (post) {
          post.comment_count = Math.max(0, (parseInt(post.comment_count) || 0) - 1);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete comment');
    }
  };

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
            <Link to={`/profile/${post.user_id}`}>
              {post.author_profile_picture ? (
                <img src={post.author_profile_picture} alt={post.author_name || ''} className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 hover:opacity-85 transition-opacity" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm hover:opacity-85 transition-opacity">
                  {(post.author_name || 'U').charAt(0)}
                </div>
              )}
            </Link>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                <Link to={`/profile/${post.user_id}`} className="hover:underline">
                  {post.author_name || 'Unknown'}
                </Link>
                {post.author_username && (
                  <span className="text-xs text-slate-400 font-normal">@{post.author_username}</span>
                )}
                <span className="text-slate-400">{visibilityLabel(post.visibility)}</span>
              </div>
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
          <button onClick={toggleComments} className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${commentsOpen ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-brand-500 dark:text-slate-400'}`}>
            <MessageCircle size={16} fill={commentsOpen ? 'currentColor' : 'none'} />
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

      {/* Comments Section */}
      {commentsOpen && (
        <div className="border-t border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/30">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Comments</h4>
          
          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-400 transition-colors text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold shadow-sm"
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          {loadingComments ? (
            <div className="text-center py-4 text-xs text-slate-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-400">No comments yet. Be the first to share your thoughts!</div>
          ) : (
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex gap-2.5">
                    <Link to={`/profile/${c.user_id}`}>
                      {c.profile_image ? (
                        <img src={c.profile_image} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {(c.full_name || 'U').charAt(0)}
                        </div>
                      )}
                    </Link>
                    <div>
                      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 px-3.5 py-2 rounded-2xl shadow-sm">
                        <Link to={`/profile/${c.user_id}`} className="font-extrabold hover:underline text-slate-900 dark:text-white mr-1.5 block">
                          {c.full_name}
                        </Link>
                        <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{c.comment_text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 ml-2 block">
                        {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  {String(c.user_id) === String(currentUserId) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="Delete Comment"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {shareModalOpen && <ShareModal post={post} onClose={() => setShareModalOpen(false)} />}
    </div>
  );
};

export default PostCard;
