import React, { useState } from 'react';
import { Search, TrendingUp, Users, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

const tabs = ['Posts', 'People', 'Events', 'Resources'];

const trendingPosts = [
  {
    id: 1,
    author: 'Sarah Mitchell',
    username: 'sarah_m',
    time: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80',
    title: 'The best study spots on campus nobody knows about... 😮',
    content: 'I finally found a quiet corner in the old West Wing. Perfect for finals prep!',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=500&h=300',
    likes: 2400,
    comments: 158,
    tags: ['#CampusLife'],
  },
  {
    id: 2,
    author: 'Marcus Chen',
    username: 'marcus_cs',
    time: '4 hours ago',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=80&h=80',
    title: 'Internship Hunt 2024: A Thread 🧵',
    content: 'Just landed a role at a top fintech firm. Here\'s exactly how I optimized my resume and what they asked in the technical interview...',
    image: null,
    likes: 842,
    comments: 92,
    tags: ['#Career', '#Tech'],
  },
  {
    id: 3,
    author: 'Tech Summit Live',
    username: 'techsummit',
    time: '1 hour ago',
    avatar: null,
    title: 'Tech Summit: Live in 2 Hours!',
    content: 'Main Auditorium • 6:00 PM',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=500&h=300',
    likes: 445,
    comments: 31,
    tags: ['#Event'],
    rsvp: true,
  },
  {
    id: 4,
    author: 'Leo Rodriguez',
    username: 'leo_r',
    time: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80',
    title: '"The only way to do great work is to love what you do." - Steve Jobs',
    content: 'Remember this as we head into midterm season. You got this, everyone!',
    image: null,
    likes: 1100,
    comments: 45,
    tags: ['#Motivation'],
  },
];

const trendingHashtags = [
  { tag: '#Hackathon2024', posts: '1.2k posts today' },
  { tag: '#ArtInTheQuad', posts: '856 posts today' },
  { tag: '#FinalsWeekPrep', posts: '542 posts today' },
  { tag: '#CampusEats', posts: '320 posts today' },
];

const suggestedClubs = [
  { name: 'AI Research Lab', members: '420 members', icon: '🤖' },
  { name: 'Digital Arts Collective', members: '1.1k members', icon: '🎨' },
  { name: 'Outdoor Adventure Club', members: '2.4k members', icon: '🏕️' },
];

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [query, setQuery] = useState('');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Explore Campus</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Discover the latest trending posts, clubs, and events across the university.</p>
        </div>

        {/* Search + Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for everything..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 text-slate-700 dark:text-slate-300 placeholder-slate-400 transition"
            />
          </div>
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-brand-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Trending Posts */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Trending Posts</h2>
              <button className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">See all activity</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {trendingPosts.map(post => (
                <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  {post.image && (
                    <div className="relative h-36 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      {post.tags?.[0] && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-brand-600/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {post.tags[0]}
                        </span>
                      )}
                      {post.rsvp && (
                        <button className="absolute bottom-2 right-2 text-[10px] font-bold bg-brand-600 text-white px-3 py-1 rounded-full">
                          RSVP
                        </button>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {post.avatar ? (
                        <img src={post.avatar} alt={post.author} className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{post.author.charAt(0)}</div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{post.author}</p>
                        <p className="text-[10px] text-slate-400">{post.time}</p>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{post.content}</p>
                    <div className="flex gap-3 text-xs text-slate-400">
                      <span>♥ {post.likes >= 1000 ? (post.likes/1000).toFixed(1)+'k' : post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-4">

            {/* Trending Hashtags */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-600" /> Trending Hashtags
              </h3>
              <div className="space-y-3">
                {trendingHashtags.map(({ tag, posts }) => (
                  <div key={tag} className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-brand-600 transition-colors">{tag}</p>
                      <p className="text-xs text-slate-400">{posts}</p>
                    </div>
                    <TrendingUp size={14} className="text-brand-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Clubs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={16} className="text-brand-600" /> Suggested Clubs
                </h3>
                <button className="text-slate-400 hover:text-brand-500 transition-colors"><RefreshCw size={14} /></button>
              </div>
              <div className="space-y-3">
                {suggestedClubs.map(club => (
                  <div key={club.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">{club.icon}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{club.name}</p>
                        <p className="text-xs text-slate-400">{club.members}</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950/30 px-3 py-1 rounded-lg transition-colors">
                      Join
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-xs font-bold text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950/30 py-2 rounded-xl transition-colors">
                Discover more clubs +
              </button>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExplorePage;
