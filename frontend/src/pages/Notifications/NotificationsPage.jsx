import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash, ArrowLeft, MessageSquare, Heart, UserPlus } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

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

const getNotificationIcon = (type) => {
  switch (type) {
    case 'follow':
      return <UserPlus size={16} className="text-blue-500" />;
    case 'like':
      return <Heart size={16} className="text-red-500" fill="currentColor" />;
    case 'comment':
      return <MessageSquare size={16} className="text-green-500" />;
    default:
      return <Bell size={16} className="text-brand-500" />;
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications');
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      const { data } = await api.put('/notifications/mark-read');
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleNotificationClick = async (notif) => {
    if (notif.is_read) return;
    try {
      await api.put(`/notifications/${notif.id}/read`);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/home" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={24} className="text-brand-600" /> Notifications
            </h1>
          </div>
          {notifications.some(n => !n.is_read) && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-400 dark:hover:bg-brand-905/60 rounded-xl transition-all"
            >
              <Check size={14} /> Mark all read
            </button>
          )}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Bell size={28} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">No notifications yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-xs mx-auto">
                When people follow you, like or comment on your posts, they'll show up here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 flex items-start gap-4 transition-colors ${notif.is_read ? 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20' : 'bg-brand-50/30 dark:bg-brand-950/10 hover:bg-brand-50/50 dark:hover:bg-brand-950/20'}`}
                >
                  {/* Actor Avatar */}
                  <Link to={`/profile/${notif.actor_id}`} className="shrink-0 relative">
                    {notif.actor_image ? (
                      <img
                        src={notif.actor_image}
                        alt={notif.actor_name || ''}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {(notif.actor_name || 'U').charAt(0)}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-0.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                      {getNotificationIcon(notif.type)}
                    </span>
                  </Link>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-normal">
                      <Link to={`/profile/${notif.actor_id}`} className="font-extrabold hover:underline text-slate-950 dark:text-white mr-1.5">
                        {notif.actor_name || 'Someone'}
                      </Link>
                      {notif.message.replace(notif.actor_name, '').trim()}
                    </p>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                      {formatRelativeTime(notif.created_at)}
                    </span>
                  </div>

                  {/* Unread indicator */}
                  {!notif.is_read && (
                    <span className="w-2.5 h-2.5 bg-brand-600 rounded-full shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
