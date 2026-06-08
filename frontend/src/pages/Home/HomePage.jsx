import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Image, Smile, Send, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const mockPosts = [
  {
    id: 1,
    author: 'Nandeesh M N',
    username: 'nandeesh',
    avatar: null,
    time: '2 hours ago',
    content: 'Just finished building the CampusConnect UI! The modular component system makes it so easy to scale. Excited to see what the community builds on top of this. 🚀',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800&h=400',
    likes: 124,
    comments: 18,
    shares: 6,
    tags: ['#Tech', '#BuildInPublic'],
    liked: false,
    saved: false,
  },
  {
    id: 2,
    author: 'Marcus Chen',
    username: 'marcus_cs',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=80&h=80',
    time: '4 hours ago',
    content: 'Internship Hunt 2024: A Thread 🧵\n\nJust landed a role at a top fintech firm. Here\'s exactly how I optimized my resume and what they asked in the technical interview...',
    image: null,
    likes: 842,
    comments: 92,
    shares: 145,
    tags: ['#Career', '#Tech'],
    liked: true,
    saved: false,
  },
  {
    id: 3,
    author: 'Campus Admin Feed',
    username: 'campusadmin',
    avatar: null,
    time: 'Yesterday',
    content: 'Annual Winter Gala 2024 🎉\nAn evening of elegance, fusion, and connections! Join us at the historic Grand Ballroom.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800&h=400',
    likes: 312,
    comments: 44,
    shares: 89,
    tags: ['#CampusEvent', '#Pinned'],
    liked: false,
    saved: true,
    isPinned: true,
  },
];

const trendingHashtags = [
  { tag: '#Hackathon2024', posts: '1.2k posts today' },
  { tag: '#ArtInTheQuad', posts: '856 posts today' },
  { tag: '#FinalsWeekPrep', posts: '542 posts today' },
  { tag: '#CampusEats', posts: '320 posts today' },
];

const suggestedStudents = [
  {
    id: 1,
    name: 'Priya Sharma',
    username: 'priya_cs',
    major: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    id: 2,
    name: 'Jordan Lee',
    username: 'jordan_cs',
    major: 'Data Science',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    id: 3,
    name: 'Linda Yao',
    username: 'linda_design',
    major: 'UX Design',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80&h=80',
  },
];

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likes, setLikes] = useState(post.likes);

  const toggleLike = () => {
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      {post.isPinned && (
        <div className="px-5 pt-3 pb-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 px-2 py-0.5 rounded-full">📌 Pinned Post</span>
        </div>
      )}

      <div className="p-5">
        {/* Author */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {post.avatar ? (
              <img src={post.avatar} alt={post.author} className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {post.author.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author}</p>
              <p className="text-xs text-slate-400">@{post.username} · {post.time}</p>
            </div>
          </div>
          <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-3">{post.content}</p>

        {/* Tags */}
        {post.tags && (
          <div className="flex gap-2 flex-wrap mb-3">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <img src={post.image} alt="Post" className="w-full h-52 object-cover" />
      )}

      {/* Actions */}
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
            {post.comments}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-green-500 dark:text-slate-400 transition-colors">
            <Share2 size={16} />
            {post.shares}
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

const HomePage = () => {
  const { user } = useAuth();
  const [postText, setPostText] = useState('');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Feed Column */}
          <div className="lg:col-span-8 space-y-4">

            {/* Create Post Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <input
                  type="text"
                  placeholder={`What's on your mind, ${user?.full_name?.split(' ')[0] || 'there'}?`}
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition"
                />
              </div>
              <div className="flex items-center justify-between pl-13">
                <div className="flex gap-3 ml-13">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-500 transition-colors">
                    <Image size={16} /> Photo
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-yellow-500 transition-colors">
                    <Smile size={16} /> Feeling
                  </button>
                </div>
                <button
                  disabled={!postText.trim()}
                  className="flex items-center gap-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-all"
                >
                  <Send size={14} /> Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {mockPosts.map(post => <PostCard key={post.id} post={post} />)}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-4">

            {/* Trending Hashtags */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-600" /> Trending Today
              </h3>
              <div className="space-y-3">
                {trendingHashtags.map(({ tag, posts }) => (
                  <div key={tag} className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{tag}</p>
                      <p className="text-xs text-slate-400">{posts}</p>
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
    </DashboardLayout>
  );
};

export default HomePage;
