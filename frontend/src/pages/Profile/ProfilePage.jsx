import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Link2, Edit3, Share2, Camera, Heart, MessageCircle, Grid } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const skills = ['Python', 'UI Design', 'Research', 'TensorFlow', 'React'];

const posts = [
  {
    id: 1,
    content: 'Just finished documenting the architecture for our new AI-driven campus assistant. The modular design should allow for easy scaling across different departments. Exciting times ahead! 🚀',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600&h=400',
    likes: 124,
    comments: 18,
    time: '2 hours ago',
  },
  {
    id: 2,
    content: 'Just shared my latest UI kit for the CampusConnect design system in the resources tab! Built with 100% tokens and accessibility in mind. Check it out and let me know your thoughts.',
    image: 'https://images.unsplash.com/photo-1606206873764-fd15e242c6d5?auto=format&fit=crop&q=80&w=600&h=400',
    likes: 67,
    comments: 5,
    time: 'Yesterday',
  },
  {
    id: 3,
    content: 'Research paper submitted! Six months of work finally condensed into 12 pages. Huge thanks to the lab team 🔬',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600&h=400',
    likes: 231,
    comments: 29,
    time: '3 days ago',
  },
];

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Posts');
  const tabs = ['Posts', 'Projects', 'Events'];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-0">

        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 rounded-b-2xl overflow-hidden bg-gradient-to-br from-brand-400 via-indigo-500 to-purple-600">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200&h=400"
            alt="Cover"
            className="w-full h-full object-cover opacity-60"
          />
          <button className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-semibold bg-black/30 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-black/50 transition-colors">
            <Camera size={14} /> Edit Cover
          </button>
        </div>

        {/* Profile Header */}
        <div className="px-4 sm:px-8 pb-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-14">

            {/* Avatar */}
            <div className="relative w-fit">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-extrabold ring-4 ring-white dark:ring-slate-900 shadow-lg">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border-2 border-white dark:border-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow">
                <Camera size={14} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pb-4">
              <Link to="/profile/edit" className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all active:scale-95">
                <Edit3 size={15} /> Edit Profile
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Share2 size={15} /> Share Profile
              </button>
            </div>
          </div>

          <div className="mt-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{user?.full_name || 'Nandeesh M N'}</h1>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <span className="text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400 px-3 py-1 rounded-full">{user?.department || 'Computer Science'}</span>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-3 py-1 rounded-full">{user?.academic_year || 'Sophomore'}, Class of 2026</span>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 px-4">

          {/* Left Panel */}
          <div className="lg:col-span-4 space-y-4">

            {/* About */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">About Me</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Aspiring software engineer passionate about AI, human-computer interaction, and creating digital solutions that bridge gaps in student accessibility. Currently researching neural networks for real-time translation.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin size={14} /> San Francisco, CA
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
                  <Link2 size={14} /> github.com/nandeesh
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill} className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg">{skill}</span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 text-center">
                <div className="px-2">
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">1.2k</p>
                  <p className="text-xs text-slate-400 font-semibold">Followers</p>
                </div>
                <div className="px-2">
                  <p className="text-lg font-extrabold text-brand-600 dark:text-brand-400">482</p>
                  <p className="text-xs text-slate-400 font-semibold">Following</p>
                </div>
                <div className="px-2">
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">24</p>
                  <p className="text-xs text-slate-400 font-semibold">Posts</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right — Posts */}
          <div className="lg:col-span-8">

            {/* Tabs */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                      activeTab === tab
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Grid size={18} />
              </button>
            </div>

            {/* Post Cards */}
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                  <div className="p-4 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user?.full_name?.charAt(0) || 'N'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.full_name || 'Nandeesh M N'}</p>
                        <p className="text-xs text-slate-400">{post.time}</p>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{post.content}</p>
                    </div>
                  </div>

                  {post.image && (
                    <img src={post.image} alt="Post" className="w-full h-48 object-cover" />
                  )}

                  <div className="px-4 py-3 flex items-center gap-5 border-t border-slate-100 dark:border-slate-800">
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors">
                      <Heart size={15} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-500 transition-colors">
                      <MessageCircle size={15} /> {post.comments}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
