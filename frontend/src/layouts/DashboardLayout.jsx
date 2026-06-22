import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home, Compass, MessageSquare, Bell, User, Calendar,
  BookOpen, Settings, PlusCircle, GraduationCap, Mail,
  Search, ChevronDown, LogOut, X, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';
import CreatePostModal from '../components/posts/CreatePostModal';
import api from '../services/api';


const navItems = [
  { to: '/home',         icon: Home,         label: 'Home' },
  { to: '/explore',      icon: Compass,      label: 'Explore' },
  { to: '/messages',     icon: MessageSquare,label: 'Messages' },
  { to: '/notifications',icon: Bell,         label: 'Notifications' },
  { to: '/events',       icon: Calendar,     label: 'Events' },
  { to: '/resources',    icon: BookOpen,     label: 'Resources' },
  { to: '/profile',      icon: User,         label: 'Profile' },
];

const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownNotifications, setDropdownNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (err) {
      console.error('Error fetching unread notifications count:', err);
    }
  };

  const fetchDropdownNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      if (data.success) {
        setDropdownNotifications(data.notifications.slice(0, 5) || []);
      }
    } catch (err) {
      console.error('Error fetching dropdown notifications:', err);
    }
  };

  useEffect(() => {
    const handleOpenModal = () => setIsCreatePostOpen(true);
    window.addEventListener('openCreatePostModal', handleOpenModal);
    return () => window.removeEventListener('openCreatePostModal', handleOpenModal);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (showNotificationDropdown) {
      fetchDropdownNotifications();
    }
  }, [showNotificationDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeClass = 'bg-brand-50 text-brand-600 font-bold dark:bg-brand-950/40 dark:text-brand-400';
  const inactiveClass = 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60';


  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-100 dark:border-slate-800">
        <Logo iconSize={20} />
        <p className="text-[10px] text-slate-400 mt-1 ml-10 font-semibold tracking-wider uppercase">Premium Collegiate Social</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <button 
          onClick={() => setIsCreatePostOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-95"
        >
          <PlusCircle size={18} />
          Create Post
        </button>
        <button 
          onClick={() => setShowLogoutConfirm(true)} 
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/20 text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 font-bold text-sm py-2.5 rounded-xl transition-all"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );

  const handleBellClick = (e) => {
    if (window.innerWidth < 768) {
      navigate('/notifications');
    } else {
      e.preventDefault();
      setShowNotificationDropdown(prev => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        {/* Left: Hamburger (mobile) + Nav links (desktop) */}
        <div className="flex items-center gap-6">
          <button
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Desktop nav links removed as requested */}
        </div>

        {/* Right: Icons + Avatar */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `p-2 rounded-lg transition-colors ${isActive ? 'text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-950/30' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`
            }
            title="Messages"
          >
            <Mail size={18} />
          </NavLink>
          
          {/* Notifications Bell Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleBellClick}
              className={`relative p-2 rounded-lg transition-colors ${showNotificationDropdown ? 'text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-950/30' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
            
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Recent Notifications</h4>
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      await api.put('/notifications/mark-read');
                      setUnreadCount(0);
                      setDropdownNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                    }}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {dropdownNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
                  ) : (
                    dropdownNotifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={async () => {
                          if (!notif.is_read) {
                            await api.put(`/notifications/${notif.id}/read`);
                            setUnreadCount(prev => Math.max(0, prev - 1));
                          }
                          setShowNotificationDropdown(false);
                          navigate(`/profile/${notif.actor_id}`);
                        }}
                        className={`p-3 text-left flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${!notif.is_read ? 'bg-brand-50/20 dark:bg-brand-950/10' : ''}`}
                      >
                        {notif.actor_image ? (
                          <img src={notif.actor_image} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {(notif.actor_name || 'U').charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-tight">
                            <span className="font-bold text-slate-900 dark:text-white">{notif.actor_name}</span> {notif.message.replace(notif.actor_name, '').trim()}
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                            {formatRelativeTime(notif.created_at)}
                          </span>
                        </div>
                        {!notif.is_read && (
                          <span className="w-1.5 h-1.5 bg-brand-600 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
                <Link 
                  to="/notifications" 
                  onClick={() => setShowNotificationDropdown(false)}
                  className="block text-center py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          <NavLink
            to="/settings"

            className={({ isActive }) =>
              `p-2 rounded-lg transition-colors ${isActive ? 'text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-950/30' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`
            }
            title="Settings"
          >
            <Settings size={18} />
          </NavLink>
          <NavLink
            to="/profile"
            className="flex items-center gap-2 ml-1 pl-2 border-l border-slate-200 dark:border-slate-700 hover:opacity-80 transition-opacity"
            title="Go to Profile"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
          </NavLink>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-2xl">
              <button
                className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-3.5rem)]">
          {children}
        </main>

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden transform transition-all">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
              <LogOut size={24} />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">Ready to leave?</h3>
            <p className="text-sm text-center text-slate-500 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Create Post Modal */}
      <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />

    </div>
  );
};

export default DashboardLayout;
