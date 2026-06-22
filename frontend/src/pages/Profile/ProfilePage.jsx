import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, Link2, Edit3, Share2, Camera, Heart, MessageCircle, Grid, X, Search, Check, UserPlus } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const skills = ['Python', 'UI Design', 'Research', 'TensorFlow', 'React'];

const ProfilePage = () => {
  const { user: loggedInUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const profileUserId = id ? parseInt(id) : loggedInUser?.id;
  const isOwnProfile = !id || parseInt(id) === loggedInUser?.id;

  const [profileUser, setProfileUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState('Posts');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [profileViewsCount, setProfileViewsCount] = useState(0);

  // Modals
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followersSearch, setFollowersSearch] = useState('');
  const [followingSearch, setFollowingSearch] = useState('');
  const [loadingModalData, setLoadingModalData] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [unfollowTarget, setUnfollowTarget] = useState(null); // 'profile' or { id, name }

  const tabs = ['Posts', 'Projects', 'Events'];

  // Fetch Profile User Info & Follow status & log visit
  useEffect(() => {
    if (!profileUserId) return;

    const loadProfileData = async () => {
      setLoadingProfile(true);
      try {
        // 1. Fetch user info
        const userRes = await api.get(`/users/${profileUserId}`);
        if (userRes.data.success) {
          setProfileUser(userRes.data.user);
        }

        // 2. Fetch follow status & counts & views
        const statusRes = await api.get(`/follow/status/${profileUserId}`);
        if (statusRes.data.success) {
          setIsFollowing(statusRes.data.isFollowing);
          setFollowersCount(statusRes.data.followersCount);
          setFollowingCount(statusRes.data.followingCount);
          setProfileViewsCount(statusRes.data.profileViewsCount);
        }

        // 3. Log visit if visiting someone else
        if (!isOwnProfile) {
          api.post(`/users/${profileUserId}/visit`).catch(e => console.error(e));
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
        toast.error('Failed to load profile details');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfileData();
  }, [profileUserId, isOwnProfile]);

  // Fetch Posts for this user
  useEffect(() => {
    if (!profileUserId) return;
    const fetchUserPosts = async () => {
      setLoadingPosts(true);
      try {
        const { data } = await api.get(`/posts/user/${profileUserId}`);
        if (data.success) {
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error('Error fetching profile posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchUserPosts();
  }, [profileUserId]);


  const handleFollowToggle = async () => {
    if (isFollowing) {
      setUnfollowTarget('profile');
      setShowUnfollowConfirm(true);
    } else {
      try {
        const { data } = await api.post(`/follow/${profileUserId}`);
        if (data.success) {
          setIsFollowing(true);
          setFollowersCount(data.followersCount);
          toast.success(`You are now following ${profileUser.full_name}`);
        }
      } catch (err) {
        console.error('Error following user:', err);
        toast.error('Failed to follow user');
      }
    }
  };

  const confirmUnfollow = async () => {
    try {
      if (unfollowTarget === 'profile') {
        const { data } = await api.delete(`/follow/${profileUserId}`);
        if (data.success) {
          setIsFollowing(false);
          setFollowersCount(data.followersCount);
          toast.success(`You unfollowed ${profileUser.full_name}`);
        }
      } else {
        const { id, name } = unfollowTarget;
        const { data } = await api.delete(`/follow/${id}`);
        if (data.success) {
          setFollowersList(prev => prev.map(u => u.id === id ? { ...u, is_following: false } : u));
          setFollowingList(prev => prev.map(u => u.id === id ? { ...u, is_following: false } : u));
          toast.success(`You unfollowed ${name}`);
          if (isOwnProfile) {
            setFollowingCount(data.followingCount);
          }
        }
      }
    } catch (err) {
      console.error('Error unfollowing:', err);
      toast.error('Failed to unfollow');
    } finally {
      setShowUnfollowConfirm(false);
      setUnfollowTarget(null);
    }
  };

  const fetchFollowers = async () => {
    try {
      setLoadingModalData(true);
      const { data } = await api.get(`/followers/${profileUserId}`);
      if (data.success) {
        setFollowersList(data.followers || []);
      }
    } catch (err) {
      console.error('Error fetching followers list:', err);
    } finally {
      setLoadingModalData(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      setLoadingModalData(true);
      const { data } = await api.get(`/following/${profileUserId}`);
      if (data.success) {
        setFollowingList(data.following || []);
      }
    } catch (err) {
      console.error('Error fetching following list:', err);
    } finally {
      setLoadingModalData(false);
    }
  };

  const handleModalFollowAction = async (targetUser) => {
    if (targetUser.is_following) {
      setUnfollowTarget({ id: targetUser.id, name: targetUser.full_name });
      setShowUnfollowConfirm(true);
    } else {
      try {
        const { data } = await api.post(`/follow/${targetUser.id}`);
        if (data.success) {
          setFollowersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, is_following: true } : u));
          setFollowingList(prev => prev.map(u => u.id === targetUser.id ? { ...u, is_following: true } : u));
          toast.success(`You are now following ${targetUser.full_name}`);
          if (isOwnProfile) {
            setFollowingCount(data.followingCount);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to follow');
      }
    }
  };

  if (loadingProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh] text-slate-500 font-semibold text-sm">
          Loading profile details...
        </div>
      </DashboardLayout>
    );
  }

  if (!profileUser) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">User not found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">The user profile you are trying to visit does not exist.</p>
          <Link to="/home" className="mt-4 inline-block text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Back to Home
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Local list filtering
  const filteredFollowers = followersList.filter(f =>
    f.full_name?.toLowerCase().includes(followersSearch.toLowerCase()) ||
    f.username?.toLowerCase().includes(followersSearch.toLowerCase())
  );

  const filteredFollowing = followingList.filter(f =>
    f.full_name?.toLowerCase().includes(followingSearch.toLowerCase()) ||
    f.username?.toLowerCase().includes(followingSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-0 relative">

        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 rounded-b-2xl overflow-hidden bg-gradient-to-br from-brand-400 via-indigo-500 to-purple-600">
          {profileUser.cover_image ? (
            <img
              src={profileUser.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200&h=400"
              alt="Cover"
              className="w-full h-full object-cover opacity-60"
            />
          )}
          {isOwnProfile && (
            <button className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-semibold bg-black/30 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-black/50 transition-colors">
              <Camera size={14} /> Edit Cover
            </button>
          )}
        </div>

        {/* Profile Header */}
        <div className="px-4 sm:px-8 pb-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-14">

            {/* Avatar */}
            <div className="relative w-fit">
              {profileUser.profile_image ? (
                <img
                  src={profileUser.profile_image}
                  alt={profileUser.full_name}
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-lg"
                />
              ) : (
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-extrabold ring-4 ring-white dark:ring-slate-900 shadow-lg">
                  {profileUser.full_name?.charAt(0) || 'U'}
                </div>
              )}
              {isOwnProfile && (
                <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border-2 border-white dark:border-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow">
                  <Camera size={14} />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pb-4">
              {isOwnProfile ? (
                <>
                  <Link to="/profile/edit" className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all active:scale-95">
                    <Edit3 size={15} /> Edit Profile
                  </Link>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Share2 size={15} /> Share
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm ${
                      isFollowing 
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200' 
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/20'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check size={15} /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} /> Follow
                      </>
                    )}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Share2 size={15} /> Share
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{profileUser.full_name}</h1>
            <p className="text-xs text-slate-400 font-semibold mb-1.5">@{profileUser.username}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400 px-3 py-1 rounded-full">{profileUser.department || 'Student'}</span>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-3 py-1 rounded-full">{profileUser.academic_year || 'Sophomore'}</span>
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
                {profileUser.bio || 'No bio provided yet.'}
              </p>
              <div className="mt-4 space-y-2">
                {profileUser.github_url && (
                  <div className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
                    <Link2 size={14} /> <a href={profileUser.github_url} target="_blank" rel="noreferrer" className="hover:underline">{profileUser.github_url.replace(/(https?:\/\/)?(www\.)?/, '')}</a>
                  </div>
                )}
                {profileUser.linkedin_url && (
                  <div className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
                    <Link2 size={14} /> <a href={profileUser.linkedin_url} target="_blank" rel="noreferrer" className="hover:underline">{profileUser.linkedin_url.replace(/(https?:\/\/)?(www\.)?/, '')}</a>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 text-center">
                <div className="px-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { setShowFollowersModal(true); fetchFollowers(); }}>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">{followersCount}</p>
                  <p className="text-xs text-slate-400 font-semibold">Followers</p>
                </div>
                <div className="px-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { setShowFollowingModal(true); fetchFollowing(); }}>
                  <p className="text-lg font-extrabold text-brand-600 dark:text-brand-400">{followingCount}</p>
                  <p className="text-xs text-slate-400 font-semibold">Following</p>
                </div>
                <div className="px-2">
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">{posts.length}</p>
                  <p className="text-xs text-slate-400 font-semibold">Posts</p>
                </div>
              </div>
              {isOwnProfile && profileViewsCount > 0 && (
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 font-semibold">
                  👀 {profileViewsCount} profile views
                </p>
              )}
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
              {loadingPosts ? (
                <div className="text-center py-10 text-slate-500 text-sm">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">No posts yet.</div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                    <div className="p-4 flex items-start gap-3">
                      {post.author_profile_picture ? (
                        <img src={post.author_profile_picture} alt={post.author_name || ''} className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {(post.author_name || 'U').charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author_name || 'Unknown'}</p>
                            {post.author_username && (
                              <span className="text-xs text-slate-400 font-normal">@{post.author_username}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{post.caption}</p>
                      </div>
                    </div>

                    {post.image_url && (
                      <img src={post.image_url} alt="Post" className="w-full max-h-96 object-cover bg-slate-100 dark:bg-slate-800" />
                    )}

                    <div className="px-4 py-3 flex items-center gap-5 border-t border-slate-100 dark:border-slate-800">
                      <button className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${post.is_liked ? 'text-red-500' : 'text-slate-500 hover:text-red-400 dark:text-slate-400'}`}>
                        <Heart size={15} fill={post.is_liked ? 'currentColor' : 'none'} /> {post.like_count || 0}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-500 dark:text-slate-400 transition-colors">
                        <MessageCircle size={15} /> {post.comment_count || 0}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 dark:text-white">Followers</h2>
              <button onClick={() => setShowFollowersModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
            </div>
            
            {/* Search Box */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 relative">
              <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search followers..."
                value={followersSearch}
                onChange={e => setFollowersSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-400 transition-colors text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingModalData ? (
                <div className="text-center py-10 text-slate-500 text-sm">Loading followers...</div>
              ) : filteredFollowers.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">No followers found</div>
              ) : (
                filteredFollowers.map(follower => (
                  <div key={follower.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${follower.id}`} onClick={() => setShowFollowersModal(false)}>
                        {follower.profile_image ? (
                          <img src={follower.profile_image} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {(follower.full_name || 'U').charAt(0)}
                          </div>
                        )}
                      </Link>
                      <div>
                        <Link to={`/profile/${follower.id}`} onClick={() => setShowFollowersModal(false)} className="font-extrabold text-sm text-slate-900 dark:text-white hover:underline block leading-tight">
                          {follower.full_name}
                        </Link>
                        <span className="text-xs text-slate-400 block leading-tight">@{follower.username}</span>
                      </div>
                    </div>
                    {parseInt(follower.id) !== loggedInUser?.id && (
                      <button
                        onClick={() => handleModalFollowAction(follower)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                          follower.is_following
                            ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                            : 'bg-brand-600 hover:bg-brand-500 border-brand-600 text-white'
                        }`}
                      >
                        {follower.is_following ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 dark:text-white">Following</h2>
              <button onClick={() => setShowFollowingModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
            </div>
            
            {/* Search Box */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 relative">
              <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search following..."
                value={followingSearch}
                onChange={e => setFollowingSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-400 transition-colors text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingModalData ? (
                <div className="text-center py-10 text-slate-500 text-sm">Loading following...</div>
              ) : filteredFollowing.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">No followed users found</div>
              ) : (
                filteredFollowing.map(followedUser => (
                  <div key={followedUser.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${followedUser.id}`} onClick={() => setShowFollowingModal(false)}>
                        {followedUser.profile_image ? (
                          <img src={followedUser.profile_image} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {(followedUser.full_name || 'U').charAt(0)}
                          </div>
                        )}
                      </Link>
                      <div>
                        <Link to={`/profile/${followedUser.id}`} onClick={() => setShowFollowingModal(false)} className="font-extrabold text-sm text-slate-900 dark:text-white hover:underline block leading-tight">
                          {followedUser.full_name}
                        </Link>
                        <span className="text-xs text-slate-400 block leading-tight">@{followedUser.username}</span>
                      </div>
                    </div>
                    {parseInt(followedUser.id) !== loggedInUser?.id && (
                      <button
                        onClick={() => handleModalFollowAction(followedUser)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                          followedUser.is_following
                            ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                            : 'bg-brand-600 hover:bg-brand-500 border-brand-600 text-white'
                        }`}
                      >
                        {followedUser.is_following ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unfollow Confirmation Modal */}
      {showUnfollowConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-2xl w-full max-w-xs shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mb-2">Unfollow user?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to stop following {unfollowTarget === 'profile' ? profileUser.full_name : unfollowTarget.name}?
            </p>
            <div className="space-y-2">
              <button
                onClick={confirmUnfollow}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-red-500/10"
              >
                Unfollow
              </button>
              <button
                onClick={() => { setShowUnfollowConfirm(false); setUnfollowTarget(null); }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProfilePage;
