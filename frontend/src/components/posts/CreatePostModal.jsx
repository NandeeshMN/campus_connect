import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Send, Globe, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const fileToDataUri = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => resolve(event.target.result);
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(file);
});

const CreatePostModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [hashtags, setHashtags] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setPostText('');
    setPostImage(null);
    setHashtags('');
    setVisibility('Public');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      toast.error('Only JPG, PNG and WEBP images are allowed.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB.');
      return;
    }

    try {
      const dataUri = await fileToDataUri(file);
      setPostImage(dataUri);
    } catch (err) {
      toast.error('Failed to read image file.');
    }
    e.target.value = null;
  };

  const handleCreatePost = async () => {
    if (!postText.trim()) return;
    setIsCreating(true);
    
    const payload = {
      caption: postText,
      visibility,
      hashtags: hashtags.trim(),
      image: postImage
    };

    try {
      const { data } = await api.post('/posts/create', payload);
      if (data.success) {
        toast.success('Post created successfully!');
        window.dispatchEvent(new CustomEvent('postCreated', { detail: data.post }));
        handleClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to create post.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Post</h2>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.full_name} className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {(user?.full_name || 'U').charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user?.full_name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <select 
                  value={visibility}
                  onChange={e => setVisibility(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border-none rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
                >
                  <option value="public">🌍 Public</option>
                  <option value="college_only">🎓 College Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Caption */}
          <textarea
            placeholder={`What do you want to talk about, ${user?.full_name?.split(' ')[0] || 'there'}?`}
            value={postText}
            onChange={e => setPostText(e.target.value)}
            rows={4}
            className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none resize-none mb-3"
          />

          {/* Image Preview */}
          {postImage && (
            <div className="relative w-full mb-4">
              <img src={postImage} alt="Preview" className="w-full max-h-80 object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50" />
              <button 
                onClick={() => setPostImage(null)}
                className="absolute top-2 right-2 bg-slate-900/70 text-white rounded-full p-1.5 hover:bg-slate-900 transition-colors shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Hashtags Input */}
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
            <span className="text-brand-500 font-bold">#</span>
            <input 
              type="text" 
              placeholder="Add hashtags (e.g. campus, tech, event)"
              value={hashtags}
              onChange={e => setHashtags(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center">
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/webp"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center h-10 w-10 rounded-full text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
              title="Add Image"
            >
              <ImageIcon size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">
              {postText.length} / 500
            </span>
            <button
              onClick={handleCreatePost}
              disabled={!postText.trim() || postText.length > 500 || isCreating}
              className="flex items-center gap-1.5 text-sm font-bold bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl transition-all shadow-sm"
            >
              {isCreating ? <span className="animate-pulse">Publishing...</span> : <><Send size={16} /> Publish</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreatePostModal;
